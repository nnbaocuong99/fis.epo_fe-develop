import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { BaseFormComponent } from '../../../../../core/_base/component/base-form.component';
import { PurchaseInvoiceService } from '../../../../../services/modules/purchase-invoice/purchase-invoice.service';
import * as mainConfig from '../../../../../core/_config/main.config';
import {
  PurchaseInvoiceItemRequestPayload
} from '../../../../../services/modules/purchase-invoice-item/purchase-invoice-item.request-payload';
import { PurchaseInvoiceItemService } from '../../../../../services/modules/purchase-invoice-item/purchase-invoice-item.service';
import * as config from './purchase-invoice-view.config';
import * as configEdit from '../purchase-invoice-edit/purchase-invoice-edit.config';
import { TreeNode } from 'primeng/api';
import { PurchaseInvoiceItemComponent } from '../purchase-invoice-edit/purchase-invoice-item/purchase-invoice-item.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigListRequestPayload } from '../../../../../services/modules/config-list/config-list.request.payload';
import { ConfigListService } from '../../../../../services/modules/config-list/config-list.service';
import { TaxCodeService } from '../../../../../services/modules/category/tax-code/tax-code.service';
import { DialogRequestImportComponent } from '../purchase-invoice-edit/dialog-request-import/dialog-request-import.component';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { currentUser } from '../../../../../core/auth';
import { take } from 'rxjs/operators';
import { OrgChartService } from '../../../../../services/modules/org-chart/org-chart.service';
import { NotificationListService } from '../../../../../services/modules/notification-list/notification-list.service';
import { FileService } from '../../../../../services/modules/file/file.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-purchase-invoice-view',
  templateUrl: './purchase-invoice-view.component.html',
  styleUrls: ['./purchase-invoice-view.component.scss']
})
export class PurchaseInvoiceViewComponent extends BaseFormComponent implements OnInit {
  @ViewChild('lPurchaseInvoiceItem', { static: false }) lPurchaseInvoiceItem: PurchaseInvoiceItemComponent;
  @ViewChild('dialogRequestImport', { static: false }) dialogRequestImport: DialogRequestImportComponent;

  public exchangeRates = config.EXCHANGE_RATE;
  public headerView = config.VIEW_COMMON_INFO;
  public mainConfig: any;
  public request: any;
  public purchaseinvoice: any = {};
  public purchaseInvoiceItem: any = {
    items: [],
    paginatorTotal: null
  };
  public purchaseInvoiceItemOrigin = [];
  public quantityTotal = 0;
  public quantitySuggestTotal = 0;
  public moneyTotal = 0;

  public headerItemsTreeTableOrigin = configEdit.HEADERS_ITEMS_TREE_TABLE;
  public headerItemsTableOrigin = configEdit.HEADERS_ITEMS_TABLE;
  public headerItemsTableCostShipmentOrigin = configEdit.HEADERS_ITEMS_TABLE_COST_SHIPMENT;
  public headerItemsTableCreditNoteOrigin = configEdit.HEADERS_ITEMS_TABLE_CREDIT_NOTE;

  public headerItemsTreeTable = configEdit.HEADERS_ITEMS_TREE_TABLE;
  public headerItemsTable = configEdit.HEADERS_ITEMS_TABLE;

  public isCostTypeCreditNote = false;
  public isCostTypeForShipment = false;
  public allowRequestImportGoods = false;
  // Ẩn hiện phần tab thuế nhà thầu và cột thuế nhà thầu ở line hàng
  public isShowContractorTax = false;

  // Ẩn hiển phần bảng danh sách HH/DV
  public isShowTreeTable = false;
  public listKey = [];
  public listValue = [];
  public tabDetails = configEdit.TAB_DETAILS;
  public currentchangTab: number;
  public currentPiId: string;
  public orgChart: any = {};
  public notificationData: any = {};

  public listPpHasFile = [];
  public listPrHasFile = [];
  public listPoHasFile = [];

  constructor(
    public purchaseInvoiceService: PurchaseInvoiceService,
    public purchaseInvoiceItemService: PurchaseInvoiceItemService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private location: Location,
    public configListService: ConfigListService,
    public taxCodeService: TaxCodeService,
    public orgChartService: OrgChartService,
    private router: Router,
    public notificationListService: NotificationListService,
    private store: Store<AppState>,
    private notificationService: NotificationService,
    private fileService: FileService
  ) {
    super();
  }

  ngOnInit() {
    this.mainConfig = mainConfig.MAIN_CONFIG;
    this.currentchangTab = this.tabDetails[0].value;

    const routeSub = this.route.params.subscribe((params) => {
      if (params.id) {
        this.initData(params.id);
      }
    });
    this.subscriptions.push(routeSub);
  }

