import React, { useEffect, useState, useCallback, useContext, useMemo } from 'react';
import { ChapterInfo, VerseInfo } from '../../services/translation/translation-types';
import QuranWord from './quran-word';
import { chapterContext } from './chapter-context';
import SwitchService, { ServiceTypes } from '../../services/switch-service';
import './index.css';

const Chapter: React.FC = () => {
    const { chapter, startVerse, totalVerses } = useContext(chapterContext);
    const [translation] = useState<string>('english');
    const [chapterInfo, setChapterInfo] = useState<ChapterInfo>({
        label: '',
        name: '',
        verses: [],
    });
    useEffect(() => {
       (new SwitchService(ServiceTypes.INLINE_SERVICE)).getChapterInfo(translation, chapter, startVerse, totalVerses, setChapterInfo);
    }, [translation, chapter, startVerse, totalVerses]);
    const padZeros = useCallback((num: number, places: number) => {
        let zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    }, []);
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
    }, [chapter, padZeros]);
    const start: any = useMemo(() => {
        let startV = startVerse;
        if (typeof startV === 'string') {
            startV = parseInt(start);
        }
        return startV || 1;
    }, [startVerse]);
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
