import { MatPaginatorIntl } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomMatPaginatorIntlForItemCategory extends MatPaginatorIntl {
    constructor() {
        super();
        this.getAndInitTranslations();
    }

    getAndInitTranslations() {
        this.itemsPerPageLabel = "Items per page:";
        this.nextPageLabel = "Items per page:";
        this.previousPageLabel = "Items per page:";
        this.changes.next();
    }

    getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
            return `0 / ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        // return `${startIndex + 1} - ${endIndex} / ${length}`;
        return `${startIndex + 1} - ${endIndex}`;
    }
}
