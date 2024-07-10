import { ChapterInfo } from "../translation/translation-types";
import WorkerTranslationService, { CModelEvent, VModelEvent } from "../worker";

export enum ServiceTypes {
    'INLINE_SERVICE',
    'MYSQL_SERVICE',
}
export default class SwitchService {
    private translation = 'english';
    public chapterInfo: ChapterInfo = {
        label: '',
        name: '',
        verses: [],
    };
    private selectedService: ServiceTypes;
    private serviceManager: WorkerTranslationService;
    private serviceCallback: undefined | ((chapterInfo: ChapterInfo) => void);
    private defaultDataCallback (evt: VModelEvent) {
        const { data } = evt;
        this.chapterInfo.verses[data.verseIndex - 1] = {
            order: [],
            verse: data.verse,
        };
        if (this.serviceCallback) {
            this.serviceCallback({ ...this.chapterInfo });
        }
    }
    private defaultLabelCallback (evt: CModelEvent) {
        const chapterLabel = `${evt.data[0]} - ${evt.data[1]}`;
        this.chapterInfo.label = chapterLabel;
        if (this.serviceCallback) {
            this.serviceCallback({ ...this.chapterInfo });
        }
    }
    constructor(type: ServiceTypes = ServiceTypes.INLINE_SERVICE) {
        this.selectedService = type
        if (this.selectedService === ServiceTypes.INLINE_SERVICE) {
            this.serviceManager = new WorkerTranslationService();
        } else {
            this.serviceManager = new WorkerTranslationService();
        }
    }
    public getChapterInfo(translation: string, chapter: number, startVerse: number, totalVerses: number, callback?: (chapterInfo: ChapterInfo) => void) {
        this.serviceManager.init(
            this.defaultDataCallback.bind(this),
            this.defaultLabelCallback.bind(this),
        );
        this.translation = translation;
        if (callback) {
            this.serviceCallback = callback;
        }
        this.serviceManager.getChapter(this.translation, chapter, startVerse, totalVerses);
    }
}