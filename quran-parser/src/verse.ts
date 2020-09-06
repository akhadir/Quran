const fetch = require('node-fetch');
const config = require('./config.ts');
const parse = require('node-html-parser');

const myArgs = process.argv.slice(2);
const [chapter, verse] = myArgs;
let findVerses = true;
const quranVerses = [];
const start = async () => {
    console.log('verse', verse);
    const quranVerse = await fetchVerse(parseInt(chapter), parseInt(verse));
    if (quranVerse && quranVerse.length) {
        quranVerses.push(quranVerse);
    }
    // console.log('Complete Chapter', quranVerses);
}
start();
