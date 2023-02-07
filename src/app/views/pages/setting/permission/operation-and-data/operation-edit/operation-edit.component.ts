import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { DialogRef } from '../../../../../../views/partials/content/crud/dialog/dialog-ref.model';
import { OperationService } from '../../../../../../services/modules/operation/operation.service';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { NgForm } from '@angular/forms';
import { BaseFormComponent } from '../../../../../../core/_base/component/base-form.component';
import { CancelConfirmation, SaveConfirmation } from '../../../../../../services/common/confirmation';
import { OperationRequestPayload } from '../../../../../../services/modules/operation/operation-request.payload';
import * as config from './operation-edit.config';

@Component({
  selector: 'app-operation-data-edit',
  templateUrl: './operation-edit.component.html',
  styleUrls: ['./operation-edit.component.scss']
})
export class OperationDataEditComponent extends BaseFormComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  @Input() dialogRef: DialogRef;
  @Output() success: EventEmitter<any> = new EventEmitter();

  public request = new OperationRequestPayload();
  public type: any[] = config.TYPE;
  public method: any;
  public isDisplay = false;
  public menuData: any[];
  public parentName = 'OPERATION.DEFAULT';
  public header = config.HEADER;
  constructor(
    public operationService: OperationService,
    public notification: NotificationService,
    public cd: ChangeDetectorRef) {
    super();
  }
  public feMethod = config.FE_METHOD;
  public beMethod = config.BE_METHOD;

  ngOnInit() {
    if (!this.dialogRef.input.type) {
      this.dialogRef.input.type = 1;
      this.request.type = this.dialogRef.input.type;
    } else {
      this.request.type = this.dialogRef.input.type;
    }

    if (!this.dialogRef.input.method) {
      this.dialogRef.input.method = 'MENU';
      this.request.method = this.dialogRef.input.method;
    } else {
      this.request.method = this.dialogRef.input.method;
    }
    this.request.pageSize = 20;
  }

  /**
   * Hande event when click button save click
   */
  public onBtnSaveFormClick(): void {
    const isUpdate = !!this.dialogRef.input.id;
    const save = new SaveConfirmation();
    save.accept = () => {
      this.operationService.merge(this.dialogRef.input).subscribe(res => {
        if (this.dialogRef.output) {
          Object.assign(this.dialogRef.output, res);
        }

        this.dialogRef.input = res;
        this.dialogRef.input.isShowDelete = true;

        this.request.type = this.dialogRef.input.type;
        this.request.method = this.dialogRef.input.method;
        this.request.excludeIds = this.dialogRef.input.id;

        this.success.emit(isUpdate ? 'UPDATE' : 'INSERT');
        this.dialogRef.hide();
        this.notification.showSuccess();
        this.cd.detectChanges();
      });
    };

    this.notification.confirm(save);
  }

  /**
   * Find type by value
   */
  public findType(value: string) {
    return this.type.find(o => o.value === +value).label;
  }

  public ChangeIndex(event: any) {
    if (event) {
      if (event.dragIndex < event.dropIndex) {
        for (let i = event.dragIndex; i <= event.dropIndex; i++) {
          this.menuData[i].temp = i + 1;
        }
      }
      if (event.dragIndex > event.dropIndex) {
        for (let i = event.dropIndex; i <= event.dragIndex; i++) {
          this.menuData[i].temp = i + 1;
        }
      }
    }
  }

  /**
   * Handle event when select button
   */
  public onChangeSelectType() {
    const value = this.dialogRef.input.type;

    if (value === 1) {
      this.dialogRef.input.method = this.feMethod[1].value;
    }
    if (value === 0) {
      this.dialogRef.input.method = this.beMethod[0].value;
    }

    this.request.type = this.dialogRef.input.type;
    this.request.method = this.dialogRef.input.method;
    this.request.excludeIds = this.dialogRef.input.id;
    this.onChangeMethod();
  }

  private checkTable(): boolean {
    for (const item of this.menuData) {
      if (item.menuOrder !== item.temp) {
        return false;
      }
    }
    return true;
  }

  public onChangeMethod() {
    if (this.dialogRef.input.method === 'VIEW') {
      if (this.dialogRef.input.menuOrder) {
        this.dialogRef.input.menuOrder = 0;
      }
      if (this.dialogRef.input.menuIcon) {
        this.dialogRef.input.menuIcon = null;
      }
    }
    this.request.method = this.dialogRef.input.method;
    this.cd.detectChanges();
  }

  public onBtnShow() {
    if (this.form) {
      if (!this.validateForm(this.form, 'role-edit')) {
        return;
      }
      if (this.form.form.dirty) {
        const save = new SaveConfirmation();
        save.accept = () => {
          this.operationService.merge(this.dialogRef.input).subscribe(res => {
            this.notification.showSuccess();
            if (this.dialogRef.output) {
              Object.assign(this.dialogRef.output, res);
            } else {
              this.success.emit(true);
            }
            this.dialogRef.input = res;
            this.dialogRef.input.isShowDelete = true;
            this.request.type = this.dialogRef.input.type;
            this.request.method = this.dialogRef.input.method;
            this.request.excludeIds = this.dialogRef.input.id;
            this.success.emit(true);
            this.cd.detectChanges();
            this.initData();
            //
          });
        };
        this.notification.confirm(save);
      } else { this.initData(); }
    }
  }

  public initData() {
    const req = new OperationRequestPayload();
    if (this.dialogRef.input.parentOperation) {
      this.parentName = this.dialogRef.input.parentOperation.name;
    }
    req.parentMenu = this.dialogRef.input.parentMenu;
    this.operationService.selectByParentMenu(req).subscribe(e => {
      this.menuData = e;
      this.isDisplay = true;
      for (let i = 1; i <= this.menuData.length; i++) {
        this.menuData[i - 1].temp = i;
      }
      this.cd.detectChanges();
    });
  }

  public markAsPristine(): void {
    if (this.form) {
      this.form.form.markAsPristine();
      this.cd.detectChanges();
    }
  }

  /**
   * Handle event when delete click
   */
  public onBtnDeleteClick(): void {
    this.operationService.delete(this.dialogRef.input.id).subscribe(res => {
      this.notification.showSuccess();
      this.dialogRef.hide();
      this.success.emit('DELETE');
      this.cd.detectChanges();
    });
    this.cd.detectChanges();
  }

  public onReorderBtnCancelClick(): void {
    if (!this.checkTable()) {
      const cancelConfirmation = new CancelConfirmation();
      cancelConfirmation.accept = () => {
        this.isDisplay = false;
        this.menuData = null;
        this.success.emit(true);
        setTimeout(() => {
          this.markAsPristine();
        }, 500);
        this.cd.detectChanges();
      };
      this.notification.confirm(cancelConfirmation);
    } else {
      this.isDisplay = false;
      this.menuData = null;
      setTimeout(() => {
        this.markAsPristine();
      }, 0);
      this.cd.detectChanges();
    }
  }
  public onReorderBtnSaveClick(): void {
    if (!this.checkTable()) {
      const save = new SaveConfirmation();
      save.accept = () => {
        this.menuData.forEach(e => e.menuOrder = e.temp);
        this.operationService.bulkUpdate(this.menuData).subscribe(() => {
          this.notification.showSuccess();
          this.isDisplay = false;
          this.operationService.selectById(this.dialogRef.input.id).subscribe(res => {
            this.dialogRef.input = res;
            this.dialogRef.input.isShowDelete = true;
            this.request.type = this.dialogRef.input.type;
            this.request.method = this.dialogRef.input.method;
            this.request.excludeIds = this.dialogRef.input.id;
            this.cd.detectChanges();
          });
          this.success.emit(true);
          setTimeout(() => {
            this.markAsPristine();
          }, 0);
          this.cd.detectChanges();
        });
      };
      this.notification.confirm(save);
    } else {
      this.isDisplay = false;
      this.menuData = null;
      setTimeout(() => {
        this.markAsPristine();
      }, 0);
      this.cd.detectChanges();
    }
  }

  public onShowDialog(): void {
    if (this.dialogRef.input.parentMenu) {
      this.operationService.selectById(this.dialogRef.input.parentMenu).subscribe(res => {
        this.dialogRef.input.parentOperation = res;
        setTimeout(() =>
          this.form.form.markAsPristine(), 0);
        this.cd.detectChanges();
      });
    }
    this.request.excludeIds = this.dialogRef.input.id;
    if (!this.dialogRef.input.type) {
      this.dialogRef.input.type = 1;
      this.request.type = this.dialogRef.input.type;
    } else {
      this.request.type = this.dialogRef.input.type;
    }

    if (!this.dialogRef.input.method) {
      this.dialogRef.input.method = 'MENU';
      this.request.method = this.dialogRef.input.method;
    } else {
      this.request.method = this.dialogRef.input.method;
    }
    setTimeout(() =>
      this.form.form.markAsPristine(), 0);
    this.cd.detectChanges();
  }
}

