import React, { useCallback, useState } from 'react';
import { Button, Menu, MenuItem } from '@material-ui/core';

export type QuranWordProps = {
    words: string[];
    notesKey: string;
};
const QuranWord : React.FC<QuranWordProps> = (props: QuranWordProps) => {
    const { words, notesKey  } = props;
    const len = words.length;
    const [anchorEl, setAnchorEl] = React.useState<Element | undefined>(undefined);
    const handleClick = useCallback((event: any) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(undefined);
    }, []);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const handleSelect = useCallback((index: number) => {
        setSelectedIndex(index);
        setAnchorEl(undefined);
    }, []);
    const text = words[selectedIndex];
    let noteString: string = notesKey;
    if (words.length > 1) {
        // const { notes } = notesConfig;
        // if (!notes[noteString]) {
        //     notes[noteString] = words;
        //     notesConfig.setNotes({ ...notes });
        // }
    }

    return (
        <>
            {len > 1 && 
                <>
                    <Button
                        aria-controls={`simple-menu-${notesKey}`}
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <span>{text}<sub>{noteString}</sub></span>
                    </Button>
                    <Menu
                        id={`simple-menu-${notesKey}`}
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        {words.map((word: string, index: number) => (
                            <MenuItem key={word} onClick={() => handleSelect(index)}>{word}</MenuItem>
                        ))}
                    </Menu>
                </>
            }
            {words.length === 1 && <span className="simp">{words[0]}</span>}
        </>
    );
};
export default QuranWord;
