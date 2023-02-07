import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BaseFormComponent } from '../../../../../../core/_base/component';
import { SaveConfirmation } from '../../../../../../services/common/confirmation';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { NotificationListService } from '../../../../../../services/modules/notification-list/notification-list.service';
import { UserRequestPayload } from '../../../../../../services/modules/user/user-request.payload';
import { UserService } from '../../../../../../services/modules/user/user.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from './notification-dialog.config';
@Component({
  selector: 'app-notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.scss']
})
export class NotificationDialogComponent extends BaseFormComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  public headerUser = config.HEADER_USER;
  public userRequestPayLoad = new UserRequestPayload();

  @Input() title = 'Bạn có muốn thông báo việc này đến ai đó ?';
  @Input() notificationData: any = {};
  @Input() dialogNotification: DialogRef;

  constructor(
    public userService: UserService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef,
    public notificationListService: NotificationListService
  ) {
    super();
  }

  ngOnInit() {
  }

  public onChangeRecipientId(event: any) {
    if (event) {
      this.notificationData.recipientId = event.id;
    }
  }

  public onSaveNotification(isSave?: any): void {
    if (this.form) {
      if (!this.validateForm(this.form, 'notificationDialogRef')) {
        return;
      }
      this.processSave();
    }
  }

  public processSave(): void {
    const confirmation = new SaveConfirmation();
    confirmation.accept = () => {
      const saveSub = this.notificationListService.merge(this.notificationData).subscribe((res) => {
        if (res) {
          this.notification.showSuccess();
          this.dialogNotification.hide();
          this.cdr.detectChanges();
        }
      });
      this.subscriptions.push(saveSub);
    };
    this.notification.confirm(confirmation);
  }

}
