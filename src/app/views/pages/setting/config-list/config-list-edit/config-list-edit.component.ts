import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BaseFormComponent } from '../../../../../core/_base/component/base-form.component';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { ConfigListService } from '../../../../../services/modules/config-list/config-list.service';
import { DialogRef } from '../../../../partials/content/crud/dialog/dialog-ref.model';

@Component({
  selector: 'app-config-list-edit',
  templateUrl: './config-list-edit.component.html',
  styleUrls: ['./config-list-edit.component.scss']
})
export class ConfigListEditComponent extends BaseFormComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  @Input() dialogRef: DialogRef;
  @Output() success: EventEmitter<any> = new EventEmitter();
  public formId: 'config-list-edit';
  constructor(
    public configListService: ConfigListService,
    public notification: NotificationService,
    public cd: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
  }

  /**
   * Hande event when click button save click
   */
  public onBtnSaveClick(): void {
    if (!this.dialogRef.input.id) {
      const item = this.dialogRef.input.types.find(x => x.key === this.dialogRef.input.type);
      if (item) {
        this.dialogRef.input.indexNo = item.count + 1;
      } else {
        this.dialogRef.input.indexNo = 1;
      }
    }
    this.configListService.merge(this.dialogRef.input).subscribe(res => {
      this.notification.showSuccess();
      if (this.dialogRef.output) {
        Object.assign(this.dialogRef.output, res);
      } else {
        this.success.emit(res);
      }
      this.dialogRef.hide();
      this.success.emit(res);
      this.cd.detectChanges();
    });
  }

  /**
   * Handle event when delete click
   */
  public onBtnDeleteClick(): void {
    this.configListService.delete(this.dialogRef.input.id).subscribe(res => {
      this.notification.showSuccess();
      this.dialogRef.hide();
      this.success.emit(true);
      this.cd.detectChanges();
    });
  }

  public onBtnCancelClick(): void {
    this.success.emit();
  }
}

