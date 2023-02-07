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
import * as configParent from '../../bids-management/bids-management.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import {
  BidsManagementViewSupplierProfileComponent
} from '../bids-management-view-supplier-profile/bids-management-view-supplier-profile.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-bids-management-view',
  templateUrl: './bids-management-view.component.html',
  styleUrls: ['./bids-management-view.component.scss']
})
export class BidsManagementViewComponent extends BaseFormComponent implements OnInit {
  // tslint:disable-next-line:max-line-length
  @ViewChild('bidsManagementViewSupplierProfile', { static: true }) bidsManagementViewSupplierProfile: BidsManagementViewSupplierProfileComponent;

  public mainConfig = mainConfig.MAIN_CONFIG;

  public bidsData: any = {
    listBidsCapacityProfileRequest: [],
    listBidsEvaluationCriteria: [],
    listBidsSupplierProfile: [],
    listBidsTradeConditions: [],
    listBidsItem: [],
  };

  public arrHeaderBidsCapacityProfileRequest = configParent.BIDS_CAPACITY_PROFILE_REQUEST;
  public arrHeaderBidsEvaluationCriteria = configParent.BIDS_EVALUATION_CRITERIA;
  public arrHeaderSupplierProfile = configParent.SUPPLIER_PROFILE;
  public arrHeaderBidsTradeConditions = configParent.BIDS_TRADE_CONDITIONS;
  public arrHeaderBidsItem = configParent.BIDS_ITEM;

  public arrSupplierProfileStatus = configParent.SUPPLIER_PROFILE_STATUS;

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
    public bidsItemService: BidsItemService
  ) {
    super();
  }

  ngOnInit() {
    this.arrHeaderBidsCapacityProfileRequest = this.arrHeaderBidsCapacityProfileRequest.filter((m, index) => index !== 2);
    this.arrHeaderBidsEvaluationCriteria = this.arrHeaderBidsEvaluationCriteria.filter((m, index) => index !== 2);
    this.arrHeaderSupplierProfile = this.arrHeaderSupplierProfile.filter((m, index) => index !== 10);
    this.arrHeaderBidsTradeConditions = this.arrHeaderBidsTradeConditions.filter((m, index) => index !== 3);
    this.arrHeaderBidsItem = this.arrHeaderBidsItem.filter((m, index) => index !== 7);

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
            this.bidsData.listBidsCapacityProfileRequest = res[1];
            this.bidsData.listBidsEvaluationCriteria = res[2];
            this.bidsData.listBidsSupplierProfile = res[3];
            this.bidsData.listBidsTradeConditions = res[4];
            this.bidsData.listBidsItem = res[5];
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

  public goToEdit(): void {
    this.router.navigate([`bids/edit/${this.bidsData.id}`], { relativeTo: this.route.parent });
  }

  public viewSupplierProfile(rowData) {
    this.bidsManagementViewSupplierProfile.showDialog(this.bidsData.id, rowData.supplierId);
  }
}
