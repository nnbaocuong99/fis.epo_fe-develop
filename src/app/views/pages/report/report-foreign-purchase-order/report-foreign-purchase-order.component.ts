import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { DepartmentService } from '../../../../services/modules/category/department/department.service';
import { OperatingUnitService } from '../../../../services/modules/category/organization-management/operating-unit/operating-unit.service';
import { SupplierService } from '../../../../services/modules/category/supplier/supplier.service';
import { ReportXNKService } from '../../../../services/modules/report-xnk/report-xnk.service';
import { UserService } from '../../../../services/modules/user/user.service';
import { ToolbarModel } from '../../../partials/content/toolbar/toolbar.model';

@Component({
  selector: 'app-report-foreign-purchase-order',
  templateUrl: './report-foreign-purchase-order.component.html',
  styleUrls: ['./report-foreign-purchase-order.component.scss']
})
export class ReportForeignPurchaseOrderComponent implements OnInit {
  @ViewChild('formFilter', { static: true }) formFilter: NgForm;
  public toolbarModel: ToolbarModel;
  public request: any = {};

  public headerOperatingUnit = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'OPERATING_UNIT.CODE', field: 'code' },
    { width: '200px', title: 'OPERATING_UNIT.NAME', field: 'name' },
    { width: '200px', title: 'OPERATING_UNIT.ADDRESS', field: 'address' }
  ];

  public headerSubDepartment = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '200px', title: 'DEPARTMENT.CODE', field: 'code' },
    { width: '200px', title: 'DEPARTMENT.NAME', field: 'name' }
  ];

  public headerSupplier = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '150px', title: 'SUPPLIER.CODE', field: 'code' },
    { width: '250px', title: 'SUPPLIER.NAME', field: 'name' },
    { width: '150px', title: 'SUPPLIER.TAX_CODE', field: 'taxCode' }
  ];

  constructor(
    public notificationService: NotificationService,
    public reportXNKService: ReportXNKService,
    public operatingUnitService: OperatingUnitService,
    public subDepartmentService: DepartmentService,
    public supplierService: SupplierService,
    public userService: UserService
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

  public exportForeignPurchaseOrder(): void {
    this.reportXNKService.exportForeignPurchaseOrder(this.request).subscribe(m => {
      this.notificationService.showSuccess();
    });
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

  public onChangeSubDepartmentDto(): void {
    if (this.request.subDepartmentDto) {
      this.request.subDepartmentId = this.request.subDepartmentDto.subDepartmentId;
    } else {
      this.request.subDepartmentId = null;
    }
  }

  public onChangeSupplier(): void {
    if (this.request.supplierDto) {
      this.request.vendorId = this.request.supplierDto.vendorId;
    } else {
      this.request.vendorId = null;
    }
  }

  public onChangeCreatedBy(data) {
    if (this.request.createdByDto && this.request.createdByDto.length > 0) {
      const listUserId = this.request.createdByDto.map(({ id }) => id);
      this.request.listCreatedBy = listUserId.join(',');
    } else {
      this.request.listCreatedBy = null;
    }
  }

}
