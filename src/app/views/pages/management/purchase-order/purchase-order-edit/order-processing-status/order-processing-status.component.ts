import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import * as config from './order-processing-status.config';
import { PurchaseOrderItemService } from '../../../../../../services/modules/purchase-order-item/purchase-order-item.service';
import {
  PurchaseOrderItemRequestPayload
} from '../../../../../../services/modules/purchase-order-item/purchase-order-item.request-payload';
import { MatPaginator } from '@angular/material';
import { merge } from 'lodash';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseComponent } from '../../../../../../core/_base/component/base-component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-processing-status',
  templateUrl: './order-processing-status.component.html',
  styleUrls: ['./order-processing-status.component.scss']
})
export class OrderProcessingStatusComponent extends BaseComponent implements OnInit {
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;

  public dataSource = {
    items: [],
    paginatorTotal: null,
  };

  public headers = config.HEADERS;
  public request = new PurchaseOrderItemRequestPayload();

  constructor(
    private cdr: ChangeDetectorRef,
    public purchaseOrderItemService: PurchaseOrderItemService,
    private route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    const routeSub = this.route.params.subscribe(params => {
      if (params.id) {
        this.request.poId = params.id;
        this.initData();
        this.pagingData();
      }
    });
    this.subscriptions.push(routeSub);
  }

  public initData(): void {
    if (this.paginator) {
      this.request.pageIndex = this.paginator.pageIndex;
      this.request.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
    }
    const requests = [
      this.purchaseOrderItemService.selectProcessingStatus(this.request),
      this.purchaseOrderItemService.cpuntProcessingStatus(this.request)];
    const sub = forkJoin(requests).subscribe(
      (response: any[]) => {
        this.dataSource.items = response[0];
        this.getTotalImportedIntoStock();
        this.dataSource.paginatorTotal = response[1];
        this.cdr.detectChanges();
      });
    this.subscriptions.push(sub);
  }

  private getTotalImportedIntoStock(): void {
    const itemsGrouped = this.groupBy(this.dataSource.items, 'itemCode');
    const keys = Object.keys(itemsGrouped);
    const rs = [];
    for (const k of keys) {
      let countKey = 0;
      for (const child of itemsGrouped[k]) {
        countKey += +child.quantityImportedIntoStock;
      }
      rs.push({
        key: k,
        count: countKey
      });
    }
    for (const item of rs) {
      this.dataSource.items.map(x => {
        if (item.key === x.itemCode) {
          x.quantityRemaining = x.quantity - item.count;
        }
      });
    }
  }

  private groupBy(xs: any[], key: string) {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
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

}
