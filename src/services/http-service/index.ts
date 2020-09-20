// import axios from 'axios';
import cachios from 'cachios';

export interface HttpService {
    get(url: string): Promise<any>;
    post(url: string, payload: any): Promise<any>;
}

class HttpServiceImpl implements HttpService {
    private baseURL: string = '/data/';
    public get(url: string) {
        const axHandler = cachios.get(`${this.baseURL}${url}`);
        return axHandler;
    }

    public post(url: string, payload: any) {
        return cachios.post(`${this.baseURL}${url}`, payload);
    }
}

export default HttpServiceImpl;