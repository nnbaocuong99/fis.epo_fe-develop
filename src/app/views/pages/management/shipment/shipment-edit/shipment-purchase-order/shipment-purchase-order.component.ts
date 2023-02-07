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
import * as config from './shipment-purchase-order.config';

@Component({
  selector: 'app-shipment-purchase-order',
  templateUrl: './shipment-purchase-order.component.html',
  styleUrls: ['./shipment-purchase-order.component.scss']
})
export class ShipmentPurchaseOrderComponent extends BaseComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  @Input() dialogRef: DialogRef;
  @Input() piId: string;
  @Input() shipmentData: any = {};
  @Output() save: EventEmitter<any> = new EventEmitter();
  @Output() success: EventEmitter<any> = new EventEmitter();
  public requestPo: any;
  public requestPoItem = new PurchaseOrderItemRequestPayload();
  public dataSource = {
    items: null,
    paginatorTotal: undefined,
  };
  public loadingId: string;
  public selectedPurchaseOrderItems: any = [];
  public selectedPurchaseOrderItemsTemp: any = [];
  public cols = config.HEADERS;
  public areaTypes = config.PO_TYPES;
  public poStatus = config.STATUS_PO;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public itemTypes = config.ITEMS_TYPES;
  private vendorId: string;
  private ouCode: string;
  private areaType: number;
  private taxpayer: any;
  private currency: string;
  constructor(
    public purchaseOrderService: PurchaseOrderService,
    public purchaseOrderItemService: PurchaseOrderItemService,
    private notificationService: NotificationService,
    public itemService: ItemService,
    public supplierService: SupplierService,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.requestPo = new PurchaseOrderRequestPayload();
  }

  private quote(source: string): string {
    return `.${source}.`;
  }

  public loadNodes(event?: any) {
    this.requestPo.pageIndex = event ? event.first / event.rows : 0;
    this.requestPo.pageSize = event ? event.rows : 10;
    const purchaseOrderSub = forkJoin([
      this.purchaseOrderService.selectForShipment(this.requestPo),
      this.purchaseOrderService.countForShipment(this.requestPo)
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
    this.requestPoItem.poId = node.data.id;
    this.requestPoItem.piId = this.piId;
    this.requestPoItem.partNo = this.requestPo.partNo;
    this.requestPoItem.itemType = this.requestPo.itemType;
    this.requestPoItem.itemCode = this.requestPo.itemCode;
    this.requestPoItem.itemName = this.requestPo.itemName;

    // call api lay du lieu
    const purchaseOrderItemSub = this.purchaseOrderItemService.selectForShipment(this.requestPoItem).subscribe(res => {
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

  public nodeSelect(event): void {
    let check = true;
    if (!event.node.parent) {
      const parent = event.node.data;
      //
      if (this.selectedPurchaseOrderItemsTemp && this.selectedPurchaseOrderItemsTemp.length === 0) {
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
        this.notificationService.showWarning('Vui lòng chọn cùng một pháp nhân. PO chọn, khác pháp nhân trên lô hàng !!');
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
      if (this.shipmentData.checkVaidateVendorId && this.shipmentData.checkVaidateVendorId !== parent.vendorId) {
        this.notificationService.showWarning('Vui lòng chọn cùng một nhà cung cấp. PO chọn, khác nhà cung cấp trên lô hàng!!');
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
        this.notificationService.showWarning('Vui lòng chọn cùng một hình thức mua hàng. PO chọn, khác hình thức mua hàng trên lô hàng!!');
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
      //   this.notificationService.showWarning('Vui lòng chọn items cùng một thuế nhà thầu. PO chọn, khác thuế nhà thầu trên lô hàng!!');
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
        this.notificationService.showWarning('Vui lòng chọn items cùng một loại tiền. PO chọn, khác loại tiền trên lô hàng!!');
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
        this.notificationService.showWarning('Vui lòng chọn cùng một pháp nhân. PO chọn, khác pháp nhân trên lô hàng !!');
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
      if (this.shipmentData.checkVaidateVendorId && this.shipmentData.checkVaidateVendorId !== parent.vendorId) {
        this.notificationService.showWarning('Vui lòng chọn cùng một nhà cung cấp. PO chọn, khác nhà cung cấp trên lô hàng!!');
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
        this.notificationService.showWarning('Vui lòng chọn cùng một hình thức mua hàng. PO chọn, khác hình thức mua hàng trên lô hàng !!');
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
        this.notificationService.showWarning('Vui lòng chọn items cùng một thuế nhà thầu. PO chọn, khác thuế nhà thầu trên lô hàng !!');
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
        this.notificationService.showWarning('Vui lòng chọn items cùng một loại tiền. PO chọn, khác loại tiền trên lô hàng !!');
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
    if (event) {
      this.onNodeExpand(event);
    }
    this.cdr.detectChanges();
  }

  public nodeUnselect(event?: any): void {
    let checkNotSupplier = false;
    let checkNotAreaType = false;
    let checkNotOuCode = false;
    let checkTaxpayer = false;
    let checkCurrency = false;
    this.selectedPurchaseOrderItems.forEach(element => {
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

    if (this.selectedPurchaseOrderItems.length === 0) {
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
    this.selectedPurchaseOrderItemsTemp = [...this.selectedPurchaseOrderItems];
  }

  private checkExistsInArray(arr: any, item: any): boolean {
    for (const obj of arr) {
      if (item.id === obj.id && item.piId === obj.piId) {
        return true;
      }
    }
    return false;
  }

  private checkExistsInArrayTree(arr: any, item: any): boolean {
    for (const obj of arr) {
      if (item.data.id === obj.data.id && item.data.piId === obj.data.piId) {
        return true;
      }
      if (obj.children) {
        for (const objChildren of obj.children) {
          if (item.data.id === objChildren.data.id && item.data.piId === objChildren.data.piId) {
            return true;
          }
        }
      }
    }
    return false;
  }

  public onBtnSaveClick(): void {
    if (this.selectedPurchaseOrderItems.length === 0) {
      this.dialogRef.hide();
      return;
    }

    const dataPo = [];
    const dataPoItem = [];

    const tempNotParent = this.selectedPurchaseOrderItems.filter(m => !m.parent);
    tempNotParent.forEach(element => {
      if (element.data && !this.checkExistsInArray(dataPo, element.data)) {
        dataPo.push(element.data);
      }
      if (element.children && element.children.length > 0) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < element.children.length; i++) {
          const children = element.children[i];
          if (!this.checkExistsInArray(dataPoItem, children.data) && children.parent) {
            children.data.projectCode = element.data.projectCode;
            children.data.poCode = element.data.code;
            children.parent = null;
            if (children.children) {
              // tslint:disable-next-line:prefer-for-of
              for (let j = 0; j < children.children.length; j++) {
                const children2 = children.children[j];
                children2.data.projectCode = element.data.projectCode;
                children2.data.poCode = element.data.code;
              }
            }
            if (!this.checkExistsInArrayTree(dataPoItem, children)) {
              dataPoItem.push(children);
            }
          }
        }
      }
    });

    const tempHasParent = this.selectedPurchaseOrderItems.filter(m => m.parent);
    tempHasParent.forEach(element => {
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
      element.data.poCode = po.code;
      if (element.children) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < element.children.length; j++) {
          const children2 = element.children[j];
          children2.data.projectCode = po.projectCode;
          children2.data.poCode = po.code;
        }
      }
      if (!this.checkExistsInArrayTree(dataPoItem, element)) {
        dataPoItem.push(element);
      }
    });

    // gen indexNo và binding số lượng là số lượng trên hoá đơn
    for (let i = 0; i < dataPoItem.length; i++) {
      dataPoItem[i].data.indexNo = (i + 1).toString();
      dataPoItem[i].data.quantity = dataPoItem[i].data.piiQuantityRemain;
      if (dataPoItem[i].children) {
        for (let j = 0; j < dataPoItem[i].children.length; j++) {
          dataPoItem[i].children[j].data.indexNo = (i + 1).toString() + '.' + (j + 1).toString();
          dataPoItem[i].children[j].data.quantity = dataPoItem[i].children[j].data.piiQuantityRemain;
        }
      }
    }

    this.save.emit({ listParent: dataPo, listChildren: dataPoItem });
    this.dialogRef.hide();
    this.cdr.detectChanges();
  }

  public onBtnLoadNodeSearchClick(): void {
    this.loadNodes();
  }

  public onBtnResetSearchClick() {
    this.requestPo = new PurchaseOrderRequestPayload();
  }

  public onBtnCancelClick(): void {
    this.success.emit();
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
      this.requestPo.vendorId = data.code;
      this.requestPo.supplierName = data.name;
    } else {
      this.requestPo.vendorId = null;
      this.requestPo.supplierName = null;
    }
  }
}
