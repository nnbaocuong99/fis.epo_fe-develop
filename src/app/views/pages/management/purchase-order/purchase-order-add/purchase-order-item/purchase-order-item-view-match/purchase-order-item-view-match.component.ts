import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DialogRef } from '../../../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from './purchase-order-item-view-match.config';
import * as mainConfig from '../../../../../../../core/_config/main.config';
import {
  PurchaseRequestItemRequestPayload
} from '../../../../../../../services/modules/purchase-request-item/purchase-request-item.request-payload';
import { forkJoin } from 'rxjs';
import { BaseComponent } from '../../../../../../../core/_base/component/base-component';
import { PurchaseRequestService } from '../../../../../../../services/modules/purchase-request/purchase-request.service';
import { PurchaseRequestItemService } from '../../../../../../../services/modules/purchase-request-item/purchase-request-item.service';
import { PurchaseRequestRequestPayload } from '../../../../../../../services/modules/purchase-request/purchase-request.request-payload';
import { PurchaseOrderItemService } from '../../../../../../../services/modules/purchase-order-item/purchase-order-item.service';
import { NotificationService } from '../../../../../../../services/common/notification/notification.service';
import { SaveConfirmation } from '../../../../../../../services/common/confirmation/save-confirmation';

@Component({
  selector: 'app-purchase-order-item-view-match',
  templateUrl: './purchase-order-item-view-match.component.html',
  styleUrls: ['./purchase-order-item-view-match.component.scss']
})
export class PurchaseOrderItemViewMatchComponent extends BaseComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  @Input() dialogRef: DialogRef;
  public headers = config.HEADER_PO;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public request: PurchaseRequestRequestPayload = new PurchaseRequestRequestPayload();
  private requestItem: PurchaseRequestItemRequestPayload = new PurchaseRequestItemRequestPayload();
  public dataSource = {
    items: null,
    paginatorTotal: undefined,
  };
  public cols = config.HEADER_PR;
  public isHidePrItem = false;
  public isHidePoItem = false;
  public loadingId: string;

  constructor(
    private purchaseRequestService: PurchaseRequestService,
    public purchaseRequestItemService: PurchaseRequestItemService,
    private purchaseOrderItemService: PurchaseOrderItemService,
    private cdr: ChangeDetectorRef,
    private notification: NotificationService) {
    super();
  }

  ngOnInit() {
    this.mainConfig = mainConfig.MAIN_CONFIG;
  }

  public loadNodes(event?: any) {
    if (this.dialogRef.input.rowData) {
      this.request.pageIndex = event ? event.first / event.rows : 0;
      this.request.pageSize = event ? event.rows : 10;
      this.request.idViewMatch = this.dialogRef.input.rowData[0].matchedId;
      // areaType = 4 lấy những purchase request có item
      // this.request.areaType = 4;
      const purchaseRequestSub = forkJoin([
        this.purchaseRequestService.select(this.request),
        this.purchaseRequestService.count(this.request),
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
      this.subscriptions.push(purchaseRequestSub);
    }
  }

  public onNodeExpand(event: any): void {
    const node = event.node;
    this.loadingId = node.data.id;
    // xoa du lieu cu
    node.children = [];
    // tao request moi
    this.requestItem.prId = node.data.id;
    this.requestItem.isSubItem = false;
    this.requestItem.matchedId = this.dialogRef.input.rowData[0].matchedId;

    // call api lay du lieu
    const purchaseRequestItemSub = this.purchaseRequestItemService.select(this.requestItem).subscribe(res => {
      for (const item of res) {
        const nodeData = {
          data: {
            ...item
          }
        };
        node.children.push(nodeData);
      }
      this.dataSource.items = [...this.dataSource.items];
      this.cdr.detectChanges();
    });
    this.subscriptions.push(purchaseRequestItemSub);
  }

}
