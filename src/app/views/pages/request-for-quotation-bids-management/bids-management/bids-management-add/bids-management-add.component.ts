import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BaseFormComponent } from '../../../../../core/_base/component/base-form.component';
import { SaveConfirmation } from '../../../../../services/common/confirmation/save-confirmation';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import {
  BidsCapacityProfileRequestRequestPayload
} from '../../../../../services/modules/bids-capacity-profile-request/bids-capacity-profile-request.request-payload';
import {
  BidsCapacityProfileRequestService
} from '../../../../../services/modules/bids-capacity-profile-request/bids-capacity-profile-request.service';
import {
  BidsEvaluationCriteriaRequestPayload
} from '../../../../../services/modules/bids-evaluation-criteria/bids-evaluation-criteria.request-payload';
import { BidsEvaluationCriteriaService } from '../../../../../services/modules/bids-evaluation-criteria/bids-evaluation-criteria.service';
import { BidsItemRequestPayload } from '../../../../../services/modules/bids-item/bids-item.request-payload';
import { BidsItemService } from '../../../../../services/modules/bids-item/bids-item.service';
import {
  BidsSupplierProfileRequestPayload
} from '../../../../../services/modules/bids-supplier-profile/bids-supplier-profile.request-payload';
import { BidsSupplierProfileService } from '../../../../../services/modules/bids-supplier-profile/bids-supplier-profile.service';
import {
  BidsTradeConditionsRequestPayload
} from '../../../../../services/modules/bids-trade-conditions/bids-trade-conditions.request-payload';
import { BidsTradeConditionsService } from '../../../../../services/modules/bids-trade-conditions/bids-trade-conditions.service';
import { BidsService } from '../../../../../services/modules/bids/bids.service';
import { SupplierService } from '../../../../../services/modules/category/supplier/supplier.service';
import * as configParent from '../../bids-management/bids-management.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { SupplierSalesService } from '../../../../../services/modules/category/supplier-sales/supplier-sales.service';
import { Guid } from 'guid-typescript';
import {
  BidsManagementViewSupplierProfileComponent
} from '../bids-management-view-supplier-profile/bids-management-view-supplier-profile.component';
import * as _moment from 'moment';
import { Location } from '@angular/common';
@Component({
  selector: 'app-bids-management-add',
  templateUrl: './bids-management-add.component.html',
  styleUrls: ['./bids-management-add.component.scss']
})
export class BidsManagementAddComponent extends BaseFormComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  @ViewChild('bidsManagementViewSupplierProfile', { static: true }) bidsManagementViewSupplierProfile: BidsManagementViewSupplierProfileComponent;

  public mainConfig = mainConfig.MAIN_CONFIG;

  public headerSuppliers = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'SUPPLIER.CODE', field: 'code' },
    { width: '300px', title: 'SUPPLIER.NAME', field: 'name' },
    { width: '100px', title: 'SUPPLIER.TAX_CODE', field: 'taxCode' },
  ];

  public headerSupplierSales = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'Email', field: 'email' }
  ];

  public bidsData: any = {
    listBidsCapacityProfileRequest: [],
    listBidsEvaluationCriteria: [],
    listBidsSupplierProfile: [],
    listBidsTradeConditions: [],
    listBidsItem: [],
    listBidsCapacityProfileRequestDeleteId: [],
    listBidsEvaluationCriteriaDeleteId: [],
    listBidsSupplierProfileDeleteId: [],
    listBidsTradeConditionsDeleteId: [],
    listBidsItemDeleteId: [],
  };

  public arrHeaderBidsCapacityProfileRequest = configParent.BIDS_CAPACITY_PROFILE_REQUEST;
  public arrHeaderBidsEvaluationCriteria = configParent.BIDS_EVALUATION_CRITERIA;
  public arrHeaderSupplierProfile = configParent.SUPPLIER_PROFILE;
  public arrHeaderBidsTradeConditions = configParent.BIDS_TRADE_CONDITIONS;
  public arrHeaderBidsItem = configParent.BIDS_ITEM;

  public arrSupplierProfileStatus = configParent.SUPPLIER_PROFILE_STATUS;

  public addItemBidsCapacityProfileRequest: any = { id: Guid.create().toString().split('-').join('') };
  public addItemBidsEvaluationCriteria: any = { id: Guid.create().toString().split('-').join('') };
  public addItemBidsSupplierProfile: any = { id: Guid.create().toString().split('-').join('') };
  public addItemBidsTradeConditions: any = { id: Guid.create().toString().split('-').join('') };
  public addItemBidsItem: any = { id: Guid.create().toString().split('-').join('') };

  addTag = m => m;

  constructor(
    public cdr: ChangeDetectorRef,
    public router: Router,
    public route: ActivatedRoute,
    public notification: NotificationService,
    public bidsService: BidsService,
    public supplierService: SupplierService,
    public supplierSalesService: SupplierSalesService,
    public bidsCapacityProfileRequestService: BidsCapacityProfileRequestService,
    public bidsSupplierProfileService: BidsSupplierProfileService,
    public bidsTradeConditionsService: BidsTradeConditionsService,
    public bidsEvaluationCriteriaService: BidsEvaluationCriteriaService,
    public bidsItemService: BidsItemService
  ) {
    super();
  }

  ngOnInit() {
    const routeSub = this.route.params.subscribe(params => {
      if (params.id) {

        const requestBidsCapacityProfileRequest: any = new BidsCapacityProfileRequestRequestPayload();
        requestBidsCapacityProfileRequest.bidsId = params.id;

        const requestBidsEvaluationCriteria: any = new BidsEvaluationCriteriaRequestPayload();
        requestBidsEvaluationCriteria.bidsId = params.id;

        const requestBidsSupplierProfile: any = new BidsSupplierProfileRequestPayload();
        requestBidsSupplierProfile.bidsId = params.id;

        const requestBidsTradeConditions: any = new BidsTradeConditionsRequestPayload();
        requestBidsTradeConditions.bidsId = params.id;

        const requestBidsItem: any = new BidsItemRequestPayload();
        requestBidsItem.bidsId = params.id;

        const initSub = forkJoin([
          this.bidsService.selectById(params.id),
          this.bidsCapacityProfileRequestService.select(requestBidsCapacityProfileRequest),
          this.bidsEvaluationCriteriaService.select(requestBidsEvaluationCriteria),
          this.bidsSupplierProfileService.select(requestBidsSupplierProfile),
          this.bidsTradeConditionsService.select(requestBidsTradeConditions),
          this.bidsItemService.select(requestBidsItem)
        ]).subscribe(res => {
          if (res[0]) {
            this.bidsData = res[0];
            this.bidsData.listBidsCapacityProfileRequestDeleteId = [];
            this.bidsData.listBidsEvaluationCriteriaDeleteId = [];
            this.bidsData.listBidsSupplierProfileDeleteId = [];
            this.bidsData.listBidsTradeConditionsDeleteId = [];
            this.bidsData.listBidsItemDeleteId = [];

            this.bidsData.listBidsCapacityProfileRequest = res[1];
            this.bidsData.listBidsEvaluationCriteria = res[2];
            this.bidsData.listBidsSupplierProfile = res[3];
            this.bidsData.listBidsTradeConditions = res[4];
            this.bidsData.listBidsItem = res[5];

            setTimeout(() => {
              this.form.form.markAsPristine();
            }, 0);

          } else {
            this.goBack();
          }
          this.cdr.detectChanges();
        });
        this.subscriptions.push(initSub);
      }
    });
    this.subscriptions.push(routeSub);
  }

  public goBack(): void {
    this.router.navigate([`bids`], { relativeTo: this.route.parent });
  }

  public goToView(): void {
    this.router.navigate([`bids/view/${this.bidsData.id}`], { relativeTo: this.route.parent });
  }

  public onBtnSaveClick(): void {
    if (this.form) {
      if (!this.validateForm(this.form, 'id-form-bids')) {
        this.notification.showWarning('VALIDATION.FORM_VALID');
        return;
      }

      if (this.form.dirty) {
        const saveConfirmation = new SaveConfirmation();
        saveConfirmation.accept = () => {
          const dataSave: any = {
            ...this.bidsData
          };
          this.bidsService.save(dataSave).subscribe(m => {
            if (m) {
              this.bidsData.id = m.id;
              this.form.form.markAsPristine();
              this.notification.showSuccess();
              this.goToView();
            }
          });
        };
        this.notification.confirm(saveConfirmation);
      } else {
        this.goBack();
      }
    } else {
      this.goBack();
    }
  }

  public onBtnCancelClick(): void {
    this.goBack();
  }

  public addNewRowBidsCapacityProfileRequest(): void {
    if (!this.addItemBidsCapacityProfileRequest.name) {
      this.notification.showWarning('Vui lòng nhập đủ thông tin');
      return;
    }
    this.bidsData.listBidsCapacityProfileRequest.push(this.addItemBidsCapacityProfileRequest);
    this.addItemBidsCapacityProfileRequest = { id: Guid.create().toString().split('-').join('') };
    this.cdr.detectChanges();
    this.form.form.markAsDirty();
  }

  public deleteRowBidsCapacityProfileRequest(indexRow: any): void {
    const temp = this.bidsData.listBidsCapacityProfileRequest.find((element, index) => index === indexRow);
    if (temp.id) {
      this.bidsData.listBidsCapacityProfileRequestDeleteId.push(temp.id);
    }
    this.bidsData.listBidsCapacityProfileRequest = this.bidsData.listBidsCapacityProfileRequest.filter((element, index) => index !== indexRow);
    this.form.form.markAsDirty();
  }

  public addNewRowBidsEvaluationCriteria(): void {
    if (!this.addItemBidsEvaluationCriteria.name) {
      this.notification.showWarning('Vui lòng nhập đủ thông tin');
      return;
    }
    this.bidsData.listBidsEvaluationCriteria.push(this.addItemBidsEvaluationCriteria);
    this.addItemBidsEvaluationCriteria = { id: Guid.create().toString().split('-').join('') };
    this.cdr.detectChanges();
    this.form.form.markAsDirty();
  }

  public deleteRowBidsEvaluationCriteria(indexRow: any): void {
    const temp = this.bidsData.listBidsEvaluationCriteria.find((element, index) => index === indexRow);
    if (temp.id) {
      this.bidsData.listBidsEvaluationCriteriaDeleteId.push(temp.id);
    }
    this.bidsData.listBidsEvaluationCriteria = this.bidsData.listBidsEvaluationCriteria.filter((element, index) => index !== indexRow);
    this.form.form.markAsDirty();
  }

  public addNewRowBidsSupplierProfile(): void {
    if (!this.addItemBidsSupplierProfile.supplierId || !this.addItemBidsSupplierProfile.email) {
      this.notification.showWarning('Vui lòng nhập đủ thông tin');
      return;
    }
    if (this.bidsData.listBidsSupplierProfile.some(m => m.supplierId === this.addItemBidsSupplierProfile.supplierId)) {
      this.notification.showWarning('Nhà cung cấp đã tồn tại');
      return;
    }
    this.bidsData.listBidsSupplierProfile.push(this.addItemBidsSupplierProfile);
    this.addItemBidsSupplierProfile = { id: Guid.create().toString().split('-').join('') };
    this.cdr.detectChanges();
    this.form.form.markAsDirty();
  }

  public deleteRowBidsSupplierProfile(indexRow: any): void {
    const temp = this.bidsData.listBidsSupplierProfile.find((element, index) => index === indexRow);
    if (temp.id) {
      this.bidsData.listBidsSupplierProfileDeleteId.push(temp.id);
    }
    this.bidsData.listBidsSupplierProfile = this.bidsData.listBidsSupplierProfile.filter((element, index) => index !== indexRow);
    this.form.form.markAsDirty();
  }

  public addNewRowBidsItem(): void {
    if (!this.addItemBidsItem.itemName || !this.addItemBidsItem.quantity
      || !this.addItemBidsItem.unit || !this.addItemBidsItem.expirationDate) {
      this.notification.showWarning('Vui lòng nhập đủ thông tin');
      return;
    }
    this.bidsData.listBidsItem.push(this.addItemBidsItem);
    this.addItemBidsItem = { id: Guid.create().toString().split('-').join('') };
    this.cdr.detectChanges();
    this.form.form.markAsDirty();
  }

  public deleteRowBidsItem(indexRow: any): void {
    const temp = this.bidsData.listBidsItem.find((element, index) => index === indexRow);
    if (temp.id) {
      this.bidsData.listBidsItemDeleteId.push(temp.id);
    }
    this.bidsData.listBidsItem = this.bidsData.listBidsItem.filter((element, index) => index !== indexRow);
    this.form.form.markAsDirty();
  }

  public onChangeSupplier(event, rowData): void {
    if (event.id) {
      rowData.supplierId = event.id;
      rowData.supplierName = event.name;
      rowData.supplierTaxCode = event.taxCode;
      rowData.email = null;
    } else {
      rowData.supplierId = null;
      rowData.supplierName = null;
      rowData.supplierTaxCode = null;
      rowData.email = null;
      rowData.listEmail = [];
    }
  }

  public onChangeSupplierSales(event, rowData): void {
    if (event.id) {
      rowData.email = event.email;
    } else {
      rowData.email = null;
    }
  }

  public onBtnInvitationClick(statusValue: number): void {
    if (!this.bidsData.id || (this.form && this.form.dirty)) {
      this.notification.showWarning('Vui lòng lưu trước khi thực hiện');
      return;
    }
    const saveConfirmation = new SaveConfirmation();
    saveConfirmation.accept = () => {
      this.bidsService.selectById(this.bidsData.id).subscribe(res => {
        const dataSave: any = {
          ...res,
          status: statusValue
        };
        this.bidsService.invitation(dataSave).subscribe(() => {
          this.notification.showSuccess();
          this.bidsData.status = statusValue;
          this.cdr.detectChanges();
        });
      });
    };
    this.notification.confirm(saveConfirmation);
  }

  public onBtnNotificationDeadlineForSubmissionExtendClick(statusValue: number): void {
    if (this.form) {
      if (!this.validateForm(this.form, 'id-form-bids')) {
        this.notification.showWarning('VALIDATION.FORM_VALID');
        return;
      }

      if (this.form.dirty) {
        const saveConfirmation = new SaveConfirmation();
        saveConfirmation.accept = () => {
          const dataSave: any = {
            ...this.bidsData
          };
          this.bidsService.notificationDeadlineForSubmissionExtend(dataSave).subscribe(m => {
            if (m) {
              this.bidsData.id = m.id;
              this.form.form.markAsPristine();
              this.notification.showSuccess();
              this.ngOnInit();
            }
          });
        };
        this.notification.confirm(saveConfirmation);
      }
    }
  }

  public checkDeadlineForSubmissionExtend() {
    if (this.bidsData.deadlineForSubmission && this.bidsData.deadlineForSubmissionExtend) {
      const a = _moment(new Date(this.bidsData.deadlineForSubmission.toString()), 'yyyy-MM-dd').toDate();
      const b = _moment(new Date(this.bidsData.deadlineForSubmissionExtend.toString()), 'yyyy-MM-dd').toDate();
      if (this.compareDate(a, b) >= 0) {
        this.notification.showWarning(`Ngày 'Gia hạn thời gian nộp hồ sơ thầu' phải lớn hơn ngày 'Hạn nộp hồ sơ thầu'`);
        this.form.form.controls[`deadlineForSubmission`].setErrors({ INVALID: true });
        this.form.form.controls[`deadlineForSubmissionExtend`].setErrors({ INVALID: true });
      } else {
        this.form.form.controls[`deadlineForSubmission`].setErrors(null);
        this.form.form.controls[`deadlineForSubmissionExtend`].setErrors(null);
      }
    }
  }

  public compareDate(date1: Date, date2: Date): number {
    date1.setHours(0);
    date1.setMinutes(0);
    date1.setSeconds(0);
    date1.setMilliseconds(0);
    date2.setHours(0);
    date2.setMinutes(0);
    date2.setSeconds(0);
    date2.setMilliseconds(0);
    if (_moment(date1).isAfter(date2)) {
      return 1;
    }
    if (_moment(date1).isSame(date2)) {
      return 0;
    }
    if (_moment(date1).isBefore(date2)) {
      return -1;
    }
  }

  public viewSupplierProfile(rowData) {
    this.bidsManagementViewSupplierProfile.showDialog(this.bidsData.id, rowData.supplierId);
  }
}
