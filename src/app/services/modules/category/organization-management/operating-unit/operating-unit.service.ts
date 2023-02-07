import { Injectable } from '@angular/core';
import { HttpService } from '../../../../common';

@Injectable({
    providedIn: 'root'
})

export class OperatingUnitService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'operating-unit';
    }
}
