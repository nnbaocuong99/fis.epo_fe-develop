import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { BaseFormComponent } from '../../../../../core/_base/component/base-form.component';
import { DeleteConfirmation } from '../../../../../services/common/confirmation/delete-confirmation';
import { SaveConfirmation } from '../../../../../services/common/confirmation/save-confirmation';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { ConfigListRequestPayload } from '../../../../../services/modules/config-list/config-list.request.payload';
import { ConfigListService } from '../../../../../services/modules/config-list/config-list.service';
import { DialogRef } from '../../../content/crud/dialog/dialog-ref.model';
import * as config from './config-list-dialog.config';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'config-list',
    templateUrl: './config-list-dialog.component.html',
    styleUrls: ['./config-list-dialog.component.scss']
})

export class ConfigListDialogComponent extends BaseFormComponent implements OnInit {
    public key: string;
    public request = new ConfigListRequestPayload();
    public dataSource = {
        items: null,
        paginatorTotal: undefined
    };
    public headers = config.HEADERS;
    public totalColumn: number;

    constructor(
        public configListService: ConfigListService,
        private notification: NotificationService,
        private cdr: ChangeDetectorRef) {
        super();
        this.key = Guid.create().toString();
    }

    @ViewChild('dlg', { static: true }) dialog: Dialog;
    @ViewChild('dlgConfirm', { static: true }) dlgConfirm: ConfirmDialog;
    @ViewChild('firstColumn', { static: false }) firstColumn: any;
    @ViewChild('secondColumn', { static: false }) secondColumn: any;
    @Input() dialogRef: DialogRef = new DialogRef();
    @Input() form: NgForm;
    @Input() type: string;
    @Input() header: string;
    @Input() bindLabel: string;
    @Input() bindValue: string;
    @Input() attr1Name: string;
    @Input() attr2Name: string;
    @Input() attr3Name: string;
    @Input() attr4Name: string;
    @Input() orderBy: string;

    @Output() show: EventEmitter<any> = new EventEmitter();
    @Output() hide: EventEmitter<any> = new EventEmitter();
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onSave: EventEmitter<any> = new EventEmitter();

    ngOnInit() {
        this.bindLabel = this.bindLabel ? this.bindLabel : 'name';
        this.bindValue = this.bindValue ? this.bindValue : 'code';
        this.totalColumn = 5;
        this.totalColumn = this.attr1Name ? this.totalColumn + 1 : this.totalColumn;
        this.totalColumn = this.attr2Name ? this.totalColumn + 1 : this.totalColumn;
        this.totalColumn = this.attr3Name ? this.totalColumn + 1 : this.totalColumn;
        this.totalColumn = this.attr4Name ? this.totalColumn + 1 : this.totalColumn;
        this.request.type = this.type;
        this.initData();
    }

    public initData(): void {
        const selectSub = this.configListService.select(this.request).subscribe(res => {
            this.dataSource.items = res;
            this.onSave.emit(res);
            if (this.orderBy) {
                this.dataSource.items.sort((a, b) => {
                    const str1 = a[this.orderBy] ? a[this.orderBy] : '';
                    const str2 = b[this.orderBy] ? b[this.orderBy] : '';
                    if (str1 < str2) { return -1; }
                    if (str1 > str2) { return 1; }
                    return 0;
                });
            }
            if (this.dataSource.items.length === 0) {
                this.dataSource.items.push({
                    isLabelValid: true,
                    isValueValid: true
                });
                setTimeout(() => { // this will make the execution after the above boolean has changed
                    this.firstColumn.nativeElement.focus();
                }, 0);
            }
            this.cdr.detectChanges();
        });
        this.subscriptions.push(selectSub);
    }

    public addNewLine(): void {
        if (this.dataSource.items && this.dataSource.items.length > 0) {
            const item = this.dataSource.items.find(x => !x.id);
            if (item) {
                this.onBtnSaveRowClick(item);
            } else if (this.dataSource.items[this.dataSource.items.length - 1].code) {
                this.dataSource.items.push({
                    isLabelValid: true,
                    isValueValid: true
                });
                setTimeout(() => { // this will make the execution after the above boolean has changed
                    this.firstColumn.nativeElement.focus();
                }, 0);
            }
        }
    }

    private validateNewRow(rowData: any): boolean {
        let result = true;
        if (!rowData[this.bindValue] || !rowData[this.bindLabel]) {
            this.notification.showMessage('Field is required');
            result = false;
        }
        return result;
    }

    public onBtnSaveRowClick(rowData: any): void {
        if (this.validateNewRow(rowData)) {
            if (!rowData[this.bindValue] || !rowData[this.bindLabel]) {
                if (!rowData[this.bindLabel]) {
                    rowData.isLabelValid = false;
                    setTimeout(() => { // this will make the execution after the above boolean has changed
                        this.secondColumn.nativeElement.focus();
                    }, 0);
                }
                if (!rowData[this.bindValue]) {
                    rowData.isValueValid = false;
                    setTimeout(() => { // this will make the execution after the above boolean has changed
                        this.firstColumn.nativeElement.focus();
                    }, 0);
                }
                return;
            } else {
                if (this.dataSource.items.length > 0) {
                    const items = this.dataSource.items.filter(x => x[this.bindValue] === rowData[this.bindValue]);
                    if (items.length > 1) {
                        this.notification.showMessage('Field unique!');
                        setTimeout(() => { // this will make the execution after the above boolean has changed
                            this.firstColumn.nativeElement.focus();
                        }, 0);
                    }
                }
            }
            const confirmation = new SaveConfirmation();
            confirmation.accept = () => {
                rowData.type = this.type;
                if (this.dataSource.items && this.dataSource.items.length > 0) {
                    rowData.indexNo = this.dataSource.items.length + 1;
                } else {
                    rowData.indexNo = 1;
                }
                const saveSub = this.configListService.merge(rowData).subscribe(res => {
                    if (res.id) {
                        this.initData();
                        this.notification.showSuccess();
                    }
                });
                this.subscriptions.push(saveSub);
            };
            this.notification.confirm(confirmation);
        }
    }

    public onBtnDeleteRowClick(id: string): void {
        const confirmation = new DeleteConfirmation();
        confirmation.accept = () => {
            const deleteSub = this.configListService.delete(id).subscribe(res => {
                if (res) {
                    this.initData();
                    this.notification.showSuccess();
                }
            });
            this.subscriptions.push(deleteSub);
        };
        this.notification.confirm(confirmation);
    }

    public onBtnEditRowClick(rowData: any) {
        rowData.hasEdit = true;
        rowData.isValueValid = true;
        rowData.isLabelValid = true;
        setTimeout(() => { // this will make the execution after the above boolean has changed
            this.firstColumn.nativeElement.focus();
        }, 0);
    }

    public onFocusOutValue(rowData: any): void {
        rowData.isValueValid = !!rowData[this.bindValue];
        if (this.dataSource.items.length > 0) {
            const items = this.dataSource.items.filter(x => x[this.bindValue] === rowData[this.bindValue]);
            if (items.length > 1) {
                this.notification.showMessage('Field unique!');
                setTimeout(() => { // this will make the execution after the above boolean has changed
                    this.firstColumn.nativeElement.focus();
                }, 0);
            }
        }
    }

    public onFocusOutLabel(rowData: any): void {
        rowData.isLabelValid = !!rowData[this.bindLabel];
    }

    public onBtnCancelRowClick(rowData: any) {
        if (rowData.id) {
            rowData.hasEdit = false;
        } else {
            this.dataSource.items.splice(this.dataSource.items.length - 1, 1);
        }
    }
}
