import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { SupplierBankService } from '../../../../services/modules/category/supplier-bank/supplier-bank.service';
import { SupplierService } from '../../../../services/modules/category/supplier/supplier.service';
import { ReportService } from '../../../../services/modules/report/report.service';
import { ToolbarModel } from '../../../partials/content/toolbar/toolbar.model';

@Component({
  selector: 'app-report-invoice-bp',
  templateUrl: './report-invoice-bp.component.html',
  styleUrls: ['./report-invoice-bp.component.scss']
})
export class ReportInvoiceBpComponent implements OnInit {
  @ViewChild('formFilter', { static: true }) formFilter: NgForm;
  public toolbarModel: ToolbarModel;
  public request: any = {};

  public headerSupplier = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '150px', title: 'SUPPLIER.CODE', field: 'code' },
    { width: '250px', title: 'SUPPLIER.NAME', field: 'name' },
    { width: '150px', title: 'SUPPLIER.TAX_CODE', field: 'taxCode' }
  ];

  public arrItemType = ['HW', 'SW', 'SRV'];

  constructor(
    public notificationService: NotificationService,
    public reportService: ReportService,
    public supplierService: SupplierService,
    public supplierBankService: SupplierBankService
  ) { }

  ngOnInit() {
    this.configToolbar();
  }

  private configToolbar(): void {
    this.toolbarModel = new ToolbarModel();
    this.toolbarModel.option.show = false;
    this.toolbarModel.add.show = false;
    this.toolbarModel.search.show = false;
  }

  public exportInvoiceBp(): void {
    this.reportService.exportInvoiceBp(this.request).subscribe(m => {
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
