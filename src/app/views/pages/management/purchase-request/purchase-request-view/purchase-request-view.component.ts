import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { BaseFormComponent } from '../../../../../core/_base/component/base-form.component';
// tslint:disable-next-line: max-line-length
import { PurchaseRequestItemRequestPayload } from '../../../../../services/modules/purchase-request-item/purchase-request-item.request-payload';
import * as mainConfig from '../../../../../core/_config/main.config';
import { PurchaseRequestService } from '../../../../../services/modules/purchase-request/purchase-request.service';
import { PurchaseRequestItemService } from '../../../../../services/modules/purchase-request-item/purchase-request-item.service';
import { forkJoin } from 'rxjs';
import * as config from '../purchase-request.config';
import * as configEdit from '../purchase-request-edit/purchase-request-edit.config';
import { ContractService } from '../../../../../services/modules/contract/contract.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { BusinessProcessManagementComponent } from '../../../../partials/business-process-management/business-process-management.component';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { currentUser } from '../../../../../core/auth';
import { Location } from '@angular/common';
import { UserService } from '../../../../../services/modules/user/user.service';
import { CustomConfirmation } from '../../../../../services/common/confirmation/custom-confirmation';
import { PurchaseRequestHistoryComponent } from '../purchase-request-history/purchase-request-history.component';
@Component({
  selector: 'app-purchase-request-view',
  templateUrl: './purchase-request-view.component.html',
  styleUrls: ['./purchase-request-view.component.scss']
})
export class PurchaseRequestViewComponent extends BaseFormComponent implements OnInit {
  @ViewChild('bpm', { static: false }) bpm: BusinessProcessManagementComponent;
  @ViewChild('purchaseRequestHistoryComponent', { static: false }) purchaseRequestHistoryComponent: PurchaseRequestHistoryComponent;

  public request: any;
  public mainConfig: any;
  public purchaseRequest: any = {};
  public purchaseRequestItem: any[];
  public contractData: any;
  public totalBom: any = [];
  public prStatus = config.PR_STATUS;
  public prContractInfo = config.PR_CONTRACT_INFO;
  public headeritems: any;
  public prIdCurrent: any;
  public allowViewPrice = false; // check có cả AM và PM thì PM không được xem giá
  public file: any;

  constructor(
    public purchaseRequestService: PurchaseRequestService,
    public purchaseRequestItemService: PurchaseRequestItemService,
    public contractService: ContractService,
    public userService: UserService,
    public translateService: TranslateService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    public notificationService: NotificationService,
    private router: Router,
    private location: Location,
    private store: Store<AppState>
  ) {
    super();
  }

  ngOnInit() {
    const temp = JSON.stringify(configEdit.HEADER);
    this.headeritems = JSON.parse(temp);
    const index = this.headeritems.findIndex(x => x.field === 'action');
    if (index > -1) {
      this.headeritems.splice(index, 1);
    }
    this.mainConfig = mainConfig.MAIN_CONFIG;
    this.request = new PurchaseRequestItemRequestPayload();

    const routeSub = this.route.params.subscribe((params) => {
      if (params.id) {
        this.initData(params.id);
      }
    });
    this.subscriptions.push(routeSub);
  }

