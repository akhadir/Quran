import React from 'react';
import Chapter from './workspace/chapter';
import './App.css';

function App() {
  return (
    <div className="App">
        <header className="App-header">
            Learn Quran Word by Word
        </header>
        <div className="main">
            <Chapter />
        </div>
    </div>
  );
}

export default App;
