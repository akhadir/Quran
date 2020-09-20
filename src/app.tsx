import React from 'react';
import Chapter from './workspace/chapter';
import './app.css';
import { chapterContext, ChapterContext } from './workspace/chapter/chapter-context';

export type AppProps = {
    chapter?: number;
    startVerse?: number;
    totalVerses?: number;
    path?: any;
}
const App: React.FC<AppProps> = (props: any) => {
    let { chapter, startVerse, totalVerses } = props;
    const config: ChapterContext = {
        chapter: parseInt(chapter, 10) || 1,
        startVerse: parseInt(startVerse, 10) || 1,
        totalVerses: parseInt(totalVerses, 10) || -1,
    };
    return (
        <div className="App">
            <header className="App-header">
                Learn Quran Word by Word
            </header>
            <div className="main">
                <chapterContext.Provider value={config}>
                    <Chapter />
                </chapterContext.Provider>
            </div>
        </div>
    );
};

export default App;
