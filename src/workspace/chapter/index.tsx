import React, { useEffect, useState, useCallback, useContext } from 'react';
import TranslationServiceImpl from '../../services/translation';
import { TranslationInfo, ChapterInfo, VerseInfo } from '../../services/translation/translation-types';
import QuranWord from './quran-word';
import { chapterContext } from './chapter-context';
import { ServiceManager } from '../../services/pipe/service-manager';
import { CModelEvent } from '../../services/pipe/chapter-model-observer';
import './index.css';
import { VModelEvent } from '../../services/pipe/verse-model-observer';

const servManager = new ServiceManager();
const Chapter: React.FC = () => {
    const { chapter, startVerse, totalVerses }  = useContext(chapterContext);
    const [translation] = useState<string>('english');
    useEffect(() => {
        servManager.init(
            {
                chapterNo: chapter,
                startVerse,
                totalVerses,
                lang: translation,
            },
            (evt: CModelEvent) => {
                console.log('Getting Chapter: ', evt);
            },
            (evt: VModelEvent) => {
                console.log('Getting Verse:', evt);
            },
        );
    }, [chapter, startVerse, totalVerses, translation]);
    const transService = new TranslationServiceImpl();
    const [transInfo, setTransInfo] = useState<TranslationInfo>();
    const [chapterInfo, setChapterInfo] = useState<ChapterInfo>();
    useEffect(() => {
        transService.getTranslationInfo(translation).then((info: TranslationInfo) => {
            setTransInfo(info);
        });
        transService.getChapter(translation, chapter, startVerse, totalVerses)
            .then((info: ChapterInfo) => {
            setChapterInfo(info);
        });
        // eslint-disable-next-line
    }, []);
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
                    const notesKey = `${index + 1}`;
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
        {!!(transInfo && chapterInfo) && (
            <>
                <h2>
                    {chapter}. {chapterInfo.label}
                </h2>
                <div className="verses">
                    {chapterInfo.verses.map((verse: VerseInfo, index: number) => (
                        <div className="verse" key={verse.verse.toString()}>
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