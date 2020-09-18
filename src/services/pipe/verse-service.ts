import { AxiosResponse } from "axios";
import { Subject, Subscription } from "rxjs";
import HttpServiceImpl from "../http-service";
import { IVerseModelObserver, VModelEvent, VModelEventType } from "./verse-model-observer";
import { QInfo } from "./quran-model";
import { QModelEvent, IQuranModelObserver } from "./quran-model-observer";

export class VerseService implements IQuranModelObserver {
    private httpService = new HttpServiceImpl();
    private observable = new Subject<VModelEvent>();
    public subscribers: Subscription[] = [];
    private parseData(resp: any[], startVerse: number, totalVerses: number | undefined): any[] {
        if (totalVerses && totalVerses > 0) {
            resp = resp.slice(
                startVerse - 1, startVerse + totalVerses - 1,
            );
        } else {
            resp = resp.slice(startVerse - 1);
        }
        return resp;
    }
    public observe(event: QModelEvent) {
        console.log('Info', event);
        const { data : info }: { data: QInfo } = event;
        const { lang, chapterNo, startVerse, totalVerses } = info;
        this.httpService.get(`simple/${lang}/${chapterNo}.json`).then((resp: AxiosResponse<any>) => {
            const { data: verses } : { data: string[][] } = resp;
            const parsedData = this.parseData(verses, startVerse, totalVerses);
            parsedData.forEach((verse: string[], index: number) => {
                const model: VModelEvent = {
                    eventType: VModelEventType.INIT,
                    data: {
                        index,
                        verseIndex: index + startVerse,
                        verse,
                    },
                };
                this.observable.next(model);
            });
        }).catch((e: any) => {
            // Nothing to be done here.
        })
    }

    public subscribe(observer: IVerseModelObserver): Subscription {
        const subscriber = this.observable.subscribe(observer.observe.bind(observer));
        this.subscribers.push(subscriber);
        return subscriber;
    }
    public unsubscribe() {
        this.observable.unsubscribe();
    }
    
}