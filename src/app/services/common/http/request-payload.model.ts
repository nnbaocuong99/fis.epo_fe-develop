import { HttpParams } from '@angular/common/http';

export class RequestPayload {
    pageIndex: number;
    pageSize: number;
    generalFilterControl: string;
    constructor(isPaging?: boolean, pageSize?: number) {
        if (isPaging) {
            this.pageIndex = 0;
            this.pageSize = 10;
            if (pageSize) {
                this.pageSize = pageSize;
            }
        }
    }

    toParams(): HttpParams {
        let params = new HttpParams();
        for (const l1PropertyName in this) {
            if (this.hasOwnProperty(l1PropertyName) && this[l1PropertyName.toString()] != null) {
                const l1Property = this[l1PropertyName.toString()];
                if (typeof l1Property === 'object') {
                    if (Array.isArray(l1Property)) {
                        for (const item of l1Property) {
                            params = params.append(l1PropertyName, item);
                        }
                    } else {
                        for (const l2PropertyName in l1Property) {
                            if (l1Property.hasOwnProperty(l2PropertyName) && l1Property[l2PropertyName.toString()] != null) {
                                const level2Property = l1Property[l2PropertyName.toString()];
                                params = params.set(l1PropertyName + '.' + l2PropertyName, level2Property);
                            }
                        }
                    }
                } else {
                    if (l1Property !== '' && l1Property !== null && l1Property !== undefined) {
                        params = params.set(l1PropertyName, l1Property);
                    }
                }
            }
        }
        return params;
    }
}
