import React from 'react';
import Chapter from './workspace/chapter';
import Notes from './workspace/chapter/notes';
import './app.css';
import { chapterContext, ChapterContext } from './workspace/chapter/verse-context';

function App() {
    const config: ChapterContext = {
        chapter: 1,
        notes: {},
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
}

export default App;
