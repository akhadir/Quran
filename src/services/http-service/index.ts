import axios, { AxiosResponse } from 'axios';

export interface HttpService {
    get(url: string): Promise<any>;
    post(url: string, payload: any): Promise<any>;
}

class HttpServiceImpl implements HttpService {
    private baseURL: string = '/data/';
    private cachedResponse: { [url: string]: any } = {};
    public get(url: string) {
        if (this.cachedResponse[url]) {
            return Promise.resolve({
                data: this.cachedResponse[url],
            } as AxiosResponse);
        }
        return axios.get(`${this.baseURL}${url}`)
    }

    public post(url: string, payload: any) {
        return axios.post(`${this.baseURL}${url}`, payload);
    }
}

export default HttpServiceImpl;