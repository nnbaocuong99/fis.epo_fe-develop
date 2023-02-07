import {
    Component, Input, OnInit, forwardRef, NgModule,
    NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, Output, EventEmitter, ChangeDetectorRef, ViewChild
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { concatMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { HttpService } from '../../../../services/common/http/http.service';
import { RequestPayload } from '../../../../services/common/http/request-payload.model';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgSelectAsyncComponent),
    multi: true
};

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'ng-select-async',
    templateUrl: './ng-select-async.component.html',
    styleUrls: ['./ng-select-async.component.css'],
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})

export class NgSelectAsyncComponent implements OnInit, ControlValueAccessor {
    @ViewChild('select', { static: true }) select: NgSelectComponent;

    @Input() service: HttpService;
    @Input() placeholder: string;
    @Input() multiple: boolean;
    @Input() bindLabel: string;
    @Input() bindValue: string;
    @Input() disabled: boolean;
    @Input() dropdownPosition: string;
    @Input() selectedItems: string;
    @Input() closeOnSelect: boolean;
    @Input() searchFn: any;
    @Input() clearable: boolean;
    @Input() actionGet: string;
    @Input() actionCount: string;
    @Input() searchControl: boolean;
    @Input() keyDownFn: (_: KeyboardEvent) => boolean;
    @Input() categoryType: string;
    @Input() searchField: string;
    @Input() appendTo: string;

    /* Custom input */
    @Input() suffixLabel: string;
    @Input() suffixValue: string;
    // @Input() initValue: Entity;
    @Input() requestPayload: RequestPayload;
    @Input() disabledCondition: any;
    @Input() msgEmpty: string;
    @Input() canAdd: boolean;
    @Input() selectAll: boolean;
    @Input() export: boolean;

    @Output() change: EventEmitter<any> = new EventEmitter();
    @Output() focus: EventEmitter<any> = new EventEmitter();
    @Output() blur: EventEmitter<any> = new EventEmitter();
    @Output() addNew: EventEmitter<any> = new EventEmitter();

    public count: number;
    public listBuffer = [];

    private userBufferSize = 20;
    private numberOfItemsFetchingMore = 10;
    public isLoading = false;

    public subCountAndLoad: Subscription;

    public requestFilter: RequestPayload = new RequestPayload();

    private actionGetName: string;
    private actionCountName: string;

    public value: any = null;

    writeValue(value: any) {
        this.value = value;
        this.cd.detectChanges();
    }

    onChangeNgSelect(rowData): void {
        this.value = rowData;
        this.onChange(rowData);
        this.change.emit(rowData);
    }

