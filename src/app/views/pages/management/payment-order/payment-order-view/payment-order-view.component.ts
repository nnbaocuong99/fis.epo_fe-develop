import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../../../../../core/_base/component';
import { ExpenseService } from '../../../../../services/modules/expense/expense.service';
import { FileService } from '../../../../../services/modules/file/file.service';
import * as mainConfig from '../../../../../core/_config/main.config';
import { forkJoin } from 'rxjs';
import * as configParent from '../payment-order.config';
import { DataEpaymentService } from '../../../../../services/modules/data-ePayment/data-ePayment.service';
import { DataEpaymentRequestPayload } from '../../../../../services/modules/data-ePayment/data-ePayment-request-payload';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { Location } from '@angular/common';

export enum PaymentTypes {
  Payment = 'PAYMENT',
  PrePayment = 'PREPAYMENT',
  AdvancePayment = 'ADVANCEPAYMENT'
}

export enum MasterDataTypes {
  Organizations = 'Organizations',
  CategoryAsyncs = 'CategoryAsyncs',
  LegalStandings = 'LegalStandings',
  BillTypes = 'BillTypes',
  TaxTypes = 'TaxTypes'
}

@Component({
  selector: 'app-payment-order-view',
  templateUrl: './payment-order-view.component.html',
  styleUrls: ['./payment-order-view.component.scss']
})

export class PaymentOrderViewComponent extends BaseFormComponent implements OnInit {
  @ViewChild('form', { static: false }) form: NgForm;

  public mainConfig = mainConfig.MAIN_CONFIG;
  public paymentMethod = configParent.PAYMENT_METHOD;
  public beneficiaryType = configParent.BENEFICIARY_TYPE;
  public currentExpenseId: string;
  public currentPiId: string;
  public paymentOrderData: any = {};
  public organizationsData = [];
  public categoryAsyncsData = [];
  public legalStandingsData = [];
  public billTypesData = [];
  public taxTypesData = [];

  constructor(
    public expenseService: ExpenseService,
    public dataEpaymentService: DataEpaymentService,
    public notificationService: NotificationService,
    public cdr: ChangeDetectorRef,
    public fileService: FileService,
    private location: Location,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    const routeSub = this.route.params.subscribe(params => {
      if (params.id) {
        this.currentExpenseId = params.id;
        this.getMasterDataControl(MasterDataTypes.Organizations);
        this.getMasterDataControl(MasterDataTypes.CategoryAsyncs);
        this.getMasterDataControl(MasterDataTypes.LegalStandings);
        this.getMasterDataControl(MasterDataTypes.BillTypes);
        this.getMasterDataControl(MasterDataTypes.TaxTypes);
        this.initData();
      }
    });
    this.subscriptions.push(routeSub);
  }

  public initData(): void {
    const initSub = forkJoin([
      this.expenseService.selectById(this.currentExpenseId),
      // this.fileService.select(requestBrandFile),
      // this.fileService.select(requestPartnerHierarchyFile)
    ]).subscribe(res => {
      if (res[0]) {
        this.paymentOrderData = res[0];
        this.currentPiId = this.paymentOrderData.piId ? this.paymentOrderData.piId : null;
      } else {
        this.goBack();
      }
      this.cdr.detectChanges();
    });
    this.subscriptions.push(initSub);
  }

  public getMasterDataControl(type: string): void {
    const request = new DataEpaymentRequestPayload();
    request.type = type;
    const temp = this.dataEpaymentService.selectMasterData(request).subscribe(res => {
      if (res) {
        if (type === MasterDataTypes.Organizations) {
          // Fix search control
          this.organizationsData = res.map(x => {
            x.Search_label = `${x.Filter} ${'-'} ${x.Name}`;
            return x;
          });
        }
        if (type === MasterDataTypes.CategoryAsyncs) {
          // Fix search control
          this.categoryAsyncsData = res.map(x => {
            x.Search_label = `${x.Description}`;
            x.Code = +x.Code;
            return x;
          });
        }
        if (type === MasterDataTypes.LegalStandings) {
          // Fix search control
          this.legalStandingsData = res.map(x => {
            x.Search_label = `${x.Code} ${'-'} ${x.Name}`;
            return x;
          });
        }
        if (type === MasterDataTypes.BillTypes) {
          this.billTypesData = res;
        }
        if (type === MasterDataTypes.TaxTypes) {
          this.taxTypesData = res;
        }
        this.cdr.detectChanges();
      }
    });
    this.subscriptions.push(temp);
  }

  public goBack(): void {
    // this.router.navigate([`list`], { relativeTo: this.route.parent });
    this.location.back();
  }

  public goToEdit(): void {
    this.router.navigate([`list/edit/${this.currentExpenseId}`], { relativeTo: this.route.parent });
  }

  public onBtnCreateDraftEpaymentTicketClick(): void {
    const request = new DataEpaymentRequestPayload();
    request.id = this.currentExpenseId;
    this.dataEpaymentService.createDraft(request).subscribe(res => {
      if (res) {
        this.notificationService.showSuccess();
        this.paymentOrderData.hidebtnCreateDraftEpayment = true;
        this.openNewTab(res.Data.Id);
        this.cdr.detectChanges();
      }
    });
  }

  public openNewTab(ePayId: any) {
    // Converts the route into a string that can be used
    // with the window.open() function
    if (ePayId) {
      const url = `https://dev.epayment.ho.fpt.vn/Form/CreateExpense?ExpenseId=${ePayId}`;
      window.open(url, '_blank');
      this.goBack();
    } else {
      this.notificationService.showError('Lỗi !!!');
      alert('Không có Id ePay');
    }
  }

}
