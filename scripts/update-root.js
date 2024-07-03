const mysql = require('mysql');
const { extractRoot } = require('./extract-root');
const Stemmer = require('arabic-stemmer/dist/index');

const stemmer = new Stemmer();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'quran',
    multipleStatements: true,
});

connection.connect(function (err) {
    if (err) throw err;
    console.log('Connected');
    getAllWords(process.argv[2] || 1);
});

function getAllWords(sura) {
    var post = { sura };
    connection.query('SELECT simple FROM `quran_words` where ? AND `simple` IS NOT NULL AND `root` IS NULL', post, function (err, result) {
        if (err) throw err;
        console.log('Updating roots for Sura', sura, 'for items', result.length);
        const inputArray = result.map((row) => {
            let root;
            if (row.simple) {
                try {
                    root = stemmer.stem(row.simple);
                    if (root.stem?.length) {
                        root = root.stem[root.stem.length - 1];
                    } else {
                        root = row.simple;
                    }
                } catch(e) {
                    console.log('Error:', row);
                    root = extractRoot(row.simple);
                }
            } else {
                console.log('Unknown Error:', row);
                process.exit(1);
            }
            return { sura, simple: row.simple, root};
        })
        updateRoots(inputArray);
    });
}

function updateRoots(input) {
    var queries = '';
    console.log("Updating ROOT for", input.length, "items.");
    input.forEach(function (item) {
        if (item.root) {
            const query = mysql.format('UPDATE `quran_words` SET `root` = ? WHERE `simple` = ? AND `sura` = ?; ', [item.root, item.simple, item.sura]);
            queries = `${queries}${query}`;
        } else {
            console.log('Root not defined', item);
        }
    });
    connection.query(queries, function (err, result) {
        if (err) throw err;
        console.log('Updated');
        // console.log(process.argv);
        process.exit();
    });
}
function updateRoot(sura, simple, root) {
    const query = connection.query('UPDATE `quran_words` SET `root` = ? WHERE `simple` = ? AND `sura` = ?', [root, simple, sura], function (err, result) {
        if (err) throw err;
        console.log('Updated', sura, simple, root);
    });
    console.log(query.sql);
}