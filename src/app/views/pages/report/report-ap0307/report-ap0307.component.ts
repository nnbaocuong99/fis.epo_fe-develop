import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { SupplierBankService } from '../../../../services/modules/category/supplier-bank/supplier-bank.service';
import { SupplierService } from '../../../../services/modules/category/supplier/supplier.service';
import { EpoAp0208TblService } from '../../../../services/modules/epo-ap-0208-tbl/epo-ap-0208-tbl.service';
import { ReportAFService } from '../../../../services/modules/report-af/report-af.service';
import { ToolbarModel } from '../../../partials/content/toolbar/toolbar.model';

@Component({
  selector: 'app-report-ap0307',
  templateUrl: './report-ap0307.component.html',
  styleUrls: ['./report-ap0307.component.scss']
})
export class ReportAp0307Component implements OnInit {
  @ViewChild('formFilter', { static: true }) formFilter: NgForm;
  public toolbarModel: ToolbarModel;
  public request: any = {};

  public headerSupplier = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '150px', title: 'SUPPLIER.CODE', field: 'code' },
    { width: '250px', title: 'SUPPLIER.NAME', field: 'name' },
    { width: '150px', title: 'SUPPLIER.TAX_CODE', field: 'taxCode' }
  ];

  public headerSupplierBank = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '150px', title: 'SUPPLIER.BANK_INFO.NAME', field: 'name' },
    { width: '150px', title: 'SUPPLIER.BANK_INFO.ACCOUNT_NUMBER', field: 'accountNumber' },
    { width: '150px', title: 'SUPPLIER.BANK_INFO.RECEIVER_NAME', field: 'receiverName' }
  ];

  public arrAccountName = [];

  constructor(
    public notificationService: NotificationService,
    public reportAFService: ReportAFService,
    public supplierService: SupplierService,
    public supplierBankService: SupplierBankService,
    public epoAp0208TblService: EpoAp0208TblService
  ) { }

  ngOnInit() {
    this.configToolbar();
    this.epoAp0208TblService.selectAccountName().subscribe(m => {
      this.arrAccountName = m;
    });
  }

  private configToolbar(): void {
    this.toolbarModel = new ToolbarModel();
    this.toolbarModel.option.show = false;
    this.toolbarModel.add.show = false;
    this.toolbarModel.search.show = false;
  }

  public exportAP0307(): void {
    this.reportAFService.exportAP0307(this.request).subscribe(m => {
      this.notificationService.showSuccess();
    });
  }

  public onChangeSupplier(): void {
    if (this.request.supplierDto) {
      this.request.vendorId = this.request.supplierDto.vendorId;
    } else {
      this.request.vendorId = null;
    }
  }

  public onChangeSupplierBank(): void {
    if (this.request.supplierBankDto) {
      this.request.account = `${this.request.supplierBankDto.accountNumber}-${this.request.supplierBankDto.name}`;
    } else {
      this.request.account = null;
    }
  }

}
