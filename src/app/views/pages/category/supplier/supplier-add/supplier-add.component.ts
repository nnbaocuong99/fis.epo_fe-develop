import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../../../../../core/_base/component/base-form.component';
import { SaveConfirmation } from '../../../../../services/common/confirmation/save-confirmation';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { SupplierService } from '../../../../../services/modules/category/supplier/supplier.service';
import * as configParent from '../../supplier/supplier.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { SupplierBankService } from '../../../../../services/modules/category/supplier-bank/supplier-bank.service';
import {
  SupplierGuaranteeCenterService
} from '../../../../../services/modules/category/supplier-guarantee-center/supplier-guarantee-center.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { SupplierBankRequestPayload } from '../../../../../services/modules/category/supplier-bank/supplier-bank.request.payload';
import {
  SupplierGuaranteeCenterRequestPayload
} from '../../../../../services/modules/category/supplier-guarantee-center/supplier-guarantee-center.request.payload';
import { SupplierSalesService } from '../../../../../services/modules/category/supplier-sales/supplier-sales.service';
import { SupplierSalesRequestPayload } from '../../../../../services/modules/category/supplier-sales/supplier-sales.request.payload';
import { SupplierHistoryComponent } from '../supplier-history/supplier-history.component';
import { ConfigListService } from '../../../../../services/modules/config-list/config-list.service';
import { ConfigListRequestPayload } from '../../../../../services/modules/config-list/config-list.request.payload';
import { Guid } from 'guid-typescript';
import { Location } from '@angular/common';
import { ConfigListFactory } from '../../../../partials/control/config-list/config-list-control.service';
@Component({
  selector: 'app-supplier-add',
  templateUrl: './supplier-add.component.html',
  styleUrls: ['./supplier-add.component.scss']
})
export class SupplierAddComponent extends BaseFormComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  @ViewChild('supplierHistory', { static: false }) supplierHistory: SupplierHistoryComponent;

  public supplierData: any = {
    listSupplierBank: [],
    listSupplierGuaranteeCenter: [],
    listSupplierSales: [],
    listSupplierBankDeleteId: [],
    listSupplierGuaranteeCenterDeleteId: [],
    listSupplierSalesDeleteId: []
  };
  public listDistributingGoods = [];
  public requestConfigList = new ConfigListRequestPayload();
  public configListDataPositon: any = {};
  public arrType = configParent.TYPE;
  public arrStatus = configParent.STATUS;
  public arrCommissionPolicy = configParent.COMMISSION_POLICY;
  public arrHeaderSales = configParent.HEADER_SALES;
  public arrHeaderBank = configParent.HEADER_BANK;
  public arrHeaderGuaranteeCenter = configParent.HEADER_GUARANTEE_CENTER;
  public addItemBank: any = { id: Guid.create().toString().split('-').join('') };
  public addItemGuaranteeCenter: any = { id: Guid.create().toString().split('-').join('') };
  public addItemSales: any = { id: Guid.create().toString().split('-').join('') };
  addCustomDistributingGoods = m => m;

  constructor(
    public cdr: ChangeDetectorRef,
    public router: Router,
    public route: ActivatedRoute,
    public notification: NotificationService,
    public supplierService: SupplierService,
    public supplierBankService: SupplierBankService,
    private location: Location,
    public supplierGuaranteeCenterService: SupplierGuaranteeCenterService,
    public supplierSalesService: SupplierSalesService,
    public configListService: ConfigListService
  ) {
    super();
  }

  ngOnInit() {
    this.requestConfigList.type = 'DISTRIBUTING_GOODS';
    this.configListDataPositon = ConfigListFactory.instant('SUPPLIER_POSITION');

    const routeSub = this.route.params.subscribe(params => {
      if (params.id) {
        const requestSupplierBank = new SupplierBankRequestPayload();
        requestSupplierBank.supplierId = params.id;

        const requestSupplierGuaranteeCenter = new SupplierGuaranteeCenterRequestPayload();
        requestSupplierGuaranteeCenter.supplierId = params.id;

        const requestSupplierSales = new SupplierSalesRequestPayload();
        requestSupplierSales.supplierId = params.id;

        const initSub = forkJoin([
          this.supplierService.selectById(params.id),
          this.supplierBankService.select(requestSupplierBank),
          this.supplierGuaranteeCenterService.select(requestSupplierGuaranteeCenter),
          this.supplierSalesService.select(requestSupplierSales)
        ]).subscribe(res => {
          if (res[0]) {
            this.supplierData = res[0];
            this.supplierData.listSupplierBankDeleteId = [];
            this.supplierData.listSupplierGuaranteeCenterDeleteId = [];
            this.supplierData.listSupplierSalesDeleteId = [];

            this.supplierData.listSupplierBank = res[1];
            this.supplierData.listSupplierGuaranteeCenter = res[2];
            this.supplierData.listSupplierSales = res[3];
            // tslint:disable-next-line:max-line-length
            this.supplierData.distributingGoodsDto = this.supplierData.distributingGoods ? this.supplierData.distributingGoods.split(',') : [];
            this.supplierData.distributingGoodsDto = this.supplierData.distributingGoodsDto.map(m => {
              m = m.trim();
              return m;
            });
          } else {
            this.goBack();
          }
          this.cdr.detectChanges();
        });
        this.subscriptions.push(initSub);
      } else {
        this.supplierData.isActive = 1;
      }
    });
    this.subscriptions.push(routeSub);
  }

  public goBack(): void {
    this.location.back();
    // this.router.navigate([`supplier`], { relativeTo: this.route.parent });
  }

  public goToView(): void {
    this.router.navigate([`supplier/view/${this.supplierData.id}`], { relativeTo: this.route.parent });
  }

  public onRowEditInit(): void {
    if (this.form) {
      this.form.form.markAsDirty();
    }
  }

  public onBtnSaveClick(): void {
    if (this.form) {
      if (!this.validateForm(this.form, 'id-form-supplier')) {
        this.notification.showMessage('VALIDATION.FORM_VALID');
        return;
      }
      if (!this.validateBankDefault()) {
        this.notification.showMessage('Vui lòng chọn duy nhất một ngân hàng mặc định');
        return;
      }

      if (this.form.dirty) {
        const saveConfirmation = new SaveConfirmation();
        saveConfirmation.accept = () => {
          const dataSave: any = {
            ...this.supplierData
          };
          if (!dataSave.id) {
            dataSave.createdSource = 'EPO';
          }
          this.supplierService.save(dataSave).subscribe(m => {
            if (m) {
              this.supplierData.id = m.id;
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

  public validateBankDefault(): boolean {
    let count = 0;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.supplierData.listSupplierBank.length; i++) {
      if (this.supplierData.listSupplierBank[i].main === 1) {
        count++;
      }
    }
    return count === 1 ? true : (this.supplierData.listSupplierBank.length > 0 ? false : true);
  }

  public onBtnCancelClick(): void {
    this.goBack();
  }

  public onChangeDepositRate() {
    if (this.supplierData.depositRate) {
      if (this.supplierData.depositRate < 0) {
        this.supplierData.depositRate = 0;
      }
      if (this.supplierData.depositRate > 100) {
        this.supplierData.depositRate = 100;
      }
    }
  }

  public onChangeQuantityRestDepositDate() {
    if (this.supplierData.quantityRestDepositDate) {
      if (this.supplierData.quantityRestDepositDate < 0) {
        this.supplierData.quantityRestDepositDate = 0;
      }
    }
  }

  public onChangeCommissionPolicy(event) {
    if (event.value !== 1) {
      this.supplierData.commissionPolicyDescription = null;
    }
  }

  public addNewRowBank(): void {
    if (!this.addItemBank.name || !this.addItemBank.accountNumber || !this.addItemBank.receiverName) {
      this.notification.showMessage('Vui lòng nhập đủ thông tin');
      return;
    }
    this.supplierData.listSupplierBank.push(this.addItemBank);
    this.addItemBank = { id: Guid.create().toString().split('-').join('') };
    this.cdr.detectChanges();
    this.form.form.markAsDirty();
  }

  public deleteRowBank(indexRow: any): void {
    const temp = this.supplierData.listSupplierBank.find((element, index) => index === indexRow);
    if (temp.id) {
      this.supplierData.listSupplierBankDeleteId.push(temp.id);
    }
    this.supplierData.listSupplierBank = this.supplierData.listSupplierBank.filter((element, index) => index !== indexRow);
    this.form.form.markAsDirty();
  }

  public addNewRowGuaranteeCenter(): void {
    if (!this.addItemGuaranteeCenter.name || !this.addItemGuaranteeCenter.address || !this.addItemGuaranteeCenter.phoneNumber) {
      this.notification.showMessage('Vui lòng nhập đủ thông tin');
      return;
    }
    this.supplierData.listSupplierGuaranteeCenter.push(this.addItemGuaranteeCenter);
    this.addItemGuaranteeCenter = { id: Guid.create().toString().split('-').join('') };
    this.cdr.detectChanges();
    this.form.form.markAsDirty();
  }

  public deleteRowGuaranteeCenter(indexRow: any): void {
    const temp = this.supplierData.listSupplierGuaranteeCenter.find((element, index) => index === indexRow);
    if (temp.id) {
      this.supplierData.listSupplierGuaranteeCenterDeleteId.push(temp.id);
    }
    // tslint:disable-next-line:max-line-length
    this.supplierData.listSupplierGuaranteeCenter = this.supplierData.listSupplierGuaranteeCenter.filter((element, index) => index !== indexRow);
    this.form.form.markAsDirty();
  }

  public addNewRowSales(): void {
    if (!this.addItemSales.name || !this.addItemSales.phoneNumber || !this.addItemSales.email) {
      this.notification.showMessage('Vui lòng nhập thông tin sales, số điện thoại, email');
      return;
    }
    this.supplierData.listSupplierSales.push(this.addItemSales);
    this.addItemSales = { id: Guid.create().toString().split('-').join('') };
    this.cdr.detectChanges();
    this.form.form.markAsDirty();
  }

  public deleteRowSales(indexRow: any): void {
    const temp = this.supplierData.listSupplierSales.find((element, index) => index === indexRow);
    if (temp.id) {
      this.supplierData.listSupplierSalesDeleteId.push(temp.id);
    }
    this.supplierData.listSupplierSales = this.supplierData.listSupplierSales.filter((element, index) => index !== indexRow);
    this.form.form.markAsDirty();
  }

  public viewHistory(): void {
    this.supplierHistory.onBtnShowDialogListClick();
    this.cdr.detectChanges();
  }

  public onChangeDistributingGoods() {
    if (this.supplierData.distributingGoodsDto) {
      const listSistributingGoods = this.supplierData.distributingGoodsDto.map(m => m.trim());
      this.supplierData.distributingGoods = listSistributingGoods.join(', ');
    }
  }

  public changeListPo(data) {
    if (data && data.listPoChange) {
      this.supplierData.listPoChange = data.listPoChange;
      this.form.form.markAsDirty();
    }
  }
}
