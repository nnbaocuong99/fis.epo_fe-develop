import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { DialogRef } from '../../content/crud/dialog/dialog-ref.model';
import * as config from './map-item-code-tree.config';
import * as mainConfig from '../../../../core/_config/main.config';
import { ItemService } from '../../../../services/modules/category/item/item.service';
import { ItemRequestPayload } from '../../../../services/modules/category/item/item.request.payload';
import { BaseListComponent } from '../../../../core/_base/component/base-list.component';
import { PurchaseOrderItemService } from '../../../../services/modules/purchase-order-item/purchase-order-item.service';
import { SaveConfirmation } from '../../../../services/common/confirmation/save-confirmation';
import { TreeNode } from 'primeng/api/treenode';

@Component({
  selector: 'app-map-item-code-tree',
  templateUrl: './map-item-code-tree.component.html',
  styleUrls: ['./map-item-code-tree.component.scss']
})

export class MapItemCodeTreeComponent extends BaseListComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;

  public header = config.HEADER;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public request = new ItemRequestPayload();
  public dataSource = {
    items: [],
    paginatorTotal: undefined,
  };
  public itemRequestPayload = new ItemRequestPayload();

  public dialogRef: DialogRef = new DialogRef();
  @Input() canSave: false;
  @Output() change: EventEmitter<any> = new EventEmitter();

  public listItem: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
    public itemService: ItemService,
    public purchaseOrderItemService: PurchaseOrderItemService
  ) {
    super();
  }

  ngOnInit() {
  }

  public getListNotTree(): any {
    const arrItemSave = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.dataSource.items.length; i++) {
      // trải phẳng dữ liệu
      const item = this.dataSource.items[i];
      arrItemSave.push(item.data);
      if (item.children && item.children.length > 0) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < item.children.length; j++) {
          const children = item.children[j];
          arrItemSave.push(children.data);
        }
      }
    }
    return arrItemSave;
  }

  private quote(source: string): string {
    return `.${source}.`;
  }

  createItemDataTree() {
    const itemSourceTemp = this.dataSource.items;
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
    this.dataSource.items = [...this.dataSource.items];
  }

  public onBtnShowDialogListClick(): void {
    // phải làm thế này để tránh binding, các cách khác không được
    this.dataSource.items = this.getListNotTree();
    this.createItemDataTree();
    this.cdr.detectChanges();
    this.dialogRef.show();
  }

  public close() {
    this.dialogRef.hide();
  }

  private checkExistsInArray(arr: any, item: any): boolean {
    for (const obj of arr) {
      if (item.id === obj.id) {
        return true;
      }
    }
    return false;
  }

  public getListItemSave(): any {
    const arrItemSave = [];
    for (const item of this.dataSource.items) {
      if (item.children && item.children.length > 0) {
        for (const children of item.children) {
          if (!this.checkExistsInArray(arrItemSave, children.data)) {
            arrItemSave.push(children.data);
          }
        }
      }
      if (!this.checkExistsInArray(arrItemSave, item.data)) {
        arrItemSave.push(item.data);
      }
    }
    return arrItemSave;
  }

  public onBtnSaveClick(): void {
    if (this.canSave) { // PO dùng chỗ nãy
      const saveConfirmation = new SaveConfirmation();
      saveConfirmation.accept = () => {
        this.purchaseOrderItemService
          .bulkMerge(this.getListItemSave())
          .subscribe((res) => {
            this.notificationService.showSuccess();
            this.change.emit();
            this.dialogRef.hide();
          });
      };
      this.notificationService.confirm(saveConfirmation);
    } else { // chỗ này của PI, ShipmentItem
      this.change.emit(this.dataSource.items);
      this.dialogRef.hide();
    }
  }

  public onBtnCancelClick(): void {
    this.dialogRef.hide();
  }

  public onModelChangeItemCode(itemDto: any, rowData: any) {
    if (itemDto && (typeof itemDto === 'object')) {
      if (itemDto.itemId) {
        rowData.itemId = itemDto.itemId;
      }
      if (itemDto.code) {
        rowData.itemCode = itemDto.code;
      }
      if (itemDto.name) {
        rowData.itemName = itemDto.name;
      }
      if (itemDto.unitCode) {
        rowData.unit = itemDto.unitCode;
      }
      if (itemDto.inventoryItemFlag === 'Y') {
        rowData.itemType = 'HW';
      }
    }
  }
}
