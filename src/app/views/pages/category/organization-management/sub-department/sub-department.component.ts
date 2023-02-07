import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DepartmentService } from '../../../../../services/modules/category/department/department.service';
import * as mainConfig from "../../../../../core/_config/main.config";
import * as config from "./sub-department.config";
import { DepartmentRequestPayload } from '../../../../../services/modules/category/department/department.request.payload';
import { DialogRef } from '../../../../partials/content/crud/dialog/dialog-ref.model';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { SaveConfirmation } from '../../../../../services/common/confirmation/save-confirmation';
import { AfGroupService } from '../../../../../services/modules/af-group/af-group.service';
import { forkJoin, merge } from 'rxjs';
import { MatPaginator } from '@angular/material';
import { tap } from 'rxjs/operators';
import { BaseFormComponent } from '../../../../../core/_base/component/base-form.component';

@Component({
  selector: 'app-sub-department',
  templateUrl: './sub-department.component.html',
  styleUrls: ['./sub-department.component.scss']
})
export class SubDepartmentComponent extends BaseFormComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('paginatorAfAssigned', { static: true }) paginatorAfAssigned: MatPaginator;
  public dialogRefEdit: DialogRef = new DialogRef();
  public dialogRefAfAssigned: DialogRef = new DialogRef();

  public headers = config.HEADER;
  public headersAfAssigned = config.HEADER_AF_ASSIGNED;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public request: any = {};
  public dataSource = {
    items: null,
    paginatorTotal: undefined
  };
  public dataSourceAfAssigned = {
    items: null,
    paginatorTotal: undefined
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
    public departmentService: DepartmentService,
    public afGroupService: AfGroupService
  ) {
    super();
  }

  ngOnInit() {
    this.mainConfig = mainConfig.MAIN_CONFIG;
    this.headers = config.HEADER;
    this.request = new DepartmentRequestPayload();
    this.initData();
    this.pagingData();
    this.pagingDataAfAssigned();
  }

  public initData(): void {
    if (this.paginator) {
      this.request.pageIndex = this.paginator.pageIndex;
      this.request.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
    }
    const requests = [
      this.departmentService.select(this.request),
      this.departmentService.count(this.request)
    ];
    const sub = forkJoin(requests).subscribe(
      (response: any[]) => {
        this.dataSource.items = response[0];
        this.dataSource.paginatorTotal = response[1];
        this.cdr.detectChanges();
      });
    this.subscriptions.push(sub);
  }

  public pagingData(): void {
    if (this.paginator) {
      const paginatorSubscriptions = merge(this.paginator.page).pipe(
        tap(() => {
          this.initData();
        })
      ).subscribe();
      this.subscriptions.push(paginatorSubscriptions);
    }
  }

  public onBtnEditClick(rowData: any): void {
    const temp = JSON.parse(JSON.stringify(rowData));
    this.dialogRefEdit.input = temp;
    this.dialogRefEdit.show();
    this.form.form.markAsPristine();
    this.cdr.detectChanges();
  }

  public onBtnSaveClick(): void {
    if (this.form) {
      if (!this.validateForm(this.form, 'id-form-edit-sub-department')) {
        this.notificationService.showMessage('VALIDATION.FORM_VALID');
        return;
      }
      if (this.form.dirty) {
        const saveConfirmation = new SaveConfirmation();
        saveConfirmation.accept = () => {
          this.departmentService.merge(this.dialogRefEdit.input).subscribe(() => {
            this.setDataAfterSave(this.dialogRefEdit.input);
            this.dialogRefEdit.hide();
            this.notificationService.showSuccess();
          });
        };
        this.notificationService.confirm(saveConfirmation);
      } else {
        this.dialogRefEdit.hide();
      }
    } else {
      this.dialogRefEdit.hide();
    }
  }

  public setDataAfterSave(data) {
    for (let i = 0; i < this.dataSource.items.length; i++) {
      if (this.dataSource.items[i].subDepartmentId === data.subDepartmentId) {
        this.dataSource.items[i].acronym = data.acronym;
      }
    }
  }

  public close() {
    this.dialogRefEdit.hide();
  }

  public closeAfAssigned() {
    this.dialogRefAfAssigned.hide();
  }

  public onBtnViewAfAssign(rowData: any): void {
    const request: any = {};
    if (this.paginatorAfAssigned) {
      request.subDepartmentId = rowData.subDepartmentId;
      request.pageIndex = this.paginatorAfAssigned.pageIndex;
      request.pageSize = this.paginatorAfAssigned.pageSize ? this.paginatorAfAssigned.pageSize : 10;
    }
    const requests = [
      this.afGroupService.selectUserAssignedSubDepartment(request),
      this.afGroupService.countUserAssignedSubDepartment(request)
    ];
    const sub = forkJoin(requests).subscribe(
      (response: any[]) => {
        this.dataSourceAfAssigned.items = response[0];
        this.dataSourceAfAssigned.paginatorTotal = response[1];
        this.cdr.detectChanges();
      });
    this.subscriptions.push(sub);
    this.dialogRefAfAssigned.input = rowData;
    this.dialogRefAfAssigned.show();
    this.form.form.markAsPristine();
    this.cdr.detectChanges();
  }

  public pagingDataAfAssigned(): void {
    if (this.paginatorAfAssigned) {
      const paginatorSubscriptions = merge(this.paginatorAfAssigned.page).pipe(
        tap(() => {
          this.onBtnViewAfAssign(this.dialogRefAfAssigned.input);
        })
      ).subscribe();
      this.subscriptions.push(paginatorSubscriptions);
    }
  }
}
