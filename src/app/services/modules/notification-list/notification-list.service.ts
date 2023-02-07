import { Injectable } from '@angular/core';
import { HttpService } from '../../common';


@Injectable({
    providedIn: 'root'
})

export class NotificationListService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'notification-list';
    }


}