  public changTabDetail(event: any) {
    this.currentchangTab = event.nextId;
  }

  public onDlgHide(): void {
    this.resetVariables();
  }

  private resetVariables(): void {
    this.purchaseinvoice = {};
    this.purchaseInvoiceItem = [];
    this.quantityTotal = 0;
    this.quantitySuggestTotal = 0;
    this.moneyTotal = 0;
    this.headerItemsTreeTable = [];
    this.isCostTypeCreditNote = false;
    this.isCostTypeForShipment = false;
    // Ẩn hiện phần tab thuế nhà thầu và cột thuế nhà thầu ở line hàng
    this.isShowContractorTax = false;
  }

  public initData(id: string): void {
    // Get purchase invoices id from input dialog ref
    this.currentPiId = id;
    const requestPiItem = new PurchaseInvoiceItemRequestPayload();
    requestPiItem.piId = this.currentPiId;

    const requestConfigList = new ConfigListRequestPayload();
    requestConfigList.type = 'COST_TYPE';

    const categorySub = forkJoin([
      // Get purchase invoice
      this.purchaseInvoiceService.selectById(this.currentPiId),
      // Get purchase invoice item
      this.purchaseInvoiceItemService.select(requestPiItem),
      this.configListService.select(requestConfigList),
      this.taxCodeService.select(),
      this.store.select(currentUser).pipe(take(1)),
    ]).subscribe((res) => {
      if (res[0]) {
        this.purchaseinvoice = res[0];
        // Config list data => show view
        this.configPurchaseInvoiceListData();
        this.onChangeCostType(res[0]);

        this.purchaseinvoice.useNameLoginData = res[4];
        if (res[4] && res[4].groupId) {
          this.orgChartService.selectById(res[4].groupId).subscribe(rs => {
            this.orgChart = rs;
          });
        }

        if (res[1]) {
          this.purchaseInvoiceItemOrigin = res[1];
          this.purchaseInvoiceItem = {
            items: res[1],
            paginatorTotal: res[1].length
          };
          this.setAllowRequestImportGoods();
          const tempHeader = JSON.stringify(configEdit.HEADERS_ITEMS_TREE_TABLE);
          this.headerItemsTreeTable = JSON.parse(tempHeader);
          // Check ẩn tab tính thuế nhà thầu và cột thuế nhà thầu nếu hình thức mua hàng trong nước
          if (this.purchaseInvoiceItem.items.length > 0) {
            // tslint:disable-next-line:max-line-length
            const check = this.purchaseInvoiceItem.items.find(x => (x.taxpayer !== undefined && x.taxpayer !== null && x.taxpayer !== 0) && x.areaType !== 1);
            // check có thuế nhà thầu và loại chi phí là giá hàng hóa dịch vụ
            if (check && (this.purchaseinvoice.codeCostType === '1')) {
              this.isShowContractorTax = true;
              this.purchaseinvoice.isShowContractorTax = true;
            } else {
              // set again header items ẩn thuế nhà thầu
              const index = this.headerItemsTreeTable.findIndex(x => x.field === 'taxpayer');
              if (index > -1) {
                this.headerItemsTreeTable.splice(index, 1);
              }
              this.isShowContractorTax = false;
              this.purchaseinvoice.isShowContractorTax = false;
            }
            this.headerItemsTreeTable.pop();
          }

          // check loại chi phí là giá hàng hóa dịch vụ
          if (this.purchaseinvoice.codeCostType === '1') {
            this.convertDataSourceToTree();
          }
          this.lPurchaseInvoiceItem.listCostType = res[2];
          this.lPurchaseInvoiceItem.taxCodeData = res[3];
          this.lPurchaseInvoiceItem.purchaseInvoiceData = this.purchaseinvoice;
          this.lPurchaseInvoiceItem.purchaseInvoiceItemsData = this.purchaseInvoiceItem;
          this.lPurchaseInvoiceItem.getTotalItems();
          this.initObjectHasFile();
          this.cdr.detectChanges();
        }
      } else {
        this.purchaseinvoice = {};
        this.router.navigate([`list`], { relativeTo: this.route.parent });
      }
    });
    this.subscriptions.push(categorySub);
  }

