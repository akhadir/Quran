import React, { useState } from 'react';
import Chapter from './workspace/chapter';
import Notes from './workspace/chapter/notes';
import './app.css';
import { chapterContext, ChapterContext } from './workspace/chapter/chapter-context';

export type AppProps = {
    chapter?: number;
    startVerse?: number;
    totalVerses?: number;
    path?: any;
}
const App: React.FC<AppProps> = (props: any) => {
    const [notes, setNotes] = useState<{ [id:string]: string[]; }>({});
    let { chapter, startVerse, totalVerses } = props;
    const config: ChapterContext = {
        chapter: chapter || 1,
        startVerse: startVerse || 1,
        totalVerses,
        notes,
        setNotes,
    };
    return (
        <div className="App">
            <header className="App-header">
                Learn Quran Word by Word
            </header>
            <div className="main">
                <chapterContext.Provider value={config}>
                    <Chapter />
                    <Notes />
                </chapterContext.Provider>
            </div>
        </div>
    );
};

export default App;
