import HttpServiceImpl from '../http-service';
import { TranslationInfo, ChapterInfo } from './translation-types';
import { AxiosResponse } from 'axios';

export interface TranslationService {
    getChapter(translation: string, chapterNumber: number): Promise<ChapterInfo>;
    getTranslationInfo(translation: string): Promise<TranslationInfo>
}

export default class TranslationServiceImpl implements TranslationService {
    
    private httpService = new HttpServiceImpl();
    private parseData(resp: any[], startVerse: number, totalVerses: number | undefined): any[] {
        if (totalVerses && totalVerses > 0) {
            resp = resp.slice(
                startVerse - 1, startVerse + totalVerses - 1,
            );
        } else {
            resp = resp.slice(startVerse - 1);
        }
        return resp;
    }
    public getChapter(
        translation: string, chapterNumber: number, startVerse: number = 1, totalVerses: number = -1): Promise<ChapterInfo> {
        const prom: Promise<ChapterInfo> = new Promise<ChapterInfo>((resolve, reject) => {
            let start: number = startVerse;
            if (typeof startVerse === 'string') {
                start = parseInt(startVerse);
            }
            let total: number | undefined = totalVerses;
            if (typeof totalVerses === 'string') {
                total = parseInt(totalVerses);
            }
            this.httpService.get(`${translation}/${chapterNumber}.json`).then((resp: AxiosResponse) => {
                let { data } : { data: ChapterInfo } = resp;
                this.parseData(data.verses, start, total);
                resolve(data);
            }).catch((error: any) => {
                console.log(error);
                const proms: Promise<AxiosResponse>[] = [
                    this.httpService.get(`simple/${translation}/synonyms.json`),
                    this.httpService.get(`simple/root/${chapterNumber}.json`),
                    this.httpService.get(`simple/${translation}/${chapterNumber}.json`),
                ];
                Promise.all(proms).then((respArray: AxiosResponse<any>[]) => {
                    const { data: synonyms } : { data: { [root: string]: string[] }} = respArray[0];
                    const { data: rootWords } : { data: string[][] } = respArray[1];
                    const { data: verses } : { data: string[][] } = respArray[2];
                    const out: ChapterInfo = {
                        label: `Chapter ${chapterNumber}`,
                        name: `Chapter ${chapterNumber}`,
                        verses: this.parseData(verses, start, total).map((verse: string[], verseIndex: number) => {
                            return {
                                order: [],
                                verse: verse.map((word: string, wordIndex: number) => {
                                    const rootWord: string = rootWords[verseIndex + start - 1][wordIndex];
                                    const wordList: string[] = synonyms[rootWord];
                                    const words = [ word ];
                                    if (wordList.length > 1) {
                                        words.push(...wordList);
                                    }
                                    return words;
                                }),
                            };
                        }),
                    };
                    resolve(out);
                });
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
