import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { BaseComponent } from '../../../../../../core/_base/component/base-component';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from './purchase-invoice-edit-copy-for-credit-note.config';
import * as invoiceConfig from '../../purchase-invoice.config';
import * as mainConfig from '../../../../../../core/_config/main.config';
import * as configEdit from '../../purchase-invoice-edit/purchase-invoice-edit.config';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseInvoiceService } from '../../../../../../services/modules/purchase-invoice/purchase-invoice.service';
import { forkJoin, merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigListService } from '../../../../../../services/modules/config-list/config-list.service';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { PurchaseInvoiceItemComponent } from '../purchase-invoice-item/purchase-invoice-item.component';
import { PurchaseInvoiceItemService } from '../../../../../../services/modules/purchase-invoice-item/purchase-invoice-item.service';
import { TreeNode } from 'primeng/api';
import { TaxCodeService } from '../../../../../../services/modules/category/tax-code/tax-code.service';

@Component({
  selector: 'app-purchase-invoice-edit-copy-for-credit-note',
  templateUrl: './purchase-invoice-edit-copy-for-credit-note.component.html',
  styleUrls: ['./purchase-invoice-edit-copy-for-credit-note.component.scss']
})
export class PurchaseInvoiceEditCopyForCreditNoteComponent extends BaseComponent implements OnInit {
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('vcPurchaseInvoiceItem', { static: false }) vcPurchaseInvoiceItem: PurchaseInvoiceItemComponent;

  @Input() piId: string;
  @Input() purchaseInvoiceData: any = {};
  @Output() success: EventEmitter<any> = new EventEmitter();

  public dialogRef: DialogRef = new DialogRef();
  public mainConfig = mainConfig.MAIN_CONFIG;
  public cols: any[];
  public frozenCols: any[];
  public request: any = {};
  public dataSource = {
    items: null,
    paginatorTotal: undefined
  };
  public purchaseInvoiceItem: any = {
    items: [],
    paginatorTotal: null
  };
  public arrCostTypes = [];
  public statusInvoices = invoiceConfig.STATUS_INVOICE;
  public checkImportGoods = invoiceConfig.CHECK_IMPORT_GOODS;
  public syncErpList = invoiceConfig.SYNC_ERP_LIST;
  public headerItemsTreeTable: any[];
  public headerItemsTable = configEdit.HEADERS_ITEMS_TABLE;
  public isShowTreeTable = true;

  public steps = config.STEPS;

  public selectedPurchaseInvoice: any = {};
  public step: number;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    public purchaseInvoiceService: PurchaseInvoiceService,
    public purchaseInvoiceItemService: PurchaseInvoiceItemService,
    public configListService: ConfigListService,
    public taxCodeService: TaxCodeService,
    public notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit() {
    const temp = JSON.stringify(config.HEADERS);
    this.cols = JSON.parse(temp);
    this.frozenCols = this.cols.slice(0, 3);
    this.cols.splice(0, 3);
    this.initMasterData();
    this.pagingData();
  }

  public showDialog(): void {
    this.step = 1;
    this.selectedPurchaseInvoice = {};
    this.vcPurchaseInvoiceItem.selectedPurchaseInvoiceItems = [];
    this.initData();
    this.dialogRef.show();
    this.cdr.detectChanges();
  }

  public onSearch(): void {
    this.initData();
  }

  public getCostTypeName(source: any[], code: string): string {
    const item = source.filter(x => x.code === code)[0];
    return item ? item.name : null;
  }

  private initMasterData() {
    const requestCostType: any = {};
    requestCostType.type = 'COST_TYPE';

    const requests = [
      this.configListService.select(requestCostType),
      this.taxCodeService.select()
    ];
    const sub = forkJoin(requests).subscribe(
      (response: any[]) => {
        this.arrCostTypes = response[0];
        this.vcPurchaseInvoiceItem.listCostType = response[0];
        this.vcPurchaseInvoiceItem.taxCodeData = response[1];
      });
    this.subscriptions.push(sub);

  }