  public configPurchaseInvoiceListData(): void {
    const listData = [];
    const listDataDraft = Object.keys(this.purchaseinvoice);
    const listValue = Object.values(this.purchaseinvoice);
    for (const element of this.headerView) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < listDataDraft.length; i = i + 1) {
        // sort listDataDraft theo headerView
        if (element.field === listDataDraft[i]) {
          listData.push({ name: listDataDraft[i], title: element.title }); // Thêm trường để show title
          // Check translate value
          if (element.hasFormatDate) {
            listData[listData.length - 1].hasFormatDate = element.hasFormatDate;
          }
          if (element.dictionary) {
            listData[listData.length - 1].dictionary = element.dictionary;
          }
          // sort value theo listDataDraft
          this.listValue.push(listValue[i]);
        }
      }
    }
    if (this.purchaseinvoice.codeCostType === '2' || this.purchaseinvoice.codeCostType === '3') {
      // check không view projectCode trong trường hợp hóa đơn là bảo hiểm, vận tải
      // trường projectCode đang binding từ shipment sang để phục vụ đồng bộ (Tạo hóa đơn bảo hiểm, vận tải từ lô hàng)
      const index = listData.findIndex(x => x.name === 'projectCode');
      if (index > -1) {
        listData.splice(index, 1);
        this.listValue.splice(index, 1);
      }
    }

    // Group 4 items 1 object
    for (let i = 0; i < listData.length; i = i + 4) {
      const listItem = [];
      listItem.push(listData[i]);
      listItem.push(listData[i + 1]);
      listItem.push(listData[i + 2]);
      listItem.push(listData[i + 3]);
      this.listKey.push(listItem);
    }
  }

  private initObjectHasFile() {
    const requestPp: any = { piId: this.purchaseinvoice.id, fileModule: 'PP' };
    const requestPr: any = { piId: this.purchaseinvoice.id, fileModule: 'PR' };
    const requestPo: any = { piId: this.purchaseinvoice.id, fileModule: 'PO' };
    const initSub = forkJoin([
      this.fileService.selectObjectHasFileInModule(requestPp),
      this.fileService.selectObjectHasFileInModule(requestPr),
      this.fileService.selectObjectHasFileInModule(requestPo)
    ]).subscribe(res => {
      this.listPpHasFile = res[0];
      this.listPrHasFile = res[1];
      this.listPoHasFile = res[2];
    });
    this.subscriptions.push(initSub);
  }

  public onChangeCostType(data: any): void {
    this.isShowTreeTable = false;
    this.isCostTypeCreditNote = false;
    this.isCostTypeForShipment = false;
    this.headerItemsTable = this.headerItemsTableOrigin.filter(m => m); // tạo mảng mới không binding

    if (data.codeCostType === '1') {
      this.isShowTreeTable = true;
    }

    if (data.codeCostType === '8' || data.codeCostType === '9') {
      // Ẩn tính thuế cho Loại chi phí thuế VAT, thuế VAT nhập khẩu
      this.purchaseinvoice.showImportVAT = false;
    } else {
      this.purchaseinvoice.showImportVAT = true;
    }
    // Check ẩn/ hiện tính thuế với loại chi phí Thuế nhà thầu, Credit hãng thuế nhà thầu
    if (data.codeCostType === '10' || data.codeCostType === '11') {
      this.purchaseinvoice.showImportVAT = false;
    } else {
      this.purchaseinvoice.showImportVAT = true;
    }

    // Check loại chi phí vận tải, bảo hiểm
    if (data.codeCostType === '2' || data.codeCostType === '3' || data.codeCostType === '8' || data.codeCostType === '9') {
      this.isCostTypeForShipment = true;
      this.headerItemsTable = this.headerItemsTableCostShipmentOrigin.filter(m => m);
    }

    // Check Loại chi phí Credit note
    if (data.codeCostType === '4' || data.codeCostType === '5' || data.codeCostType === '6') {
      this.isCostTypeCreditNote = true;
      this.headerItemsTable = this.headerItemsTableCreditNoteOrigin.filter(m => m); // tạo mảng mới không binding
    }

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
        data: { ...parent, quantityOrigin: parent.quantity, priceOrigin: parent.price, isFormEdit: true },
        expanded: true,
        children: [],
        leaf: true
      };
      const childItems = itemSourceTemp.filter(x => x.isSubItem && this.quote(x.indexNo).startsWith(this.quote(parent.indexNo)));
      for (const child of childItems) {
        const childNode = {
          data: { ...child, quantityOrigin: child.quantity, priceOrigin: child.price, isFormEdit: true },
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

  public goBack() {
    this.location.back();
    // this.router.navigate([`list`], { relativeTo: this.route.parent });
  }

  public goEdit() {
    this.router.navigate([`../../edit/${this.purchaseinvoice.id}`], { relativeTo: this.route, });
  }

  public goPaymentOrder() {
    if (this.purchaseinvoice.expenseId) {
      // màn hình list
      this.router.navigate([`../../../payment-order/list/${this.purchaseinvoice.id}`], { relativeTo: this.route });
    } else {
      // Form Add
      this.router.navigate([`../../../payment-order/add`],
        {
          relativeTo: this.route,
          queryParams: {
            piId: this.purchaseinvoice.id
          }
        });
    }
  }

  public goPaymentTracking() {
    this.router.navigate([`../../payment-tracking/${this.purchaseinvoice.id}`], { relativeTo: this.route });
  }

  public setAllowRequestImportGoods() {
    let check = false;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.purchaseInvoiceItem.items.length; i++) {
      if (this.purchaseInvoiceItem.items[i]) {
        if (this.purchaseInvoiceItem.items[i].areaType === 1 || this.purchaseInvoiceItem.items[i].areaType === 2) {
          check = true;
        }
      }
    }
    if (check && this.purchaseinvoice.codeCostType === '1') {
      this.allowRequestImportGoods = true;
    }
  }

  public requestImportGoods() {
    if (!this.validateBeforeImportGoods()) {
      return;
    }
    this.dialogRequestImport.onShowDialog();
  }

  private validateBeforeImportGoods(): boolean {
    // tslint:disable-next-line:max-line-length
    if (!this.currentPiId || (this.purchaseinvoice.importStatus && this.purchaseinvoice.importStatus >= 1) || !this.allowRequestImportGoods) {
      return false;
    }
    if (this.purchaseInvoiceItemOrigin.find(item => !item.taxpayer !== null && item.taxpayer !== undefined)) {
      // Thông báo tính thuế
      this.defaultInfoSaveNotification('AF_TAX');
    }
    if (this.purchaseInvoiceItemOrigin.find(item => !item.termAccount && item.itemType === 'SRV')) {
      // Thông báo cập nhật thông tin tài khoản định khoản
      this.defaultInfoSaveNotification('AF_ADMIN');
    }
    for (const item of this.purchaseInvoiceItemOrigin) {
      if (!item.itemCode) {
        this.notificationService.showWarning('VALIDATION.PURCHASE_INVOICE.MSG_002');
        return false;
      }
      if ((!item.subInventory && item.itemType !== 'SRV') ||
        (!item.subInventory && item.itemType === 'SRV' && !item.isUpdateSrv)) {
        this.notificationService.showWarning('VALIDATION.PURCHASE_INVOICE.MSG_008');
        return false;
      }
    }
    return true;
  }

  public defaultInfoSaveNotification(type?: any): void {
    this.notificationData.status = 1;
    this.notificationData.module = 'Request-import-goods';
    const requestImportGoods = { id: this.currentPiId, code: this.purchaseinvoice ? this.purchaseinvoice.code : '' };
    this.notificationData.messageContent = JSON.stringify(requestImportGoods);

    if (type === 'AF_ADMIN') {
      this.notificationData.role = 'AF_ADMIN';
      this.notificationData.description = 'Check thông tin items SRV cập nhật tài khoản định khoản';
    }
    if (type === 'AF_TAX') {
      this.notificationData.role = 'AF_TAX';
      this.notificationData.description = 'Check thông tin hóa đơn, tính thuế nhà thầu';
    }

    if (type === 'AF_INV') {
      this.notificationData.role = 'AF_INV';
      this.notificationData.description = 'Check thông tin hóa đơn, PO và làm nhập hàng hóa đơn';
    }

    const saveSub = this.notificationListService.merge(this.notificationData).subscribe(() => { });
    this.subscriptions.push(saveSub);

  }

  public printPaperImportGoods() {
    this.dialogRequestImport.purchaseInvoiceData.print = true;
    this.dialogRequestImport.onShowDialog();
  }

  public updateStatusImportGoods(event: any): void {
    this.purchaseInvoiceService.selectById(this.currentPiId).subscribe(res => {
      if (res) {
        const dataUpdate: any = {
          ...res,
          importStatus: 1,
          requestImportGoods: true // thuộc tính truyền vào object để đánh dấu đề nghị nhập hàng, không có trong DB
        };
        // Lưu người đề nghị nhập kho là người đăng nhập
        if (event) {
          dataUpdate.warehouseImport = event;
        }
        // Trạng thái tính thuế khác hoàn thành, đổi trạng thái sang AF tính thuế
        if (this.purchaseinvoice.taxStatus !== 4) {
          dataUpdate.taxStatus = 2;
        } else {
          dataUpdate.IsGenerateTaxInvoice = false; // Khônng sinh hoá đơn thuế
        }
        this.purchaseInvoiceService.requestImportGoods(dataUpdate).subscribe(m => {
          this.purchaseinvoice.importStatus = 1;
          this.defaultInfoSaveNotification('AF_INV');
          this.notificationService.showSuccess();
          this.dialogRequestImport.close();
          this.cdr.detectChanges();
        });
      }
    });
  }

}
