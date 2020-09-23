self.onmessage = (event) => {
    const { data } = event;
    const rootWord = data.rootWords[data.verseIndex][data.wordIndex];
    const words = data.synonyms[rootWord];
    self.postMessage(words);
}