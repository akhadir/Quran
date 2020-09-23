(() => {
    function parseData(resp, startVerse, totalVerses) {
        if (totalVerses && totalVerses > 0) {
            resp = resp.slice(
                startVerse - 1, startVerse + totalVerses - 1,
            );
        } else {
            resp = resp.slice(startVerse - 1);
        }
        return resp;
    }
    let synonyms;
    let rootWords;
    let verses;
    self.addEventListener('message', function (e) {
        const type = e.data.type;
        const data = e.data.data;
        if (type === 'INIT') {
            synonyms = data.synonyms;
            rootWords = data.rootWords;
            verses = data.verses;
        } else if (type === 'FETCH_DATA') {
            const start = data.start;
            const total = data.total;
            parseData(verses, start, total).forEach((verse, verseIndex) => {
                const result = verse.map((word, wordIndex) => {
                        const rootWord = rootWords[verseIndex + start - 1][wordIndex];
                        const wordList = synonyms[rootWord];
                        const words = [ word ];
                        if (wordList.length > 1) {
                            words.push(...wordList);
                        }
                        return words;
                });
                postMessage({
                    index: verseIndex,
                    verseIndex: verseIndex + start,
                    verse: result,
                });
            });
        } else {
            // Do nothing
        }
    });
})();
