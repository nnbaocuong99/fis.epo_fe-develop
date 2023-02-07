import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../../../core/_base/component/base-component';
import { SupplierHistoryService } from '../../../../../services/modules/category/supplier-history/supplier-history.service';
import { DialogRef } from '../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from './supplier-history.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { SupplierHistoryRequestPayload } from '../../../../../services/modules/category/supplier-history/supplier-history.request.payload';
import { MatPaginator } from '@angular/material';
import { forkJoin, merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SupplierHistoryViewDetailsComponent } from './supplier-history-view-details/supplier-history-view-details.component';

@Component({
  selector: 'app-supplier-history',
  templateUrl: './supplier-history.component.html',
  styleUrls: ['./supplier-history.component.scss']
})
export class SupplierHistoryComponent extends BaseComponent implements OnInit {
  @ViewChild('supplierHistoryViewDetails', { static: true }) supplierHistoryViewDetails: SupplierHistoryViewDetailsComponent;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;

  public dialogRef: DialogRef = new DialogRef();
  public headers = config.HEADER;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public request = new SupplierHistoryRequestPayload();
  public dataSource = {
    items: null,
    paginatorTotal: undefined
  };
  public arrActionType = config.ACTION_TYPE;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    public supplierHistoryService: SupplierHistoryService
  ) {
    super();
  }

  ngOnInit() {
    const routeSub = this.route.params.subscribe((params) => {
      if (params.id) {
        this.request.supplierId = params.id;
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
      this.supplierHistoryService.select(this.request),
      this.supplierHistoryService.count(this.request)
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
    this.supplierHistoryViewDetails.onShowDialogClick(rowData.id);
  }

  public close() {
    this.dialogRef.hide();
  }

}
