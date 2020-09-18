import { AxiosResponse } from "axios";
import { Subject, Subscription } from "rxjs";
import HttpServiceImpl from "../http-service";
import { IChapterModelObserver, CModelEvent, CModelEventType } from "./chapter-model-observer";
import { QInfo } from "./quran-model";
import { QModelEvent, IQuranModelObserver } from "./quran-model-observer";

export class ChapterService implements IQuranModelObserver {
    private httpService = new HttpServiceImpl();
    private observable = new Subject<CModelEvent>();
    public subscribers: Subscription[] = [];

    public observe(event: QModelEvent) {
        console.log('Info', event);
        const { data : info }: { data: QInfo } = event;
        this.httpService.get(`${info.lang}/chapter.json`).then((resp: AxiosResponse) => {
            const { data } : { data: string[][] } = resp;
            const model: CModelEvent = {
                eventType: CModelEventType.INIT,
                data: data[info.chapterNo - 1],
            };
            this.observable.next(model);
        }).catch(error => {
            const model: CModelEvent = {
                eventType: CModelEventType.INIT,
                data: [],
            };
            this.observable.next(model);
        });
    }
    
    public subscribe(observer: IChapterModelObserver): Subscription {
        const subscriber = this.observable.subscribe(observer.observe.bind(observer));
        this.subscribers.push(subscriber);
        return subscriber;
    }
    public unsubscribe() {
        this.observable.unsubscribe();
    }
    
}