import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { DialogRef } from '../../content/crud/dialog/dialog-ref.model';
import * as config from './map-term-account.config';
import * as mainConfig from '../../../../core/_config/main.config';
import { PurchaseOrderItemService } from '../../../../services/modules/purchase-order-item/purchase-order-item.service';
import { ConfigListService } from '../../../../services/modules/config-list/config-list.service';
import { ConfigListRequestPayload } from '../../../../services/modules/config-list/config-list.request.payload';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { merge } from 'lodash';
import { tap } from 'rxjs/internal/operators/tap';
import { MatPaginator } from '@angular/material';
import { DeleteConfirmation } from '../../../../services/common/confirmation/delete-confirmation';
import { BaseFormComponent } from '../../../../core/_base/component/base-form.component';
import { SaveConfirmation } from '../../../../services/common/confirmation/save-confirmation';

@Component({
  selector: 'app-map-term-account',
  templateUrl: './map-term-account.component.html',
  styleUrls: ['./map-term-account.component.scss']
})
export class MapTermAccountComponent extends BaseFormComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Input() ouId: any;

  public dialogRef: DialogRef = new DialogRef();
  public dialogRefAdd: DialogRef = new DialogRef();

  public headers = config.HEADER;
  public company = config.COMPANY;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public request = new ConfigListRequestPayload();
  public dataSource = {
    items: null,
    paginatorTotal: undefined
  };
  public termAccountSelected: any = {};

  constructor(
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
    public configListService: ConfigListService,
    public purchaseOrderItemService: PurchaseOrderItemService
  ) {
    super();
  }

  ngOnInit() {
    this.request.type = 'TERM_ACCOUNT';
    this.dialogRefAdd.input = {};
    this.pagingData();
  }

  public initData(): void {
    if (this.paginator) {
      this.request.pageIndex = this.paginator.pageIndex;
      this.request.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
    }
    const requests = [
      this.configListService.select(this.request),
      this.configListService.count(this.request)
    ];
    const sub = forkJoin(requests).subscribe(
      (response: any[]) => {
        this.dataSource.items = response[0];
        this.dataSource.paginatorTotal = response[1];
        this.cdr.detectChanges();
      });
    this.subscriptions.push(sub);
  }

  public pagingData(): void {
    if (this.paginator) {
      const paginatorSubscriptions = merge(this.paginator.page).pipe(
        tap(() => {
          this.initData();
        })
      ).subscribe();
      this.subscriptions.push(paginatorSubscriptions);
    }
  }

  public onBtnShowDialogListClick(): void {
    this.initData();
    this.dialogRef.show();
    this.cdr.detectChanges();
  }

  public onBtnEditClick(rowData: any): void {
    const temp = JSON.parse(JSON.stringify(rowData));
    this.dialogRefAdd.input = temp;
    this.dialogRefAdd.show();
    this.form.form.markAsPristine();
    this.cdr.detectChanges();
  }

  public onBtnDeleteClick(id: string): void {
    const confirmation = new DeleteConfirmation();
    confirmation.accept = () => {
      this.configListService.delete(id).subscribe(() => {
        this.initData();
        this.notificationService.showDeteleSuccess();
      });
    };
    this.notificationService.confirm(confirmation);
  }

  public onBtnSaveClick(): void {
    const temp = this.company.find(m => m.ouId === this.ouId);
    if (this.ouId && temp.value === this.termAccountSelected.attr1) {
      this.change.emit(this.termAccountSelected.code);
      this.dialogRef.hide();
    } else {
      this.notificationService.showMessage(`Vui lòng chọn đúng tài khoản định khoản thuộc ${temp.label}`);
    }
  }

  public close() {
    this.dialogRef.hide();
  }

  public onBtnShowDialogListClickFromRow(): void {
    this.dialogRefAdd.input = {};
    this.dialogRefAdd.show();
    this.form.form.markAsPristine();
    this.cdr.detectChanges();
  }

  public onBtnSaveClickFromRow(): void {
    if (this.form) {
      if (!this.validateForm(this.form, 'id-term-account')) {
        this.notificationService.showMessage('VALIDATION.FORM_VALID');
        return;
      }
      if (this.form.dirty) {
        const saveConfirmation = new SaveConfirmation();
        saveConfirmation.accept = () => {
          this.dialogRefAdd.input.attr1 = this.dialogRefAdd.input.code.split('.')[0];
          this.dialogRefAdd.input.type = 'TERM_ACCOUNT';
          this.configListService.merge(this.dialogRefAdd.input).subscribe(() => {
            this.initData();
            this.dialogRefAdd.hide();
            this.notificationService.showSuccess();
          });
        };
        this.notificationService.confirm(saveConfirmation);
      } else {
        this.dialogRefAdd.hide();
      }
    } else {
      this.dialogRefAdd.hide();
    }
  }

  public closeFormRow() {
    this.dialogRefAdd.hide();
  }
}
