import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PurchaseInvoiceRequestPayload } from '../../../../../../services/modules/purchase-invoice/purchase-invoice.request-payload';
import { PurchaseInvoiceService } from '../../../../../../services/modules/purchase-invoice/purchase-invoice.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from './shipment-purchase-invoice.config';
import * as mainConfig from '../../../../../../core/_config/main.config';
import {
  PurchaseInvoiceItemRequestPayload
} from '../../../../../../services/modules/purchase-invoice-item/purchase-invoice-item.request-payload';
import { PurchaseInvoiceItemService } from '../../../../../../services/modules/purchase-invoice-item/purchase-invoice-item.service';
import { BaseComponent } from '../../../../../../core/_base/component/base-component';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { Router } from '@angular/router';
import { InvoiceTypeService } from '../../../../../../services/modules/category/invoice-type/invoice-type.service';
import { SupplierService } from '../../../../../../services/modules/category/supplier/supplier.service';
import { UserService } from '../../../../../../services/modules/user/user.service';
import { CurrencyService } from '../../../../../../services/modules/category/currency/currency.service';
import { ItemService } from '../../../../../../services/modules/category/item/item.service';
import { ConfigListFactory } from '../../../../../partials/control/config-list/config-list-control.service';
import { TreeNode } from 'primeng/api';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

