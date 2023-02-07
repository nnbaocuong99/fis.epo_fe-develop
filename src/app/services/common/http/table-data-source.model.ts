import { HttpResponse } from "@angular/common/http";

export class TableDataSource {
    items: any[];
    paginatorTotal: number;

    constructor() {
        this.items = [];
        this.paginatorTotal = 0;
    }

    public mapHttpResponse(httpResponse: HttpResponse<any>) {
        this.items = httpResponse.body;
        try {
            if (httpResponse.headers.get('x-pagination')) {
                this.paginatorTotal = JSON.parse(httpResponse.headers.get('x-pagination')).totalCount;
            }
        } catch (err) {
            console.log(err);
        }
    }
}