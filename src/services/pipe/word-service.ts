import { AxiosResponse } from "axios";
import { Subject, Subscription } from "rxjs";
import HttpServiceImpl from "../http-service";
import { QInfo } from "./quran-model";
import { IVerseModelObserver, VModelEvent } from "./verse-model-observer";

export enum WModelEventType {
    INIT = 'INIT',
};
export type WModelEvent = {
    data: {
        index: number;
        wordIndex: number;
        verseIndex: number;
        words: string[];
    };
    type: WModelEventType;
};
export interface IWordModelObserver {
    observeWord(evt: WModelEvent): void;
}
export class WordService implements IVerseModelObserver {
    private httpService = new HttpServiceImpl();
    private observable = new Subject<WModelEvent>();
    public subscribers: Subscription[] = [];
    public qInfo: QInfo;
    
    public constructor(qInfo: QInfo) {
        this.qInfo = qInfo;
    }
    subscribe(observer: IWordModelObserver): Subscription {
        const subscriber = this.observable.subscribe(observer.observeWord.bind(observer));
        this.subscribers.push(subscriber);
        return subscriber;
    }
    observe(evt: VModelEvent): void {
        const { startVerse, lang, chapterNo } = this.qInfo;
        const proms: Promise<AxiosResponse>[] = [
            this.httpService.get(`simple/${lang}/synonyms.json`),
            this.httpService.get(`simple/root/${chapterNo}.json`),
        ];
        Promise.all(proms).then((responses: AxiosResponse[]) => {
            const verseIndex = evt.data.verseIndex;
            const { data: synonyms } : { data: { [root: string]: string[] }} = responses[0];
            const { data: rootWords } : { data: string[][] } = responses[1];
            const verse: string[] = evt.data.verse;
            verse.forEach((word: string, wordIndex: number) => {
                const rootWord: string = rootWords[verseIndex + startVerse - 2][wordIndex];
                const wordList: string[] = synonyms[rootWord];
                const words = [];
                if (wordList.length > 1) {
                    words.push(...wordList);
                }
                const out: WModelEvent = {
                    type: WModelEventType.INIT,
                    data: {
                        index: wordIndex,
                        wordIndex: wordIndex + 1,
                        verseIndex,
                        words,
                    },
                };
                this.observable.next(out);
            });
            
        });
    }
    
};
