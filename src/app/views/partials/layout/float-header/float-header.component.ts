// Angular
import { AfterViewInit, Component, ElementRef, Input, OnInit } from '@angular/core';
// Layout
import { ScrollTopOptions } from '../../../../core/_base/layout';

@Component({
	selector: 'kt-float-header',
	templateUrl: './float-header.component.html',
	styleUrls: ['./float-header.component.scss']
})
export class FloatHeaderComponent implements AfterViewInit {
	@Input() element: HTMLElement;

	ngAfterViewInit() {
		if (this.element) {
			const a = 1;
		}
	}

	public getFullWidth() {
		if (document.getElementsByClassName('p-datatable-scrollable-body')[1]) {
			return document.getElementsByClassName('p-datatable-scrollable-body')[1].scrollWidth + 'px';
		} else {
			return 0 + 'px';
		}
	}

	public getClientWidth() {
		if (document.getElementsByClassName('p-datatable-scrollable-body')[1]) {
			return document.getElementsByClassName('p-datatable-scrollable-body')[1].clientWidth + 'px';
		} else {
			return 0 + 'px';
		}
	}

	public getPosition(): any {
		if (this.element) {
			var rect = this.element.getBoundingClientRect();
			return rect;
		} else {
			return {
				left: 0
			};
		}
	}

	public onScroll(event: any): void {
		if (this.element) {
			this.element.scrollLeft = event.target.scrollLeft;
		}
	}

	public showScrollTable(): boolean {
		const self = document.getElementsByClassName('scroll-table')[0];
		if (this.element && self) {
			const rect = this.element.getBoundingClientRect();
			const rectScroll = self.getBoundingClientRect();
			const scrollTrack = document.getElementsByClassName('scroll-table-track')[0];
			if (scrollTrack) {
				scrollTrack.scrollLeft = this.element.scrollLeft;
			}
			return rect.bottom > rectScroll.bottom;;
		} else {
			return false;
		}
	}
}
