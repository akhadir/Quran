import { IQuranModel, QInfo } from "./quran-model";
import { IVerseModelObserver, VModelEvent } from "./verse-model-observer";
import { VerseService } from "./verse-service";
import { IWordModelObserver, WModelEvent, WordService } from "./word-service";

export class VerseWordManager implements IVerseModelObserver, IWordModelObserver {
    private verseCB: ((evt: VModelEvent) => void) | undefined;
    private verseService: VerseService = new VerseService();
    private wordService: WordService;
    private quranOut: string[][][] = [];
    public constructor(qModel: IQuranModel) {
        const qinfo: QInfo = {
            chapterNo: qModel.chapterNo,
            startVerse: qModel.startVerse,
            totalVerses: qModel.totalVerses,
            lang: qModel.lang,
        }
        this.wordService = new WordService(qinfo);
        this.verseService.subscribe(this);
        this.verseService.subscribe(this.wordService);
        qModel.subscribe(this.verseService);
        this.wordService.subscribe(this);
    }
    observeWord(evt: WModelEvent): void {
        console.log('word: ', evt);
        this.quranOut[evt.data.verseIndex - 1][evt.data.wordIndex - 1].push(...evt.data.words);
        if (this.quranOut[evt.data.verseIndex - 1].length === evt.data.wordIndex) {
            if (this.verseCB) {
                // this.verseCB(this.quranOut)
            }
        }
    }

    public init(verseCB: (evt: VModelEvent) => void) {
        this.verseCB = verseCB;
    }

    public observe(evt: VModelEvent): void {
        console.log('verse: ', evt);
        const versArray: string[][] = evt.data.verse.map((vers: string) => ([vers]));
        this.quranOut[evt.data.verseIndex - 1] = versArray;
        // if (this.verseCB) {
        //     this.verseCB(evt);
        // }
    }
}
