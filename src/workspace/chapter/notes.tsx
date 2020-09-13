import React, { useContext } from 'react';
import { chapterContext } from './chapter-context';

const Notes: React.FC = () => {
    const notes = {};
    const noteKeys = Object.keys(notes).sort();
    return (
        <div className="verse-notes">
            {noteKeys.map((key: string) => (
                <div className="verse-note">
                    <div className="key">{key}: </div>
                    {/* <div className="value">{notes[key].join(', ')}</div> */}
                </div>
            ))}
        </div>
    );
}
export default Notes;