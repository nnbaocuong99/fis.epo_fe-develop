import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../../../core/_base/component/base-component';
import { DialogRef } from '../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from './purchase-plan-history.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { merge } from 'lodash';
import { PurchasePlanViewDetailsComponent } from './purchase-plan-view-details/purchase-plan-view-details.component';
import {
  PurchasePlanHistoryRequestPayload
} from '../../../../../services/modules/purchase-plan-history/purchase-plan-history.request-payload';
import { PurchasePlanHistoryService } from '../../../../../services/modules/purchase-plan-history/purchase-plan-history.service';
import {
  PurchasePlanItemHistoryService
} from '../../../../../services/modules/purchase-plan-item-history/purchase-plan-item-history.service';

@Component({
  selector: 'app-purchase-plan-history',
  templateUrl: './purchase-plan-history.component.html',
  styleUrls: ['./purchase-plan-history.component.scss']
})
export class PurchasePlanHistoryComponent extends BaseComponent implements OnInit {
  @ViewChild('purchasePlanViewDetails', { static: true }) purchasePlanViewDetails: PurchasePlanViewDetailsComponent;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  public dialogRef: DialogRef = new DialogRef();
  public headers = config.HEADER;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public request = new PurchasePlanHistoryRequestPayload();
  public dataSource = {
    items: null,
    paginatorTotal: undefined
  };
  public type = config.TYPE;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    public purchasePlanHistoryService: PurchasePlanHistoryService,
    public purchasePlanItemHistoryService: PurchasePlanItemHistoryService
  ) {
    super();
  }

  ngOnInit() {
    const routeSub = this.route.params.subscribe((params) => {
      if (params.id) {
        this.request.ppId = params.id;
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
      this.purchasePlanHistoryService.select(this.request),
      this.purchasePlanHistoryService.count(this.request)
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
    this.purchasePlanViewDetails.onShowDialogClick(rowData.id);
  }

  public close() {
    this.dialogRef.hide();
  }
}

