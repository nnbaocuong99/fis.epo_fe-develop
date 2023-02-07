import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormComponent } from '../../../../core/_base/component/base-form.component';
import { NotificationService } from '../../../../services/common/notification/notification.service';
// tslint:disable-next-line: max-line-length
import { AllCodeCombinationsRequestPayload } from '../../../../services/modules/all-code-combinations/all-code-combinations.request-payload';
import { AllCodeCombinationsService } from '../../../../services/modules/all-code-combinations/all-code-combinations.service';
import { AccountRequestPayload } from '../../../../services/modules/category/account/account.request.payload';
import { AccountSyncService } from '../../../../services/modules/category/account/account.service';
import { BusinessFieldRequestPayload } from '../../../../services/modules/category/business-field/business-field.request.payload';
import { BusinessFieldService } from '../../../../services/modules/category/business-field/business-field.service';
import { BusinessTypeRequestPayload } from '../../../../services/modules/category/business-type/business-type.request.payload';
import { BusinessTypeService } from '../../../../services/modules/category/business-type/business-type.service';
import { CompanyRequestPayload } from '../../../../services/modules/category/company/company.request.payload';
import { CompanyService } from '../../../../services/modules/category/company/company.service';
import { DepartmentRequestPayload } from '../../../../services/modules/category/department/department.request.payload';
import { DepartmentService } from '../../../../services/modules/category/department/department.service';
import { IntercompanyRequestPayload } from '../../../../services/modules/category/intercompany/intercompany.request.payload';
import { IntercompanyService } from '../../../../services/modules/category/intercompany/intercompany.service';
import { PreventiveRequestPayload } from '../../../../services/modules/category/preventive/preventive.request.payload';
import { PreventiveService } from '../../../../services/modules/category/preventive/preventive.service';
import { RegionsRequestPayload } from '../../../../services/modules/category/regions/regions.request.payload';
import { RegionsService } from '../../../../services/modules/category/regions/regions.service';
import { DialogRef } from '../../content/crud/dialog/dialog-ref.model';

