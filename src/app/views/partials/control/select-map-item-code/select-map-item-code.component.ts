import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { DialogRef } from '../../content/crud/dialog/dialog-ref.model';
import * as config from './select-map-item-code.config';
import * as mainConfig from '../../../../core/_config/main.config';
import { ItemService } from '../../../../services/modules/category/item/item.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { BaseFormComponent } from '../../../../core/_base/component/base-form.component';
import { ItemRequestPayload } from '../../../../services/modules/category/item/item.request.payload';
import { BaseListComponent } from '../../../../core/_base/component/base-list.component';
import { tap } from 'rxjs/internal/operators/tap';
import { merge } from 'rxjs/internal/observable/merge';
import { CustomMatPaginatorIntlForItemCategory } from '../../common/custom-mat-paginator-for-item-category';

export const SELECT_SYNC_SOURCE_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectMapItemCodeComponent),
  multi: true
};

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'select-map-item-code',
  templateUrl: './select-map-item-code.component.html',
  styleUrls: ['./select-map-item-code.component.scss'],
  providers: [
    SELECT_SYNC_SOURCE_CONTROL_VALUE_ACCESSOR,
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginatorIntlForItemCategory
    }
  ]
})
export class SelectMapItemCodeComponent extends BaseListComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  @ViewChild('paginator1', { static: true }) paginator1: MatPaginator;
  @ViewChild('paginator2', { static: true }) paginator2: MatPaginator;
  @Input() dataSearchMap: any;

  public headers = [];
  public mainConfig: any;
  public request1 = new ItemRequestPayload();
  public request2 = new ItemRequestPayload();
  public formTitle: string;
  public dataSource1 = {
    items: null,
    paginatorTotal: undefined
  };
  public dataSource2 = {
    items: null,
    paginatorTotal: undefined
  };

  public dialogRef: DialogRef = new DialogRef();
  @Input() placeholder: string;
  @Output() change: EventEmitter<any> = new EventEmitter();

  public selectedItem: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
    public itemService: ItemService) {
    super();
  }

  private privateValue: any = '';
  get value(): any { return this.privateValue; }
  set value(v: any) {
    if (v !== this.privateValue) {
      this.privateValue = v;
      this.onChange(v);
    }
  }

  writeValue(value: any) {
    if (value) {
      this.privateValue = value;
      this.onChange(value);
    }
  }

  onChange = (_: any) => { };
  onTouched = () => { };
  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  ngOnInit() {
    this.headers = config.HEADER;
    this.mainConfig = mainConfig.MAIN_CONFIG;
    this.request1.mapName = this.dataSearchMap.itemName ? this.dataSearchMap.itemName : null;
    this.request1.mapPartNumber = this.dataSearchMap.partNo ? this.dataSearchMap.partNo : null;

    this.formTitle = 'ITEM.HEADER_LIST';
    this.initData1();
    this.initData2();
    this.pagingData1();
    this.pagingData2();
  }

  public initData1(): void {
    if (this.paginator1) {
      this.request1.pageIndex = this.paginator1.pageIndex;
      this.request1.pageSize = this.paginator1.pageSize ? this.paginator1.pageSize : 10;
    }
    const requests = [
      this.itemService.select(this.request1),
      // this.itemService.count(this.request1)
    ];
    const sub = forkJoin(requests).subscribe(
      (response: any[]) => {
        this.dataSource1.items = response[0];
        if (this.dataSource1.items.length < this.request1.pageSize) {
          this.dataSource1.paginatorTotal = this.dataSource1.items.length;
        } else {
          this.dataSource1.paginatorTotal = (this.request1.pageIndex + 2) * this.request1.pageSize;
        }

        if (this.dataSearchMap.itemCode) { // có item code rồi thì lấy object theo itemCode
          const requestTemp = new ItemRequestPayload();
          requestTemp.code = this.dataSearchMap.itemCode;
          this.itemService.select(requestTemp).subscribe(m => {
            if (m.length > 0 && m.length === 1) {
              this.selectedItem = m[0];
              this.value = this.selectedItem;
            }
          });
        } else {
          if (response[0].length > 0) {
            if (!this.dataSearchMap.itemCode || (typeof this.dataSearchMap.itemCode === 'object')) { // chưa có itemCode thì map item đầu tiên tìm kiếm được
              if (response[0].length == 1) {
                this.selectedItem = response[0][0];
                this.value = this.selectedItem;
              } else {
                if (typeof this.dataSearchMap.itemCode === 'object') {
                  this.value = null;
                }
              }
            }
          }
        }
        this.cdr.detectChanges();
      });
    this.subscriptions.push(sub);
  }

  public pagingData1(): void {
    if (this.paginator1) {
      const paginatorSubscriptions = merge(this.paginator1.page).pipe(
        tap(() => {
          this.initData1();
        })
      ).subscribe();
      this.subscriptions.push(paginatorSubscriptions);
    }
  }

  public initData2(): void {
    if (this.paginator2) {
      this.request2.pageIndex = this.paginator2.pageIndex;
      this.request2.pageSize = this.paginator2.pageSize ? this.paginator2.pageSize : 10;
    }
    const requests = [
      this.itemService.select(this.request2),
      // this.itemService.count(this.request2)
    ];
    const sub = forkJoin(requests).subscribe(
      (response: any[]) => {
        this.dataSource2.items = response[0];
        if (this.dataSource2.items.length < this.request2.pageSize) {
          this.dataSource2.paginatorTotal = this.dataSource2.items.length;
        } else {
          this.dataSource2.paginatorTotal = (this.request2.pageIndex + 2) * this.request2.pageSize;
        }
        this.cdr.detectChanges();
      });
    this.subscriptions.push(sub);
  }

  public pagingData2(): void {
    if (this.paginator2) {
      const paginatorSubscriptions = merge(this.paginator2.page).pipe(
        tap(() => {
          this.initData2();
        })
      ).subscribe();
      this.subscriptions.push(paginatorSubscriptions);
    }
  }

  public onBtnShowDialogListClick(): void {
    this.ngOnInit();
    this.cdr.detectChanges();
    this.dialogRef.show();
  }

  public close() {
    this.dialogRef.hide();
  }

  public onBtnSaveClick(): void {
    if (this.selectedItem && this.selectedItem.code) {
      this.value = this.selectedItem;
      this.change.emit(this.selectedItem);
    }
    this.dialogRef.hide();
  }

  public onBtnCancelClick(): void {
    this.dialogRef.hide();
  }

  public searchData1(): void {
    this.request1.pageIndex = 0;
    this.initData1();
  }

  public searchData2(): void {
    this.request2.pageIndex = 0;
    this.initData2();
  }

  public focusOut(): void {
    if (!this.value) {
      this.value = {};
      this.privateValue = {};
    }
  }

}
