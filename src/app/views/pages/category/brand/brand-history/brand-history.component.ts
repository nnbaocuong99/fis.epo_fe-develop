import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { BrandHistoryRequestPayload } from '../../../../../services/modules/category/brand-history/brand-history.request.payload';
import { BrandHistoryService } from '../../../../../services/modules/category/brand-history/brand-history.service';
import { DialogRef } from '../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from './brand-history.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, merge } from 'rxjs';
import { BaseComponent } from '../../../../../core/_base/component/base-component';
import { tap } from 'rxjs/operators';
import { BrandHistoryViewDetailsComponent } from './brand-history-view-details/brand-history-view-details.component';

@Component({
  selector: 'app-brand-history',
  templateUrl: './brand-history.component.html',
  styleUrls: ['./brand-history.component.scss']
})
export class BrandHistoryComponent extends BaseComponent implements OnInit {
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('appBrandHistoryViewDetails', { static: true }) appBrandHistoryViewDetails: BrandHistoryViewDetailsComponent;

  public dialogRef: DialogRef = new DialogRef();
  public request = new BrandHistoryRequestPayload();
  public dataSource = {
    items: null,
    paginatorTotal: undefined
  };
  public arrActionType = config.ACTION_TYPE;
  public headers = config.HEADER;
  public mainConfig = mainConfig.MAIN_CONFIG;

  constructor(
    public brandHistoryService: BrandHistoryService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    const routeSub = this.route.params.subscribe((params) => {
      if (params.id) {
        this.request.brandId = params.id;
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
      this.brandHistoryService.select(this.request),
      this.brandHistoryService.count(this.request)
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

  public close() {
    this.dialogRef.hide();
  }

  public onBtnShowDialogDetailsClick(rowData: any): void {
    this.appBrandHistoryViewDetails.onShowDialogClick(rowData.id);
  }

}
