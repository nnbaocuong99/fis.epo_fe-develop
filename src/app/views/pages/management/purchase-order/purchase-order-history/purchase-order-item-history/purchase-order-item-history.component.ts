import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TreeNode } from 'primeng';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { BaseComponent } from '../../../../../../core/_base/component/base-component';
import { PurchaseOrderHistoryService } from '../../../../../../services/modules/purchase-order-history/purchase-order-history.service';
import {
  PurchaseOrderItemHistoryRequestPayload
} from '../../../../../../services/modules/purchase-order-item-history/purchase-order-item-history.request-payload';
import {
  PurchaseOrderItemHistoryService
} from '../../../../../../services/modules/purchase-order-item-history/purchase-order-item-history.service';
import * as config from './purchase-order-item-history.config';
import * as mainConfig from '../../../../../../core/_config/main.config';
import { TaxCodeService } from '../../../../../../services/modules/category/tax-code/tax-code.service';

@Component({
  selector: 'app-purchase-order-item-history',
  templateUrl: './purchase-order-item-history.component.html',
  styleUrls: ['./purchase-order-item-history.component.scss']
})
export class PurchaseOrderItemHistoryComponent extends BaseComponent implements OnInit {
  _purchaseOrderHistory: any;
  get purchaseOrderHistory(): any {
    return this._purchaseOrderHistory;
  }
  @Input() set purchaseOrderHistory(value: any) {
    this._purchaseOrderHistory = value;
    if (this._purchaseOrderHistory.id) {
      this.configTablePurchaseOrder();
      this.initData();
    }
  }
  @Input() isInternal: boolean;
  public dataSource: any = {
    items: [],
    paginatorTotal: null
  };
  public headers: any[];
  public frozenCols: any[];
  public mainConfig = mainConfig.MAIN_CONFIG;
  public headerInternal = config.HEADER_INTERNAL;
  public headerExternal = config.HEADER_EXTERNAL;
  public totalWithTax = 0;
  public totalWithoutTax = 0;
  public totalAmountTax = 0;
  public taxCodeData: any[];

  constructor(
    private cdr: ChangeDetectorRef,
    public purchaseOrderHistoryService: PurchaseOrderHistoryService,
    public purchaseOrderItemHistoryService: PurchaseOrderItemHistoryService,
    public taxCodeService: TaxCodeService
  ) {
    super();
  }

  ngOnInit() {

  }

  private quote(source: string): string {
    return `.${source}.`;
  }

  private initData(): void {
    const request = new PurchaseOrderItemHistoryRequestPayload();
    request.poHistoryId = this.purchaseOrderHistory.id;
    const initData = forkJoin([
      this.purchaseOrderItemHistoryService.select(request),
      this.taxCodeService.select()
    ]).subscribe(res => {
      this.dataSource = {
        items: res[0],
        paginatorTotal: res[0].length
      };
      this.taxCodeData = res[1];
      this.createItemDataTree();
      this.getTotal();
      this.cdr.detectChanges();
    });
    this.subscriptions.push(initData);
  }

  createItemDataTree() {
    const itemSourceTemp = JSON.parse(JSON.stringify(this.dataSource.items));
    this.dataSource.items = [];
    const parentItems = itemSourceTemp.filter(x => !x.isSubItem);
    for (const parent of parentItems) {
      const node: TreeNode = {
        data: { ...parent },
        children: [],
        expanded: true,
        leaf: true
      };
      const childItems = itemSourceTemp.filter(x => x.isSubItem && this.quote(x.indexNo).startsWith(this.quote(parent.indexNo)));
      for (const child of childItems) {
        const childNode = {
          data: { ...child },
          leaf: true,
        };
        node.children.push(childNode);
        node.leaf = false;
      }
      this.dataSource.items.push(node);
    }
    this.dataSource.paginatorTotal = this.dataSource.items.length;
    this.dataSource.items = [...this.dataSource.items];
  }

  public configTablePurchaseOrder(): void {
    if (this.purchaseOrderHistory.areaType === 1 || this.purchaseOrderHistory.areaType === 2) {
      this.isInternal = true;
      // X??? l?? frozenCols table
      const temp = JSON.stringify(this.headerInternal);
      this.headers = JSON.parse(temp);
      this.frozenCols = this.headers.slice(0, 5);
      this.headers.splice(0, 5);
      // PO mua h??ng n?????c ngo??i c???a BP b??? c???t thu??? VAT d?????i line
      if (this.purchaseOrderHistory.areaType === 2) {
        this.headers = this.headers.filter(m => m.field !== 'tax' && m.field !== 'taxAmount');
      }
    } else {
      this.isInternal = false;
      // X??? l?? frozenCols table
      const temp = JSON.stringify(this.headerExternal);
      this.headers = JSON.parse(temp);
      // L???y 5 ph???n t??? ?????u ti??n
      this.frozenCols = this.headers.slice(0, 5);
      // X??a 5 ph???n t??? ?????u ti??n
      this.headers.splice(0, 5);
    }
  }

  private getTotal(): void {
    if (this.dataSource.items.length > 0) {
      // T???ng ti???n ch??a bao g???m thu???
      let totalWithoutTax = 0;
      // T???ng ti???n thu???
      let totalAmountTax = 0;

      for (const item of this.dataSource.items) {
        // Kh??ng t??nh nh???ng line h??ng ???? b??? t??? ch???i
        if (item.data.isActive) {
          totalWithoutTax += this.rounding(+item.data.quantity * +item.data.price);
          totalAmountTax += this.rounding(item.data.taxAmount ? +item.data.taxAmount : 0);
          if (item.data.tax && this.taxCodeData) {
            this.taxCodeData.map(x => {
              if (x.name === item.data.tax && x.taxValue !== undefined && x.taxValue !== null) {
                totalAmountTax += this.rounding((item.data.quantity * item.data.price * x.taxValue) / 100);
              }
            });
          }
          if (item.children && item.children.length > 0) {
            item.children.map(chil => {
              if (chil.data && chil.data.price) {
                totalWithoutTax += this.rounding(+chil.data.quantity * +chil.data.price);
                totalAmountTax += this.rounding(chil.data.taxAmount ? +chil.data.taxAmount : 0);
              }
            });
          }
        }
      }
      // T???ng ti???n ch??a bao g???m thu???
      this.totalWithoutTax = totalWithoutTax;
      // T???ng ti???n thu???
      this.totalAmountTax = totalAmountTax;
      // T???ng ti???n bao g???m thu???
      this.totalWithTax = totalWithoutTax + totalAmountTax;
    } else {
      // T???ng ti???n ch??a bao g???m thu???
      this.totalWithoutTax = 0;
      // T???ng ti???n thu???
      this.totalAmountTax = 0;
      this.totalWithTax = 0;
    }
  }

  public rounding(value: number): number {
    return (Math.round(value * 100) / 100);
  }

}

