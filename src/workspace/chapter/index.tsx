import React, { useEffect, useState, useCallback, useContext } from 'react';
import TranslationServiceImpl from '../../services/translation';
import { TranslationInfo, ChapterInfo, VerseInfo } from '../../services/translation/translation-types';
import QuranWord from './quran-word';
import './index.css';
import { chapterContext } from './verse-context';

const Chapter: React.FC = () => {
    const transService = new TranslationServiceImpl();
    // const [supCount] = useState<number>(1);
    const { chapter }  = useContext(chapterContext);
    const [translation] = useState<string>('tamil');
    const [transInfo, setTransInfo] = useState<TranslationInfo>();
    const [chapterInfo, setChapterInfo] = useState<ChapterInfo>();
    useEffect(() => {
        transService.getTranslationInfo(translation).then((info: TranslationInfo) => {
            setTransInfo(info);
        });
        transService.getChapter(translation, chapter).then((info: ChapterInfo) => {
            setChapterInfo(info);
        });
        // eslint-disable-next-line
    }, []);

    const getVerse = useCallback((verse: VerseInfo) => {
        // let scount = supCount;
        let out;
        if (verse.order.length) {
            out = verse.order.map((order: number) => {
                const word: string[] = verse.verse[order];
                return <QuranWord words={word} key={order} />;
            });
        } else {
            out = verse.verse.map((word: string[], index: number) => <QuranWord words={word} key={index} />);
        }
        return out;
    }, []);
    return (<>
        {!!(transInfo && chapterInfo) && (
            <>
                <h2>
                    {chapter}. {chapterInfo.label}
                </h2>
                <div className="verses">
                    {chapterInfo.verses.map((verse: VerseInfo, index: number) => (
                        <div className="verse" key={verse.verse.toString()}>
                            <div className="chapter">{chapter}:{index + 1}</div>
                            <div className="text">
                                {getVerse(verse)}
                            </div>
                        </div>
                    ))}
                </div>
            </>
        )}
    </>)
}

export default Chapter;