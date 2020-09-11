import { createContext } from 'react';

export type ChapterContext {
    chapter: number;
    startVerse: number;
    totalVerses: number | undefined;
}
export const chapterContext = createContext({
    chapter: 1,
    startVerse: 1,
    totalVerses: undefined,
});