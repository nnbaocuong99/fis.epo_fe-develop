import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { forkJoin } from 'rxjs';
import { BaseFormComponent } from '../../../../../../core/_base/component';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { BrandRevenueRequestPayload } from '../../../../../../services/modules/category/brand-revenue/brand-revenue.request.payload';
import { BrandRevenueService } from '../../../../../../services/modules/category/brand-revenue/brand-revenue.service';
import { ConfigListFactory } from '../../../../../partials/control/config-list/config-list-control.service';
import * as config from './brand-revenue.config';

@Component({
  selector: 'app-brand-revenue',
  templateUrl: './brand-revenue.component.html',
  styleUrls: ['./brand-revenue.component.scss']
})
export class BrandRevenueComponent extends BaseFormComponent implements OnInit {
  @ViewChild('form', { static: false }) form: NgForm;

  @Input() editTable = true;
  @Output() hasEdit: EventEmitter<any> = new EventEmitter();

  public addItem: any = { id: Guid.create().toString().split('-').join('') };
  public currentBrandId: string;
  public header: any;
  public validateFields = config.BRAND_REVENUE_VALIDATE_FIELD;
  public quarterlyData = config.QUARTERLY;
  public dataSource = {
    items: null,
    paginatorTotal: undefined
  };
  public revenue: number;
  public configListDataRevenue: any = {};
  public totalAmount = 0;

  constructor(
    public brandRevenueService: BrandRevenueService,
    public notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    const tempheader = JSON.stringify(config.HEADER_BRAND_REVENUE);
    this.header = JSON.parse(tempheader);
    if (!this.editTable) {
      const index = this.header.findIndex(x => x.field === 'action');
      if (index > -1) {
        this.header.splice(index, 1);
      }
    }
    this.configListDataRevenue = ConfigListFactory.instant('BRAND_REVENUE');
    const routeSub = this.route.params.subscribe(params => {
      if (params.id) {
        this.currentBrandId = params.id;
        this.loadData(this.currentBrandId);
      } else {
        this.dataSource.items = [];
      }
    });
    this.subscriptions.push(routeSub);
  }

  public loadData(currentBrandId: string): void {
    const request = new BrandRevenueRequestPayload();
    request.brandId = currentBrandId;

    const initSub = forkJoin([
      this.brandRevenueService.select(request),
      this.brandRevenueService.count(request)
    ]).subscribe(res => {
      this.dataSource.items = res[0];
      this.dataSource.paginatorTotal = res[1];
      this.getTotal();
      this.cdr.detectChanges();
    });
    this.subscriptions.push(initSub);
  }

  public getTotal(): void {
    if (this.dataSource.items && this.dataSource.items.length > 0) {
      let total = 0;
      for (const item of this.dataSource.items) {
        total += item.quarterlyRevenue ? +item.quarterlyRevenue : 0;
      }
      this.totalAmount = total;
    }
  }

  public addNewRow(): void {
    const addItem = this.addItem;
    if (this.validateNewRow(this.validateFields)) {
      if (addItem) {
        if (this.currentBrandId) {
          addItem.brandId = this.currentBrandId;
        }
        if (this.dataSource.items && this.dataSource.items.length > 0) {
          this.dataSource.items = this.dataSource.items.concat(addItem);

        } else {
          this.dataSource.items = [];
          this.dataSource.items.push(addItem);
        }
      }
      this.onRowEditInit();
      this.addItem = { id: Guid.create().toString().split('-').join('') };
    }
  }

  public validateNewRow(validateFields: any): boolean {
    let result = true;
    for (const item of validateFields) {
      if (item.validateValue.some(x => x === this.addItem[item.field])) {
        this.notificationService.showMessage(item.message);
        result = false;
        break;
      }
    }
    return result;
  }

  public onBtnDeleteClick(rowData: any): void {
    const index = this.dataSource.items.findIndex(x => x.id === rowData.id);
    if (index > -1) {
      this.dataSource.items.splice(index, 1);
      this.onRowEditInit();
    }
  }

  public onRowEditInit(): void {
    this.hasEdit.emit();
    this.getTotal();
    this.cdr.detectChanges();
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

  public onSearchRevenue(event: any): void {
    if (event) {
      const revenue = event.code.split('-');
      if (revenue.length > 1) {
        if (this.dataSource.items && this.dataSource.items.length > 0) {
          for (const items of this.dataSource.items) {
            if (items.quarterlyRevenue > (revenue[1] * 1000000)) {
              items.hideRow = true;
            } else {
              items.hideRow = false;
            }
          }
        }
      } else if (revenue[0]) {
        for (const items of this.dataSource.items) {
          if (items.quarterlyRevenue > (revenue[0] * 1000000)) {
            items.hideRow = false;
          } else {
            items.hideRow = true;
          }
        }
      }

    } else {
      for (const items of this.dataSource.items) {
        items.hideRow = false;
      }
    }
    this.cdr.detectChanges();
  }

}
