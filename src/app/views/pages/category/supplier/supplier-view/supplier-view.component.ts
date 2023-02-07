import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import * as configParent from '../../supplier/supplier.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from '../../../../../services/modules/category/supplier/supplier.service';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { BaseFormComponent } from '../../../../../core/_base/component/base-form.component';
import { FileService } from '../../../../../services/modules/file/file.service';
import { FileRequestPayload } from '../../../../../services/modules/file/file.request.payload';
import { forkJoin } from 'rxjs';
import { FileDownload } from '../../../../partials/control/download-file/download-file.component';
import { SupplierBankService } from '../../../../../services/modules/category/supplier-bank/supplier-bank.service';
import {
  SupplierGuaranteeCenterService
} from '../../../../../services/modules/category/supplier-guarantee-center/supplier-guarantee-center.service';
import { SupplierBankRequestPayload } from '../../../../../services/modules/category/supplier-bank/supplier-bank.request.payload';
import {
  SupplierGuaranteeCenterRequestPayload
} from '../../../../../services/modules/category/supplier-guarantee-center/supplier-guarantee-center.request.payload';
import { SupplierSalesRequestPayload } from '../../../../../services/modules/category/supplier-sales/supplier-sales.request.payload';
import { SupplierSalesService } from '../../../../../services/modules/category/supplier-sales/supplier-sales.service';
import { SupplierHistoryComponent } from '../supplier-history/supplier-history.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-supplier-view',
  templateUrl: './supplier-view.component.html',
  styleUrls: ['./supplier-view.component.scss']
})
export class SupplierViewComponent extends BaseFormComponent implements OnInit {
  @ViewChild('supplierHistory', { static: false }) supplierHistory: SupplierHistoryComponent;

  public supplierData: any = {
    listSupplierBank: [],
    listSupplierGuaranteeCenter: [],
    listSupplierSales: []
  };
  public mainConfig = mainConfig.MAIN_CONFIG;
  public arrType = configParent.TYPE;
  public arrStatus = configParent.STATUS;
  public arrCommissionPolicy = configParent.COMMISSION_POLICY;
  public arrHeaderSales = configParent.HEADER_SALES;
  public arrHeaderBank = configParent.HEADER_BANK;
  public arrHeaderGuaranteeCenter = configParent.HEADER_GUARANTEE_CENTER;
  public file: any;

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
    private fileService: FileService
  ) {
    super();
  }

  ngOnInit() {
    this.arrHeaderBank = this.arrHeaderBank.filter((m, index) => index !== 5);
    this.arrHeaderGuaranteeCenter = this.arrHeaderGuaranteeCenter.filter((m, index) => index !== 4);
    this.arrHeaderSales = this.arrHeaderSales.filter((m, index) => index !== 6);

    const routeSub = this.route.params.subscribe(params => {
      if (params.id) {
        const requestSupplierBank = new SupplierBankRequestPayload();
        requestSupplierBank.supplierId = params.id;

        const requestSupplierGuaranteeCenter = new SupplierGuaranteeCenterRequestPayload();
        requestSupplierGuaranteeCenter.supplierId = params.id;

        const requestSupplierSales = new SupplierSalesRequestPayload();
        requestSupplierSales.supplierId = params.id;

        const requestFile = new FileRequestPayload();
        requestFile.module = 'Attachment\\Supplier\\' + params.id;

        const initSub = forkJoin([
          this.supplierService.selectById(params.id),
          this.supplierBankService.select(requestSupplierBank),
          this.supplierGuaranteeCenterService.select(requestSupplierGuaranteeCenter),
          this.supplierSalesService.select(requestSupplierSales),
          this.fileService.select(requestFile)
        ]).subscribe(res => {
          if (res[0]) {
            this.supplierData = res[0];
            this.supplierData.listSupplierBank = res[1];
            this.supplierData.listSupplierGuaranteeCenter = res[2];
            this.supplierData.listSupplierSales = res[3];
          } else {
            this.goBack();
          }
          if (res[4] && res[4].length > 0) {
            this.file = res[4][0];
          }
          this.cdr.detectChanges();
        });
        this.subscriptions.push(initSub);
      }
    });
    this.subscriptions.push(routeSub);
  }

  public onBtnDownloadClick(): void {
    if (this.file && this.file.id) {
      const fileDownload = new FileDownload();
      fileDownload.id = this.file.id;
      fileDownload.name = this.file.name;
      this.fileService.download(fileDownload);
    }
  }

  public goBack(): void {
    // this.router.navigate([`supplier`], { relativeTo: this.route.parent });
    this.location.back();
  }

  public goToEdit(): void {
    this.router.navigate([`supplier/edit/${this.supplierData.id}`], { relativeTo: this.route.parent });
  }

  public viewHistory(): void {
    this.supplierHistory.onBtnShowDialogListClick();
    this.cdr.detectChanges();
  }

}
