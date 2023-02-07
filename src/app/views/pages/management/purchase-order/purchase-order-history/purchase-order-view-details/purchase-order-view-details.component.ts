import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { BaseComponent } from '../../../../../../core/_base/component/base-component';
import {
  PurchaseOrderHistoryService
} from '../../../../../../services/modules/purchase-order-history/purchase-order-history.service';
import {
  PurchaseOrderItemHistoryService
} from '../../../../../../services/modules/purchase-order-item-history/purchase-order-item-history.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from './purchase-order-view-details.config';
import * as mainConfig from '../../../../../../core/_config/main.config';
import * as configParent from '../purchase-order-history.config';

@Component({
  selector: 'app-purchase-order-view-details',
  templateUrl: './purchase-order-view-details.component.html',
  styleUrls: ['./purchase-order-view-details.component.scss']
})
export class PurchaseOrderViewDetailsComponent extends BaseComponent implements OnInit {
  public dialogRef: DialogRef = new DialogRef();

  public purchaseOrderHistory: any;
  public isInternal = true;
  public isShowTableItem = false;
  public productTypes = config.PRODUCT_TYPES;
  public valueTypes = config.VALUE_TYPES;
  public areaTypeInternal = config.AREA_TYPE_INTERNAL;
  public areaTypeExternal = config.AREA_TYPE_EXTERNAL;
  public areaTypes = config.AREA_TYPE_INTERNAL;
  public taxPayers = config.TAX_PAYERS;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public arrBuyInternalUse = configParent.BUY_INTERNAL_USE;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    public purchaseOrderHistoryService: PurchaseOrderHistoryService,
    public purchaseOrderItemHistoryService: PurchaseOrderItemHistoryService
  ) {
    super();
  }

  ngOnInit() {
  }

  public onShowDialogClick(id: string): void {
    this.initData(id);
    this.dialogRef.show();
    this.cdr.detectChanges();
  }

  public initData(id: string): void {
    const categorySub = forkJoin([
      this.purchaseOrderHistoryService.selectById(id)
    ]).subscribe((res) => {
      this.purchaseOrderHistory = res[0];
      if (this.purchaseOrderHistory.areaType === 3 || this.purchaseOrderHistory.areaType === 4) {
        this.areaTypes = this.areaTypeExternal;
        this.isInternal = false;
        this.isShowTableItem = true;
      } else {
        this.areaTypes = this.areaTypeInternal;
        this.isInternal = true;
        this.isShowTableItem = true;
      }
      this.cdr.detectChanges();
    });
    this.subscriptions.push(categorySub);
  }

  public close() {
    this.dialogRef.hide();
    this.isShowTableItem = false;
  }

}