export const SELECT_SYNC_SOURCE_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectTermAccountComponent),
  multi: true
};

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'select-term-account',
  templateUrl: './select-term-account.component.html',
  styleUrls: ['./select-term-account.component.scss'],
  providers: [SELECT_SYNC_SOURCE_CONTROL_VALUE_ACCESSOR]
})
export class SelectTermAccountComponent extends BaseFormComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  public dialogRef: DialogRef = new DialogRef();
  @Input() placeholder: string;
  @Input() disabled = false;
  @Input() required = false;
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() saveFirstRow: EventEmitter<any> = new EventEmitter();

  public allCodeCombinationsRequestPayload = new AllCodeCombinationsRequestPayload();
  public companyRequestPayload = new CompanyRequestPayload();
  public regionsRequestPayload = new RegionsRequestPayload();
  public subDepartmentRequestPayload = new DepartmentRequestPayload();
  public accountRequestPayload = new AccountRequestPayload();
  public businessFieldRequestPayload = new BusinessFieldRequestPayload();
  public businessTypeRequestPayload = new BusinessTypeRequestPayload();
  public intercompanyRequestPayload = new IntercompanyRequestPayload();
  public preventiveRequestPayload = new PreventiveRequestPayload();

  private _ouId: any;
  get ouId(): any { return this._ouId; }
  @Input() set ouId(v: any) {
    if (v) {
      this._ouId = v;
      this.companyRequestPayload.ouId = v;
    }
  }

  public arr = [];
  public obj: any = {};

  constructor(
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
    public allCodeCombinationsService: AllCodeCombinationsService,
    public companyService: CompanyService,
    public regionsService: RegionsService,
    public subDepartmentService: DepartmentService,
    public accountSyncService: AccountSyncService,
    public businessFieldService: BusinessFieldService,
    public businessTypeService: BusinessTypeService,
    public intercompanyService: IntercompanyService,
    public preventiveService: PreventiveService
  ) {
    super();
  }

  public value: any = null;

  writeValue(value: any) {
    if (value) {
      this.value = value;
      const arrTemp = value.split('.');
      if (arrTemp.length === 8) {
        this.arr = arrTemp;
        this.allCodeCombinationsRequestPayload.allCode = value;
        this.allCodeCombinationsService.selectAllTypeObject(this.allCodeCombinationsRequestPayload).subscribe(m => {
          if (m) {
            if (m.company) {
              this.obj.companyDto = {
                name: m.company.name,
                code: m.company.code,
              };
              this.subDepartmentRequestPayload.companyCode = m.company.code;
            }
            if (m.regions) {
              this.obj.regionsDto = {
                name: m.regions.name,
                code: m.regions.code,
              };
            }
            if (m.subDepartment) {
              this.obj.subDepartmentDto = {
                name: m.subDepartment.name,
                code: m.subDepartment.code,
              };
            }
            if (m.account) {
              this.obj.accountDto = {
                name: m.account.name,
                code: m.account.code,
              };
            }
            if (m.businessField) {
              this.obj.businessFieldDto = {
                name: m.businessField.name,
                code: m.businessField.code,
              };
              this.businessTypeRequestPayload.businessFieldCode = m.businessField.code;
            }
            if (m.businessType) {
              this.obj.businessTypeDto = {
                name: m.businessType.name,
                code: m.businessType.code,
              };
            }
            if (m.intercompany) {
              this.obj.intercompanyDto = {
                name: m.intercompany.name,
                code: m.intercompany.code,
              };
            }
            if (m.preventive) {
              this.obj.preventiveDto = {
                name: m.preventive.name,
                code: m.preventive.code,
              };
            }
          }
        });
      } else {
        this.arr = [];
        this.obj = {};
        this.value = null;
      }
    } else {
      this.arr = [];
      this.obj = {};
      this.value = null;
    }
  }

  onChange = (_: any) => { };
  onTouched = () => { };
  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  ngOnInit() {
    this.companyRequestPayload.pageSize = 20;
    this.regionsRequestPayload.pageSize = 20;
    this.subDepartmentRequestPayload.pageSize = 20;
    this.accountRequestPayload.pageSize = 20;
    this.businessFieldRequestPayload.pageSize = 20;
    this.businessTypeRequestPayload.pageSize = 20;
    this.intercompanyRequestPayload.pageSize = 20;
    this.preventiveRequestPayload.pageSize = 20;
  }

  public onBtnShowDialogListClick(): void {
    this.cdr.detectChanges();
    this.dialogRef.show();
  }

  public close() {
    this.dialogRef.hide();
  }

  public onBtnSaveClick(): void {
    if (this.form) {
      if (!this.validateForm(this.form, 'id-edit-term-account')) {
        this.notificationService.showMessage('VALIDATION.FORM_VALID');
        return;
      }
      if (this.form.dirty) {
        this.value = this.arr.join('.');
        this.onChange(this.value);
        this.saveFirstRow.emit();
        this.change.emit(this.obj);
        this.dialogRef.hide();
      } else {
        this.dialogRef.hide();
      }
    } else {
      this.dialogRef.hide();
    }
  }

  public onChangeValueControl(data, type, inWriteValue?): void {
    if (type === 'company') {
      if (data) {
        this.subDepartmentRequestPayload.companyCode = data.code;
      }
      if (!inWriteValue) {
        this.obj.subDepartmentDto = null;
      }
    }
    if (type === 'regions') {

    }
    if (type === 'subDepartment') {

    }
    if (type === 'account') {

    }
    if (type === 'businessField') {
      if (data) {
        this.businessTypeRequestPayload.businessFieldCode = data.code;
      }
      if (!inWriteValue) {
        this.obj.businessTypeDto = null;
      }
    }
    if (type === 'businessType') {

    }
    if (type === 'intercompany') {

    }
    if (type === 'preventive') {

    }
  }

  public onBtnCancelClick(): void {
    this.dialogRef.hide();
  }

  public onModelChangeInput(data: any) {
    this.onChange(data);
    this.change.emit(data);
    if (!this.value) {
      this.arr = [];
      this.obj = {};
    }
  }

}
