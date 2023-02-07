import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../../../../../core/_base/component';
import { SaveConfirmation } from '../../../../../services/common/confirmation';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { BrandRequestPayload, BrandRequestSaveDto } from '../../../../../services/modules/category/brand/brand.request.payload';
import { BrandService } from '../../../../../services/modules/category/brand/brand.service';
import { CurrencyService } from '../../../../../services/modules/category/currency/currency.service';
import { ConfigListFactory } from '../../../../partials/control/config-list/config-list-control.service';
import * as config from './brand-add.config';
import { BrandMarketingFundInfoComponent } from './brand-marketing-fund-info/brand-marketing-fund-info.component';
import { BrandMembershipRequirementComponent } from './brand-membership-requirement/brand-membership-requirement.component';
import { BrandRevenueComponent } from './brand-revenue/brand-revenue.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { PartnerHierarchyComponent } from './partner-hierarchy/partner-hierarchy.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-brand-add',
  templateUrl: './brand-add.component.html',
  styleUrls: ['./brand-add.component.scss']
})
export class BrandAddComponent extends BaseFormComponent implements OnInit {
  @ViewChild('form', { static: false }) form: NgForm;
  @ViewChild('contactInfo', { static: false }) contactInfo: ContactInfoComponent;
  @ViewChild('partnerHierarchy', { static: false }) partnerHierarchy: PartnerHierarchyComponent;
  @ViewChild('brandRevenue', { static: false }) brandRevenue: BrandRevenueComponent;
  @ViewChild('brandMembershipRequirement', { static: false }) brandMembershipRequirement: BrandMembershipRequirementComponent;
  @ViewChild('brandMarketingFundInfo', { static: false }) brandMarketingFundInfo: BrandMarketingFundInfoComponent;

  public brandData: any = {};
  public brandContactInfo = [];
  public brandType = config.TYPE_BRAND;
  public backDate = config.BACKDATE;
  public incentiveData = config.INCENTIVE;
  public mdfData = config.MDF;
  public dealRegistration = config.DEAL_REGISTRATION;
  public currentBrandId: string;
  public formTitle = 'Thêm mới hãng sản xuất';
  public listYearSelect = [];
  public configListDataParadigm: any = {};
  public configListDataNewProduct: any = {};
  public configListDataPartnerRating: any = {};
  public configListDataWarrantyValidity: any = {};
  public configListDataFct: any = {};
  public configListDataPriority: any = {};
  public configListDataFisPartnerLevel: any = {};

