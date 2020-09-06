const fs = require('fs');
const stopword = require('stopword')
const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
const rootMap = JSON.parse(fs.readFileSync(`./out/rootMapEnglish.json`));
const rootMapEngUniq = {};
Object.keys(rootMap).forEach((rootKey) => {
    const wordArray = rootMap[rootKey];
    const langWordList = [];
    const rootEngStems = [];
    wordArray.forEach((words) => {
        const flushedWords = words
            .replace(/\(.+?\)/g, '')
            .replace(/\[.+?\]/g, '')
            .replace(/[\"\,\.;\?!\-]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
        let flushedWordArray = stopword.removeStopwords(tokenizer.tokenize(words));
        // if (flushedWordArray.length === 0) {
        //     flushedWordArray = flushedWords.split(' ').filter((wrd) => {
        //         return ['although', 'as', 'in', 'for', 'if', 'though', 'but', 'so', 'on', 'about', 'by', 'the', 'of', 'is', 'was', 'are', 'were', 'his', 'her', 'him', 'he', 'she', 'they', 'their', 'them', 'i', 'you', 'me', 'yours', 'my', 'mine'].indexOf(wrd) === -1;
        //     });
        // }
        const stemWordList = flushedWordArray.map((word) => {
            return natural.PorterStemmer.stem(word);
        });
        const hasRootAlready = stemWordList.some((stemWord) => {
            return rootEngStems.indexOf(stemWord) > -1;
        });
        if (!hasRootAlready && flushedWordArray.length) {
            rootEngStems.push(...stemWordList);
            if (flushedWords && langWordList.indexOf(flushedWords) === -1) {
                langWordList.push(flushedWords);
            }
        }
    });
    if (rootMapEngUniq[rootKey]) {
        rootMapEngUniq[rootKey].push(...langWordList);
    } else {
        rootMapEngUniq[rootKey] = langWordList;
    }
});
const savableContent = JSON.stringify(rootMapEngUniq, undefined, 4);
const fileNam = './out/rootMapEngUniq.json';
const writeStrm = fs.createWriteStream(fileNam);
writeStrm.write(savableContent);
writeStrm.on('finish', () => {
    console.log(`Saved rootMap Unique - English to the file.`);
});
writeStrm.end();