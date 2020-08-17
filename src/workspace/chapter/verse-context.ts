import React from 'react';

export type ChapterContext = {
    chapter: number;
    notes: { [id:string]: string[] };
}
const defaultConfig: ChapterContext = {
    chapter: 1,
    notes: {},
};
export const chapterContext = React.createContext<ChapterContext>(defaultConfig);