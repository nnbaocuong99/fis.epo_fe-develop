import { Component, Input, OnInit } from '@angular/core';
import { ToolbarModel } from './toolbar.model';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
    @Input() model: ToolbarModel;
    @Input() widthFromSearch: string;

    public isDropdown: boolean;

    constructor() { }

    ngOnInit() {
        if (!this.model) {
            this.model = new ToolbarModel();
        }
    }
}
