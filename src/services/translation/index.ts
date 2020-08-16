import HttpServiceImpl from '../http-service';
import { TranslationInfo } from './translation-types';

export interface TranslationService {
    getChapter(translation: string, chapterNumber: number): Promise<any>;
    getTranslationInfo(translation: string): Promise<TranslationInfo>
}

export default class TranslationServiceImpl implements TranslationService {
    private httpService = new HttpServiceImpl();

    public getChapter(translation: string, chapterNumber: number): Promise<any> {
        return this.httpService.get(`${translation}/${chapterNumber}`);
    }

    public getTranslationInfo (translation: string): Promise<any> {
        return this.httpService.get(translation);
    }

}
