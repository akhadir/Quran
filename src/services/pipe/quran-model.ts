import { Subject } from "rxjs/internal/Subject";
import { Subscription } from "rxjs/internal/Subscription";
import { QModelEvent, QModelEventType, IQuranModelObserver } from "./quran-model-observer";

export type QInfo = {
    lang: string;
    chapterNo: number;
    startVerse: number;
    totalVerses: number;
}
export interface IQuranModel {
    lang: string;
    chapterNo: number;
    startVerse: number;
    totalVerses: number;
    observable: Subject<QModelEvent>;
    subscribers: Subscription[];
    subscribe: (observer: IQuranModelObserver) => Subscription;
    unsubscribe: () => void;
    init: (qinfo: QInfo) => void;
}

export class QuranModel implements IQuranModel {
    private _chapterNo: number = 1;
    private _startVerse: number = 1;
    private _totalVerses: number = -1;
    private _lang: string = 'english';
    get chapterNo(): number {
        return this._chapterNo;
    }
    set chapterNo(no: number) {
        this._chapterNo = no;
    }
    get lang(): string {
        return this._lang;
    }
    set lang(lang: string) {
        this._lang = lang;
    }
    get startVerse(): number {
        return this._startVerse;
    }
    set startVerse(no: number) {
        this._startVerse = no;
    }
    get totalVerses(): number {
        return this._totalVerses;
    }
    set totalVerses(no: number) {
        console.log('startVerse');
        this._totalVerses = no;
    }
    public constructor () {
        this.observable = new Subject();
    }
    public subscribers: Subscription[] = [];
    public observable: Subject<QModelEvent>;

    public init(input: QInfo): void {
        this._chapterNo = input.chapterNo;
        this._startVerse = input.startVerse;
        this._totalVerses = input.totalVerses;
        const qinfo: QInfo = {
            lang: this.lang,
            chapterNo: this.chapterNo,
            startVerse: this.startVerse,
            totalVerses: this.totalVerses,
        };
        this.observable.next({
            data: qinfo,
            eventType: QModelEventType.INIT,
        });
    }
    public subscribe(observer: IQuranModelObserver): Subscription {
        const subscriber = this.observable.subscribe(observer.observe.bind(observer));
        this.subscribers.push(subscriber);
        return subscriber;
    }
    public unsubscribe() {
        this.observable.unsubscribe();
    }
}