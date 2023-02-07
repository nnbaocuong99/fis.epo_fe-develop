import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { OperatingUnitService } from '../../../../services/modules/category/organization-management/operating-unit/operating-unit.service';
import { SupplierService } from '../../../../services/modules/category/supplier/supplier.service';
import { ReportAFService } from '../../../../services/modules/report-af/report-af.service';
import { ToolbarModel } from '../../../partials/content/toolbar/toolbar.model';

@Component({
  selector: 'app-report-spending-plan',
  templateUrl: './report-spending-plan.component.html',
  styleUrls: ['./report-spending-plan.component.scss']
})
export class ReportSpendingPlanComponent implements OnInit {
  @ViewChild('formFilter', { static: true }) formFilter: NgForm;
  public toolbarModel: ToolbarModel;
  public request: any = {};

  public headerOperatingUnit = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'OPERATING_UNIT.CODE', field: 'code' },
    { width: '200px', title: 'OPERATING_UNIT.NAME', field: 'name' },
    { width: '200px', title: 'OPERATING_UNIT.ADDRESS', field: 'address' }
  ];

  public headerSupplier = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '150px', title: 'SUPPLIER.CODE', field: 'code' },
    { width: '250px', title: 'SUPPLIER.NAME', field: 'name' },
    { width: '150px', title: 'SUPPLIER.TAX_CODE', field: 'taxCode' }
  ];

  constructor(
    public notificationService: NotificationService,
    public reportAFService: ReportAFService,
    public operatingUnitService: OperatingUnitService,
    public supplierService: SupplierService
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

  public exportSpendingPlan(): void {
    this.reportAFService.exportSpendingPlan(this.request).subscribe(m => {
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

  public onChangeOperatingUnitDto(): void {
    if (this.request.operatingUnitDto) {
      this.request.ouId = this.request.operatingUnitDto.ouId;
    } else {
      this.request.ouId = null;
    }
    this.request.subDepartmentDto = null;
    this.request.subDepartmentId = null;
  }

}
