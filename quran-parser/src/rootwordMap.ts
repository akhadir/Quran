const fs = require('fs');

const rootMap = {};
for (let chap = 1; chap <= 114; chap++) {
    console.log(`Reading Chapter ${chap}`);
    let chapter = JSON.parse(fs.readFileSync(`./out/root/${chap}.json`));
    chapter.forEach((verse, vers) => {
        verse.forEach((word, wor) => {
            const link = `${chap}:${vers + 1}:${wor + 1}`;
            if (rootMap[word]) {
                rootMap[word].push(link);
            } else {
                rootMap[word] = [link];
            }
        });
    });
}
const content = JSON.stringify(rootMap, undefined, 4);
const fileName = './out/rootMap.json';
const writeStream = fs.createWriteStream(fileName);
writeStream.write(content);
writeStream.on('finish', () => {
    console.log(`Saved rootMap to the file.`);
});
writeStream.end();