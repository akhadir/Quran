export enum CModelEventType {
    INIT = 'INIT',
};
export type CModelEvent = {
    eventType: CModelEventType;
    data: string[];
};

export interface IChapterModelObserver {
    init(chapterCB: (evt: CModelEvent) => void): void;
    observe(evt: CModelEvent): void;
}

export default class ChapterModelObserver implements IChapterModelObserver {
    private chapterCB: (evt: CModelEvent) => void;
    public init(chapterCB: (evt: CModelEvent) => void): void {
        this.chapterCB = chapterCB;
    }
    public constructor(chapterCB: (evt: CModelEvent) => void) {
        this.chapterCB = chapterCB;
    }
    observe(evt: CModelEvent): void {
        this.chapterCB(evt);
    }   
}
