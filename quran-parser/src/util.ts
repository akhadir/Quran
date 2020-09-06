const fetch = require('node-fetch');
const parse = require('node-html-parser');
const config = require('./config.ts');
const fs = require('fs');

const fetchQuran = (chap, vers, callback) => {
    const qurl = config.qurl.replace('{chapter}', chap).replace('{verse}', vers);
    // console.log(qurl);
    const prom = new Promise((resolve, reject) => {
        const quranVerse = [];
        fetch(qurl).then(res => res.text()).then((body) => {
            const root = parse.parse(body);
            const locations = root.querySelectorAll('.morphologyTable .location');
            locations.some((location) => {
                const verseNumbers = location.innerHTML.replace('(', '').replace(')', '').split(':');
                const currChapter = parseInt(verseNumbers[0], 10);
                const currVerse = parseInt(verseNumbers[1], 10);
                if (currChapter === chap && currVerse <= vers) {
                    if (vers === currVerse) {
                        const word = callback(location);
                        quranVerse.push(word);
                    }
                } else {
                    return true;
                }
                return false;
            });
            resolve(quranVerse);
        });
    });
    return prom;
};
const fetchEnglishVerse = (chap, vers) => {
    return fetchQuran(chap, vers, (location) => {
        let word = location.parentNode;
        word = word.innerHTML.split('<br>');
        word = word[word.length - 1];
        return word;
    });
}

const fetchRootWords = (chap, vers) => {
    return fetchQuran(chap, vers, (location) => {
        let word = location.parentNode.querySelector('a');
        if (!word) {
            word = location.parentNode.querySelector('.phonetic');
            word = word.innerHTML;
        } else {
            word = word.attributes['href'].split('q=')[1].split('#')[0];
        }
        return word;
    });
}
const fetchVerse = (chap, vers) => {
    return fetchQuran(chap, vers, (location) => {
        let word = location.parentNode.querySelector('a');
        if (!word) {
            word = location.parentNode.querySelector('.phonetic');
        }
        word = word.innerHTML;
        return word;
    });
}
const saveToFile = (chap, content, subFolder='') => {
    if (typeof content !== 'string') {
        content = JSON.stringify(content, undefined, 4);
    }
    let fileName;
    if (subFolder) {
        fileName = `./out/${subFolder}/${chap}.json`;
    } else {
        fileName = `./out/${chap}.json`;
    }
    const writeStream = fs.createWriteStream(fileName);
    writeStream.write(content);
    writeStream.on('finish', () => {
        console.log(`Saved chap ${chap} to the file.`);
    });
    writeStream.end();
}
module.exports = { fetchRootWords, fetchEnglishVerse, fetchVerse, saveToFile };