import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { BaseFormComponent } from '../../../../../../core/_base/component/base-form.component';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { ShipmentItemRequestPayload } from '../../../../../../services/modules/shipment-item/shipment-item.request-payload';
import { ShipmentItemService } from '../../../../../../services/modules/shipment-item/shipment-item.service';
import { ShipmentService } from '../../../../../../services/modules/shipment/shipment.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from './shipment-item.config';
import * as configPurchasePlanEdit from '../../../purchase-plan/purchase-plan-edit/purchase-plan-edit.config';
import { ItemService } from '../../../../../../services/modules/category/item/item.service';
import { ItemRequestPayload } from '../../../../../../services/modules/category/item/item.request.payload';
import { ConfigListFactory } from '../../../../../partials/control/config-list/config-list-control.service';
import { MapItemCodeTreeComponent } from '../../../../../partials/control/map-item-code-tree/map-item-code-tree.component';
import { MenuItem } from 'primeng/api';
import { MapTermAccountComponent } from '../../../../../partials/control/map-term-account/map-term-account.component';
import { ConfigListRequestPayload } from '../../../../../../services/modules/config-list/config-list.request.payload';
import { forkJoin } from 'rxjs';
import { ConfigListService } from '../../../../../../services/modules/config-list/config-list.service';