  public initData(): void {
    this.request.costType = this.getCostTypeName(this.arrCostTypes, '1');
    if (this.paginator) {
      this.request.pageIndex = this.paginator.pageIndex;
      this.request.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
    }
    const requests = [
      this.purchaseInvoiceService.selectPost(this.request),
      this.purchaseInvoiceService.countPost(this.request)
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

  private initItemData() {
    this.vcPurchaseInvoiceItem.purchaseInvoiceData.showImportVAT = true;
    this.purchaseInvoiceItem.items = [];
    const requestPii: any = { piId: this.selectedPurchaseInvoice.id };
    this.purchaseInvoiceItemService.select(requestPii).subscribe(m => {
      if (m) {
        this.purchaseInvoiceItem.items = m;
        this.convertDataSourceToTree();
        this.vcPurchaseInvoiceItem.getTotalItems();
        const tempHeader = JSON.stringify(configEdit.HEADERS_ITEMS_TREE_TABLE);
        this.headerItemsTreeTable = JSON.parse(tempHeader);
        // Check ẩn tab tính thuế nhà thầu và cột thuế nhà thầu nếu hình thức mua hàng trong nước
        if (this.purchaseInvoiceItem.items.length > 0) {
          const check = this.purchaseInvoiceItem.items.find(x => (x.taxpayer !== undefined && x.taxpayer !== null && x.taxpayer !== 0) && x.areaType !== 1);
          // check có thuế nhà thầu và loại chi phí là giá hàng hóa dịch vụ
          if (check && this.getCostTypeName(this.arrCostTypes, '1')) {
            this.selectedPurchaseInvoice.isShowContractorTax = true;
          } else {
            // set again header items ẩn thuế nhà thầu
            const index = this.headerItemsTreeTable.findIndex(x => x.field === 'taxpayer');
            if (index > -1) {
              this.headerItemsTreeTable.splice(index, 1);
            }
            this.selectedPurchaseInvoice.isShowContractorTax = false;
          }
          this.headerItemsTreeTable.pop();
        }
        this.cdr.detectChanges();
      }
    });
  }

  private quote(source: string): string {
    return `.${source}.`;
  }

  public convertDataSourceToTree(): void {
    const itemSourceTemp = this.purchaseInvoiceItem.items;
    this.purchaseInvoiceItem.items = [];
    const parentItems = itemSourceTemp.filter(x => !x.isSubItem);
    for (const parent of parentItems) {
      const node: TreeNode = {
        data: { ...parent },
        expanded: true,
        children: [],
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
      this.purchaseInvoiceItem.items.push(node);
    }
    this.purchaseInvoiceItem.paginatorTotal = this.purchaseInvoiceItem.items.length;
    this.purchaseInvoiceItem.items = [...this.purchaseInvoiceItem.items];
  }

  public goToView(rowData: any): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`list/view/${rowData.id}`], { relativeTo: this.route.parent })
    );
    window.open(url, '_blank');
  }

  public onChangeStepClick(step: number): void {
    if (!this.steps.some(m => m.value === step)) {
      return;
    }

    if (step === 1) {
      this.step = step;
    }

    if (step === 2) {
      if (!this.selectedPurchaseInvoice || !this.selectedPurchaseInvoice.id) {
        this.notificationService.showWarning('Vui lòng chọn hóa đơn để tiếp tục');
        return;
      }
      this.initItemData();
      this.step = step;
    }

    if (step === 3) {
      if (this.vcPurchaseInvoiceItem.selectedPurchaseInvoiceItems.length === 0) {
        this.notificationService.showWarning('Vui lòng chọn hàng hóa để tiếp tục');
        return;
      }
      this.purchaseInvoiceService.selectById(this.selectedPurchaseInvoice.id).subscribe(m => {
        if (m) {
          this.success.emit({ pi: m, pii: this.getListNotTree() });
          this.close();
        }
      });
    }
  }

  public getListNotTree(): any {
    // trải phẳng dữ liệu
    const arrItemSave = [];
    for (let i = 0; i < this.vcPurchaseInvoiceItem.selectedPurchaseInvoiceItems.length; i++) {
      const item = this.vcPurchaseInvoiceItem.selectedPurchaseInvoiceItems[i];
      arrItemSave.push(item.data);
      if (item.children && item.children.length > 0) {
        for (let j = 0; j < item.children.length; j++) {
          const children = item.children[j];
          arrItemSave.push(children.data);
        }
      }
    }
    return arrItemSave;
  }

  public close() {
    this.dialogRef.hide();
  }

}
