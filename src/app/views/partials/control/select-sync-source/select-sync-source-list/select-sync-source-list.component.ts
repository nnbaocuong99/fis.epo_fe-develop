import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DialogRef } from '../../../content/crud/dialog/dialog-ref.model';
import * as mainConfig from '../../../../../core/_config/main.config';
import { ExchangeRateTypeService } from '../../../../../services/modules/category/exchange-rate-type/exchange-rate-type.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material';
import { BaseComponent } from '../../../../../core/_base/component/base-component';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { merge } from 'lodash';
import { tap } from 'rxjs/internal/operators/tap';
import { CustomMatPaginatorIntlForItemCategory } from '../../../common/custom-mat-paginator-for-item-category';

@Component({
  selector: 'app-select-sync-source-list',
  templateUrl: './select-sync-source-list.component.html',
  styleUrls: ['./select-sync-source-list.component.scss'],
  providers: [{
    provide: MatPaginatorIntl,
    useClass: CustomMatPaginatorIntlForItemCategory
  }]
})
export class SelectSyncSourceListComponent extends BaseComponent implements OnInit {
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;

  @Output() select: EventEmitter<any> = new EventEmitter();
  @Input() dialogRef: DialogRef = new DialogRef();
  @Input() requestPayload: any = {};
  @Input() actionGet: string;
  @Input() actionCount: string;

  public headers = [];
  public mainConfig = mainConfig.MAIN_CONFIG;
  public baseService: any;
  public dataSource = {
    items: null,
    paginatorTotal: undefined
  };
  @Input() categoryType: string;

  public selectedRow: any = {};
  private actionGetName: string;
  private actionCountName: string;

  constructor(
    public exchangeRateTypeService: ExchangeRateTypeService,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.baseService = this.dialogRef.input.service;
    this.actionGetName = !this.actionGet ? 'select' : this.actionGet;
    this.actionCountName = !this.actionCount ? 'count' : this.actionCount;
    this.requestPayload.type = null;
    this.requestPayload.date = null;

    if (this.categoryType === 'item') {
      this.initDataItem();
      this.pagingDataItem();
    } else {
      this.initData();
      this.pagingData();
    }
  }

  public initData(): void {
    if (this.paginator) {
      this.requestPayload.pageIndex = this.paginator.pageIndex;
      this.requestPayload.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
    }
    const requests = [
      this.baseService[this.actionGetName](this.requestPayload),
      this.baseService[this.actionCountName](this.requestPayload)
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

  public initDataItem(): void {
    if (this.paginator) {
      this.requestPayload.pageIndex = this.paginator.pageIndex;
      this.requestPayload.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
    }
    const requests = [
      this.baseService.select(this.requestPayload),
      // this.baseService.count(this.request)
    ];
    const sub = forkJoin(requests).subscribe(
      (response: any[]) => {
        this.dataSource.items = response[0];
        if (this.dataSource.items.length < this.requestPayload.pageSize) {
          this.dataSource.paginatorTotal = this.dataSource.items.length;
        } else {
          this.dataSource.paginatorTotal = (this.requestPayload.pageIndex + 2) * this.requestPayload.pageSize;
        }
        this.cdr.detectChanges();
      });
    this.subscriptions.push(sub);
  }

  public pagingDataItem(): void {
    if (this.paginator) {
      const paginatorSubscriptions = merge(this.paginator.page).pipe(
        tap(() => {
          this.initDataItem();
        })
      ).subscribe();
      this.subscriptions.push(paginatorSubscriptions);
    }
  }

  public onSelectRow(): void {
    this.select.emit(this.selectedRow);
    this.dialogRef.hide();
  }

  public isString(data) {
    if (typeof data === 'string') {
      return true;
    } else {
      return false;
    }
  }
}
