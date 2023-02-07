import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { BaseComponent } from '../../../../../../core/_base/component/base-component';
import * as mainConfig from '../../../../../../core/_config/main.config';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { ItemService } from '../../../../../../services/modules/category/item/item.service';
import { SupplierService } from '../../../../../../services/modules/category/supplier/supplier.service';
import {
  PurchaseOrderItemRequestPayload
} from '../../../../../../services/modules/purchase-order-item/purchase-order-item.request-payload';
import { PurchaseOrderItemService } from '../../../../../../services/modules/purchase-order-item/purchase-order-item.service';
import { PurchaseOrderRequestPayload } from '../../../../../../services/modules/purchase-order/purchase-order.request-payload';
import { PurchaseOrderService } from '../../../../../../services/modules/purchase-order/purchase-order.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from './purchase-invoice-edit-copy-po.config';

@Component({
  selector: 'app-purchase-invoice-edit-copy-po',
  templateUrl: './purchase-invoice-edit-copy-po.component.html',
  styleUrls: ['./purchase-invoice-edit-copy-po.component.scss']
})
export class PurchaseInvoiceEditCopyPoComponent extends BaseComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  @Input() dialogRef: DialogRef;
  @Input() piId: string;
  @Input() purchaseInvoiceData: any = {};
  @Output() save: EventEmitter<any> = new EventEmitter();
  @Output() success: EventEmitter<any> = new EventEmitter();
  public requestPo: any;
  public requestPoItem = new PurchaseOrderItemRequestPayload();
  public dataSource = {
    items: null,
    paginatorTotal: undefined,
  };
  public loadingId: string;
  public purchaseOrderData: any = [];
  public selectedPurchaseOrderItems: any = [];
  public selectedPurchaseOrderItemsTemp: any = [];
  public cols = config.HEADERS;
  public poTypes = config.PO_TYPES;
  public itemTypes = config.ITEMS_TYPES;
  public poStatus = config.PO_STATUS;
  public mainConfig = mainConfig.MAIN_CONFIG;
  private vendorId: string;
  private poId: string;
  private ouCode: string;
  private areaType: any;
  private taxpayer: any;
  private currency: string;
  private buyInternalUse: boolean;

  constructor(
    public purchaseOrderService: PurchaseOrderService,
    public purchaseOrderItemService: PurchaseOrderItemService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    public supplierService: SupplierService,
    public itemService: ItemService
  ) {
    super();
  }

  ngOnInit() {
    this.requestPo = new PurchaseOrderRequestPayload();
  }

  public loadNodes(event?: any) {
    this.requestPo.pageIndex = event ? event.first / event.rows : 0;
    this.requestPo.pageSize = event ? event.rows : 10;
    const purchaseOrderSub = forkJoin([
      this.purchaseOrderService.selectForInvoice(this.requestPo),
      this.purchaseOrderService.countForInvoice(this.requestPo)
    ]).subscribe(res => {
      this.dataSource.items = [];
      this.dataSource.paginatorTotal = res[1];
      for (const el of res[0]) {
        const node = {
          data: {
            ...el
          },
          leaf: false,
        };
        this.dataSource.items.push(node);
      }
      this.dataSource.items = [...this.dataSource.items];
      this.cdr.detectChanges();
    });
    this.subscriptions.push(purchaseOrderSub);
  }

  public onNodeExpand(event: any): void {
    // Check điều kiện để không expand item cha
    if (event.node.data.indexNo) {
      return;
    }
    const node = event.node;
    this.loadingId = node.data.id;
    // xoa du lieu cu
    node.children = [];
    // tao request moi
    this.requestPoItem.poId = node.data.id;
    this.requestPoItem.piId = this.piId;
    this.requestPoItem.partNo = this.requestPo.partNo;
    this.requestPoItem.itemType = this.requestPo.itemType;
    this.requestPoItem.itemCode = this.requestPo.itemCode;
    this.requestPoItem.itemName = this.requestPo.itemName;

    // call api lay du lieu
    const purchaseOrderItemSub = this.purchaseOrderItemService.selectForInvoice(this.requestPoItem).subscribe(res => {
      if (res && res.length > 0) {
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
      }
    });
    this.subscriptions.push(purchaseOrderItemSub);
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
    const dataPo = [];
    const dataPoItem = [];

    const tempNotParent = this.selectedPurchaseOrderItems.filter(m => !m.parent);
    for (const element of tempNotParent) {
      if (element.data && !this.checkExistsInArray(dataPo, element.data)) {
        dataPo.push(element.data);
      }
      if (element.children && element.children.length > 0) {
        for (let i = 0; i < element.children.length; i++) {
          const children = element.children[i];
          if (!this.checkExistsInArray(dataPoItem, children.data) && children.parent) {
            children.data.projectCode = element.data.projectCode;
            children.data.code = element.data.code;
            children.parent = null;
            if (children.children) {
              for (let j = 0; j < children.children.length; j++) {
                const children2 = children.children[j];
                children2.data.projectCode = element.data.projectCode;
                children2.data.code = element.data.code;
              }
            }
            if (!this.checkExistsInArrayTree(dataPoItem, children)) {
              dataPoItem.push(children);
            }
          }
        }
      }
    }

    const tempHasParent = this.selectedPurchaseOrderItems.filter(m => m.parent);
    for (const element of tempHasParent) {
      let po = null;
      if (element.parent.parent) {
        po = element.parent.parent.data;
      } else {
        po = element.parent.data;
      }
      if (po && !this.checkExistsInArray(dataPo, po)) {
        dataPo.push(po);
      }
      element.data.projectCode = po.projectCode;
      element.data.code = po.code;
      if (element.children) {
        for (let j = 0; j < element.children.length; j++) {
          const children2 = element.children[j];
          children2.data.projectCode = po.projectCode;
          children2.data.code = po.code;
        }
      }
      if (!this.checkExistsInArrayTree(dataPoItem, element)) {
        dataPoItem.push(element);
      }
    }

    // gen indexNo
    for (let i = 0; i < dataPoItem.length; i++) {
      dataPoItem[i].data.indexNo = (i + 1).toString();
      dataPoItem[i].data.amountRemain = this.rounding(dataPoItem[i].data.amountRemain);
      if (dataPoItem[i].children) {
        for (let j = 0; j < dataPoItem[i].children.length; j++) {
          dataPoItem[i].children[j].data.indexNo = (i + 1).toString() + '.' + (j + 1).toString();
          dataPoItem[i].children[j].data.amountRemain = this.rounding(dataPoItem[i].children[j].data.amountRemain);
        }
      }
    }

    this.save.emit({ listParent: dataPo, listChildren: dataPoItem });
    this.dialogRef.hide();
    this.cdr.detectChanges();
  }

  public rounding(value: number): number {
    return (Math.round(value * 100) / 100);
  }

  public onBtnCancelClick(): void {
    this.success.emit();
  }

  public onBtnLoadNodeSearchClick(): void {
    this.loadNodes();
  }


  public onBtnResetSearchClick() {
    this.requestPo = new PurchaseOrderRequestPayload();
  }

  public nodeSelect(event): void {
    let check = true;
    if (!event.node.parent) {
      // xử lý click check all items
      const parentData = event.node.data;
      //
      this.poId = this.poId ? this.poId : parentData.id;
      if (parentData.id && this.poId !== parentData.id) {
        this.notificationService.showWarning('Vui lòng chọn cùng một đơn hàng');
        check = false;
        this.checkSelectItems(check, event);
        return;
      }
      if (this.purchaseInvoiceData.checkVaidatePoId
        && this.purchaseInvoiceData.checkVaidatePoId !== parentData.id) {
        this.notificationService.showWarning('Vui lòng chọn cùng một đơn hàng !!');
        check = false;
        this.checkSelectItems(check, event);
        return;
      }
      //
      this.ouCode = this.ouCode ? this.ouCode : parentData.ouCode;
      if (parentData.ouCode && this.ouCode !== parentData.ouCode) {
        this.notificationService.showWarning('Vui lòng chọn cùng một pháp nhân');
        check = false;
        this.checkSelectItems(check, event);
        return;
      }
      if (this.purchaseInvoiceData.checkVaidateOuCode
        && this.purchaseInvoiceData.checkVaidateOuCode !== parentData.ouCode) {
        this.notificationService.showWarning('Vui lòng chọn cùng một pháp nhân. PO chọn, khác pháp nhân trên hóa đơn !!');
        check = false;
        this.checkSelectItems(check, event);
        return;
      }
      //
      this.vendorId = this.vendorId ? this.vendorId : parentData.vendorId;
      if (parentData.vendorId && this.vendorId !== parentData.vendorId) {
        this.notificationService.showWarning('Vui lòng chọn cùng một nhà cung cấp');
        check = false;
        this.checkSelectItems(check, event);
        return;
      }
      if (this.purchaseInvoiceData.checkVaidateVendorId
        && this.purchaseInvoiceData.checkVaidateVendorId !== parentData.vendorId) {
        this.notificationService.showWarning('Vui lòng chọn cùng một nhà cung cấp. PO chọn, khác nhà cung cấp trên hóa đơn !!');
        check = false;
        this.checkSelectItems(check, event);
        return;
      }
      //
      this.areaType = this.areaType ? this.areaType : parentData.areaType;
      if (parentData.areaType && this.areaType !== parentData.areaType) {
        this.notificationService.showWarning('Vui lòng chọn cùng một hình thức mua hàng');
        check = false;
        this.checkSelectItems(check, event);
        return;
      }
      if (this.purchaseInvoiceData.checkVaidateAreaType
        && this.purchaseInvoiceData.checkVaidateAreaType !== parentData.areaType) {
        this.notificationService.showWarning('Vui lòng chọn cùng hình thức mua hàng. PO chọn, khác hình thức mua hàng trên hóa đơn !!');
        check = false;
        this.checkSelectItems(check, event);
        return;
      }
      //
      if (!this.taxpayer) {
        this.taxpayer = parentData.taxpayer ? parentData.taxpayer : 'undefined';
      }
      if (this.taxpayer !== parentData.taxpayer && !(this.taxpayer === 'undefined' && !parentData.taxpayer)) {
        this.notificationService.showWarning('Vui lòng chọn items cùng một thuế nhà thầu');
        check = false;
        this.checkSelectItems(check, event);
        return;
      }
      if (this.purchaseInvoiceData.checkVaidateTaxpayer
        && this.purchaseInvoiceData.checkVaidateTaxpayer !== parentData.taxpayer
        && !(this.purchaseInvoiceData.checkVaidateTaxpayer === 'undefined' && !parentData.taxpayer)) {
        this.notificationService.showWarning('Vui lòng chọn items cùng một thuế nhà thầu. PO chọn, khác thuế nhà thầu trên hóa đơn !!');
        check = false;
        this.checkSelectItems(check, event);
        return;
      }
      //
      this.currency = this.currency ? this.currency : parentData.currency;
      if (parentData.currency && this.currency !== parentData.currency) {
        this.notificationService.showWarning('Vui lòng chọn items cùng một loại tiền');
        check = false;
        this.checkSelectItems(check, event);
        return;
      }
      if (this.purchaseInvoiceData.checkVaidateCurrency
        && this.purchaseInvoiceData.checkVaidateCurrency !== parentData.currency) {
        this.notificationService.showWarning('Vui lòng chọn items cùng một loại tiền. PO chọn, khác loại tiền trên hóa đơn !!');
        check = false;
        this.checkSelectItems(check, event);
        return;
      }
      //
      this.buyInternalUse = (this.buyInternalUse == true || this.buyInternalUse === false) ? this.buyInternalUse : (parentData.buyInternalUse ? true : false);
      if (this.buyInternalUse !== (parentData.buyInternalUse ? true : false)) {
        this.notificationService.showWarning('Vui lòng chọn cùng phạm vi sử dụng');
        check = false;
        this.checkSelectItems(check, event);
        return;
      }
      if ((this.purchaseInvoiceData.checkVaidateBuyInternalUse === true || this.purchaseInvoiceData.checkVaidateBuyInternalUse === false) && this.purchaseInvoiceData.checkVaidateBuyInternalUse !== (parentData.buyInternalUse ? true : false)) {
        this.notificationService.showWarning('Vui lòng chọn cùng phạm vi sử dụng. PO chọn, khác phạm vi sử dụng trên hóa đơn !!');
        check = false;
        this.checkSelectItems(check, event);
        return;
      }
      this.checkSelectItems(check, event);
    } else {
      // xử lý check 1 items con
      const childrenData = event.node.parent.parent ? event.node.parent.parent : event.node.parent;
      //
      this.poId = this.poId ? this.poId : childrenData.data.id;
      if (childrenData.data.id && this.poId !== childrenData.data.id) {
        this.notificationService.showWarning('Vui lòng chọn cùng một đơn hàng');
        check = false;
        this.checkSelectItems(check);
        return;
      }
      if (this.purchaseInvoiceData.checkVaidatePoId
        && this.purchaseInvoiceData.checkVaidatePoId !== childrenData.data.id) {
        this.notificationService.showWarning('Vui lòng chọn cùng một đơn hàng !!');
        check = false;
        this.checkSelectItems(check);
        return;
      }
      //
      this.ouCode = this.ouCode ? this.ouCode : childrenData.data.ouCode;
      if (childrenData.data.ouCode && this.ouCode !== childrenData.data.ouCode) {
        this.notificationService.showWarning('Vui lòng chọn cùng một pháp nhân');
        check = false;
        this.checkSelectItems(check);
        return;
      }
      if (this.purchaseInvoiceData.checkVaidateOuCode
        && this.purchaseInvoiceData.checkVaidateOuCode !== childrenData.data.ouCode) {
        this.notificationService.showWarning('Vui lòng chọn cùng một pháp nhân. PO chọn, khác pháp nhân trên hóa đơn !!');
        check = false;
        this.checkSelectItems(check);
        return;
      }
      //
      this.vendorId = this.vendorId ? this.vendorId : childrenData.data.vendorId;
      if (childrenData.data.vendorId && this.vendorId !== childrenData.data.vendorId) {
        this.notificationService.showWarning('Vui lòng chọn cùng một nhà cung cấp');
        check = false;
        this.checkSelectItems(check);
        return;
      }
      if (this.purchaseInvoiceData.checkVaidateVendorId
        && this.purchaseInvoiceData.checkVaidateVendorId !== childrenData.data.vendorId) {
        this.notificationService.showWarning('Vui lòng chọn cùng một nhà cung cấp. PO chọn, khác nhà cunng cấp trên hóa đơn !!');
        check = false;
        this.checkSelectItems(check);
        return;
      }
      //
      this.areaType = this.areaType ? this.areaType : childrenData.data.areaType;
      if (childrenData.data.areaType && this.areaType !== childrenData.data.areaType) {
        this.notificationService.showWarning('Vui lòng chọn cùng một hình thức mua hàng');
        check = false;
        this.checkSelectItems(check);
        return;
      }
      if (this.purchaseInvoiceData.checkVaidateAreaType
        && this.purchaseInvoiceData.checkVaidateAreaType !== childrenData.data.areaType) {
        this.notificationService.showWarning('Vui lòng chọn cùng một hình thức mua hàng. PO chọn, khác hình thức mua hàng trên hóa đơn !!');
        check = false;
        this.checkSelectItems(check);
        return;
      }
      //
      if (!this.taxpayer) {
        this.taxpayer = childrenData.data.taxpayer ? childrenData.data.taxpayer : 'undefined';
      }
      if (this.taxpayer !== childrenData.data.taxpayer && !(this.taxpayer === 'undefined' && !childrenData.data.taxpayer)) {
        this.notificationService.showWarning('Vui lòng chọn items cùng một thuế nhà thầu');
        check = false;
        this.checkSelectItems(check);
        return;
      }
      //
      if (this.purchaseInvoiceData.checkVaidateTaxpayer
        && this.purchaseInvoiceData.checkVaidateTaxpayer !== childrenData.data.taxpayer
        && !(this.purchaseInvoiceData.checkVaidateTaxpayer === 'undefined' && !childrenData.data.taxpayer)) {
        this.notificationService.showWarning('Vui lòng chọn items cùng một thuế nhà thầu. PO chọn, khác thuế nhà thầu trên hóa đơn !!');
        check = false;
        this.checkSelectItems(check);
        return;
      }
      //
      this.currency = this.currency ? this.currency : childrenData.data.currency;
      if (childrenData.data.currency && this.currency !== childrenData.data.currency) {
        this.notificationService.showWarning('Vui lòng chọn items cùng một loại tiền');
        check = false;
        this.checkSelectItems(check);
        return;
      }
      if (this.purchaseInvoiceData.checkVaidateCurrency
        && this.purchaseInvoiceData.checkVaidateCurrency !== childrenData.data.currency) {
        this.notificationService.showWarning('Vui lòng chọn items cùng một loại tiền. PO chọn, khác loại tiền trên hóa đơn !!');
        check = false;
        this.checkSelectItems(check);
        return;
      }
      //
      this.buyInternalUse = (this.buyInternalUse === true || this.buyInternalUse === false) ? this.buyInternalUse : (childrenData.buyInternalUse ? true : false);
      if (this.buyInternalUse !== (childrenData.buyInternalUse ? true : false)) {
        this.notificationService.showWarning('Vui lòng chọn cùng phạm vi sử dụng');
        check = false;
        this.checkSelectItems(check);
        return;
      }
      if ((this.purchaseInvoiceData.checkVaidateBuyInternalUse === true || this.purchaseInvoiceData.checkVaidateBuyInternalUse === false) && this.purchaseInvoiceData.checkVaidateBuyInternalUse !== (childrenData.buyInternalUse ? true : false)) {
        this.notificationService.showWarning('Vui lòng chọn cùng phạm vi sử dụng. PO chọn, khác phạm vi sử dụng trên hóa đơn !!');
        check = false;
        this.checkSelectItems(check);
        return;
      }
      this.checkSelectItems(check);
    }
  }

  public checkSelectItems(check: boolean, event?: any): void {
    if (check) {
      this.selectedPurchaseOrderItemsTemp = [...this.selectedPurchaseOrderItems];
    } else {
      this.selectedPurchaseOrderItems = [...this.selectedPurchaseOrderItemsTemp];
    }
    if (this.selectedPurchaseOrderItems.length === 0) {
      this.poId = null;
      this.ouCode = null;
      this.vendorId = null;
      this.areaType = null;
      this.taxpayer = null;
      this.currency = null;
      this.buyInternalUse = null;
    }
    if (event) {
      this.onNodeExpand(event);
    }
    this.cdr.detectChanges();
  }

  public nodeUnselect(event?: any) {
    let checkNotSupplier = false;
    let checkNotAreaType = false;
    let checkNotPoId = false;
    let checkNotOuCode = false;
    let checkTaxpayer = false;
    let checkCurrency = false;
    let checkBuyInternalUse = false;
    this.selectedPurchaseOrderItems.forEach(element => {
      if (!element.parent) {
        if (element.data.poId) {
          checkNotPoId = true;
        }
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
        if (element.data.buyInternalUse) {
          checkBuyInternalUse = true;
        }
      }
      if (element.parent) {
        if (element.parent.parent) {
          if (element.parent.parent.data.poId) {
            checkNotPoId = true;
          }
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
          if (element.parent.parent.data.buyInternalUse) {
            checkBuyInternalUse = true;
          }
        } else {
          if (element.parent.data.poId) {
            checkNotPoId = true;
          }
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
          if (element.parent.data.buyInternalUse) {
            checkBuyInternalUse = true;
          }
        }
      }
    });

    if (this.selectedPurchaseOrderItems.length === 0) {
      this.poId = null;
      this.ouCode = null;
      this.vendorId = null;
      this.areaType = null;
      this.taxpayer = null;
      this.currency = null;
      this.buyInternalUse = null;
    }
    if (!checkNotPoId) {
      this.poId = null;
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
    if (!checkBuyInternalUse) {
      this.buyInternalUse = null;
    }

    this.selectedPurchaseOrderItemsTemp = [...this.selectedPurchaseOrderItems];
  }

  public onChangeItemCode(data: any): void {
    if (data) {
      this.requestPo.itemId = data.itemId;
      this.requestPo.itemCode = data.code;
      this.requestPo.itemName = data.name;
    } else {
      this.requestPo.itemId = null;
      this.requestPo.itemCode = null;
      this.requestPo.itemName = null;
    }
  }

  public onChangeSupplier(data: any): void {
    if (data) {
      this.requestPo.vendorId = data.vendorId;
      this.requestPo.supplierName = data.name;
    } else {
      this.requestPo.vendorId = null;
      this.requestPo.supplierName = null;
    }
  }

  private quote(source: string): string {
    return `.${source}.`;
  }
}
