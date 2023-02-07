import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../../../core/_base/component/base-component';
import { DialogRef } from '../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from './brand-view-year.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { forkJoin, merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BrandService } from '../../../../../services/modules/category/brand/brand.service';
import { BrandRequestPayload } from '../../../../../services/modules/category/brand/brand.request.payload';
import { DeleteConfirmation } from '../../../../../services/common/confirmation';
import { NotificationService } from '../../../../../services/common/notification/notification.service';

@Component({
  selector: 'app-brand-view-year',
  templateUrl: './brand-view-year.component.html',
  styleUrls: ['./brand-view-year.component.scss']
})
export class BrandViewYearComponent extends BaseComponent implements OnInit {
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;

  public dialogRef: DialogRef = new DialogRef();
  public dataSource = {
    items: null,
    paginatorTotal: undefined
  };
  public request = new BrandRequestPayload();
  public headers = config.HEADER;
  public mainConfig = mainConfig.MAIN_CONFIG;

  constructor(
    public brandService: BrandService,
    public notification: NotificationService,
    private cdr: ChangeDetectorRef,
    public router: Router,
    private route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
  }

  public close() {
    this.dialogRef.hide();
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
      this.brandService.selectBrandYear(this.request),
      this.brandService.countBrandYear(this.request)
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

  public onBtnEditClick(id: string): void {
    this.router.navigate([`edit/${id}`], { relativeTo: this.route });
  }

  public onBtnViewClick(rowData?: any): void {
    this.router.navigate([`view/${rowData.id}`], { relativeTo: this.route });
  }

  public onBtnDeleteClick(id: string): void {
    const confirmation = new DeleteConfirmation();
    confirmation.accept = () => {
      this.brandService.delete(id).subscribe(() => {
        this.initData();
        this.notification.showDeteleSuccess();
      });
    };
    this.notification.confirm(confirmation);
  }

  public onBtnAddClick(): void {
    const rowData = { code: this.request.code, name: this.request.name };
    this.router.navigate([`add`], {
      relativeTo: this.route,
      state: {
        fromBrand: true,
        brandData: rowData
      }
    });
  }

  public convertCurrencyMask(price: any): string {
    if (price !== null && price !== undefined) {
      const result = this.format(price, 0, 3, ',', '.');
      return result;
    } else {
      return '';
    }
  }

  private format(value: any, n: any, x: any, s: any, c: any) {
    let result = '';
    if (value != null && value !== undefined) {
      if (typeof (value) === 'string') {
        value = parseFloat(value);
      }
      const re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')';
      const num = value.toFixed(Math.max(0, n));
      result = (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
    }
    return result;
  }

}
