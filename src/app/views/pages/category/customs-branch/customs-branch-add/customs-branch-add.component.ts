import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import * as configParent from '../../customs-branch/customs-branch.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { Guid } from 'guid-typescript';
import { NgForm } from '@angular/forms';
import { BaseFormComponent } from '../../../../../core/_base/component/base-form.component';
import { SaveConfirmation } from '../../../../../services/common/confirmation/save-confirmation';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { CustomsBranchService } from '../../../../../services/modules/category/customs-branch/customs-branch.service';
import { CustomsFeesService } from '../../../../../services/modules/category/customs-fees/customs-fees.service';
import { CustomsFeesRequestPayload } from '../../../../../services/modules/category/customs-fees/customs-fees.request.payload';
import { forkJoin } from 'rxjs';
import { CustomsTypeService } from '../../../../../services/modules/category/customs-type/customs-type.service';
import { CustomsTypeRequestPayload } from '../../../../../services/modules/category/customs-type/customs-type.request.payload';
import { Location } from '@angular/common';
@Component({
  selector: 'app-customs-branch-add',
  templateUrl: './customs-branch-add.component.html',
  styleUrls: ['./customs-branch-add.component.scss']
})
export class CustomsBranchAddComponent extends BaseFormComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;

  public mainConfig = mainConfig.MAIN_CONFIG;

  public customsBranchData: any = {
    listCustomsFees: [],
    listCustomsType: [],
    listCustomsFeesDeleteId: [],
    listCustomsTypeDeleteId: [],
  };

  public arrHeaderCustomsFees = configParent.HEADER_CUSTOMS_FEES;
  public arrHeaderCustomsType = configParent.HEADER_CUSTOMS_TYPE;

  public addItemCustomsFees: any = { id: Guid.create().toString().split('-').join('') };
  public addItemCustomsType: any = { id: Guid.create().toString().split('-').join('') };

  public arrCustomsFeesName = [
    'Nộp thuế Nhập khẩu hàng NK',
    'Nộp thuế GTGT hàng NK',
    'Nộp Lệ phí làm thủ tục hải quan'
  ];

  constructor(
    public cdr: ChangeDetectorRef,
    public router: Router,
    public route: ActivatedRoute,
    public notification: NotificationService,
    public customsBranchService: CustomsBranchService,
    public customsFeesService: CustomsFeesService,
    public customsTypeService: CustomsTypeService
  ) {
    super();
  }

  ngOnInit() {
    const routeSub = this.route.params.subscribe(params => {
      if (params.id) {

        const requestCustomsFees: any = new CustomsFeesRequestPayload();
        requestCustomsFees.customsBranchId = params.id;

        const requestCustomsType: any = new CustomsTypeRequestPayload();
        requestCustomsType.customsBranchId = params.id;

        const initSub = forkJoin([
          this.customsBranchService.selectById(params.id),
          this.customsFeesService.select(requestCustomsFees),
          this.customsTypeService.select(requestCustomsType)
        ]).subscribe(res => {
          if (res[0]) {
            this.customsBranchData = res[0];
            this.customsBranchData.listCustomsFeesDeleteId = [];
            this.customsBranchData.listCustomsTypeDeleteId = [];
            this.customsBranchData.listCustomsFees = res[1];
            this.customsBranchData.listCustomsType = res[2];
            if (this.customsBranchData.listCustomsFees.length === 0) {
              for (let i = 0; i < this.arrCustomsFeesName.length; i++) {
                const temp: any = {
                  id: Guid.create().toString().split('-').join(''),
                  name: this.arrCustomsFeesName[i]
                }
                this.customsBranchData.listCustomsFees.push(temp);
              }
            }
            setTimeout(() => {
              this.form.form.markAsPristine();
            }, 0);

          } else {
            this.goBack();
          }
          this.cdr.detectChanges();
        });
        this.subscriptions.push(initSub);
      } else {
        for (let i = 0; i < this.arrCustomsFeesName.length; i++) {
          const temp: any = {
            id: Guid.create().toString().split('-').join(''),
            name: this.arrCustomsFeesName[i]
          }
          this.customsBranchData.listCustomsFees.push(temp);
        }
      }
    });
    this.subscriptions.push(routeSub);
  }

  public goBack(): void {
    this.router.navigate([`customs-branch`], { relativeTo: this.route.parent });
  }

  public goToView(): void {
    this.router.navigate([`customs-branch/view/${this.customsBranchData.id}`], { relativeTo: this.route.parent });
  }

  public onBtnSaveClick(): void {
    if (this.form) {
      if (!this.validateForm(this.form, 'id-form-customs-branch')) {
        this.notification.showWarning('VALIDATION.FORM_VALID');
        return;
      }
      if (this.checkDuplicateCustomsFees()) {
        this.notification.showWarning('Tên khoản phí không được phép trùng lặp');
        return;
      }
      if (this.form.dirty) {
        const saveConfirmation = new SaveConfirmation();
        saveConfirmation.accept = () => {
          const dataSave: any = {
            ...this.customsBranchData
          };
          this.customsBranchService.save(dataSave).subscribe(m => {
            if (m) {
              this.customsBranchData.id = m.id;
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

  public checkDuplicateCustomsFees(): boolean {
    let check = false;
    const arr = [];
    for (const item of this.customsBranchData.listCustomsFees) {
      if (arr.some(m => m.trim().toLocaleLowerCase() === item.name.trim().toLocaleLowerCase())) {
        check = true;
        break;
      } else {
        arr.push(item.name);
      }
    }
    return check;
  }

  public onBtnCancelClick(): void {
    this.goBack();
  }

  public addNewRowCustomsType(): void {
    if (this.addItemCustomsType.code) {
      this.addItemCustomsType.code = this.addItemCustomsType.code.trim();
    }
    if (this.addItemCustomsType.name) {
      this.addItemCustomsType.name = this.addItemCustomsType.name.trim();
    }

    if (!this.addItemCustomsType.code) {
      this.notification.showWarning('Vui lòng nhập đủ thông tin');
      return;
    }
    const checkExists = this.customsBranchData.listCustomsType.some(m => m.code.trim().toLocaleLowerCase() === this.addItemCustomsType.code.trim().toLocaleLowerCase());
    if (checkExists) {
      this.notification.showWarning('Mã loại hình tồn tại');
      return;
    }
    this.customsBranchData.listCustomsType.push(this.addItemCustomsType);
    this.addItemCustomsType = { id: Guid.create().toString().split('-').join('') };
    this.cdr.detectChanges();
    this.form.form.markAsDirty();
  }

  public deleteRowCustomsType(indexRow: any, rowData: any): void {
    const temp = this.customsBranchData.listCustomsType.find((element, index) => index === indexRow);
    if (temp.id) {
      this.customsBranchData.listCustomsTypeDeleteId.push(temp.id);
    }
    this.customsBranchData.listCustomsType = this.customsBranchData.listCustomsType.filter((element, index) => index !== indexRow);
    this.form.form.markAsDirty();
  }

  public addNewRowCustomsFees(): void {
    if (this.addItemCustomsFees.name) {
      this.addItemCustomsFees.name = this.addItemCustomsFees.name.trim();
    }
    if (this.addItemCustomsFees.chapterCode) {
      this.addItemCustomsFees.chapterCode = this.addItemCustomsFees.chapterCode.trim();
    }
    if (this.addItemCustomsFees.economicContentCode) {
      this.addItemCustomsFees.economicContentCode = this.addItemCustomsFees.economicContentCode.trim();
    }

    if (!this.addItemCustomsFees.name) {
      this.notification.showWarning('Vui lòng nhập đủ thông tin');
      return;
    }
    const checkExists = this.customsBranchData.listCustomsFees.some(m => m.name.trim().toLocaleLowerCase() === this.addItemCustomsFees.name.trim().toLocaleLowerCase());
    if (checkExists) {
      this.notification.showWarning('Tên khoản phí đã tồn tại');
      return;
    }
    this.customsBranchData.listCustomsFees.push(this.addItemCustomsFees);
    this.addItemCustomsFees = { id: Guid.create().toString().split('-').join('') };
    this.cdr.detectChanges();
    this.form.form.markAsDirty();
  }

  public deleteRowCustomsFees(indexRow: any, rowData: any): void {
    if (this.arrCustomsFeesName.includes(rowData.name)) {
      this.notification.showWarning('Không thể xóa khoản phí mặc định');
      return;
    }
    const temp = this.customsBranchData.listCustomsFees.find((element, index) => index === indexRow);
    if (temp.id) {
      this.customsBranchData.listCustomsFeesDeleteId.push(temp.id);
    }
    this.customsBranchData.listCustomsFees = this.customsBranchData.listCustomsFees.filter((element, index) => index !== indexRow);
    this.form.form.markAsDirty();
  }

}
