import React, { useEffect, useState, useCallback, useContext } from 'react';
// import TranslationServiceImpl from '../../services/translation';
import { ChapterInfo, VerseInfo } from '../../services/translation/translation-types';
import QuranWord from './quran-word';
import { chapterContext } from './chapter-context';
// import { ServiceManager } from '../../services/pipe/service-manager';
// import { CModelEvent } from '../../services/pipe/chapter-model-observer';
import './index.css';
// import { VModelEvent } from '../../services/pipe/verse-model-observer';
// import { WModelEvent } from '../../services/pipe/word-service';
// import { CModelEvent } from '../../services/pipe/chapter-model-observer';
import WorkerTranslationService, { CModelEvent, VModelEvent } from '../../services/worker';

// const servManager = new ServiceManager();
const workerServManager = new WorkerTranslationService();
const Chapter: React.FC = () => {
    const { chapter, startVerse, totalVerses }  = useContext(chapterContext);
    const [translation] = useState<string>('english');
    useEffect(() => {
        workerServManager.init(
            (evt: VModelEvent) => {
                const { data } = evt;
                chapterInfo.verses[data.verseIndex - 1] = {
                    order: [],
                    verse: data.verse,
                };
                setChapterInfo({ ...chapterInfo });
            },
            (evt: CModelEvent) => {
                const chapterLabel = `${evt.data[0]} - ${evt.data[1]}`;
                chapterInfo.label = chapterLabel;
                setChapterInfo({ ...chapterInfo });
            },
        );
        workerServManager.getChapter(translation, chapter, startVerse, totalVerses);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [translation, chapter, startVerse, totalVerses]);
    // useEffect(() => {
    //     servManager.init(
    //         {
    //             chapterNo: chapter,
    //             startVerse,
    //             totalVerses,
    //             lang: translation,
    //         },
    //         (evt: CModelEvent) => {
    //             // console.log('Getting Chapter: ', evt);
    //             const chapterLabel = `${evt.data[0]} - ${evt.data[1]}`;
    //             chapterInfo.label = chapterLabel;
    //             setChapterInfo({ ...chapterInfo });
    //         },
    //         (evt: VModelEvent) => {
    //             // console.log('Getting Verse:', evt);
    //             const { data } = evt;
    //             chapterInfo.verses[data.verseIndex - 1] = {
    //                 order: [],
    //                 verse: data.verse.map((vers) => [vers]),
    //             };
    //             setChapterInfo({ ...chapterInfo });
    //         },
    //         (evt: WModelEvent) => {
    //             // console.log('Getting Word:', evt);
    //             const { data } = evt;
    //             if (chapterInfo.verses[data.verseIndex - 1]) {
    //                 chapterInfo.verses[data.verseIndex - 1].verse[data.wordIndex - 1].push(...data.words);
    //             }
    //             setChapterInfo({ ...chapterInfo });
    //         },
    //     );
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [chapter, startVerse, totalVerses, translation]);
    // const transService = new TranslationServiceImpl();
    // const [transInfo, setTransInfo] = useState<TranslationInfo>();
    const [chapterInfo, setChapterInfo] = useState<ChapterInfo>({
        label: '',
        name: '',
        verses: [],
    });
    // useEffect(() => {
    //     transService.getTranslationInfo(translation).then((info: TranslationInfo) => {
    //         setTransInfo(info);
    //     });
    //     transService.getChapter(translation, chapter, startVerse, totalVerses)
    //         .then((info: ChapterInfo) => {
    //         setChapterInfo(info);
    //     });
    //     // eslint-disable-next-line
    // }, []);
    const padZeros = (num: number, places: number) => {
        let zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    }
    const getVerse = useCallback((verse: VerseInfo, vIndex: number) => {
        let out;
        const key = padZeros(chapter, 3);
        if (verse.order.length) {
            out = verse.order.map((order: number) => {
                const word: string[] = verse.verse[order];
                const indexKey = padZeros(vIndex, 3);
                const notesKey = `${key}${indexKey}${order}`;
                return <QuranWord words={word} key={notesKey} notesKey={notesKey} />;
            });
        } else {
            out = verse.verse.map(
                (word: string[], index: number) => {
                    const notesKey = word.toString();
                    return <QuranWord words={word} key={notesKey} notesKey={notesKey} />;
                },
            );
        }
        return out;
    }, [chapter]);
    let start: any = startVerse;
    if (typeof start === 'string') {
        start = parseInt(start);
    }
    start = start ? start : 1;
    return (<>
        {chapterInfo.label && (
            <>
                <h2>
                    {chapter}. {chapterInfo.label}
                </h2>
                <div className="verses">
                    {chapterInfo.verses.map((verse: VerseInfo, index: number) => (
                        <div className="verse" key={`${chapter}:${index + start}`}>
                            <div className="chapter">{chapter}:{index + start}</div>
                            <div className="text">
                                {getVerse(verse, index)}
                            </div>
                        </div>
                    ))}
                </div>
            </>
        )}
    </>)
}

export default Chapter;