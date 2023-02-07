import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceLocator } from './service-locator.service';

@Injectable()
export class Configuration {
    private _httpClient = ServiceLocator.injector.get(HttpClient);
    public configuration: any;

    constructor() {
        this.getConfiguration();
    }

    public getConfiguration(): void {
        this.getJsonData().subscribe(data => {
            localStorage.setItem('configuration', JSON.stringify(data));
            this.configuration = JSON.parse(localStorage.configuration);
        });
    }

    private getJsonData(): Observable<any> {
        const origin = 'http://localhost:4200';
        return this._httpClient.get(origin + '/assets/appsetting.json');
    }
}
