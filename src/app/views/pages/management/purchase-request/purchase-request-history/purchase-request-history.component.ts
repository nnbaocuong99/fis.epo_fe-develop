import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BaseComponent } from '../../../../../core/_base/component/base-component';
import {
  PurchaseRequestHistoryRequestPayload
} from '../../../../../services/modules/purchase-request-history/purchase-request-history.request-payload';
import { PurchaseRequestHistoryService } from '../../../../../services/modules/purchase-request-history/purchase-request-history.service';
import {
  PurchaseRequestItemHistoryService
} from '../../../../../services/modules/purchase-request-item-history/purchase-request-item-history.service';
import { DialogRef } from '../../../../partials/content/crud/dialog/dialog-ref.model';
import { PurchaseRequestViewDetailComponent } from './purchase-request-view-detail/purchase-request-view-detail.component';
import { tap } from 'rxjs/internal/operators/tap';
import { merge } from 'lodash';
import * as config from './purchase-request-history.config';
import * as mainConfig from '../../../../../core/_config/main.config';

@Component({
  selector: 'app-purchase-request-history',
  templateUrl: './purchase-request-history.component.html',
  styleUrls: ['./purchase-request-history.component.scss']
})
export class PurchaseRequestHistoryComponent extends BaseComponent implements OnInit {
  @ViewChild('purchaseRequestViewDetails', { static: true }) purchaseRequestViewDetails: PurchaseRequestViewDetailComponent;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  public dialogRef: DialogRef = new DialogRef();
  public headers = config.HEADER;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public request = new PurchaseRequestHistoryRequestPayload();
  public dataSource = {
    items: null,
    paginatorTotal: undefined
  };
  public type = config.TYPE;

  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    public purchaseRequestHistoryService: PurchaseRequestHistoryService,
    public purchaseRequestItemHistoryService: PurchaseRequestItemHistoryService
  ) {
    super();
  }

  ngOnInit() {
    const routeSub = this.route.params.subscribe((params) => {
      if (params.id) {
        this.request.prId = params.id;
      }
    });
    this.subscriptions.push(routeSub);
  }

  public onBtnShowDialogListClick(): void {
    this.initData();
    this.pagingData();
    this.dialogRef.show();
    this.cdr.detectChanges();
  }

  public initData(): void {
    if (this.paginator) {
      this.request.pageIndex = this.paginator.pageIndex;
      this.request.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
    }
    const requests = [
      this.purchaseRequestHistoryService.select(this.request),
      this.purchaseRequestHistoryService.count(this.request)
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

  public onBtnShowDialogDetailsClick(rowData: any): void {
    this.purchaseRequestViewDetails.onShowDialogClick(rowData.id);
  }

  public close() {
    this.dialogRef.hide();
  }
}
