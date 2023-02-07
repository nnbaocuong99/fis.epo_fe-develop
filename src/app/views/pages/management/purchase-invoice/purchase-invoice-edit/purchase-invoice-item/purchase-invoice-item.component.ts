import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { SubInventoryService } from '../../../../../../services/modules/category/sub-inventory/sub-inventory.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from './purchase-invoice-item.config';
import * as configParent from '../purchase-invoice-edit.config';
import * as configPurchasePlanEdit from '../../../purchase-plan/purchase-plan-edit/purchase-plan-edit.config';
import { ItemService } from '../../../../../../services/modules/category/item/item.service';
import { ItemRequestPayload } from '../../../../../../services/modules/category/item/item.request.payload';
import * as configPurchaseOrderAdd from '../../../purchase-order/purchase-order-add/purchase-order-add.config';
import { OrganizationService } from '../../../../../../services/modules/category/organization-management/organization/organization.service';
import {
  OrganizationRequestPayload
} from '../../../../../../services/modules/category/organization-management/organization/organization.request.payload';
import { BaseFormComponent } from '../../../../../../core/_base/component';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { TaxCodeRequestPayload } from '../../../../../../services/modules/category/tax-code/tax-code.request.payload';
import { TaxCodeService } from '../../../../../../services/modules/category/tax-code/tax-code.service';
import { MapItemCodeComponent } from '../../../../../partials/control/map-item-code/map-item-code.component';
import { ActivatedRoute } from '@angular/router';
import { ConfigListRequestPayload } from '../../../../../../services/modules/config-list/config-list.request.payload';
import { ConfigListService } from '../../../../../../services/modules/config-list/config-list.service';
import { NgForm } from '@angular/forms';
import { ConfigListFactory } from '../../../../../partials/control/config-list/config-list-control.service';
import { MenuItem } from 'primeng/api';
import { MapTermAccountComponent } from '../../../../../partials/control/map-term-account/map-term-account.component';
import { forkJoin } from 'rxjs';
import { InputInvoiceInformationService } from '../../../../../../services/modules/category/input-invoice-information/input-invoice-information.service';

