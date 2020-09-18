import { QInfo } from "./quran-model";

export enum QModelEventType {
    INIT = 'INIT',
    CHANGE_START_VERSE = 'ÇHANGE_START_VERSE',
    CHANGE_TOTAL_VERSES = 'CHANGE_TOTAL_VERSES',
    CHANGE_CHAPTER = 'CHANGE_CHAPTER',
};
export type QModelEvent = {
    eventType: QModelEventType;
    data: QInfo;
};

export interface IQuranModelObserver {
    observe(evt: QModelEvent): void;
}
