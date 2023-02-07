import { Injectable } from '@angular/core';
import { HttpService } from '../../common';
import { ChangeHistoryDto } from './change-history.model';

@Injectable({
    providedIn: 'root',
})
export class ChangeHistoryService extends HttpService<ChangeHistoryDto> {
    constructor() {
        super();
        this.url = this.origin + 'change-history';
    }
}
