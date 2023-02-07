import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { SupplierBankService } from '../../../../services/modules/category/supplier-bank/supplier-bank.service';
import { SupplierService } from '../../../../services/modules/category/supplier/supplier.service';
import { EpoAp0208TblService } from '../../../../services/modules/epo-ap-0208-tbl/epo-ap-0208-tbl.service';
import { ReportAFService } from '../../../../services/modules/report-af/report-af.service';
import { ToolbarModel } from '../../../partials/content/toolbar/toolbar.model';

@Component({
  selector: 'app-report-ap0208',
  templateUrl: './report-ap0208.component.html',
  styleUrls: ['./report-ap0208.component.scss']
})
export class ReportAp0208Component implements OnInit {
  @ViewChild('formFilter', { static: true }) formFilter: NgForm;
  public toolbarModel: ToolbarModel;
  public request: any = {};

  public headerSupplier = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '150px', title: 'SUPPLIER.CODE', field: 'code' },
    { width: '250px', title: 'SUPPLIER.NAME', field: 'name' },
    { width: '150px', title: 'SUPPLIER.TAX_CODE', field: 'taxCode' }
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

  public exportAP0208(): void {
    this.reportAFService.exportAP0208(this.request).subscribe(m => {
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

}