@Component({
  selector: 'app-shipment-item',
  templateUrl: './shipment-item.component.html',
  styleUrls: ['./shipment-item.component.scss']
})
export class ShipmentItemComponent extends BaseFormComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('mapItemCode', { static: false }) mapItemCode: MapItemCodeTreeComponent;
  @ViewChild('mapTermAccount', { static: false }) mapTermAccount: MapTermAccountComponent;
  @Input() editTable = true;
  @Input() form: any;
  @Input() selectionMode = false;
  @Output() editRow: EventEmitter<any> = new EventEmitter();

  public dialogRefTermAccount: DialogRef = new DialogRef();
  public dialogRefProjectMilestone: DialogRef = new DialogRef();
  public requestShipmentItem = new ShipmentItemRequestPayload();
  public headerTableItem = [];
  public headerItems = configPurchasePlanEdit.HEADER_ITEMS;
  public itemRequestPayload = new ItemRequestPayload();
  public itemTypes = configPurchasePlanEdit.ITEM_TYPE;

  _shipmentItemData: any;
  get shipmentItemData(): any {
    return this._shipmentItemData;
  }
  @Input() set shipmentItemData(value: any) {
    this._shipmentItemData = value;
    if (this.shipmentItemData && this.shipmentItemData.items.length > 0) {
      this.shipmentItemData.items.map(x => {
        x.data.quantityOrigin = x.data.quantity;
        if (x.children && x.children.length > 0) {
          x.children.map(obj => obj.data.quantityOrigin = obj.data.quantity);
        }
      });
      this.getTotal();
    }
  }

  public quantityTotal = 0;
  public id: string;
  public priceTotal: number;
  public configListDataItemOrigin: any[];
  public isShowDialogRefTermAccount = false;
  public isShowDialogRefProjectMilestone = false;
  public itemSrv: any = {};
  public frozenCols: any[];
  public selectedNode: any;
  public btnItems: MenuItem[] = [
    { label: 'Xóa', icon: 'pi pi-fw pi-times', command: () => this.onBtnDeleteTreeRowClick(this.selectedNode.data) }
  ];

  public selectedShipmentItems: any = [];

  constructor(
    public shipmentService: ShipmentService,
    public shipmentItemService: ShipmentItemService,
    public itemService: ItemService,
    public configListService: ConfigListService,
    private notificationService: NotificationService,
    public cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    // this.configListDataItemOrigin = ConfigListFactory.instant('COUNTRY');
    // this.itemSrv = ConfigListFactory.instant('ITEM')[0];
    this.getDefaultConfig();
    // Xử lý frozenCols table
    const temp = JSON.stringify(config.HEADERS);
    this.headerTableItem = JSON.parse(temp);
    this.frozenCols = this.headerTableItem.slice(0, 7);
    this.headerTableItem.splice(0, 7);
  }

  // Get default config
  public getDefaultConfig(): void {
    const requestCountry: any = { type: 'COUNTRY' };
    const requestItemSrv: any = { type: 'ITEM' };
    const temp = forkJoin([
      this.configListService.select(requestCountry),
      this.configListService.select(requestItemSrv)
    ]).subscribe(res => {
      this.configListDataItemOrigin = res[0].sort(this.sortStringConfigList);
      this.itemSrv = res[1];
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
    this.getTotal();
    this.editRow.emit();
  }

  public onChangeItemOrigin(event: any, rowData: any): void {
    if (event) {
      if (this.checkBindingAllData()) {
        for (const item of this.shipmentItemData.items) {
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

  public checkBindingAllData(): boolean {
    let isBindingAll = true;
    for (const item of this.shipmentItemData.items) {
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

  public onRowEditQuantityInit(rowData: any) {
    const quantityCheck = +rowData.quantityOrigin + (rowData.piiQuantityRemain ? +rowData.piiQuantityRemain : 0);
    if (rowData && this.form && (quantityCheck - rowData.quantity >= 0)) {
      if (rowData.quantity < 0) {
        rowData.quantity = 0;
      }
      this.form.form.markAsDirty();
      this.getTotal();
      this.editRow.emit();
    } else {
      rowData.acceptSave = false;
      this.notificationService.showWarning('Số lượng tạo lô hàng không được lớn hơn số lượng trên hóa đơn, tối đa: ' + quantityCheck);
      this.getTotal();
      this.editRow.emit(rowData.acceptSave);
    }
  }

  // public onBtnDeleteRowClick(rowData: any): void {
  //   const index = this.shipmentItemData.items.indexOf(rowData);
  //   this.shipmentItemData.items.splice(index, 1);
  //   if (rowData && this.form) {
  //     this.form.form.markAsDirty();
  //   }
  //   this.getTotal();
  // }

  public onBtnDeleteTreeRowClick(rowData: any): void {
    this.shipmentItemData.items = this.shipmentItemData.items.filter(m => m.data.id !== rowData.id);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.shipmentItemData.items.length; i++) {
      if (this.shipmentItemData.items[i].children) {
        this.shipmentItemData.items[i].children = this.shipmentItemData.items[i].children.filter(m => m.data.id !== rowData.id);
      }
    }
    if (rowData && this.form) {
      this.form.form.markAsDirty();
    }
    this.editRow.emit(rowData.acceptSave);
    this.getTotal();
  }

  private getTotal(): void {
    if (this.shipmentItemData && this.shipmentItemData.items && this.shipmentItemData.items.length > 0) {
      let total = 0;
      let totalAmount = 0;

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.shipmentItemData.items.length; i++) {
        total += this.shipmentItemData.items[i].data.quantity ? +this.shipmentItemData.items[i].data.quantity : 0;
        if (this.shipmentItemData.items[i].data.quantity && this.shipmentItemData.items[i].data.price) {
          totalAmount += +this.shipmentItemData.items[i].data.quantity * +this.shipmentItemData.items[i].data.price;
        }
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.shipmentItemData.items[i].children.length; j++) {
          total += this.shipmentItemData.items[i].children[j].data.quantity ? +this.shipmentItemData.items[i].children[j].data.quantity : 0;
          if (this.shipmentItemData.items[i].children[j].data.quantity && this.shipmentItemData.items[i].children[j].data.price) {
            // tslint:disable-next-line:max-line-length
            totalAmount += +this.shipmentItemData.items[i].children[j].data.quantity * +this.shipmentItemData.items[i].children[j].data.price;
          }
        }
      }

      this.quantityTotal = total;
      this.priceTotal = totalAmount;
    } else {
      this.quantityTotal = 0;
      this.priceTotal = 0;
    }
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
    if (rowData) {
      this.form.form.markAsDirty();
    }

    this.editRow.emit();
  }

  public onMapItemFromErp(): void {
    this.mapItemCode.dataSource.items = this.shipmentItemData.items;
    this.mapItemCode.onBtnShowDialogListClick();
    this.cdr.detectChanges();
  }

  public changeSourceItem(data: any) {
    this.shipmentItemData.items = data;
    this.editRow.emit('dirty');
  }

  public onChangeisUpdateSrv(rowData: any, event: any) {
    if (rowData && this.form) {
      this.form.form.markAsDirty();
    }
    rowData.isUpdateSrv = event.checked ? 1 : 0;
    if (event.checked) {
      rowData.itemCode = this.itemSrv.code;
      // rowData.itemName = this.itemSrv.name;
      rowData.unit = this.itemSrv.attr1;
      // rowData.note = rowData.itemNameOrigin;
    }
    this.editRow.emit();
  }

  public onShowContextMenu() {
    // todo
  }

  public clickTrTable(rowData: any): void {
    rowData.isShowEditRow = true;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.shipmentItemData.items.length; i++) {
      const item = this.shipmentItemData.items[i];
      if (item.data.indexNo !== rowData.indexNo) {
        item.data.isShowEditRow = false;
      }
      if (item.children && item.children.length > 0) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < item.children.length; j++) {
          const children = item.children[j];
          if (children.data.indexNo !== rowData.indexNo) {
            children.data.isShowEditRow = false;
          }
        }
      }
    }
  }

  public onMapTermAccount(): void {
    if (this.shipmentItemData.items.length > 0) {
      this.mapTermAccount.ouId = this.shipmentItemData.items[0].data.ouCode;
      this.mapTermAccount.onBtnShowDialogListClick();
      this.cdr.detectChanges();
    }
  }

  public changeMapTermAccount(data): void {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.shipmentItemData.items.length; i++) {
      if (!this.shipmentItemData.items[i].data.termAccount && this.shipmentItemData.items[i].data.isUpdateSrv) {
        this.shipmentItemData.items[i].data.termAccount = data;
      }
      if (this.shipmentItemData.items[i].children && this.shipmentItemData.items[i].children.length > 0) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.shipmentItemData.items[i].children.length; j++) {
          if (!this.shipmentItemData.items[i].children[j].data.termAccount && this.shipmentItemData.items[i].children[j].data.isUpdateSrv) {
            this.shipmentItemData.items[i].children[j].data.termAccount = data;
          }
        }
      }
    }
    this.editRow.emit();
  }

}
