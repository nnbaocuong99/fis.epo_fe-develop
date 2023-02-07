import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PurchasePlanService } from '../../../../../services/modules/purchase-plan/purchase-plan.service';
import * as mainConfig from '../../../../../core/_config/main.config';
import * as parentConfig from '../purchase-plan.config';
import { forkJoin } from 'rxjs';
import { CurrencyService } from '../../../../../services/modules/category/currency/currency.service';
import { BaseFormComponent } from '../../../../../core/_base/component/base-form.component';
import { FileDownload } from '../../../../partials/control/download-file/download-file.component';
import { FileRequestPayload } from '../../../../../services/modules/file/file.request.payload';
import { FileService } from '../../../../../services/modules/file/file.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessProcessManagementComponent } from '../../../../partials/business-process-management/business-process-management.component';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { PurchasePlanItemComponent } from '../purchase-plan-edit/purchase-plan-item/purchase-plan-item.component';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { currentUser } from '../../../../../core/auth';
import { PurchasePlanHistoryComponent } from '../purchase-plan-history/purchase-plan-history.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-purchase-plan-view',
  templateUrl: './purchase-plan-view.component.html',
  styleUrls: ['./purchase-plan-view.component.scss']
})
export class PurchasePlanViewComponent extends BaseFormComponent implements OnInit {
  @ViewChild('bpm', { static: false }) bpm: BusinessProcessManagementComponent;
  @ViewChild('purchasePlanItem', { static: false }) purchasePlanItem: PurchasePlanItemComponent;
  @ViewChild('purchasePlanHistory', { static: false }) purchasePlanHistory: PurchasePlanHistoryComponent;

  public purchasePlan: any = {};
  public ppStatus = parentConfig.PP_STATUS;
  public mainConfig: any;
  public arrCurrency: any;
  public request: any;
  public file: any;
  public allowViewPrice = false; // check có cả AM và PM thì PM không được xem giá

  constructor(
    public purchasePlanService: PurchasePlanService,
    private currencyService: CurrencyService,
    private fileService: FileService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private notificationService: NotificationService,
    private store: Store<AppState>
  ) {
    super();
  }

  public checkRole() {
    this.store.pipe(select(currentUser)).subscribe(obj => {
      if (obj) {
        const userName = obj.userName ? obj.userName.trim().toLocaleLowerCase() : '';
        const amAccount = this.purchasePlan.amAccount ? this.purchasePlan.amAccount.trim().toLocaleLowerCase() : '';
        const pmAccount = this.purchasePlan.pmAccount ? this.purchasePlan.pmAccount.trim().toLocaleLowerCase() : '';
        if (`,${pmAccount},`.includes(`,${userName},`)) {
          this.allowViewPrice = false;
        }
        if (`,${amAccount},`.includes(`,${userName},`)) {
          this.allowViewPrice = true;
        }
        if (obj.roles && obj.roles.length > 0) {
          if (obj.roles.some(m => m.includes('BP_') || m.includes('XNK_') || m.includes('AF_') || m === 'SUPER_ADMIN')) {
            this.allowViewPrice = true;
          }
        }
      }
    });
  }

  ngOnInit() {
    this.mainConfig = mainConfig.MAIN_CONFIG;
    const routeSub = this.route.params.subscribe((params) => {
      if (params.id) {
        this.initData(params.id);
      }
    });
    this.subscriptions.push(routeSub);
  }

  /**
   * Initialize data
   */
  public initData(id: string): void {
    // Get purchase plan id from input dialog ref
    const ppId = id;
    const requestFile = new FileRequestPayload();
    requestFile.module = 'Attachment\\PurchasePlan\\' + ppId;

    const categorySub = forkJoin([
      this.purchasePlanService.selectById(ppId),
      this.currencyService.select(),
      this.fileService.select(requestFile),
    ]).subscribe(res => {
      if (!res[0]) {
        this.router.navigate([`list`], { relativeTo: this.route.parent });
      }
      this.purchasePlan = res[0];
      this.checkRole();
      this.arrCurrency = res[1].map(item => item.code);

      if (res[2] && res[2].length > 0) {
        this.file = res[2][0];
      }

      this.cdr.detectChanges();
    });
    this.subscriptions.push(categorySub);
  }

  public onBtnDownloadClick(): void {
    if (this.file && this.file.id) {
      const fileDownload = new FileDownload();
      fileDownload.id = this.file.id;
      fileDownload.name = this.file.name;
      this.fileService.download(fileDownload);
    }
  }

  public goBack() {
    this.location.back();
    // this.router.navigate([`list`], { relativeTo: this.route.parent });
  }

  public goEdit() {
    this.router.navigate([`../../edit/${this.purchasePlan.id}`], { relativeTo: this.route });
  }

  public onBtnCreateTicket(): void {
    if (!this.file) {
      this.notificationService.showWarning('Vui lòng đính kèm thông tin hợp đồng.');
      return;
    }
    if (this.bpm) {
      this.bpm.isShowCreateTicketTemplate = true;
    }
  }

  public createTicketSuccess(sproDraftTicketId: number): void {
    if (sproDraftTicketId) {
      this.purchasePlan.sproDraftTicketId = sproDraftTicketId;
      this.purchasePlan.sproTicketId = null;
    }
  }

  public updateStatus(status: number): void {
    this.purchasePlan.status = status;
    this.purchasePlanService.merge(this.purchasePlan).subscribe();
  }

  public viewHistory(): void {
    this.purchasePlanHistory.onBtnShowDialogListClick();
    this.cdr.detectChanges();
  }

}
