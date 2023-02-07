import { Injectable } from '@angular/core';
import { HttpService } from '../../common';


@Injectable({
    providedIn: 'root'
})

export class MailScheduleService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'mail-schedule';
    }


}
