import HttpServiceImpl from '../http-service';
import { TranslationInfo, ChapterInfo } from './translation-types';
import { AxiosResponse } from 'axios';

export interface TranslationService {
    getChapter(translation: string, chapterNumber: number): Promise<ChapterInfo>;
    getTranslationInfo(translation: string): Promise<TranslationInfo>
}

export default class TranslationServiceImpl implements TranslationService {
    private httpService = new HttpServiceImpl();

    public getChapter(translation: string, chapterNumber: number): Promise<ChapterInfo> {
        const prom: Promise<ChapterInfo> = new Promise<ChapterInfo>((resolve, reject) => {
            this.httpService.get(`${translation}/${chapterNumber}`).then((resp: AxiosResponse) => {
                resolve(resp.data);
            });
        });
        return prom;
    }

    public getTranslationInfo (translation: string): Promise<TranslationInfo> {
        const prom: Promise<TranslationInfo> = new Promise<TranslationInfo>((resolve, reject) => {
            this.httpService.get(translation).then((resp: AxiosResponse) => {
                resolve(resp.data);
            });
        });
        return prom;
    }

}
