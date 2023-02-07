import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BaseListComponent } from '../../../../../../core/_base/component/base-list.component';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { PurchasePlanItemRequestPayload } from '../../../../../../services/modules/purchase-plan-item/purchase-plan-item.request-payload';
import { PurchasePlanItemService } from '../../../../../../services/modules/purchase-plan-item/purchase-plan-item.service';
import { PurchaseRequestService } from '../../../../../../services/modules/purchase-request/purchase-request.service';
import * as parentconfig from '../purchase-request-edit.config';
import * as mainConfig from '../../../../../../core/_config/main.config';
import { forkJoin } from 'rxjs';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import { PurchaseRequestItemService } from '../../../../../../services/modules/purchase-request-item/purchase-request-item.service';
import { DeleteThenInsertRequestDto } from '../../../../../../services/modules/purchase-request-item/purchase-request-item.request-payload';
import { TreeNode } from 'primeng/api';
import { SaveConfirmation } from '../../../../../../services/common/confirmation/save-confirmation';

@Component({
  selector: 'app-purchase-request-edit-item',
  templateUrl: './purchase-request-edit-item.component.html',
  styleUrls: ['./purchase-request-edit-item.component.scss']
})
export class PurchaseRequestEditItemComponent extends BaseListComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  @Input() dialogRef: DialogRef;
  @Input() selectedPurchaseRequestItemRef: any = [];
  @Input() allowViewPrice = false;

  @Output() success: EventEmitter<any> = new EventEmitter();

  public formId: 'purchase-request-item-edit';
  public headers = parentconfig.HEADER.filter(x => x.class !== 'action');
  public mainConfig: any;
  public request: any = {};
  public selectedPurchasePlanItems: any;
  public selectedPurchasePlanItemsClone: any;
  public dataSource = {
    items: null,
    paginatorTotal: undefined,
  };
  public isShowCheckBoxHeader = true;
  public onLoadTable = 1;

  constructor(
    public purchasePlanItemService: PurchasePlanItemService,
    public purchaseRequestItemService: PurchaseRequestItemService,
    public notificationService: NotificationService,
    public purchaseRequestService: PurchaseRequestService,
    public cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.mainConfig = mainConfig.MAIN_CONFIG;
    this.request = new PurchasePlanItemRequestPayload();
  }

  search() {
    alert('search');
  }

  public loadNodes(event?: any): void {
    this.request.pageIndex = event ? event.first / event.rows : 0;
    if (this.onLoadTable !== 1) {
      this.request.pageSize = event ? event.rows : 10;
    }
    this.onLoadTable = 2;
    this.request.ppId = this.dialogRef.input.ppId;

    this.request.isSubItem = null;
    this.request.subIndexNo = null;
    const purchasePlanItemSub = forkJoin([
      this.purchasePlanItemService.select(this.request),
      this.purchasePlanItemService.count(this.request)
    ]).subscribe(res => {
      this.dataSource.items = [];
      this.dataSource.paginatorTotal = res[1];

      const resTemp = res[0];
      // giữ lại một số trường dữ liệu cũ
      for (const element of this.selectedPurchaseRequestItemRef) {
        for (const item of resTemp) {
          if (item.id === element.ppItemId) {
            item.originId = element.id;
            item.quantityRemain = element.quantityRemain;
            item.areaType = element.areaType;
            item.classifyBy = element.classifyBy;
            item.classifyAt = element.classifyAt;
            item.ipoNumber = element.ipoNumber;
          }
        }
      }

      const parentItems = resTemp.filter(x => !x.isSubItem);
      for (const parent of parentItems) {
        const node: TreeNode = {
          data: { ...parent },
          children: [],
          leaf: true
        };
        const childItems = resTemp.filter(x => x.isSubItem && this.quote(x.indexNo).startsWith(this.quote(parent.indexNo)));
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

      if (this.selectedPurchaseRequestItemRef) {
        this.selectedPurchasePlanItems = [];
        this.selectedPurchaseRequestItemRef.forEach(element => {
          for (const item of this.dataSource.items) {
            if (item.data.id === element.ppItemId) {
              item.isDisabled = true;
              this.selectedPurchasePlanItems.push(item);
            }
          }
        });
        if (!this.selectedPurchasePlanItemsClone) {
          this.selectedPurchasePlanItemsClone = [...this.selectedPurchasePlanItems];
        } else {
          this.selectedPurchasePlanItems = [...this.selectedPurchasePlanItemsClone];
        }
      }

      this.dataSource.items = [...this.dataSource.items];
      // Check hide/unhide checkbox header table
      if (this.dataSource.items.find(x => x.data.status !== 0)) {
        this.isShowCheckBoxHeader = false;
      }
      this.cdr.detectChanges();
    });

    this.subscriptions.push(purchasePlanItemSub);
  }

  private quote(source: string): string {
    return `.${source}.`;
  }

  public onBtnSaveClick(): void {
    const saveConfirmation = new SaveConfirmation();
    saveConfirmation.accept = () => {
      const request = new DeleteThenInsertRequestDto();
      this.selectedPurchasePlanItems = [...this.selectedPurchasePlanItemsClone];
      const list = [];
      for (const item of this.selectedPurchasePlanItems) {
        list.push(item.data);
        if (item.children) {
          for (const itemChild of item.children) {
            list.push(itemChild.data);
          }
        }
      }

      request.listInsert = list.map(x => {
        x.ppItemId = x.id;
        x.prId = this.dialogRef.input.prId;
        if (x.originId) {
          x.id = x.originId;
        } else {
          delete x.id;
        }
        return x;
      });

      request.idsDelete = this.selectedPurchaseRequestItemRef.map(x => x.id);
      this.purchaseRequestItemService.deleteThenInsert(request).subscribe((res) => {
        this.notificationService.showSuccess();
        this.dialogRef.hide();
        this.success.emit();
        this.cdr.detectChanges();
      });
    };
    this.notificationService.confirm(saveConfirmation);
  }

  public onBtnCancelClick(): void {
    this.dialogRef.hide();
  }

  public nodeSelect(event: any): void {
    if (event && event.node) {
      if (!this.selectedPurchasePlanItemsClone.find(x => x.data.id === event.node.data.id)) {
        this.selectedPurchasePlanItemsClone.push(event.node);
      }
    }
  }

  public nodeUnselect(event: any): void {
    if (event && event.node) {
      const index = this.selectedPurchasePlanItemsClone.findIndex(x => x.data.id === event.node.data.id);
      if (index > -1) {
        this.selectedPurchasePlanItemsClone.splice(index, 1);
      }
    }
  }
}
