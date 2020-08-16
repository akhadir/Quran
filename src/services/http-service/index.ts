import axios from 'axios';

export interface HttpService {
    get(url: string): Promise<any>;
    post(url: string, payload: any): Promise<any>;
}

class HttpServiceImpl implements HttpService {
    private baseURL: string = '/data/';

    public get(url: string) {
        return axios.get(`${this.baseURL}${url}/index.json`)
    }

    public post(url: string, payload: any) {
        return axios.post(`${this.baseURL}${url}/index.json`, payload);
    }
}

export default HttpServiceImpl;