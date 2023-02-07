import { Injectable } from '@angular/core';
import { HttpService } from '../../../common';

@Injectable({
    providedIn: 'root'
})

export class BrandMembershipRequirementService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'brand-membership-requirement';
    }

}
