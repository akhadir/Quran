import HttpServiceImpl from '../http-service';
import { TranslationInfo, ChapterInfo } from '../translation/translation-types';
import { AxiosResponse } from 'axios';

export enum VModelEventType {
    INIT = 'INIT',
};
export type VModelEvent = {
    eventType: VModelEventType;
    data: {
        index: number;
        verseIndex: number;
        verse: string[][];
    };
};
export enum CModelEventType {
    INIT = 'INIT',
};
export type CModelEvent = {
    eventType: CModelEventType;
    data: string[];
};

enum WorkerEvent {
    INIT = 'INIT',
    FETCH_DATA = 'FETCH_DATA',
};
export interface ITranslationService {
    getChapter(translation: string, chapterNumber: number): Promise<ChapterInfo>;
    getTranslationInfo(translation: string): Promise<TranslationInfo>
}

export default class WorkerTranslationService implements ITranslationService {
    private workerService: Worker;
    private httpService = new HttpServiceImpl();
    private verseCB: ((evt: VModelEvent) => void) | undefined;
    private chapterCB: ((evt: CModelEvent) => void) | undefined;

    public constructor() {
        this.workerService = new Worker('/quran-worker.js');
        this.workerService.onmessage = this.workerHandler.bind(this);
    }

    public init(verseCB: (evt: VModelEvent) => void, chapterCB: (evt: CModelEvent) => void) {
        this.verseCB = verseCB;
        this.chapterCB = chapterCB;
    }

    private workerHandler(e: { data: any}) {
        const { data } = e;
        if (data && this.verseCB) {
            this.verseCB({
                eventType: VModelEventType.INIT,
                data,
            });
        }
    }
    public getChapter(
        translation: string, chapterNumber: number, startVerse: number = 1, totalVerses: number = -1): Promise<ChapterInfo> {
        const prom: Promise<ChapterInfo> = new Promise<ChapterInfo>((resolve, reject) => {
            let start: number = startVerse;
            let total: number | undefined = totalVerses;
            const proms: Promise<AxiosResponse>[] = [
                this.httpService.get(`simple/${translation}/synonyms.json`),
                this.httpService.get(`simple/root/${chapterNumber}.json`),
                this.httpService.get(`simple/${translation}/${chapterNumber}.json`),
                this.httpService.get(`${translation}/chapter.json`),
            ];
            Promise.all(proms).then((respArray: AxiosResponse<any>[]) => {
                const { data: synonyms } : { data: { [root: string]: string[] }} = respArray[0];
                const { data: rootWords } : { data: string[][] } = respArray[1];
                const { data: verses } : { data: string[][] } = respArray[2];
                const { data: chapterInfo } : { data: string[][] } = respArray[3];
                this.workerService.postMessage({
                    type: WorkerEvent.INIT,
                    data: { 
                        synonyms,
                        rootWords,
                        verses,
                    },
                });
                this.workerService.postMessage({
                    type: WorkerEvent.FETCH_DATA,
                    data: {
                        start,
                        total,
                    },
                });
                if (this.chapterCB) {
                    this.chapterCB({
                        eventType: CModelEventType.INIT,
                        data: chapterInfo[chapterNumber - 1],
                    });
                }
            });
        });
        return prom;
    }

    public getTranslationInfo (translation: string): Promise<TranslationInfo> {
        const prom: Promise<TranslationInfo> = new Promise<TranslationInfo>((resolve, reject) => {
            this.httpService.get(`${translation}/index.json`).then((resp: AxiosResponse) => {
                resolve(resp.data);
            });
        });
        return prom;
    }

}
