import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { HttpOptions } from './http-options';
import { TransferState } from '../transfer-state/transfer-state';


@Injectable()
export class TransferHttp {
    baseHttpUrl = '';
    formHeader = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    jsonHeader = new Headers({ 'Content-Type': 'application/json; charset=UTF-8' });
    constructor(
        private http: Http,
        private httpOptions: HttpOptions,
        private transferState: TransferState
    ) {
        this.baseHttpUrl = httpOptions.pre + httpOptions.contentPath;
    }
    /**
     * get
     */
    get(url: string, params?: object): Promise<any> {
        return this.doRequest(url, params, 'get');
    }
    /**
     * post
     */
    post(url: string, params?: object): Promise<any> {
        return this.doRequest(url, params, 'post');
    }
    /**
     * payload
     */
    postByJson(url: string, params?: object): Promise<any> {
        return this.doRequest(url, params, 'json');
    }

    doRequest(url: string, params: object, type: string) {
        return new Promise((resolve, reject) => {
            let key = url + (params ? JSON.stringify(params) : '');
            let cacheData = this.getFromCache(key);
            if (cacheData) {
                return resolve(cacheData);
            }
            else {
                let o: any;
                if (type === 'get') {
                    o = this.http.get(this.baseHttpUrl + url, new RequestOptions({
                        params: params,
                        headers: this.formHeader
                    }))
                }
                else if (type === 'post') {
                    let body = new URLSearchParams();
                    for (let p in (params as any)) {
                        if (params.hasOwnProperty(p)) {
                            body.set(p, params[p]);
                        }
                    }
                    o = this.http.post(this.baseHttpUrl + url, body, new RequestOptions({
                        headers: this.formHeader
                    }))
                }
                else {
                    let body = params;
                    o = this.http.post(this.baseHttpUrl + url, body, new RequestOptions({
                        headers: this.jsonHeader
                    }))
                }
                o.subscribe((res) => {
                    var data = res.json();
                    if (typeof window === 'undefined') {
                        //node 环境，设置缓存
                        console.log('服务端渲染，把异步数据存入缓存，并通过script传递给浏览器');
                        this.setCache(key, data);
                    }
                    resolve(data);
                }, (error: any) => {
                    console.log('doRequest fail...');
                    reject(error);
                })
            }
        })
    }

    setCache(key, data) {
        return this.transferState.set(key, data);
    }

    getFromCache(key): any {
        return this.transferState.get(key);
    }
}
