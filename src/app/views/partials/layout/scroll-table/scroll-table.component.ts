// Angular
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
// Layout
import { ScrollTopOptions } from '../../../../core/_base/layout';

@Component({
	selector: 'kt-scroll-table',
	templateUrl: './scroll-table.component.html',
	styleUrls: ['./scroll-table.component.scss']
})
export class ScrollTableComponent implements AfterViewInit {
	@Input() element: HTMLElement;

	constructor(public cd: ChangeDetectorRef) { }

	ngAfterViewInit() {
	}

	public getFullWidth() {
		if (this.element) {
			return this.element.scrollWidth + 'px';
		} else {
			return 0 + 'px';
		}
	}

	public getClientWidth() {
		if (this.element) {
			return this.element.clientWidth + 'px';
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
			return rect.bottom > rectScroll.bottom && rect.top < rectScroll.top;
		} else {
			return false;
		}
	}
}
