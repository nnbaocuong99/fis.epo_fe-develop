import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { BaseComponent } from '../../../../../../core/_base/component/base-component';
import * as mainConfig from '../../../../../../core/_config/main.config';
import { CustomConfirmation } from '../../../../../../services/common/confirmation/custom-confirmation';
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
import * as config from './shipment-add-from-po.config';

@Component({
  selector: 'app-shipment-add-from-po',
  templateUrl: './shipment-add-from-po.component.html',
  styleUrls: ['./shipment-add-from-po.component.scss']
})
export class ShipmentAddFromPoComponent extends BaseComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  @Input() dialogRef: DialogRef;
  @Input() piId: string;
  @Input() shipmentItemDataRef: any = [];
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
  public productTypes = config.PO_TYPES;
  public statusErp = config.STATUS_ERP;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public areaTypes = config.PO_TYPES;
  public itemTypes = config.ITEMS_TYPES;
  public poStatus = config.STATUS_PO;
  private vendorId: string;
  private ouCode: string;
  private areaType: number;
  private taxpayer: number;

  constructor(
    public purchaseOrderService: PurchaseOrderService,
    public purchaseOrderItemService: PurchaseOrderItemService,
    private notificationService: NotificationService,
    public supplierService: SupplierService,
    public itemService: ItemService,
    private cdr: ChangeDetectorRef
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

  private quote(source: string): string {
    return `.${source}.`;
  }

  public onNodeExpand(event: any): void {
    const node = event.node;
    this.loadingId = node.data.id;
    // xoa du lieu cu
    node.children = [];
    // tao request moi
    this.requestPoItem.poId = node.data.id;
    this.requestPoItem.piId = this.piId;

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

        if (this.shipmentItemDataRef) {
          if (this.shipmentItemDataRef.length === 0) {
            node.children.push(nodeData);
          } else {
            if (!this.shipmentItemDataRef.find(x => (x.id === nodeData.data.id) || (x.poItemId === nodeData.data.id))) {
              node.children.push(nodeData);
            }
          }
        }

      }
      this.dataSource.items = [...this.dataSource.items];
      this.cdr.detectChanges();
    });
    this.subscriptions.push(purchaseOrderItemSub);
  }

  nodeSelect(event): void {
    let check = true;
    if (!event.node.parent) {
      const parent = event.node.data;
      //
      if (!this.ouCode) {
        this.ouCode = parent.ouCode;
      }
      if (parent.ouCode && this.ouCode !== parent.ouCode) {
        this.notificationService.showWarning('Vui lòng chọn cùng một pháp nhân');
        check = false;
      }
      //
      if (!this.vendorId) {
        this.vendorId = parent.vendorId;
      }
      if (parent.vendorId && this.vendorId !== parent.vendorId) {
        this.notificationService.showWarning('Vui lòng chọn cùng một nhà cung cấp');
        check = false;
      }
      //
      if (!this.areaType) {
        this.areaType = parent.areaType;
      }
      if (parent.areaType && this.areaType !== parent.areaType) {
        this.notificationService.showWarning('Vui lòng chọn cùng một hình thức mua hàng');
        check = false;
      }
      //
      if (!this.taxpayer) {
        this.taxpayer = parent.taxpayer;
      }
      if (parent.taxpayer && this.taxpayer !== parent.taxpayer) {
        this.notificationService.showWarning('Vui lòng chọn items cùng một thuế nhà thầu');
        check = false;
      }
      //
      if (check) {
        this.selectedPurchaseOrderItemsTemp = [...this.selectedPurchaseOrderItems];
      } else {
        this.selectedPurchaseOrderItems = [...this.selectedPurchaseOrderItemsTemp];
      }
      this.onNodeExpand(event);
      this.cdr.detectChanges();
    } else {
      let parent = null;
      if (event.node.parent.parent) {
        parent = event.node.parent.parent.data;
      } else {
        parent = event.node.parent.data;
      }
      //
      if (!this.ouCode) {
        this.ouCode = parent.ouCode;
      }
      if (parent.ouCode && this.ouCode !== parent.ouCode) {
        this.notificationService.showWarning('Vui lòng chọn cùng một pháp nhân');
        check = false;
      }
      //
      if (!this.vendorId) {
        this.vendorId = parent.vendorId;
      }
      if (parent.vendorId && this.vendorId !== parent.vendorId) {
        this.notificationService.showWarning('Vui lòng chọn cùng một nhà cung cấp');
        check = false;
      }
      if (!this.areaType) {
        this.areaType = parent.areaType;
      }
      if (parent.areaType && this.areaType !== parent.areaType) {
        this.notificationService.showWarning('Vui lòng chọn cùng một hình thức mua hàng');
        check = false;
      }
      //
      if (!this.taxpayer) {
        this.taxpayer = parent.taxpayer;
      }
      if (parent.taxpayer && this.taxpayer !== parent.taxpayer) {
        this.notificationService.showWarning('Vui lòng chọn items cùng một thuế nhà thầu');
        check = false;
      }
      //
      if (check) {
        this.selectedPurchaseOrderItemsTemp = [...this.selectedPurchaseOrderItems];
      } else {
        this.selectedPurchaseOrderItems = [...this.selectedPurchaseOrderItemsTemp];
      }
      this.cdr.detectChanges();
    }
  }

  public nodeUnselect(event?: any) {
    let checkNotSupplier = false;
    let checkNotAreaType = false;
    let checkNotOuCode = false;
    let checkTaxpayer = false;
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
        }
      }
    });

    if (this.selectedPurchaseOrderItems.length === 0) {
      this.ouCode = null;
      this.vendorId = null;
      this.areaType = null;
      this.taxpayer = null;
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

    this.selectedPurchaseOrderItemsTemp = [...this.selectedPurchaseOrderItems];
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
            children.data.orgCode = element.data.orgCode;
            children.data.piCode = element.data.piCode;
            children.parent = null;
            if (children.children) {
              // tslint:disable-next-line:prefer-for-of
              for (let j = 0; j < children.children.length; j++) {
                const children2 = children.children[j];
                children2.data.projectCode = element.data.projectCode;
                children2.data.poCode = element.data.code;
                children2.data.orgCode = element.data.orgCode;
                children2.data.piCode = element.data.piCode;
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
      // tslint:disable-next-line:variable-name
      let Po = null;
      if (element.parent.parent) {
        Po = element.parent.parent.data;
      } else {
        Po = element.parent.data;
      }
      if (Po && !this.checkExistsInArray(dataPo, Po)) {
        dataPo.push(Po);
      }
      element.data.projectCode = Po.projectCode;
      element.data.poCode = Po.code;
      if (element.children) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < element.children.length; j++) {
          const children2 = element.children[j];
          children2.data.projectCode = Po.projectCode;
          children2.data.poCode = Po.code;
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

  public onBtnCancelClick(): void {
    this.success.emit();
  }

  public onBtnLoadNodeSearchClick(): void {
    this.loadNodes();
  }

  public onBtnResetSearchClick() {
    this.requestPo = new PurchaseOrderRequestPayload();
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