  public checkRole() {
    this.store.pipe(select(currentUser)).subscribe(obj => {
      if (obj) {
        const userName = obj.userName ? obj.userName.trim().toLocaleLowerCase() : '';
        const amAccount = this.purchaseRequest.amAccount ? this.purchaseRequest.amAccount.trim().toLocaleLowerCase() : '';
        const pmAccount = this.purchaseRequest.pmAccount ? this.purchaseRequest.pmAccount.trim().toLocaleLowerCase() : '';
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

  public onDlgHide(): void {
    this.resetVariables();
  }

  private resetVariables(): void {
    this.purchaseRequest = null;
    this.purchaseRequestItem = null;
    this.contractData = null;
  }
  /**
   * Initialize data
   */
  public initData(id: string): void {
    // Get purchase plan id from input dialog ref
    this.prIdCurrent = id;
    const requestItem = new PurchaseRequestItemRequestPayload();
    requestItem.prId = this.prIdCurrent;

    this.request.prId = this.prIdCurrent;

    const categorySub = forkJoin([
      // Get purchase plan
      this.purchaseRequestService.selectById(this.prIdCurrent),
      // Get purchase plan item
      this.purchaseRequestItemService.select(requestItem),
      this.purchaseRequestItemService.selectTotalBom(requestItem)
    ]).subscribe(res => {
      if (!res[0]) {
        this.router.navigate([`list`], { relativeTo: this.route.parent });
      }
      this.purchaseRequest = res[0];
      this.checkRole();
      this.totalBom = res[2];
      if (this.purchaseRequest && this.purchaseRequest.prType) {
        if (this.purchaseRequest.prType === 1 || this.purchaseRequest.prType === 2) {
          this.purchaseRequest.prTypeName = this.translateService.instant('PURCHASE_REQUEST.CONTRACT_OUTPUT');
        } else {
          this.purchaseRequest.prTypeName = this.translateService.instant('PURCHASE_REQUEST.INTERNAL_USE');
        }
      }
      this.purchaseRequestItem = res[1];
      this.cdr.detectChanges();
    });
    this.subscriptions.push(categorySub);
  }

  public goBack() {
    this.location.back();
    // this.router.navigate([`list`], { relativeTo: this.route.parent });
  }

  public goEdit() {
    this.router.navigate([`../../edit/${this.purchaseRequest.id}`], { relativeTo: this.route });
  }

  public checkLicensedExport(): void {
    const request = new PurchaseRequestItemRequestPayload();
    request.prId = this.prIdCurrent;
    this.purchaseRequestItemService.exportAll(request).subscribe(() => {
      this.notificationService.showMessage('Export complete');
    });
  }

  public onBtnCreateTicket(): void {
    if (!this.file) {
      this.notificationService.showWarning('Vui lòng đính kèm thông tin hợp đồng !');
      return;
    }
    let showWarning = false;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.purchaseRequestItem.length; i++) {
      const item = this.purchaseRequestItem[i];
      if (item.expectedPrice === null || item.expectedPrice === undefined) {
        this.notificationService.showWarning('Vui lòng cập nhật giá cho tất cả hàng hóa !');
        return;
      }
      if (item.expectedPrice === 0) {
        showWarning = true;
      }
      // if (!item.deliveryLocation === null) {
      //   this.notificationService.showWarning('Vui lòng cập nhật địa điểm nhận hàng !');
      //   return;
      // }
    }
    if (this.bpm) {
      if (showWarning) {
        const confirmation = new CustomConfirmation(`Một số mặt hàng đang có 'Đơn giá dự kiến' bằng 0, bạn có chắc muốn tiếp tục?`);
        confirmation.accept = () => {
          this.bpm.isShowCreateTicketTemplate = true;
          this.cdr.detectChanges();
        };
        this.notificationService.confirm(confirmation);
      } else {
        this.bpm.isShowCreateTicketTemplate = true;
        this.cdr.detectChanges();
      }
    }
  }

  public createTicketSuccess(sproDraftTicketId: number): void {
    if (sproDraftTicketId) {
      this.purchaseRequest.sproDraftTicketId = sproDraftTicketId;
      this.purchaseRequest.sproTicketId = null;
      // assign cho POman được chọn lúc tạo ticket
      // if (this.purchaseRequest.assignUserIdTemp) {
      //   const dataAssignTemp: any = {
      //     ...this.purchaseRequest,
      //     assignUserId: this.purchaseRequest.assignUserIdTemp
      //   };
      //   this.purchaseRequestService.assign(dataAssignTemp).subscribe(m => {
      //     this.purchaseRequest.assignUserId = this.purchaseRequest.assignUserIdTemp;
      //   });
      // }
    }
  }

  public updateStatus(status: number): void {
    this.purchaseRequest.prStatus = status;
    this.purchaseRequestService.merge(this.purchaseRequest).subscribe();
  }

  public changeComboboxSpro(event: any): void {
    // -200 là id của POman của process phê duyệt YCMH trước 6 tuần
    // if (event && event.id === -200) {
    //   if (event.value) {
    //     const requestUser: any = { userName: event.value };
    //     this.userService.select(requestUser).subscribe(m => {
    //       if (m && m.length > 0) {
    //         this.purchaseRequest.assignUserIdTemp = m[0].id;
    //       }
    //     });
    //   } else {
    //     this.purchaseRequest.assignUserIdTemp = null;
    //   }
    // }
  }

  public changeProcessSpro(event: any): void {
    // this.purchaseRequest.assignUserIdTemp = null;
  }

  public onSuccessInitFile(file: any) {
    if (file) {
      this.file = file;
    }
  }

  public viewHistory(): void {
    this.purchaseRequestHistoryComponent.onBtnShowDialogListClick();
    this.cdr.detectChanges();
  }

}
