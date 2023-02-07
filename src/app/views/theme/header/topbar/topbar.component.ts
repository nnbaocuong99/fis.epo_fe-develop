// Angular
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'kt-topbar',
	templateUrl: './topbar.component.html',
	styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {

	public isShowNotifiCation = false;

	ngOnInit(): void {
		if (document.domain === 'localhost') {
			this.isShowNotifiCation = true;
		}
	}

}