  constructor(
    public brandService: BrandService,
    public currencyService: CurrencyService,
    private cdr: ChangeDetectorRef,
    public router: Router,
    public route: ActivatedRoute,
    public notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit() {
    const selectedYearTemp = new Date().getFullYear();
    this.listYearSelect = [];
    for (let i = selectedYearTemp - 10; i < selectedYearTemp + 10; i++) {
      this.listYearSelect.push({ value: i });
    }
    // Get data config-list
    this.configListDataPriority = ConfigListFactory.instant('BRAND_PRIORITY');
    this.configListDataFisPartnerLevel = ConfigListFactory.instant('BRAND_FIS_PARTNER_LEVEL');
    this.configListDataParadigm = ConfigListFactory.instant('BRAND_PARADIGM');
    this.configListDataNewProduct = ConfigListFactory.instant('BRAND_NEW_PRODUCT');
    this.configListDataPartnerRating = ConfigListFactory.instant('BRAND_PARTNER_RATING');
    this.configListDataWarrantyValidity = ConfigListFactory.instant('BRAND_WARRANTY_VALIDITY');
    this.configListDataFct = ConfigListFactory.instant('BRAND_CONTRACTOR_TAX');

    const routeSub = this.route.params.subscribe(params => {
      if (params.id) {
        this.formTitle = 'Update thông tin hãng sản xuất';
        this.currentBrandId = params.id;
        this.initData(this.currentBrandId);
      } else {
        this.brandData = {};
        if (window.history.state.fromBrand) {
          this.brandData.code = window.history.state.brandData.code;
          this.brandData.name = window.history.state.brandData.name;
        }
      }
    });
    this.subscriptions.push(routeSub);
  }

  public goBack(): void {
    this.router.navigate([`brand`], { relativeTo: this.route.parent });
  }


  public initData(id: string): void {
    this.brandService.selectById(id).subscribe(res => {
      if (res) {
        this.brandData = res;


        if (this.brandData.financialYearFd) {
          this.brandData.financialYearDate = [];
          this.brandData.financialYearDate.push(new Date(this.brandData.financialYearFd));
        }
        if (this.brandData.financialYearTd) {
          this.brandData.financialYearDate.push(new Date(this.brandData.financialYearTd));
        }
        if (this.brandData.fromDate) {
          this.brandData.partnerEffectDate = [];
          this.brandData.partnerEffectDate.push(new Date(this.brandData.fromDate));
        }
        if (this.brandData.toDate) {
          this.brandData.partnerEffectDate.push(new Date(this.brandData.toDate));
        }

        this.cdr.detectChanges();
      }
    });
  }

  public editRow(): void {
    this.form.form.markAsDirty();
  }

  public onBtnSaveClick(): void {
    if (this.form) {
      if (!this.validateForm(this.form, 'id-form-brand')) {
        this.notificationService.showMessage('VALIDATION.FORM_VALID');
        this.partnerHierarchy.checkValidateFormPartnerHierarchy();
        return;
      }
      if (!this.partnerHierarchy.checkValidateFormPartnerHierarchy()) {
        this.notificationService.showMessage('VALIDATION.FORM_VALID');
        return;
      }
      if (!this.brandRevenue.dataSource.items || (this.brandRevenue.dataSource.items && this.brandRevenue.dataSource.items.length === 0)) {
        this.notificationService.showMessage('Chưa có thông tin bảng doanh thu');
        return;
      }
      if (this.form.dirty) {
        const saveConfirmation = new SaveConfirmation();
        saveConfirmation.accept = () => {
          const requestSave = this.createRequestSave();

          const saveSub = this.brandService.save(requestSave).subscribe(res => {
            if (res && res.id) {
              this.router.navigate([`brand/view/${res.id}`], { relativeTo: this.route.parent });
              this.notificationService.showSuccess();
            }
          });
          this.subscriptions.push(saveSub);
        };
        this.notificationService.confirm(saveConfirmation);
      } else {
        this.goBack();
      }
    }
  }

  public onBtnCancelClick(): void {
    this.goBack();
  }

  private createRequestSave() {
    const requestSave = new BrandRequestSaveDto();
    requestSave.brand = this.brandData;

    // lấy thông tin bảng doanh thu
    // tslint:disable-next-line:max-line-length
    if (this.brandRevenue && this.brandRevenue.dataSource.items && this.brandRevenue.dataSource.items.length > 0) {
      requestSave.brandRevenue = this.brandRevenue.dataSource.items;
    }

    // lấy thông tin bảng requirement
    // tslint:disable-next-line:max-line-length
    if (this.brandMembershipRequirement.dataSource && this.brandMembershipRequirement.dataSource.items && this.brandMembershipRequirement.dataSource.items.length > 0) {
      requestSave.brandMembershipRequirement = this.brandMembershipRequirement.dataSource.items;
    }

    // lấy danh sách liên hệ của thông tin chi tiết bảo hành
    // tslint:disable-next-line:max-line-length
    if (this.contactInfo.dataSourceContactPersons && this.contactInfo.dataSourceContactPersons.items && this.contactInfo.dataSourceContactPersons.items.length > 0) {
      requestSave.brandWarrantyContactPersons = this.contactInfo.dataSourceContactPersons.items;
    }

    // lấy danh sách liên hệ của hãng sản xuât
    // tslint:disable-next-line:max-line-length
    if (this.contactInfo.dataSourceContactInfo && this.contactInfo.dataSourceContactInfo.items && this.contactInfo.dataSourceContactInfo.items.length > 0) {
      requestSave.brandContactInfo = this.contactInfo.dataSourceContactInfo.items;
    }

    // tslint:disable-next-line:max-line-length
    if (this.partnerHierarchy.coreSolutionsData && this.partnerHierarchy.coreSolutionsData.items && this.partnerHierarchy.coreSolutionsData.items.length > 0) {
      requestSave.brandCoreSolutions = this.partnerHierarchy.coreSolutionsData.items;
    }

    // lấy danh sách liên hệ của hãng sản xuât
    // tslint:disable-next-line:max-line-length
    if (this.partnerHierarchy.hierarchyData && this.partnerHierarchy.hierarchyData.items && this.partnerHierarchy.hierarchyData.items.length > 0) {
      requestSave.brandHierarchy = this.partnerHierarchy.hierarchyData.items;
    }

    requestSave.brandMarketingFund = this.brandMarketingFundInfo.marketingFund ? this.brandMarketingFundInfo.marketingFund : [];
    requestSave.brandMarketingFundItem = this.brandMarketingFundInfo.marketingFundItem ? this.brandMarketingFundInfo.marketingFundItem : [];

    return requestSave;
  }

  public onChangeFinancialYearDate(event: any): void {
    if (event) {
      this.brandData.financialYearFd = this.convertDate(this.brandData.financialYearDate[0]);
      this.brandData.financialYearTd = this.convertDate(this.brandData.financialYearDate[1]);
    }
  }
  public onChangePartnerEffectDate(event: any): void {
    if (event) {
      this.brandData.fromDate = this.convertDate(this.brandData.partnerEffectDate[0]);
      this.brandData.toDate = this.convertDate(this.brandData.partnerEffectDate[1]);
    }
  }

  private convertDate(datetime: any): string {
    if (datetime) {
      const year = datetime.getFullYear();
      const month = datetime.getMonth() + 1;
      const day = datetime.getDate();
      return `${this.pad(year)}-${this.pad(month)}-${this.pad(day)}`;
    } else {
      return null;
    }
  }

  private pad(a: number | string): string {
    if (+a < 10) {
      return '0' + +a;
    } else {
      return '' + +a;
    }
  }

  public onChangeCurrency() {
    this.brandData.currency = this.brandData.currencyDto ? this.brandData.currencyDto.name : null;
  }

  public onChangeBrandName(event: any): void {
    if (event && !this.currentBrandId && this.brandData.brandYear) {
      const requestAll = new BrandRequestPayload();
      requestAll.name = event.target.value;
      requestAll.brandYear = this.brandData.brandYear;
      this.brandService.selectBrandYear(requestAll).subscribe(res => {
        if (res && res.length > 0) {
          this.notificationService.showError('Hãng sản xuất ' + requestAll.name + ' năm ' + requestAll.brandYear + ' đã tồn tại !!!');
          this.brandData.name = null;
          this.cdr.detectChanges();
        }
      });

    }
  }

  public onChangeBrandYear(event: any): void {
    if (event && !this.currentBrandId && this.brandData.name) {
      const requestAll = new BrandRequestPayload();
      requestAll.name = this.brandData.name;
      requestAll.brandYear = event.value;
      this.brandService.selectBrandYear(requestAll).subscribe(res => {
        if (res && res.length > 0) {
          this.notificationService.showError('Hãng sản xuất ' + requestAll.name + ' năm ' + requestAll.brandYear + ' đã tồn tại !!!');
          this.brandData.brandYear = null;
          this.cdr.detectChanges();
        }
      });
    }
  }

}
