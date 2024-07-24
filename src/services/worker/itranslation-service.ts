import { VModelEvent, CModelEvent } from ".";
import { ChapterInfo, TranslationInfo } from "../translation/translation-types";

export interface ITranslationService {
    init(dataCallback: (evt: VModelEvent) => void, labelCallback: (evt: CModelEvent) => void): void;
    getChapter(translation: string, chapterNumber: number, startVerse: number, totalVerses?: number): Promise<ChapterInfo>;
    getTranslationInfo(translation: string): Promise<TranslationInfo>;
}
