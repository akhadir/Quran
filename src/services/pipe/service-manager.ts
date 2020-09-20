import ChapterModelObserver, { CModelEvent, IChapterModelObserver } from "./chapter-model-observer";
import { ChapterService } from "./chapter-service";
import { IQuranModel, QInfo, QuranModel } from "./quran-model";
import { VModelEvent } from "./verse-model-observer";
import { VerseWordManager } from "./verse-word-manager";
import { WModelEvent } from "./word-service";

export class ServiceManager {
    private qModel: IQuranModel = new QuranModel();
    private chapterService: ChapterService = new ChapterService();
    private chapterModelObserver: IChapterModelObserver | undefined;
    private verseWordManager: VerseWordManager | undefined;
    
    public constructor() {
        this.qModel.subscribe(this.chapterService);
    }

    public init(
        data: QInfo,
        chapterCB: (evt: CModelEvent) => void,
        verseCB: (evt: VModelEvent) => void,
        wordCB: (evt: WModelEvent) => void,
    ): void {
        if (!this.chapterModelObserver) {
            this.chapterModelObserver = new ChapterModelObserver(chapterCB);
        } else {
            this.chapterModelObserver.init(chapterCB);
        }
        this.chapterService.subscribe(this.chapterModelObserver);
        if (!this.verseWordManager) {
            this.verseWordManager = new VerseWordManager(this.qModel, data);
        }
        this.verseWordManager.init(verseCB, wordCB);
        this.qModel.init(data);
    }
}
