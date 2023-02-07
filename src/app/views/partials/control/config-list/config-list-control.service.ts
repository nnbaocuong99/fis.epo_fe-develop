import { Inject, InjectionToken } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigListRequestPayload } from '../../../../services/modules/config-list/config-list.request.payload';
import { ConfigListService } from '../../../../services/modules/config-list/config-list.service';

export class ConfigListLoader {
    private _sourceType: string[];
    // tslint:disable-next-line:member-ordering
    static loadedSubject = new BehaviorSubject<boolean>(false);
    constructor(public configListService: ConfigListService, public router: Router, @Inject(TOKEN) source: string[]) {
        this._sourceType = source;
        this.initData();
    }

    public initData(): void {
        const request = new ConfigListRequestPayload();
        request.types = this._sourceType;
        this.configListService.selectBaseInfo(request).subscribe(res => {
            this.append(request.types, res);
            ConfigListLoader.loadedSubject.next(true);
        });
    }

    private append(types: string[], list: any[]): void {
        let newList = [];
        const listConfig: any[] = JSON.parse(sessionStorage.listConfig ? sessionStorage.listConfig : '[]');

        if (list && list.length > 0) {
            newList = listConfig.filter(x => !types.some(y => y === x.type));
            newList.push(...list);
        } else {
            newList = listConfig.filter(x => !types.some(y => y === x.type));
        }

        sessionStorage.setItem('listConfig', JSON.stringify(newList));
    }
}

export class ConfigListFactory {
    static instant(module: string): any[] {
        const listConfig: any[] = JSON.parse(sessionStorage.listConfig ? sessionStorage.listConfig : '[]');
        return listConfig.filter(x => x.type === module);
    }

    static instantAsync(module: string): Observable<any[]> {
        return ConfigListLoader.loadedSubject.pipe(map(res => {
            const listConfig: any[] = JSON.parse(sessionStorage.listConfig ? sessionStorage.listConfig : '[]');
            return listConfig.filter(x => x.type === module);
        }));
    }

    static default(module: string, property?: string): any {
        const listConfig: any[] = JSON.parse(sessionStorage.listConfig ? sessionStorage.listConfig : '[]');
        const listFiltered = listConfig.filter(x => x.type === module);
        if (listFiltered.length > 0) {
            return property ? listFiltered[0][property] : listFiltered[0];
        } else {
            return null;
        }
    }
}

export const TOKEN = new InjectionToken<string>('MyToken');