@Component({
  selector: 'app-purchase-invoice-item',
  templateUrl: './purchase-invoice-item.component.html',
  styleUrls: ['./purchase-invoice-item.component.scss']
})
export class PurchaseInvoiceItemComponent extends BaseFormComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('mapItemCode', { static: false }) mapItemCode: MapItemCodeComponent;
  @ViewChild('mapTermAccount', { static: false }) mapTermAccount: MapTermAccountComponent;
  @ViewChild('formPii', { static: false }) formPii: NgForm;

  @Input() form: any;
  @Input() piId: any;
  @Input() editTable: boolean;
  @Input() totalWithTax = 0;
  @Input() headerItemsTable: [];
  @Input() isShowTreeTable: boolean;
  @Input() isCostTypeCredit: boolean;
  @Input() isCostTypeCreditNote: boolean;
  @Input() isCostTypeForShipment: boolean;
  @Input() showTreeTableCheckbox = false;

  @Output() editRow: EventEmitter<any> = new EventEmitter();

  _headerItemsTreeTable: any[];
  get headerItemsTreeTable(): any[] {
    return this._headerItemsTreeTable;
  }
  @Input() set headerItemsTreeTable(data: any[]) {
    this._headerItemsTreeTable = data;
    if (this.headerItemsTreeTable && this.headerItemsTreeTable.length > 0) {
      // Xử lý frozenCols table
      const temp = JSON.stringify(this.headerItemsTreeTable);
      this.header = JSON.parse(temp);
      this.frozenCols = this.header.slice(0, 6);
      this.header.splice(0, 6);
    }
  }

  _purchaseInvoiceItemsData: any;
  get purchaseInvoiceItemsData(): any {
    return this._purchaseInvoiceItemsData;
  }
  @Input() set purchaseInvoiceItemsData(value: any) {
    this._purchaseInvoiceItemsData = value;
    // loại chi phí là Thuế VAT NK thì binding control tax trên line hàng default là IPVAT 10%-HHNK
    if (this.purchaseInvoiceData && this.purchaseInvoiceData.taxId) {
      if (this.purchaseInvoiceData.taxId !== 'null' && this.taxCodeData.find(x => x.id === this.purchaseInvoiceData.taxId)) {
        this.addItem.tax = this.taxCodeData.find(x => x.id === this.purchaseInvoiceData.taxId).name;
      } else {
        this.addItem.tax = null;
      }
    }
    if (this.purchaseInvoiceItemsData && this.purchaseInvoiceItemsData.items.length === 0) {
      this.quantityTotal = 0;
      this.quantitySuggestTotal = 0;
      this.moneyTotal = 0;
      this.totalWithTax = 0;
    }
  }

  _purchaseInvoiceData: any;
  get purchaseInvoiceData(): any {
    return this._purchaseInvoiceData;
  }
  @Input() set purchaseInvoiceData(data: any) {
    this._purchaseInvoiceData = data;
    if (this.purchaseInvoiceData && this.purchaseInvoiceData.code) {
      // Hóa đơn thuế nhà thầu
      if (this.purchaseInvoiceData.code.search('/Tax') > -1) {
        this.contractorTaxInvoice = true;
      }
    }
  }

  public dialogRefTermAccount: DialogRef = new DialogRef();
  public dialogRefProjectMilestone: DialogRef = new DialogRef();
  public organizationRequestPayload = new OrganizationRequestPayload();
  public itemRequestPayload = new ItemRequestPayload();
  public taxCodeRequestPayload = new TaxCodeRequestPayload();
  public header: any[];
  public taxPayers = config.TAX_PAYER;
  public headerItems = configPurchasePlanEdit.HEADER_ITEMS;
  public columnSubInventory = configParent.SUB_INVENTORY;
  public itemTypes = configPurchasePlanEdit.ITEM_TYPE;
  public headerOrg = configPurchaseOrderAdd.HEADER_ORG;
  public headerTaxCode = config.HEADER_TAX_CODE;
  public isShowDialogRefTermAccount = false;
  public isShowDialogRefProjectMilestone = false;
  public contractorTaxInvoice = false;
  public priceTotal = 0;
  public quantityTotal = 0;
  public quantitySuggestTotal = 0;
  public moneyTotal = 0;
  public taxCodeData: any[];
  public listFilter = [
    'projectCode', 'code', 'itemCode', 'partNo', 'itemName', 'itemType', 'note',
    'unit', 'quantity', 'quantitySuggest', 'price', 'itemOrigin', 'delivery',
    'tax', 'taxpayer', 'orgCode', 'subInventory', 'termAccount', 'projectMilestone'
  ];
  public itemSrv: any = {};
  public addItem: any = {
    quantity: 1
  };
  public validateFields = config.VALIDATE_FIELD;
  public paramId: string;
  public listCostType = [];
  public frozenCols: any[];
  public configListDataItemOrigin: any[];
  public selectedNode: any;
  public btnItems: MenuItem[] = [
    { label: 'Xóa', icon: 'pi pi-fw pi-times', command: () => this.onBtnDeleteTreeRowClick(this.selectedNode.data) }
  ];
  public currentRow: any = {};
  public selectedPurchaseInvoiceItems: any = [];
  public listInvoiceTypeOnList = [];

  constructor(
    private cdr: ChangeDetectorRef,
    public subInventoryService: SubInventoryService,
    public itemService: ItemService,
    public organizationService: OrganizationService,
    private notificationService: NotificationService,
    public taxCodeService: TaxCodeService,
    private activatedRoute: ActivatedRoute,
    public configListService: ConfigListService,
    public inputInvoiceInformationService: InputInvoiceInformationService
  ) {
    super();
  }

  ngOnInit() {
    this.getDefaultConfig();
    const routeSub = this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.paramId = params.id;
      }
    });
    this.subscriptions.push(routeSub);
  }

  // Get default config
  public getDefaultConfig(): void {
    const requestCountry: any = { type: 'COUNTRY' };
    const requestItemSrv: any = { type: 'ITEM' };
    const temp = forkJoin([
      this.configListService.select(requestCountry),
      this.configListService.select(requestItemSrv),
      this.inputInvoiceInformationService.select(),
    ]).subscribe(res => {
      this.configListDataItemOrigin = res[0].sort(this.sortStringConfigList);
      this.itemSrv = res[1][0];
      this.listInvoiceTypeOnList = res[2] ? res[2] : null;
      this.cdr.detectChanges();
    });
    this.subscriptions.push(temp);
  }

  public sortStringConfigList(a, b) {
    const str1 = a.name ? a.name : '';
    const str2 = b.name ? b.name : '';
    if (str1 < str2) { return -1; }
    if (str1 > str2) { return 1; }
    return 0;
  }

  public onRowEditInit(rowData: any) {
    if (rowData && this.form) {
      this.form.form.markAsDirty();
    }
    this.getTotalItems();
    this.editRow.emit();
  }

  public checkBindingAllData(): boolean {
    let isBindingAll = true;
    for (const item of this.purchaseInvoiceItemsData.items) {
      if (item.data.itemOrigin) {
        isBindingAll = false;
      }
      for (const chil of item.children) {
        if (chil.data.itemOrigin) {
          isBindingAll = false;
          break;
        }
      }
      if (isBindingAll === false) {
        break;
      }
    }
    return isBindingAll;
  }

  public onChangeItemOrigin(event: any, rowData: any): void {
    if (event) {
      if (this.checkBindingAllData()) {
        for (const item of this.purchaseInvoiceItemsData.items) {
          item.data.itemOrigin = event.name;
          for (const chil of item.children) {
            chil.data.itemOrigin = event.name;
          }
        }
      } else {
        rowData.itemOrigin = event.name;
      }
    } else {
      rowData.itemOrigin = null;
    }
    this.onRowEditInit(rowData);
  }

  public onChangeisUpdateSrv(rowData: any, event: any) {
    if (rowData && this.form) {
      this.form.form.markAsDirty();
    }
    rowData.isUpdateSrv = event.checked ? 1 : 0;
    if (event.checked) {
      rowData.itemCode = this.itemSrv.code;
      rowData.unit = this.itemSrv.attr1;
    }
    this.editRow.emit();
  }

  public onChangeRowEditInitQuatity(rowData: any) {
    rowData.amount = rowData.quantity * rowData.price ? rowData.quantity * rowData.price : null;
    const quantityCheck = +rowData.quantityOrigin + +(rowData.poiQuantityRemain ? rowData.poiQuantityRemain : 0);
    if (this.form && this.paramId && quantityCheck - rowData.quantity >= 0 || !rowData.poiQuantity
      // Trường hợp copy từ PO
      || (rowData.quantity <= rowData.quantityRemain && !this.paramId)) {
      rowData.acceptSave = true;
      if (rowData.quantity < 0) {
        rowData.quantity = 0;
      }
      this.form.form.markAsDirty();
      this.calculateAmount(rowData);
      this.getTotalItems();
      this.editRow.emit(rowData.acceptSave);
    } else {
      rowData.acceptSave = false;
      this.notificationService.showWarning('Số lượng tạo HĐ không được lớn hơn số lượng còn lại trên PO, tối đa: ' + quantityCheck);
      this.calculateAmount(rowData);
      this.getTotalItems();
      this.editRow.emit(rowData.acceptSave);
    }
  }

  public onModelChangePriceWithCreditNote(addItem: any) {
    if (this.isCostTypeCredit) {
      if (addItem.price > -1) {
        addItem.price = -1;
      }
    }
    this.calculateAmount(addItem);
    this.getTotalItems();
  }

  public onModelChangePrice(event: any, rowData: any): void {
    if (rowData && this.form) {
      this.form.form.markAsDirty();
    }
    if (event) {
      if (this.isCostTypeCredit) {
        if (rowData.price > -1) {
          rowData.price = -1;
        }
        this.calculateAmount(rowData);
      } else {
        // xử lý cho 2 TH thay đổi ở table và treeTable
        rowData.price = event.target ? +event.target.value : +event;
        this.editRow.emit(true);
        this.calculateAmount(rowData);
        if (rowData.amount > rowData.amountRemain) {
          rowData.acceptSave = false;
          this.editRow.emit(false);
          this.notificationService.showWarning('Giá trị tạo HĐ không được lớn hơn giá trị chưa xuất HĐ ' + rowData.amountRemain);
        }
      }
      this.getTotalItems();
    }
  }

  public onModelChangeTotalAmount(event: any): void {
    if (event) {
      this.purchaseInvoiceData.totalAmount = event.target ? +event.target.value : +event;
      this.purchaseInvoiceData.isShowTotalAmountControl = false;
    }
    if (this.form) {
      this.form.form.markAsDirty();
    }
  }

  public onBtnDeleteRowClick(rowData: any): void {
    const index = this.purchaseInvoiceItemsData.items.indexOf(rowData);
    this.purchaseInvoiceItemsData.items.splice(index, 1);
    if (rowData && this.form) {
      this.form.form.markAsDirty();
    }
    this.editRow.emit(rowData.acceptSave);
    this.getTotalItems();
  }

  public onBtnDeleteTreeRowClick(rowData: any): void {
    this.purchaseInvoiceItemsData.items = this.purchaseInvoiceItemsData.items.filter(m => m.data.id !== rowData.id);
    for (let i = 0; i < this.purchaseInvoiceItemsData.items.length; i++) {
      if (this.purchaseInvoiceItemsData.items[i].children) {
        this.purchaseInvoiceItemsData.items[i].children = this.purchaseInvoiceItemsData.items[i].children.filter(m => m.data.id !== rowData.id);
      }
    }
    if (rowData && this.form) {
      this.form.form.markAsDirty();
    }
    this.editRow.emit(rowData.acceptSave);
    this.getTotalItems();
  }

  public getTotalItems(): void {
    if (this.purchaseInvoiceItemsData) {
      if (this.purchaseInvoiceItemsData.items && this.purchaseInvoiceItemsData.items.length > 0 && this.taxCodeData) {
        let quantityTotal = 0;
        let quantitySuggestTotal = 0;
        let moneyTotal = 0;
        let totalWithTax = 0;
        if (this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '1')) {
          for (let i = 0; i < this.purchaseInvoiceItemsData.items.length; i++) {
            // xủ lý items cha
            const item = this.purchaseInvoiceItemsData.items[i];
            quantityTotal += +item.data.quantity ? +item.data.quantity : 0;
            quantitySuggestTotal += +item.data.quantitySuggest ? +item.data.quantitySuggest : 0;
            moneyTotal += +item.data.amount ? +item.data.amount : 0;
            totalWithTax += +item.data.taxAmount ? +item.data.taxAmount : 0;
            // xủ lý items cha
            if (item.children) {
              for (let j = 0; j < item.children.length; j++) {
                const children = item.children[j];
                quantityTotal += +children.data.quantity ? +children.data.quantity : 0;
                quantitySuggestTotal += +children.data.quantitySuggest ? +children.data.quantitySuggest : 0;
                moneyTotal += +children.data.amount ? +children.data.amount : 0;
                totalWithTax += +children.data.taxAmount ? +children.data.taxAmount : 0;
              }
            }
          }
        } else {
          for (const item of this.purchaseInvoiceItemsData.items) {
            item.amount = item.quantity * item.price ? item.quantity * item.price : null;
            quantityTotal += +item.quantity ? +item.quantity : 0;
            quantitySuggestTotal += +item.quantitySuggest ? +item.quantitySuggest : 0;
            item.amount = item.amount ? +item.amount : +item.price;
            moneyTotal += +item.amount ? +item.amount : 0;
            totalWithTax += +item.taxAmount ? +item.taxAmount : 0;
          }
        }

        this.quantityTotal = quantityTotal;
        this.quantitySuggestTotal = quantitySuggestTotal;
        this.moneyTotal = moneyTotal;
        this.totalWithTax = totalWithTax;
        if (!this.contractorTaxInvoice) {
          // Cập nhật lại tổng tiền ở hoá đơn
          this.purchaseInvoiceData.totalAmount = this.moneyTotal;
        }
      } else {
        this.quantityTotal = 0;
        this.quantitySuggestTotal = 0;
        this.moneyTotal = 0;
        this.totalWithTax = 0;
      }
    }
  }

  public rounding(value: number): number {
    return (Math.round(value * 100) / 100);
  }

  public onChangeSubInventoryCode(subInventoryDto: any, rowData: any) {
    if (subInventoryDto) {
      for (let i = 0; i < this.purchaseInvoiceItemsData.items.length; i++) {
        if (this.purchaseInvoiceItemsData.items[i].orgCode === rowData.orgCode) {
          rowData.subInventory = subInventoryDto.code;
          rowData.subInventoryName = subInventoryDto.name;
        }
      }
    }
    if (rowData && this.form) {
      this.form.form.markAsDirty();
    }
    this.getTotalItems();
    this.editRow.emit();
  }

  public onChangeSubInventoryCodeTree(subInventoryDto: any, rowData: any) {
    if (subInventoryDto && (typeof subInventoryDto === 'object')) {
      for (let i = 0; i < this.purchaseInvoiceItemsData.items.length; i++) {
        if (this.purchaseInvoiceItemsData.items[i].data.orgCode === rowData.orgCode) {
          this.purchaseInvoiceItemsData.items[i].data.subInventory = this.purchaseInvoiceItemsData.items[i].data.subInventory && typeof this.purchaseInvoiceItemsData.items[i].data.subInventory !== 'object' ? this.purchaseInvoiceItemsData.items[i].data.subInventory : subInventoryDto.code;
          this.purchaseInvoiceItemsData.items[i].data.subInventoryName = this.purchaseInvoiceItemsData.items[i].data.subInventoryName && typeof this.purchaseInvoiceItemsData.items[i].data.subInventoryName !== 'object' ? this.purchaseInvoiceItemsData.items[i].data.subInventoryName : subInventoryDto.name;
        }
        if (this.purchaseInvoiceItemsData.items[i].children && this.purchaseInvoiceItemsData.items[i].children.length > 0) {
          for (let j = 0; j < this.purchaseInvoiceItemsData.items[i].children.length; j++) {
            if (this.purchaseInvoiceItemsData.items[i].children[j].data.orgCode === rowData.orgCode) {
              this.purchaseInvoiceItemsData.items[i].children[j].data.subInventory = this.purchaseInvoiceItemsData.items[i].children[j].data.subInventory && typeof this.purchaseInvoiceItemsData.items[i].children[j].data.subInventory !== 'object' ? this.purchaseInvoiceItemsData.items[i].children[j].data.subInventory : subInventoryDto.code;
              this.purchaseInvoiceItemsData.items[i].children[j].data.subInventoryName = this.purchaseInvoiceItemsData.items[i].children[j].data.subInventoryName && typeof this.purchaseInvoiceItemsData.items[i].children[j].data.subInventoryName !== 'object' ? this.purchaseInvoiceItemsData.items[i].children[j].data.subInventoryName : subInventoryDto.name;
            }
          }
        }
      }
      rowData.subInventory = subInventoryDto.code;
      rowData.subInventoryName = subInventoryDto.name;
    }
    if (rowData && this.form) {
      this.form.form.markAsDirty();
    }
    this.getTotalItems();
    this.editRow.emit();
  }

  public onChangeItemCode(itemsCodeDto: any, rowData: any) {
    if (itemsCodeDto) {
      if (itemsCodeDto.itemId) {
        rowData.itemId = itemsCodeDto.itemId;
      }
      if (itemsCodeDto.code) {
        rowData.itemCode = itemsCodeDto.code;
      }
      if (itemsCodeDto.name) {
        rowData.itemName = itemsCodeDto.name;
      }
      if (itemsCodeDto.unitCode) {
        rowData.unit = itemsCodeDto.unitCode;
      }
      if (itemsCodeDto.inventoryItemFlag === 'Y') {
        rowData.itemType = 'HW';
      }
    }
    if (rowData && this.form) {
      this.form.form.markAsDirty();
    }
    this.editRow.emit();
  }

  public onMapItemFromErp(): void {
    this.mapItemCode.dataSource.items = this.purchaseInvoiceItemsData.items;
    this.mapItemCode.onBtnShowDialogListClick();
    this.cdr.detectChanges();
  }

  public onMapTermAccount(): void {
    this.mapTermAccount.onBtnShowDialogListClick();
    this.cdr.detectChanges();
  }

  public onChangeTax(event?: any, rowData?: any) {
    if (event.name) {
      rowData.tax = event.name;
    } else {
      rowData.tax = null;
    }
    this.calculateAmount(rowData);

    if (rowData && this.form) {
      this.form.form.markAsDirty();
    }
    this.getTotalItems();
    this.editRow.emit();
  }

  public onChangeTaxAmount(rowData?: any) {
    if (rowData.taxAmount) {
      rowData.taxAmount = this.rounding(rowData.taxAmount);
      this.onRowEditInit(rowData);
    }
  }

  public calculateAmount(rowData) {
    if (rowData.tax) {
      const taxCode = this.taxCodeData.find(m => m.name === rowData.tax);
      rowData.taxValue = taxCode ? taxCode.taxValue : null;
    } else {
      rowData.taxValue = null;
    }
    if (rowData.quantity && rowData.price) {
      rowData.amount = rowData.quantity * rowData.price;
      if (rowData.taxValue) {
        rowData.taxAmount = this.rounding(rowData.amount * rowData.taxValue / 100);
      } else {
        rowData.taxAmount = null;
      }
    }
  }

  public changeSourceItem(data: any) {
    this.purchaseInvoiceItemsData.items = data;
    this.editRow.emit('dirty');
  }

  public onChangeAmount(rowData: any): void {
    if (rowData.amount >= rowData.amountRemain) {
      rowData.acceptSave = false;
      this.notificationService.showWarning('Giá trị tạo HĐ không được lớn hơn giá trị chưa xuất HĐ ' + rowData.amountRemain);
    }
    this.getTotalItems();
    this.editRow.emit(rowData.acceptSave);
  }

  public onSaveTermAccount(rowData: any): void {
    if (!this.purchaseInvoiceData.id && rowData.isUpdateSrv) {
      this.purchaseInvoiceItemsData.items.map(x => {
        if (!x.termAccount && x.isUpdateSrv) {
          x.termAccount = rowData.termAccount;
        }
        return x;
      });
    }
  }

  public onSaveProjectMilestone(rowData: any): void {
    if (!this.purchaseInvoiceData.id && rowData.isUpdateSrv) {
      this.purchaseInvoiceItemsData.items.map(x => {
        if (!x.projectMilestone && x.isUpdateSrv) {
          x.projectMilestone = rowData.projectMilestone;
        }
        return x;
      });
    }
  }

  public addNewRow(): void {
    if (this.validateNewRow()) {
      if (this.addItem) {
        if (this.piId) {
          this.addItem.piId = this.piId;
        }

        if (!this.addItem.amount) {
          this.addItem.amount = this.addItem.quantity * this.addItem.price ? this.addItem.quantity * this.addItem.price : null;
        }

        if (this.purchaseInvoiceItemsData.items && this.purchaseInvoiceItemsData.items.length > 0) {
          this.purchaseInvoiceItemsData.items = this.purchaseInvoiceItemsData.items.concat(this.addItem);

        } else {
          this.purchaseInvoiceItemsData.items.push(this.addItem);
        }
        this.getTotalItems();
      }
      this.cdr.detectChanges();
      this.addItem = { quantity: 1 };
    }
    this.form.form.markAsDirty();
    this.editRow.emit();
  }

  public validateNewRow(): boolean {
    let result = true;
    for (const item of this.validateFields) {
      if (item.validateValue.some(x => x === this.addItem[item.field])) {
        this.notificationService.showMessage(item.message);
        result = false;
        break;
      }
    }
    return result;
  }

  private getCostTypeName(source: any[], code: string): string {
    const item = source.filter(x => x.code === code)[0];
    return item ? item.name : null;
  }

  public onShowContextMenu() {
    // todo
  }

  public onRowEditClick(rowData): void {
    if (this.currentRow) {
      if (this.currentRow.indexNo !== rowData.indexNo) {
        // check parent
        if (this.purchaseInvoiceItemsData.items.find(x => x.data.indexNo === this.currentRow.indexNo)) {
          this.purchaseInvoiceItemsData.items.find(x => x.data.indexNo === this.currentRow.indexNo).data.isShowEditRow = false;
        } else {
          // check children
          this.purchaseInvoiceItemsData.items.find(x => {
            if (x.children && x.children.length > 0) {
              x.children.find(chi => {
                if (chi.data.indexNo === this.currentRow.indexNo && chi.data.isShowEditRow) {
                  chi.data.isShowEditRow = false;
                }
              });
              return x;
            }
          });
        }
      }
    }
    rowData.isShowEditRow = true;
    this.currentRow = JSON.parse(JSON.stringify(rowData));
    this.cdr.detectChanges();
  }

  public changeMapTermAccount(data): void {
    if (this.purchaseInvoiceData && this.isShowTreeTable) {
      for (let i = 0; i < this.purchaseInvoiceItemsData.items.length; i++) {
        if (!this.purchaseInvoiceItemsData.items[i].data.termAccount && this.purchaseInvoiceItemsData.items[i].data.isUpdateSrv) {
          this.purchaseInvoiceItemsData.items[i].data.termAccount = data;
        }
        if (this.purchaseInvoiceItemsData.items[i].children && this.purchaseInvoiceItemsData.items[i].children.length > 0) {
          for (let j = 0; j < this.purchaseInvoiceItemsData.items[i].children.length; j++) {
            if (!this.purchaseInvoiceItemsData.items[i].children[j].data.termAccount && this.purchaseInvoiceItemsData.items[i].children[j].data.isUpdateSrv) {
              this.purchaseInvoiceItemsData.items[i].children[j].data.termAccount = data;
            }
          }
        }
      }
      this.editRow.emit();
    }
  }

  public getInvoiceTypeOnListName(source: any[], flexValue: string): string {
    const item = source.filter(x => x.flexValue === flexValue)[0];
    return item ? item.description : null;
  }

}
