import { V } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../../../../../core/_base/component';
import { SaveConfirmation } from '../../../../../services/common/confirmation/save-confirmation';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { TempMailService } from '../../../../../services/modules/config-temp-mail/config-temp-mail.service';
import { RoleService } from '../../../../../services/modules/role/role.service';
import { UserService } from '../../../../../services/modules/user/user.service';
import { FormDynamicData } from '../../../../partials/content/crud/component/form-dynamic-data.model';
@Component({
  selector: 'app-config-temp-mail-edit',
  templateUrl: './config-temp-mail-edit.component.html',
  styleUrls: ['./config-temp-mail-edit.component.scss']
})
export class ConfigTempMailEditComponent extends BaseFormComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  @Output() success: EventEmitter<any> = new EventEmitter();
  public tempMailData: any = {};
  public bodyOrigin: string;
  constructor(
    public userService: UserService,
    public roleService: RoleService,
    public tempMailService: TempMailService,
    private notification: NotificationService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    const routeSub = this.route.params.subscribe((params) => {
      if (params.id) {
        this.tempMailService.selectById(params.id).subscribe((res) => {
          if (res) {
            this.tempMailData = res;
            this.bodyOrigin = res.body;
          }
          setTimeout(() => {
            this.form.form.markAsPristine();
            this.cd.detectChanges();
          }, 0);
        });
      } else {
        this.tempMailData = { status: 1 };
      }
    });
    this.subscriptions.push(routeSub);
  }

  public onBtnSaveClick(): void {
    if (this.form) {
      if (!this.validateForm(this.form, 'id-form-temp-mail')) {
        this.notification.showMessage('VALIDATION.FORM_VALID');
        return;
      }

      if (this.form.dirty) {
        const saveConfirmation = new SaveConfirmation();
        saveConfirmation.accept = () => {
          this.tempMailData.body = this.bodyOrigin;
          this.tempMailService.merge(this.tempMailData).subscribe(() => {
            this.notification.showSuccess();
            this.goBack();
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

  public goBack() {
    this.router.navigate(["apps/setting/config-mail/template"]);
  }

  public onChangeRoles(data) {
    if (this.tempMailData.rolesDto) {
      const listRole = this.tempMailData.rolesDto.map(({ code }) => code);
      this.tempMailData.roles = listRole.join(',');
    }
  }

  public onChangeReceivers(data) {
    if (this.tempMailData.receiversDto) {
      const listUserName = this.tempMailData.receiversDto.map(({ userName }) => userName);
      this.tempMailData.receivers = listUserName.join(',');
    }
  }

}
