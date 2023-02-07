import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BaseFormComponent } from '../../../../../core/_base/component/base-form.component';
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
import * as config from './bids-management-view-supplier-profile.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { AppState } from '../../../../../core/reducers';
import { BidsRequestPayload } from '../../../../../services/modules/bids/bids.request-payload';
import { DialogRef } from '../../../../partials/content/crud/dialog/dialog-ref.model';

@Component({
  selector: 'app-bids-management-view-supplier-profile',
  templateUrl: './bids-management-view-supplier-profile.component.html',
  styleUrls: ['./bids-management-view-supplier-profile.component.scss']
})
export class BidsManagementViewSupplierProfileComponent extends BaseFormComponent implements OnInit {

  public dialogRef: DialogRef = new DialogRef();

  public mainConfig = mainConfig.MAIN_CONFIG;

  public bidsData: any = {
    listBidsCapacityProfileRequest: [],
    listBidsEvaluationCriteria: [],
    listBidsSupplierProfile: [],
    listBidsTradeConditions: [],
    listBidsItem: [],
  };

  public arrHeaderBidsCapacityProfileRequest = config.BIDS_CAPACITY_PROFILE_REQUEST;
  public arrHeaderBidsEvaluationCriteria = config.BIDS_EVALUATION_CRITERIA;
  public arrHeaderSupplierProfile = config.SUPPLIER_PROFILE;
  public arrHeaderSupplierProfileViewAll = config.SUPPLIER_PROFILE_VIEW_ALL;
  public arrHeaderBidsTradeConditions = config.BIDS_TRADE_CONDITIONS;
  public arrHeaderBidsItem = config.BIDS_ITEM;

  public arrSupplierProfileStatus = config.SUPPLIER_PROFILE_STATUS;
  public arrBidsItemStatus = config.BIDS_ITEM_STATUS;

  public bidsId: string;
  public supplierId: string;
  public bidsSupplierProfileData: any = {};
  public listBidsSupplierProfileViewAll: any = [];

  constructor(
    public cdr: ChangeDetectorRef,
    public router: Router,
    public route: ActivatedRoute,
    public notification: NotificationService,
    public bidsService: BidsService,
    public supplierService: SupplierService,
    public bidsCapacityProfileRequestService: BidsCapacityProfileRequestService,
    public bidsSupplierProfileService: BidsSupplierProfileService,
    public bidsTradeConditionsService: BidsTradeConditionsService,
    public bidsEvaluationCriteriaService: BidsEvaluationCriteriaService,
    public bidsItemService: BidsItemService) {
    super();
  }

  ngOnInit() {
    this.bidsData = {
      listBidsCapacityProfileRequest: [],
      listBidsEvaluationCriteria: [],
      listBidsSupplierProfile: [],
      listBidsTradeConditions: [],
      listBidsItem: [],
    };
    this.bidsSupplierProfileData = {};
    this.arrHeaderBidsCapacityProfileRequest = this.arrHeaderBidsCapacityProfileRequest.filter((m, index) => index !== 2);
    this.arrHeaderBidsEvaluationCriteria = this.arrHeaderBidsEvaluationCriteria.filter((m, index) => index !== 2);
    this.arrHeaderSupplierProfile = this.arrHeaderSupplierProfile.filter((m, index) => index !== 3);
    this.arrHeaderBidsTradeConditions = this.arrHeaderBidsTradeConditions.filter((m, index) => index !== 3);
    this.arrHeaderBidsItem = this.arrHeaderBidsItem.filter((m, index) => index !== 20);
    this.cdr.detectChanges();
  }

  public initData(): void {
    const requestBidsCapacityProfileRequest: any = new BidsCapacityProfileRequestRequestPayload();
    requestBidsCapacityProfileRequest.bidsId = this.bidsId;
    requestBidsCapacityProfileRequest.supplierSite = true;

    const requestBidsEvaluationCriteria: any = new BidsEvaluationCriteriaRequestPayload();
    requestBidsEvaluationCriteria.bidsId = this.bidsId;

    const requestBidsSupplierProfile: any = new BidsSupplierProfileRequestPayload();
    requestBidsSupplierProfile.bidsId = this.bidsId;
    requestBidsSupplierProfile.supplierId = this.supplierId;
    requestBidsSupplierProfile.supplierSite = true;

    const requestBidsTradeConditions: any = new BidsTradeConditionsRequestPayload();
    requestBidsTradeConditions.bidsId = this.bidsId;
    requestBidsTradeConditions.supplierId = this.supplierId;

    const requestBidsItem: any = new BidsItemRequestPayload();
    requestBidsItem.bidsId = this.bidsId;
    requestBidsItem.supplierId = this.supplierId;
    requestBidsItem.supplierSite = true;

    const requestBids: any = new BidsRequestPayload();
    requestBids.id = this.bidsId;

    const initSub = forkJoin([
      this.bidsService.selectById(this.bidsId),
      this.bidsCapacityProfileRequestService.select(requestBidsCapacityProfileRequest),
      this.bidsEvaluationCriteriaService.select(requestBidsEvaluationCriteria),
      this.bidsSupplierProfileService.select(requestBidsSupplierProfile),
      this.bidsTradeConditionsService.select(requestBidsTradeConditions),
      this.bidsItemService.select(requestBidsItem),
      this.bidsService.count(requestBids)
    ]).subscribe(res => {
      if (res[0] && res[6] > 0) {
        this.bidsData = res[0];
        this.bidsData.listBidsCapacityProfileRequest = res[1];
        this.bidsData.listBidsEvaluationCriteria = res[2];
        this.bidsData.listBidsSupplierProfile = res[3].filter(m => m.referenceId);
        this.bidsData.listBidsTradeConditions = res[4];
        this.bidsData.listBidsItem = res[5].map(m => {
          if (!m.status) {
            m.status = 1;
          }
          return m;
        });

        const temp = res[3].find(m => !m.referenceId);
        if (temp && temp.id) {
          this.bidsSupplierProfileData = temp;
        }

        const requestBidsSupplierProfileViewAll: any = new BidsSupplierProfileRequestPayload();
        requestBidsSupplierProfileViewAll.bidsId = this.bidsId;
        requestBidsSupplierProfileViewAll.auction = 1;
        this.bidsSupplierProfileService.select(requestBidsSupplierProfileViewAll).subscribe(m => {
          this.listBidsSupplierProfileViewAll = m;
        });
        this.cdr.detectChanges();
      } else {
        this.close();
        this.notification.showInfo('Không tìm thấy thông tin');
      }
    });
    this.subscriptions.push(initSub);
  }

  public showDialog(bidsId: string, supplierId: string): void {
    this.bidsId = bidsId;
    this.supplierId = supplierId;
    this.ngOnInit();
    this.initData();
    this.dialogRef.show();
    this.cdr.detectChanges();
  }

  public close() {
    this.dialogRef.hide();
  }

}
