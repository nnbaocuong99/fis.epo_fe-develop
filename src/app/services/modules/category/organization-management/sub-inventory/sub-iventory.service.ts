import { Injectable } from '@angular/core';
import { HttpService } from '../../../../common';

@Injectable({
	providedIn: 'root',
})
export class SubIventoryService extends HttpService {
	constructor() {
		super();
		this.url = this.origin + 'sub-inventory';
	}
}
