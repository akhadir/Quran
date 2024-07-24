import HttpServiceImpl from '../http-service';
import SqliteManager from '../sqlite-servicer';
// import { MySqlManager } from "../mysql-service/index.ts.back";
import { ChapterInfo, TranslationInfo } from "../translation/translation-types";
import { CModelEvent, CModelEventType, VModelEvent } from "../worker";
import { ITranslationService } from '../worker/itranslation-service';

export class DBTranslationService implements ITranslationService {
    private dbManager;
    private labelCallback?: (evt: CModelEvent) => void;
    private dataCallback?: (evt: VModelEvent) => void;
    public result: ChapterInfo = {
        name: '',
        label: '',
        verses: [],
    };
    constructor() {
        // this.dbManager = MySqlManager.getInstance();
        this.dbManager = SqliteManager.getInstance();
    }
    init(dataCallback: (evt: VModelEvent) => void, labelCallback: (evt: CModelEvent) => void): void {
        this.labelCallback = labelCallback;
        this.dataCallback = dataCallback;
    }
    getTranslationInfo(translation: string): Promise<TranslationInfo> {
        throw new Error("Method not implemented.");
    }
    public getChapter(
        translation: string, chapterNumber: number, startVerse: number = 1, totalVerses: number = -1): Promise<ChapterInfo> {
        const chapterInfo: ChapterInfo = {
            name: '',
            label: '',
            verses: [],
        };
        const prom = new Promise<ChapterInfo>((resolve, reject) => {
            const labelService = new HttpServiceImpl();
            labelService.get(`${translation}/chapter.json`).then((result: any) => {
                const chapterDetails = result.data[chapterNumber - 1]
                if (this.labelCallback) {
                    this.labelCallback({
                        data: chapterDetails,
                        eventType: CModelEventType.INIT,
                    });
                }
            });
            const sqlPromise = initSqlJs({
                locateFile: (file: string) => `http://localhost${file}`
            });
            const dataPromise = fetch('/db/quran.sqlite').then(res => res.arrayBuffer());
            Promise.all([sqlPromise, dataPromise]).then((result: any) => {
                const [SQL, buf] = result;
                const db = new SQL.Database(new Uint8Array(buf));
                console.log("DB: ", db);
            });
            const params: any[] = [];
            let query = 'SELECT translation FROM quran_words WHERE sura=? ';
            params.push(chapterNumber);
            if (startVerse) {
                query = 'AND aya=? ';
                params.push(startVerse);
            }
            if (totalVerses) {
                query = 'LIMIT ?';
                params.push(startVerse);
            }
            this.dbManager.query(query, params).then((data) => {
                console.log(data);
                resolve(data);
                if (this.dataCallback) {
                    // this.dataCallback(chapterInfo);
                }
            });
        });
        return prom;
    }
}

function initSqlJs(arg0: { locateFile: (file: string) => string; }) {
    throw new Error('Function not implemented.');
}
