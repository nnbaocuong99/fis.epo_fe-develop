import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { PurchaseOrderRequestPayload } from '../../../../../services/modules/purchase-order/purchase-order.request-payload';
import { PurchaseOrderService } from '../../../../../services/modules/purchase-order/purchase-order.service';
import * as config from './purchase-order-in-supplier.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import * as configSupplier from '../supplier.config';
import { forkJoin } from 'rxjs';
import { BaseComponent } from '../../../../../core/_base/component/base-component';
import { tap } from 'rxjs/internal/operators/tap';
import { merge } from 'lodash';

@Component({
  selector: 'app-purchase-order-in-supplier',
  templateUrl: './purchase-order-in-supplier.component.html',
  styleUrls: ['./purchase-order-in-supplier.component.scss']
})
export class PurchaseOrderInSupplierComponent extends BaseComponent implements OnInit {
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @Input() vendorId: any;
  @Output() change: EventEmitter<any> = new EventEmitter();

  public areaTypes = configSupplier.AREA_TYPE;
  public arrEvaluateTheQualityOfGoods = config.EVALUATE_THE_QUALITY_OF_GOODS;
  public tabs = config.TABS;
  public activeIdTab: number = 1;
  public request: any = {};
  public headers = config.HEADER;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public dataSource = {
    items: null,
    paginatorTotal: undefined
  };
  public listPoChange = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private notification: NotificationService,
    public route: ActivatedRoute,
    private router: Router,
    public purchaseOrderService: PurchaseOrderService
  ) {
    super();
  }

  ngOnInit() {
    this.request = new PurchaseOrderRequestPayload();
    this.request.vendorId = this.vendorId;
    this.initData();
    this.pagingData();
  }

  public initData(): void {
    if (this.paginator) {
      this.request.pageIndex = this.paginator.pageIndex;
      this.request.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 5;
    }
    const requests = [
      this.purchaseOrderService.select(this.request),
      this.purchaseOrderService.count(this.request)
    ];
    const sub = forkJoin(requests).subscribe(
      (response: any[]) => {
        this.dataSource.items = response[0];
        this.dataSource.paginatorTotal = response[1];
        for (const item of this.dataSource.items) {
          const temp = this.listPoChange.find(m => m.id === item.id);
          if (temp) {
            item.vendorRate = temp.vendorRate;
            item.qualityMismatch = temp.qualityMismatch;
          }
          item.qualityMismatch = item.qualityMismatch === true ? true : false;
        }
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

  public setFragmentToRoute(event): void {
    this.activeIdTab = event.nextId;
  }

  public changeVendorRate(value, rowData) {
    this.listPoChange = this.listPoChange.filter(m => m.id != rowData.id);
    this.listPoChange.push(rowData);
    this.change.emit({ listPoChange: this.listPoChange });
  }

  public changeQualityMismatch(value, rowData) {
    this.listPoChange = this.listPoChange.filter(m => m.id != rowData.id);
    this.listPoChange.push(rowData);
    this.change.emit({ listPoChange: this.listPoChange });
  }

}
