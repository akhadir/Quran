export type TranslationInfo = {
    label: string;
    lang: string;
    name: string;
    rtl: boolean;
    endOfSentense: string;
    endOfWord: string;
};

export type VerseInfo = {
    order: number[],
    verse: string[][];
};

export type ChapterInfo = {
    name: string;
    label: string;
    verses: VerseInfo[];
};