    onChange = (_: any) => { };
    onTouched = () => { };
    registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }

    constructor(
        public toastr: ToastrService,
        public translateService: TranslateService,
        public cd: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.actionGetName = !this.actionGet ? 'select' : this.actionGet;
        this.actionCountName = !this.actionCount ? 'count' : this.actionCount;

        this.searchFn = !this.searchFn ? () => true : this.searchFn;

        // if (this.initValue === undefined || this.initValue === null) { return; }
        // this.listBuffer.push(this.initValue);

        if (!!this.requestPayload) {
            this.userBufferSize = this.requestPayload.pageSize ? this.requestPayload.pageSize : 20;
        }

        if (!this.keyDownFn) {
            this.keyDownFn = () => true;
        }
    }

    public onOpen(): void {
        this.requestFilter = !this.requestPayload ? new RequestPayload() : Object.assign(new RequestPayload(), this.requestPayload);
        this.requestFilter.pageIndex = 0;
        this.requestFilter.pageSize = this.userBufferSize;
        this.loadAndCountUser(this.requestFilter, true);
    }

    public onClose(): void {
        this.listBuffer = [];
    }

    public onScrollToEnd(): void {
        if (this.count === this.listBuffer.length) {
            return;
        }
        this.fetchMore();
    }

    public onScroll({ end }): void {
        if (this.isLoading || this.count === this.listBuffer.length) {
            return;
        }

        if (end + this.numberOfItemsFetchingMore >= this.listBuffer.length) {
            this.fetchMore();
        }
    }

    /**
     * Fetch more data to combobox source
     */
    private fetchMore(): void {
        const len = this.listBuffer.length;
        this.isLoading = true;
        this.requestFilter.pageIndex = (len / this.requestFilter.pageSize - 1);
        this.requestFilter.pageSize = this.count - len < this.userBufferSize ? this.count - len : this.userBufferSize;
        this.service[this.actionGetName](this.requestFilter, false).subscribe(response => {
            const more = response;
            this.disableOption(more);
            this.isLoading = false;
            this.listBuffer = this.listBuffer.concat(more);
        }, (error: any) => {
            this.toastr.error(error.error);
        });
    }

    /**
     * Handle event when input search
     * @param event: event when input search
     */
    public onSearch(event: any): void {
        if (event.term === '') {
            this.requestFilter = !this.requestPayload ? new RequestPayload() : Object.assign(new RequestPayload(), this.requestPayload);
            this.requestFilter.pageIndex = 0;
            this.requestFilter.pageSize = this.userBufferSize;
            this.loadAndCountUser(this.requestFilter);
        } else {
            if (this.searchField) {
                this.requestFilter[this.searchField] = event.term;
            } else {
                this.requestFilter[this.bindLabel] = event.term;
            }
            this.requestFilter.pageIndex = 0;
            this.requestFilter.pageSize = this.userBufferSize;
            this.loadAndCountUser(this.requestFilter);
        }
    }

    /**
     * Load data and count data
     */
    private loadAndCountUser(searchEntity: RequestPayload, onOpen?: boolean): void {
        // Show spinner
        this.isLoading = true;

        // Cancelled service and next to necessary service
        if (!!this.subCountAndLoad) {
            this.subCountAndLoad.unsubscribe();
        }

        // Call service to get data
        let observable = null;
        if (this.categoryType !== 'item') {
            observable = this.service[this.actionCountName](this.requestFilter, false).pipe(concatMap(count => {
                this.count = count as number;
                return this.service[this.actionGetName](searchEntity, false);
            }));
        } else {
            observable = this.service[this.actionGetName](searchEntity, false);
        }

        this.subCountAndLoad = observable.subscribe(
            (response: any[]) => {
                if (response.length === 0 && !!this.msgEmpty && onOpen) {
                    this.toastr.warning(this.msgEmpty);
                }
                this.disableOption(response);
                this.listBuffer = response;
                this.isLoading = false;
                this.cd.detectChanges();
            },
            error => {
                if (typeof (error.error) === 'string') {
                    this.toastr.error(error.error);
                } else {
                    this.toastr.error(
                        error.error[this.bindLabel]
                            ? error.error[this.bindLabel].reduce((a: string, b: string) => a + '. ' + b)
                            : 'An error occurred'
                    );
                }
            }
        );
    }

    private disableOption(list: any[]) {
        const listDisabed = this.filterItems(list, this.disabledCondition);
        list.filter(x => listDisabed.some(y => y === x)).forEach(item => {
            item.disabled = true;
        });
    }

    private filterItems(data: any[], filters: any): any[] {
        let result = [];
        if (filters && data && data.length > 0) {
            const propertiesSearch = Object.keys(filters);
            for (const property of propertiesSearch) {
                result = data.filter(x => x[property] === filters[property]);
            }
        }
        return result;
    }

    /**
     * Handle event when clear input search
     */
    public onClear() {
        const event: any = {};
        event.term = '';
        this.onSearch(event);
    }

    public getLabel(item: any, label: string) {
        const labels = label.split('.');
        labels.forEach(l => {
            item = item[l];
        });

        return item ? this.translateService.instant(item) : item;
    }

    public onBtnSelectAll(): void {
        const searchEntity = Object.assign(new RequestPayload(), JSON.parse(JSON.stringify(this.requestFilter)));
        searchEntity.Skip = 0;
        searchEntity.Take = 0;
        this.service[this.actionGetName](searchEntity, true).subscribe(response => {
            console.log(response);
            this.value = response;
        });
    }

    public copyToClipboard(value: any) {
        if (value == null || value === undefined || value.length === 0) {
            this.toastr.info('No value to copy');
            return;
        }
        let strValue = '';
        if (typeof (value) === 'object') {
            if (Array.isArray(value)) {
                value.forEach(x => {
                    strValue = strValue + `${strValue ? ('\n' + x[this.bindLabel]) : x[this.bindLabel]}`
                        + `${this.suffixValue ? ('\t' + this.translateService.instant(x[this.suffixValue])) : ''}`;
                });
            } else {
                strValue = `${strValue ? ('\n' + value[this.bindLabel]) : value[this.bindLabel]}`
                    + `${this.suffixValue ? ('\t' + this.translateService.instant(value[this.suffixValue])) : ''}`;
            }
        } else {
            strValue = value.toString();
        }

        const el = document.createElement('textarea');
        el.value = strValue;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        this.toastr.info('Copied text to clipboard');
    }
}

@NgModule({
    declarations: [
        NgSelectAsyncComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        NgSelectModule
    ],
    exports: [
        NgSelectAsyncComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA,
        CUSTOM_ELEMENTS_SCHEMA,
    ]
})

export class NgSelectAsyncModule { }
