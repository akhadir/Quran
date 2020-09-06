const util = require('./util.ts');

const myArgs = process.argv.slice(2);
let [chapter] = myArgs;
chapter = parseInt(chapter, 10);
let findVerses = true;
const quranVerses = [];
let verse = 0;
const start = async () => {
    while (findVerses) {
        verse += 1;
        const quranVerse = await util.fetchEnglishVerse(chapter, verse);
        if (quranVerse && quranVerse.length) {
            quranVerses.push(quranVerse);
        } else {
            findVerses = false;
        }
    }
    console.log('Complete Chapter', quranVerses);
    util.saveToFile(chapter, quranVerses, 'english');
}
start();
