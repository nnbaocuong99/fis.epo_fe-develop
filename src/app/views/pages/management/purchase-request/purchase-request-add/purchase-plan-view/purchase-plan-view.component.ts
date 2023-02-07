import { ChangeDetectorRef } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { Guid } from 'guid-typescript';
import { BaseFormComponent } from '../../../../../../core/_base/component/base-form.component';
import { CurrencyService } from '../../../../../../services/modules/category/currency/currency.service';
import { PurchasePlanItemRequestPayload } from '../../../../../../services/modules/purchase-plan-item/purchase-plan-item.request-payload';
import { PurchasePlanItemService } from '../../../../../../services/modules/purchase-plan-item/purchase-plan-item.service';
import { PurchasePlanService } from '../../../../../../services/modules/purchase-plan/purchase-plan.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from './purchase-plan-view.config';
import * as mainConfig from '../../../../../../core/_config/main.config';
import { forkJoin } from 'rxjs';
import { FileRequestPayload } from '../../../../../../services/modules/file/file.request.payload';
import { FileService } from '../../../../../../services/modules/file/file.service';
import { FileDownload } from '../../../../../partials/control/download-file/download-file.component';

@Component({
  selector: 'app-purchase-plan-view',
  templateUrl: './purchase-plan-view.component.html',
  styleUrls: ['./purchase-plan-view.component.scss']
})
export class PurchasePlanViewComponent extends BaseFormComponent implements OnInit {
  @Input() dialogRef: DialogRef;
  public purchasePlan: any;
  public purchasePlanItem: any[];
  public cols = config.HEADER_ITEM;
  public mainConfig: any;
  public key: string;
  public arrCurrency: any;
  public totalBom: any = [];
  public request: any;
  public fileInfo: any = {};

  constructor(
    public purchasePlanService: PurchasePlanService,
    public purchasePlanItemService: PurchasePlanItemService,
    private currencyService: CurrencyService,
    private cdr: ChangeDetectorRef,
    private fileService: FileService,
  ) {
    super();
    this.key = Guid.create().toString();
  }

  ngOnInit() {
    this.mainConfig = mainConfig.MAIN_CONFIG;
    this.request = new PurchasePlanItemRequestPayload();
  }

  public onDlgShow(): void {
    this.initData();
  }

  public onDlgHide(): void {
    this.resetVariables();
    this.dialogRef.invisible();
  }

  private resetVariables(): void {
    this.purchasePlan = null;
    this.purchasePlanItem = null;
    this.arrCurrency = null;
    this.totalBom = [];
  }

  /**
   * Initialize data
   */
  public initData(): void {
    // Get purchase plan id from input dialog ref
    const ppId = this.dialogRef.input;
    const requestItem = new PurchasePlanItemRequestPayload();
    requestItem.ppId = ppId;
    this.request.ppId = ppId;

    const requestFile = new FileRequestPayload();
    requestFile.module = 'Attachment\\PurchasePlan\\' + ppId;

    this.dialogRef.hideMask();

    const categorySub = forkJoin([
      this.purchasePlanService.selectById(ppId),
      this.purchasePlanItemService.select(requestItem),
      this.currencyService.select(),
      this.purchasePlanItemService.selectTotalBom(this.request),
      this.fileService.select(requestFile),
    ]).subscribe((res) => {
      this.purchasePlan = res[0];
      this.purchasePlanItem = res[1];
      this.arrCurrency = res[2].map(item => item.code);
      this.totalBom = res[3];

      if (res[4] && res[4].length > 0) {
        this.fileInfo = res[4][0];
      }

      this.dialogRef.visible();
      this.dialogRef.showMask();
      this.cdr.detectChanges();
    });
    this.subscriptions.push(categorySub);
  }

  public onBtnDownloadClick(): void {
    if (this.fileInfo && this.fileInfo.id) {
      const fileDownload = new FileDownload();
      fileDownload.id = this.fileInfo.id;
      fileDownload.name = this.fileInfo.name;
      this.fileService.download(fileDownload);
    }
  }

}
