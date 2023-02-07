import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  PurchaseOrderHistoryRequestPayload
} from '../../../../../services/modules/purchase-order-history/purchase-order-history.request-payload';
import { PurchaseOrderHistoryService } from '../../../../../services/modules/purchase-order-history/purchase-order-history.service';
import { DialogRef } from '../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from './purchase-order-history.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material';
import { BaseComponent } from '../../../../../core/_base/component/base-component';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { tap } from 'rxjs/internal/operators/tap';
import { merge } from 'lodash';
import {
  PurchaseOrderItemHistoryService
} from '../../../../../services/modules/purchase-order-item-history/purchase-order-item-history.service';
import {
  PurchaseOrderItemHistoryRequestPayload
} from '../../../../../services/modules/purchase-order-item-history/purchase-order-item-history.request-payload';
import { PurchaseOrderViewDetailsComponent } from './purchase-order-view-details/purchase-order-view-details.component';

@Component({
  selector: 'app-purchase-order-history',
  templateUrl: './purchase-order-history.component.html',
  styleUrls: ['./purchase-order-history.component.scss']
})
export class PurchaseOrderHistoryComponent extends BaseComponent implements OnInit {
  @ViewChild('purchaseOrderViewDetails', { static: true }) purchaseOrderViewDetails: PurchaseOrderViewDetailsComponent;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  public dialogRef: DialogRef = new DialogRef();
  public headers = config.HEADER;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public request = new PurchaseOrderHistoryRequestPayload();
  public dataSource = {
    items: null,
    paginatorTotal: undefined
  };
  public type = config.TYPE;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    public purchaseOrderHistoryService: PurchaseOrderHistoryService,
    public purchaseOrderItemHistoryService: PurchaseOrderItemHistoryService
  ) {
    super();
  }

  ngOnInit() {
    const routeSub = this.route.params.subscribe((params) => {
      if (params.id) {
        this.request.poId = params.id;
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
      this.purchaseOrderHistoryService.select(this.request),
      this.purchaseOrderHistoryService.count(this.request)
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
    this.purchaseOrderViewDetails.onShowDialogClick(rowData.id);
  }

  public close() {
    this.dialogRef.hide();
  }
}
