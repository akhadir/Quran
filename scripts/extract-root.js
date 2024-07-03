function removePrefixes(word) {
    const prefixes = ["ال", "بال", "كال", "وال", "فال", "لل", "ب", "ك", "و", "ف", "ل"];
    for (let prefix of prefixes) {
        if (word.startsWith(prefix)) {
            return word.slice(prefix.length);
        }
    }
    return word;
}

function removeSuffixes(word) {
    const suffixes = ["ها", "هم", "كما", "نا", "ها", "كم", "كن", "هما", "هم", "هن", "ا", "ي", "ة", "ات", "ان", "ين", "ون", "وا", "ي", "ت"];
    for (let suffix of suffixes) {
        if (word.endsWith(suffix)) {
            return word.slice(0, -suffix.length);
        }
    }
    return word;
}

function extractRoot(word) {
    // Step 1: Remove prefixes
    word = removePrefixes(word);

    // Step 2: Remove suffixes
    word = removeSuffixes(word);

    // The result is a simplified form of the root
    return word;
}

// Test the function
// let word = "الكتب";
// let root = extractRoot(word);
// console.log(root); // Output should be "كتب"

exports.extractRoot = extractRoot;
