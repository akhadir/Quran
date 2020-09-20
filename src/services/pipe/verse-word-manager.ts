import { IQuranModel, QInfo } from "./quran-model";
import { IVerseModelObserver, VModelEvent } from "./verse-model-observer";
import { VerseService } from "./verse-service";
import { IWordModelObserver, WModelEvent, WordService } from "./word-service";

export class VerseWordManager implements IVerseModelObserver, IWordModelObserver {
    private verseCB: ((evt: VModelEvent) => void) | undefined;
    private verseService: VerseService = new VerseService();
    private wordService: WordService;
    private wordCB: ((evt: WModelEvent) => void) | undefined;
    public constructor(qModel: IQuranModel, qInfo: QInfo) {
        this.wordService = new WordService(qInfo);
        this.verseService.subscribe(this);
        this.verseService.subscribe(this.wordService);
        qModel.subscribe(this.verseService);
        this.wordService.subscribe(this);
    }
    observeWord(evt: WModelEvent): void {
        if (this.wordCB) {
            this.wordCB(evt);
        }
    }

    public init(verseCB: (evt: VModelEvent) => void, wordCB: (evt: WModelEvent) => void) {
        this.verseCB = verseCB;
        this.wordCB = wordCB;
    }

    public observe(evt: VModelEvent): void {
        if (this.verseCB) {
            this.verseCB(evt);
        }
    }
}
