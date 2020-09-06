const fs = require('fs');

const rootMap = JSON.parse(fs.readFileSync(`./out/rootMap.json`));
const rootMapEnglish = {};
Object.keys(rootMap).forEach((rootKey) => {
    const wordKeyList = rootMap[rootKey];
    const langWordList = wordKeyList.map((key) => {
        const [chap, verse, word] = key.split(':');
        const chapter = JSON.parse(fs.readFileSync(`./out/english/${chap}.json`));
        return chapter[verse - 1][word - 1];
    });
    if (rootMapEnglish[rootKey]) {
        rootMapEnglish[rootKey].push(...langWordList);
    } else {
        rootMapEnglish[rootKey] = langWordList;
    }
});
const cont = JSON.stringify(rootMapEnglish, undefined, 4);
const file = './out/rootMapEnglish.json';
const writeSrm = fs.createWriteStream(file);
writeSrm.write(cont);
writeSrm.on('finish', () => {
    console.log(`Saved rootMap - English to the file.`);
});
writeSrm.end();