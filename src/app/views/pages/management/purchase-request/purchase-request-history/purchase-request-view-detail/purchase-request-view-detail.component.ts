import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../../../core/_base/component/base-component';
import {
  PurchaseRequestHistoryService
} from '../../../../../../services/modules/purchase-request-history/purchase-request-history.service';
import {
  PurchaseRequestItemHistoryService
} from '../../../../../../services/modules/purchase-request-item-history/purchase-request-item-history.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import * as mainConfig from '../../../../../../core/_config/main.config';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../../../core/reducers';
import { currentUser } from '../../../../../../core/auth';
import { forkJoin } from 'rxjs';
import * as config from './purchase-request-view-detail.config';
import {
  PurchaseRequestItemRequestPayload
} from '../../../../../../services/modules/purchase-request-item/purchase-request-item.request-payload';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import {
  PurchaseRequestItemHistoryRequestPayload
} from '../../../../../../services/modules/purchase-request-item-history/purchase-request-item-history.request-payload';
import {
  PurchaseRequestClassifyHistoryRequestPayload
} from '../../../../../../services/modules/purchase-request-classify-history/purchase-request-classify-history.request-payload';
import {
  PurchaseRequestClassifyHistoryService
} from '../../../../../../services/modules/purchase-request-classify-history/purchase-request-classify-history.service';
import { MatPaginator } from '@angular/material';
import { tap } from 'rxjs/internal/operators/tap';
import { merge } from 'lodash';
@Component({
  selector: 'app-purchase-request-view-detail',
  templateUrl: './purchase-request-view-detail.component.html',
  styleUrls: ['./purchase-request-view-detail.component.scss']
})
export class PurchaseRequestViewDetailComponent extends BaseComponent implements OnInit {
  public dialogRef: DialogRef = new DialogRef();
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  public prStatus = config.PR_STATUS;
  public prContractInfo = config.PR_CONTRACT_INFO;
  public headeritems = config.HEADER;
  public purchaseRequestHistory: any;
  public purchaseRequestItemHistory: any[];
  public totalBom: any = [];
  public mainConfig = mainConfig.MAIN_CONFIG;

  public allowViewPrice = false; // check có cả AM và PM thì PM không được xem giá
  public isShowDialogClassifyHistory = false;
  public headersPurchaseRequestClassifyHistory = config.HEADER_PURCHASE_REQUEST_CLASSIFY_HISTORY;
  public requestPurchaseRequestClassifyHistory = new PurchaseRequestClassifyHistoryRequestPayload();
  public purchaseRequestClassifyHistory = {
    items: null,
    paginatorTotal: undefined
  };

  constructor(
    private cdr: ChangeDetectorRef,
    public purchaseRequestHistoryService: PurchaseRequestHistoryService,
    public purchaseRequestItemHistoryService: PurchaseRequestItemHistoryService,
    public purchaseRequestClassifyHistoryService: PurchaseRequestClassifyHistoryService,
    private store: Store<AppState>,
    public notificationService: NotificationService,
  ) {
    super();
  }

  ngOnInit() {

  }

  public checkRole() {
    this.store.pipe(select(currentUser)).subscribe(obj => {
      if (obj) {
        const userName = obj.userName ? obj.userName.trim().toLocaleLowerCase() : '';
        const amAccount = this.purchaseRequestHistory.amAccount ? this.purchaseRequestHistory.amAccount.trim().toLocaleLowerCase() : '';
        const pmAccount = this.purchaseRequestHistory.pmAccount ? this.purchaseRequestHistory.pmAccount.trim().toLocaleLowerCase() : '';
        if (`,${pmAccount},`.includes(`,${userName},`)) {
          this.allowViewPrice = false;
        }
        if (`,${amAccount},`.includes(`,${userName},`)) {
          this.allowViewPrice = true;
        }
        if (obj.roles && obj.roles.length > 0) {
          if (obj.roles.some(m => m.includes('BP_') || m.includes('XNK_') || m.includes('AF_') || m === 'SUPER_ADMIN')) {
            this.allowViewPrice = true;
          }
        }
      }
    });
  }

  public onShowDialogClick(id: string): void {
    this.initData(id);
    this.dialogRef.show();
    this.cdr.detectChanges();
  }

  public initData(id: string): void {
    const requestPrHistory = new PurchaseRequestItemHistoryRequestPayload();
    requestPrHistory.prHistoryId = id;
    const categorySub = forkJoin([
      this.purchaseRequestHistoryService.selectById(id),
      this.purchaseRequestItemHistoryService.select(requestPrHistory),
      this.purchaseRequestItemHistoryService.selectTotalBom(requestPrHistory)
    ]).subscribe((res) => {
      this.purchaseRequestHistory = res[0];
      this.purchaseRequestItemHistory = res[1];
      this.totalBom = res[2];
      this.checkRole();
      this.cdr.detectChanges();
    });
    this.subscriptions.push(categorySub);
  }

  public close() {
    this.dialogRef.hide();
  }

  public onBtnViewClassifyHistoryClick(rowData: any): void {
    this.initDataPurchaseRequestClassifyHistory(rowData);
    this.pagingDataPurchaseRequestClassifyHistory(rowData);
    this.isShowDialogClassifyHistory = true;
    this.cdr.detectChanges();
  }

  public initDataPurchaseRequestClassifyHistory(rowData: any): void {
    if (this.paginator) {
      this.requestPurchaseRequestClassifyHistory.pageIndex = this.paginator.pageIndex;
      this.requestPurchaseRequestClassifyHistory.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
    }
    this.requestPurchaseRequestClassifyHistory.prItemId = rowData.prItemId;
    const requests = [
      this.purchaseRequestClassifyHistoryService.select(this.requestPurchaseRequestClassifyHistory),
      this.purchaseRequestClassifyHistoryService.count(this.requestPurchaseRequestClassifyHistory)
    ];
    const sub = forkJoin(requests).subscribe(
      (response: any[]) => {
        this.purchaseRequestClassifyHistory.items = response[0];
        this.purchaseRequestClassifyHistory.paginatorTotal = response[1];
        this.cdr.detectChanges();
      });
    this.subscriptions.push(sub);
  }

  public pagingDataPurchaseRequestClassifyHistory(rowData: any): void {
    if (this.paginator) {
      const paginatorSubscriptions = merge(this.paginator.page).pipe(
        tap(() => {
          this.initDataPurchaseRequestClassifyHistory(rowData);
        })
      ).subscribe();
      this.subscriptions.push(paginatorSubscriptions);
    }
  }

  public onBtnHideClassifyHistoryClick(): void {
    this.isShowDialogClassifyHistory = false;
    this.cdr.detectChanges();
  }

  // public checkLicensedExport(): void {
  //   const request = new PurchaseRequestItemRequestPayload();
  //   request.prId = this.prIdCurrent;
  //   this.purchaseRequestItemService.exportAll(request).subscribe(() => {
  //     this.notificationService.showMessage('Export complete');
  //   });
  // }
}
