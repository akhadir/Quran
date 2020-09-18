export enum VModelEventType {
    INIT = 'INIT',
};
export type VModelEvent = {
    eventType: VModelEventType;
    data: {
        index: number;
        verseIndex: number;
        verse: string[];
    };
};

export interface IVerseModelObserver {
    observe(evt: VModelEvent): void;
}

