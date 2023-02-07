import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { DepartmentService } from '../../../../services/modules/category/department/department.service';
import { OperatingUnitService } from '../../../../services/modules/category/organization-management/operating-unit/operating-unit.service';
import { ReportAFService } from '../../../../services/modules/report-af/report-af.service';
import { ToolbarModel } from '../../../partials/content/toolbar/toolbar.model';

@Component({
  selector: 'app-report-import-list',
  templateUrl: './report-import-list.component.html',
  styleUrls: ['./report-import-list.component.scss']
})
export class ReportImportListComponent implements OnInit {
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

  constructor(
    public notificationService: NotificationService,
    public reportAFService: ReportAFService,
    public operatingUnitService: OperatingUnitService,
    public subDepartmentService: DepartmentService
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

  public exportImportList(): void {
    this.reportAFService.exportImportList(this.request).subscribe(m => {
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

}
