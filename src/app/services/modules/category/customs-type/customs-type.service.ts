import { Injectable } from '@angular/core';
import { HttpService } from '../../../common';

@Injectable({
    providedIn: 'root'
})

export class CustomsTypeService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'customs-type';
    }
}