@Component({
  selector: 'app-shipment-purchase-invoice',
  templateUrl: './shipment-purchase-invoice.component.html',
  styleUrls: ['./shipment-purchase-invoice.component.scss']
})
export class ShipmentPurchaseInvoiceComponent extends BaseComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  @Input() dialogRef: DialogRef;
  @Input() shipmentData: any = {};
  @Output() save: EventEmitter<any> = new EventEmitter();
  public requestPi: any = {};
  public requestPiItem = new PurchaseInvoiceItemRequestPayload();
  public selectedPurchaseInvoiceItems: any = [];
  public selectedPurchaseInvoiceItemsTemp: any = [];
  public invoiceTypes = config.INVOICE_TYPE;
  public costTypes = config.COST_TYPE;
  public statusInvoices = config.STATUS_INVOICE;
  public statusERPs = config.STATUS_ERP;
  public statusTaxs = config.STATUS_TAX;
  public statusErps = config.STATUS_ERP;
  public itemTypes = config.ITEMS_TYPES;
  public loadingId: string;
  private vendorId: string;
  private ouCode: string;
  private areaType: number;
  private taxpayer: any;
  private currency: string;

  public dataSource = {
    items: null,
    paginatorTotal: undefined,
  };
  public mainConfig = mainConfig.MAIN_CONFIG;
  public headers = config.HEADERS;
  public arrCostTypes = [];

  constructor(
    public purchaseInvoiceService: PurchaseInvoiceService,
    public purchaseInvoiceItemService: PurchaseInvoiceItemService,
    public notificationService: NotificationService,
    public invoiceTypeService: InvoiceTypeService,
    public supplierService: SupplierService,
    public userService: UserService,
    public currencyService: CurrencyService,
    public itemService: ItemService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    super();
    this.requestPi = new PurchaseInvoiceRequestPayload();
  }

  ngOnInit() {
  }

  public loadNodes(event?: any) {
    this.requestPi.pageIndex = event ? event.first / event.rows : 0;
    this.requestPi.pageSize = event ? event.rows : 10;

    const initSub = forkJoin([
      this.purchaseInvoiceService.selectWithoutShipment(this.requestPi),
      this.purchaseInvoiceService.countWithoutShipment(this.requestPi)
    ]).subscribe(res => {
      this.dataSource.items = [];
      this.dataSource.paginatorTotal = res[1];
      if (res[0].length > 0) {
        for (const el of res[0]) {
          const node = {
            data: {
              ...el
            },
            leaf: false,
          };
          this.dataSource.items.push(node);
        }
      }
      this.dataSource.items = [...this.dataSource.items];
      this.cdr.detectChanges();
    });
    this.subscriptions.push(initSub);

    this.initMasterData();
  }

  private initMasterData() {
    this.arrCostTypes = ConfigListFactory.instant('COST_TYPE');
  }

  private quote(source: string): string {
    return `.${source}.`;
  }

  public onNodeExpand(event: any, rowData?: any): void {
    // Check điều kiện để không expand item cha
    if (event.node.data.indexNo) {
      return;
    }

    const node = event.node;
    this.loadingId = node.data.id;
    // xoa du lieu cu
    node.children = [];
    // tao request moi
    this.requestPiItem.piId = node.data.id;

    // call api lay du lieu
    const purchaseOrderItemSub = this.purchaseInvoiceItemService.selectWithoutShipment(this.requestPiItem).subscribe(res => {
      const response = res.sort((a, b) => parseFloat(a.indexNo) - parseFloat(b.indexNo));

      const arr = [];
      let parentItems = response.filter(x => !x.isSubItem);
      const childTemp = response.filter(x => x.isSubItem);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < childTemp.length; i++) {
        let check = false;
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < parentItems.length; j++) {
          if (this.quote(childTemp[i].indexNo).startsWith(this.quote(parentItems[j].indexNo))) {
            check = true;
          }
        }
        if (!check) {
          arr.push(childTemp[i]);
        }
      }
      parentItems = parentItems.concat(arr); // xử lý copy hết số lượng của cha nhưng số lượng của con vẫn còn

      for (const parent of parentItems) {
        const nodeData: TreeNode = {
          data: {
            ...parent
          },
          children: [],
          leaf: true
        };
        // tslint:disable-next-line:max-line-length
        const childItems = response.filter(x => x.isSubItem && x.id !== parent.id && this.quote(x.indexNo).startsWith(this.quote(parent.indexNo)));
        for (const child of childItems) {
          const childNode = {
            data: { ...child },
            leaf: true,
          };

          nodeData.children.push(childNode);
          nodeData.leaf = false;
        }
        node.children.push(nodeData);
      }
      this.dataSource.items = [...this.dataSource.items];
      this.cdr.detectChanges();
    });
    this.subscriptions.push(purchaseOrderItemSub);
  }

  private getCostTypeName(source: any[], value: string): string {
    const item = source.filter(x => x.value === value)[0];
    return item ? item.label : null;
  }

  public nodeSelect(event): void {
    let check = true;
    if (!event.node.parent) {
      const parent = event.node.data;
      //
      if (this.selectedPurchaseInvoiceItemsTemp && this.selectedPurchaseInvoiceItemsTemp.length === 0) {
        this.ouCode = null;
        this.vendorId = null;
        this.areaType = null;
        this.taxpayer = null;
        this.currency = null;
      }
      this.ouCode = !this.ouCode ? parent.ouCode : this.ouCode;
      if (parent.ouCode && this.ouCode !== parent.ouCode) {
        this.notificationService.showWarning('Vui lòng chọn cùng một pháp nhân');
        check = false;
        this.checkSelectItems(check, event);
        return;
      }
      if (this.shipmentData.checkVaidateOuCode && this.shipmentData.checkVaidateOuCode !== parent.ouCode) {
        this.notificationService.showWarning('Vui lòng chọn cùng một pháp nhân. PI chọn, khác pháp nhân trên lô hàng !!');
        check = false;
        this.checkSelectItems(check, event);
        return;
      }
      //
      this.vendorId = !this.vendorId ? parent.vendorId : this.vendorId;
      if (parent.vendorId && this.vendorId !== parent.vendorId) {
        this.notificationService.showWarning('Vui lòng chọn cùng một nhà cung cấp');
        check = false;
        this.checkSelectItems(check, event);
        return;
      }
      // tslint:disable-next-line:max-line-length
      if (this.shipmentData.checkVaidateVendorId && this.shipmentData.checkVaidateVendorId !== parent.vendorId) {
        this.notificationService.showWarning('Vui lòng chọn cùng một nhà cung cấp. PI chọn, khác nhà cung cấp trên lô hàng!!');
        check = false;
        this.checkSelectItems(check, event);
        return;
      }
      //
      this.areaType = !this.areaType ? parent.areaType : this.areaType;
      if (parent.areaType && this.areaType !== parent.areaType) {
        this.notificationService.showWarning('Vui lòng chọn cùng một hình thức mua hàng');
        check = false;
        this.checkSelectItems(check, event);
        return;
      }
      if (this.shipmentData.checkVaidateAreaType && this.shipmentData.checkVaidateAreaType !== parent.areaType) {
        this.notificationService.showWarning('Vui lòng chọn cùng một hình thức mua hàng. PI chọn, khác hình thức mua hàng trên lô hàng!!');
        check = false;
        this.checkSelectItems(check, event);
        return;
      }
      //
      if (!this.taxpayer) {
        this.taxpayer = parent.taxpayer ? parent.taxpayer : 'undefined';
      }
      // if (this.taxpayer !== parent.taxpayer && !(this.taxpayer === 'undefined' && !parent.taxpayer)) {
      //   this.notificationService.showWarning('Vui lòng chọn items cùng một thuế nhà thầu');
      //   check = false;
      //   this.checkSelectItems(check, event);
      //   return;
      // }
      // if (this.shipmentData.checkVaidateTaxpayer && this.shipmentData.checkVaidateTaxpayer !== parent.taxpayer
      //   && !(this.shipmentData.checkVaidateTaxpayer === 'undefined' && !parent.taxpayer)) {
      //   this.notificationService.showWarning('Vui lòng chọn items cùng một thuế nhà thầu. PI chọn, khác thuế nhà thầu trên lô hàng!!');
      //   check = false;
      //   this.checkSelectItems(check, event);
      //   return;
      // }
      //
      this.currency = !this.currency ? parent.currency : this.currency;
      if (parent.currency && this.currency !== parent.currency) {
        this.notificationService.showWarning('Vui lòng chọn items cùng một loại tiền');
        check = false;
        this.checkSelectItems(check, event);
        return;
      }
      if (this.shipmentData.checkVaidateCurrency && this.shipmentData.checkVaidateCurrency !== parent.currency) {
        this.notificationService.showWarning('Vui lòng chọn items cùng một loại tiền. PI chọn, khác loại tiền trên lô hàng!!');
        check = false;
        this.checkSelectItems(check, event);
        return;
      }
      this.checkSelectItems(check, event);
    } else {
      let parent = null;
      if (event.node.parent.parent) {
        parent = event.node.parent.parent.data;
      } else {
        parent = event.node.parent.data;
      }
      //
      this.ouCode = !this.ouCode ? parent.ouCode : this.ouCode;
      if (parent.ouCode && this.ouCode !== parent.ouCode) {
        this.notificationService.showWarning('Vui lòng chọn cùng một pháp nhân');
        check = false;
        this.checkSelectItems(check);
        return;
      }
      if (this.shipmentData.checkVaidateOuCode && this.shipmentData.checkVaidateOuCode !== parent.ouCode) {
        this.notificationService.showWarning('Vui lòng chọn cùng một pháp nhân. PI chọn, khác pháp nhân trên lô hàng !!');
        check = false;
        this.checkSelectItems(check);
        return;
      }
      //
      this.vendorId = !this.vendorId ? parent.vendorId : this.vendorId;
      if (parent.vendorId && this.vendorId !== parent.vendorId) {
        this.notificationService.showWarning('Vui lòng chọn cùng một nhà cung cấp');
        check = false;
        this.checkSelectItems(check);
        return;
      }
      // tslint:disable-next-line:max-line-length
      if (this.shipmentData.checkVaidateVendorId && this.shipmentData.checkVaidateVendorId !== parent.vendorId) {
        this.notificationService.showWarning('Vui lòng chọn cùng một nhà cung cấp. PI chọn, khác nhà cung cấp trên lô hàng!!');
        check = false;
        this.checkSelectItems(check);
        return;
      }
      //
      this.areaType = !this.areaType ? parent.areaType : this.areaType;
      if (parent.areaType && this.areaType !== parent.areaType) {
        this.notificationService.showWarning('Vui lòng chọn cùng một hình thức mua hàng');
        check = false;
        this.checkSelectItems(check);
        return;
      }
      if (this.shipmentData.checkVaidateAreaType && this.shipmentData.checkVaidateAreaType !== parent.areaType) {
        this.notificationService.showWarning('Vui lòng chọn cùng một hình thức mua hàng. PI chọn, khác hình thức mua hàng trên lô hàng !!');
        check = false;
        this.checkSelectItems(check);
        return;
      }
      //
      if (!this.taxpayer) {
        this.taxpayer = parent.taxpayer ? parent.taxpayer : 'undefined';
      }
      if (this.taxpayer !== parent.taxpayer && !(this.taxpayer === 'undefined' && !parent.taxpayer)) {
        this.notificationService.showWarning('Vui lòng chọn items cùng một thuế nhà thầu');
        check = false;
        this.checkSelectItems(check);
        return;
      }
      if (this.shipmentData.checkVaidateTaxpayer && this.shipmentData.checkVaidateTaxpayer !== parent.taxpayer
        && !(this.shipmentData.checkVaidateTaxpayer === 'undefined' && !parent.taxpayer)) {
        this.notificationService.showWarning('Vui lòng chọn items cùng một thuế nhà thầu. PI chọn, khác thuế nhà thầu trên lô hàng !!');
        check = false;
        this.checkSelectItems(check);
        return;
      }
      //
      this.currency = !this.currency ? parent.currency : this.currency;
      if (parent.currency && this.currency !== parent.currency) {
        this.notificationService.showWarning('Vui lòng chọn items cùng một loại tiền');
        check = false;
        this.checkSelectItems(check);
        return;
      }
      if (this.shipmentData.checkVaidateCurrency && this.shipmentData.checkVaidateCurrency !== parent.currency) {
        this.notificationService.showWarning('Vui lòng chọn items cùng một loại tiền. PI chọn, khác loại tiền trên lô hàng !!');
        check = false;
        this.checkSelectItems(check);
        return;
      }
      this.checkSelectItems(check);
    }
  }

  public checkSelectItems(check: boolean, event?: any): void {
    if (check) {
      this.selectedPurchaseInvoiceItemsTemp = [...this.selectedPurchaseInvoiceItems];
    } else {
      this.selectedPurchaseInvoiceItems = [...this.selectedPurchaseInvoiceItemsTemp];
    }
    // if (event) {
    //   this.onNodeExpand(event);
    // }
    this.cdr.detectChanges();
  }

  public nodeUnselect(event?: any) {
    let checkNotSupplier = false;
    let checkNotAreaType = false;
    let checkNotOuCode = false;
    let checkTaxpayer = false;
    let checkCurrency = false;
    this.selectedPurchaseInvoiceItems.forEach(element => {
      if (!element.parent) {
        if (element.data.ouCode) {
          checkNotOuCode = true;
        }
        if (element.data.vendorId) {
          checkNotSupplier = true;
        }
        if (element.data.areaType) {
          checkNotAreaType = true;
        }
        if (element.data.taxpayer) {
          checkTaxpayer = true;
        }
        if (element.data.currency) {
          checkCurrency = true;
        }
      }
      if (element.parent) {
        if (element.parent.parent) {
          if (element.parent.parent.data.ouCode) {
            checkNotOuCode = true;
          }
          if (element.parent.parent.data.vendorId) {
            checkNotSupplier = true;
          }
          if (element.parent.parent.data.areaType) {
            checkNotAreaType = true;
          }
          if (element.parent.parent.data.taxpayer) {
            checkTaxpayer = true;
          }
          if (element.parent.parent.data.currency) {
            checkCurrency = true;
          }
        } else {
          if (element.parent.data.ouCode) {
            checkNotOuCode = true;
          }
          if (element.parent.data.vendorId) {
            checkNotSupplier = true;
          }
          if (element.parent.data.areaType) {
            checkNotAreaType = true;
          }
          if (element.parent.data.taxpayer) {
            checkTaxpayer = true;
          }
          if (element.parent.data.currency) {
            checkCurrency = true;
          }
        }
      }
    });

    if (this.selectedPurchaseInvoiceItems.length === 0) {
      this.ouCode = null;
      this.vendorId = null;
      this.areaType = null;
      this.taxpayer = null;
      this.currency = null;
    }
    if (!checkNotOuCode) {
      this.ouCode = null;
    }
    if (!checkNotSupplier) {
      this.vendorId = null;
    }
    if (!checkNotAreaType) {
      this.areaType = null;
    }
    if (!checkTaxpayer) {
      this.taxpayer = null;
    }
    if (!checkCurrency) {
      this.currency = null;
    }

    this.selectedPurchaseInvoiceItemsTemp = [...this.selectedPurchaseInvoiceItems];
  }

  private checkExistsInArray(arr: any, item: any): boolean {
    for (const obj of arr) {
      if (item.id === obj.id) {
        return true;
      }
    }
    return false;
  }

  private checkExistsInArrayTree(arr: any, item: any): boolean {
    for (const obj of arr) {
      if (item.data.id === obj.data.id) {
        return true;
      }
      if (obj.children) {
        for (const objChildren of obj.children) {
          if (item.data.id === objChildren.data.id) {
            return true;
          }
        }
      }
    }
    return false;
  }

  public onBtnSaveClick(): void {
    if (this.selectedPurchaseInvoiceItems.length === 0) {
      this.dialogRef.hide();
      return;
    }

    const dataPi = [];
    const dataPiItem = [];

    const tempNotParent = this.selectedPurchaseInvoiceItems.filter(m => !m.parent);
    tempNotParent.forEach(element => {
      if (element.data && !this.checkExistsInArray(dataPi, element.data)) {
        dataPi.push(element.data);
      }
      if (element.children && element.children.length > 0) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < element.children.length; i++) {
          const children = element.children[i];
          if (!this.checkExistsInArray(dataPiItem, children.data) && children.parent) {
            children.data.projectCode = element.data.projectCode;
            children.data.piCode = element.data.code;
            if (element.children && element.children.find(x => x.data.code)) {
              children.data.poCode = element.children.find(x => x.data.code).data.code;
            }
            children.parent = null;
            if (children.children) {
              // tslint:disable-next-line:prefer-for-of
              for (let j = 0; j < children.children.length; j++) {
                const children2 = children.children[j];
                children2.data.projectCode = element.data.projectCode;
                children2.data.piCode = element.data.code;
                if (element.children && element.children.find(x => x.data.code)) {
                  children2.data.poCode = element.children.find(x => x.data.code).data.code;
                }
              }
            }
            if (!this.checkExistsInArrayTree(dataPiItem, children)) {
              dataPiItem.push(children);
            }
          }
        }
      }
    });

    const tempHasParent = this.selectedPurchaseInvoiceItems.filter(m => m.parent);
    tempHasParent.forEach(element => {
      let pi = null;
      if (element.parent.parent) {
        pi = element.parent.parent.data;
      } else {
        pi = element.parent.data;
      }
      if (pi && !this.checkExistsInArray(dataPi, pi)) {
        dataPi.push(pi);
      }
      element.data.projectCode = pi.projectCode;
      element.data.poCode = pi.code;
      if (element.children) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < element.children.length; j++) {
          const children2 = element.children[j];
          children2.data.projectCode = pi.projectCode;
          children2.data.poCode = pi.code;
        }
      }
      if (!this.checkExistsInArrayTree(dataPiItem, element)) {
        dataPiItem.push(element);
      }
    });

    // gen indexNo và binding số lượng còn lại
    for (let i = 0; i < dataPiItem.length; i++) {
      dataPiItem[i].data.indexNo = (i + 1).toString();

      if (dataPiItem[i].quantity) {
        dataPiItem[i].piiQuantity = dataPiItem[i].quantity;
      }
      dataPiItem[i].data.quantity = dataPiItem[i].data.quantityRemain;
      dataPiItem[i].data.piiQuantityRemain = dataPiItem[i].data.quantityRemain;
      dataPiItem[i].data.piItemId = dataPiItem[i].data.id;

      if (dataPiItem[i].children) {
        for (let j = 0; j < dataPiItem[i].children.length; j++) {
          dataPiItem[i].children[j].data.indexNo = (i + 1).toString() + '.' + (j + 1).toString();
          if (dataPiItem[i].children[j].data.quantity) {
            dataPiItem[i].children[j].data.piiQuantity = dataPiItem[i].quantity;
          }
          dataPiItem[i].children[j].data.quantity = dataPiItem[i].children[j].data.quantityRemain;
          dataPiItem[i].children[j].data.piiQuantityRemain = dataPiItem[i].children[j].data.quantityRemain;
          dataPiItem[i].children[j].data.piItemId = dataPiItem[i].children[j].data.id;
        }
      }
    }

    this.save.emit({ listParent: dataPi, listChildren: dataPiItem });
    this.dialogRef.hide();
    this.cdr.detectChanges();
  }

  public onChangeItemCode(data: any): void {
    if (data) {
      this.requestPi.itemId = data.itemId;
      this.requestPi.itemCode = data.code;
      this.requestPi.itemName = data.name;
    } else {
      this.requestPi.itemId = null;
      this.requestPi.itemCode = null;
      this.requestPi.itemName = null;
    }
  }

  public onBtnLoadNodeSearchClick(): void {
    this.loadNodes();
  }

  public onBtnResetSearchClick() {
    this.requestPi = new PurchaseInvoiceRequestPayload();
    this.loadNodes();
  }

}
