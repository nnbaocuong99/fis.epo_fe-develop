import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { DialogRef } from '../../../../../../views/partials/content/crud/dialog/dialog-ref.model';
import { RoleService } from '../../../../../../services/modules/role/role.service';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { NgForm } from '@angular/forms';
import { BaseFormComponent } from '../../../../../../core/_base/component/base-form.component';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material';
import { UserService } from '../../../../../../services/modules/user/user.service';
import { UserRequestPayload } from '../../../../../../services/modules/user/user-request.payload';
import * as config from './role-edit.config';
import { CancelConfirmation, SaveConfirmation } from '../../../../../../services/common/confirmation';
import { UserOrgComponent } from '../../../user-management/user-edit/user-org/user-org.component';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss']
})
export class RoleEditComponent extends BaseFormComponent implements OnInit {
  @ViewChild('popupForm', { static: true }) popupForm: NgForm;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('form', { static: true }) form: NgForm;
  @ViewChild('userOrg', { static: true }) userOrg: UserOrgComponent;
  @Input() dialogRef: DialogRef;
  @Input() userDialogRef: DialogRef;
  @Output() success: EventEmitter<any> = new EventEmitter();
  public operationDialogRef = new DialogRef();
  public headers = config.HEADER;
  public userList: any;
  public isShowAddUser = false;
  public email: string;
  public request = new UserRequestPayload();
  public userRequest = new UserRequestPayload();
  public userDeleteRequest = new UserRequestPayload();
  public insertUserRequest: any = {};

  public userData: any = {};
  constructor(
    public roleService: RoleService,
    public userService: UserService,
    public notification: NotificationService,
    public cd: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    // Set role id for operation dialog ref
    this.operationDialogRef.visibility$.subscribe(res => {
      if (res) {
        this.operationDialogRef.input.roleId = this.dialogRef.input.id;
      }
    });
    this.operationDialogRef.input.styleClass = 'action-link';
    this.operationDialogRef.input.text = 'ROLE.SET_RESOURCE';

    this.initData();
    const paginatorSubscriptions = merge(this.paginator.page).pipe(
      tap(() => {
        this.initData();
      })
    ).subscribe();
    this.subscriptions.push(paginatorSubscriptions);
    setTimeout(() => {
      this.form.form.markAsPristine();
      this.popupForm.form.markAsPristine();
    }, 0);

    // const routeSub = this.route.params.subscribe((params) => {
    // 	if (params.id) {
    // 		this.userService.selectById(params.id).subscribe((res) => {
    // 			this.userData = res;
    // 			this.cd.detectChanges();
    // 			setTimeout(() => {
    // 				this.form.form.markAsPristine();
    // 			}, 0);
    // 		});
    // 	} else {
    // 		this.userData = {};
    // 	}
    // });
    // this.subscriptions.push(routeSub);
  }

  /**
   * Hande event when click button save click
   */
  public onBtnSaveClick(): void {
    this.roleService.merge(this.dialogRef.input).subscribe(res => {
      this.notification.showSuccess();
      if (this.dialogRef.output) {
        Object.assign(this.dialogRef.output, res);
      } else {
        this.success.emit(true);
      }
      this.dialogRef.hide();
      this.success.emit();
      this.cd.detectChanges();
    });
  }

  /**
   * Handle event when delete click
   */
  public onBtnDeleteClick(): void {
    this.roleService.delete(this.dialogRef.input.id).subscribe(res => {
      this.notification.showSuccess();
      this.dialogRef.hide();
      this.success.emit(true);
      this.cd.detectChanges();
    });
  }

  /**
   * Init dialog data
   */
  public initData(): void {
    this.request.roleId = this.dialogRef.input.id;
    this.request.pageIndex = this.paginator.pageIndex;
    this.request.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
    const subSelect = this.userService.select(this.request).subscribe(res => {
      this.userDialogRef.input.items = res;
      this.cd.detectChanges();
    });
    const subCount = this.userService.count(this.request).subscribe(res => {
      this.userDialogRef.input.paginatorTotal = res;
      this.cd.detectChanges();
    });
    this.subscriptions.push(...[subSelect, subCount]);
  }

  /**
   * Pop up form save
   */
  public onBtnSaveUsers(): void {
    if (this.popupForm.form.dirty) {
      const save = new SaveConfirmation();
      save.accept = () => {
        this.insertUserRequest.ids = this.userList.map(x => x.id);
        this.insertUserRequest.roleId = this.dialogRef.input.id;
        this.userService.bulkInsert(this.insertUserRequest).subscribe(() => {
          this.notification.showSuccess();
          this.isShowAddUser = false;
          this.userList = null;
          this.initData();
          this.success.emit(true);
          setTimeout(() => {
            this.popupForm.form.markAsPristine();
          }, 0);
          this.cd.detectChanges();
        });
      };
      this.notification.confirm(save);
    } else {
      this.isShowAddUser = false;
      this.userList = null;
      setTimeout(() => {
        this.popupForm.form.markAsPristine();
      }, 0);
      this.cd.detectChanges();
    }
  }

  /**
   * Pop up form cancel
   */
  public onBtnCancelUsers(): void {
    if (this.popupForm.form.dirty) {
      const cancelConfirmation = new CancelConfirmation();
      cancelConfirmation.accept = () => {
        this.isShowAddUser = false;
        this.userList = null;
        this.success.emit(true);
        setTimeout(() => {
          this.popupForm.form.markAsPristine();
        }, 0);
        this.cd.detectChanges();
      };
      this.notification.confirm(cancelConfirmation);
    } else {
      this.isShowAddUser = false;
      this.userList = null;
      setTimeout(() => {
        this.popupForm.form.markAsPristine();
      }, 0);
      this.cd.detectChanges();
    }
  }

  /**
   * Dialog delete user
   */
  public onBtnDelUserClick(rowData: any) {
    this.userDeleteRequest.id = rowData.id;
    this.userDeleteRequest.roleId = this.dialogRef.input.id;
    this.userService.deleteUserFromRole(this.userDeleteRequest).subscribe(res => {
      setTimeout(() =>
        this.form.form.markAsPristine(), 0);
      this.initData();
      this.notification.showSuccess();
      this.userDeleteRequest = new UserRequestPayload();
    });
  }

  /**
   * Dialog add user
   */
  public onBtnAddUserClick() {
    if (this.form) {
      if (!this.validateForm(this.form, 'role-edit')) {
        return;
      }
      if (this.form.form.dirty) {
        const save = new SaveConfirmation();
        save.accept = () => {
          this.roleService.merge(this.dialogRef.input).subscribe(res => {
            this.notification.showSuccess();
            if (this.dialogRef.output) {
              Object.assign(this.dialogRef.output, res);
            } else {
              this.success.emit(true);
            }
            this.dialogRef.input.id = res.id;
            this.userRequest.excludeIds = this.userDialogRef.input.items ? this.userDialogRef.input.items.map(x => x.id) : null;
            this.isShowAddUser = true;
            this.cd.detectChanges();
            setTimeout(() => {
              this.form.form.markAsPristine();
              this.popupForm.form.markAsPristine();
            }, 0);
          });
        };
        this.notification.confirm(save);
      } else {
        this.userRequest.excludeIds = this.userDialogRef.input.items ? this.userDialogRef.input.items.map(x => x.id) : null;
        this.isShowAddUser = true;
        this.cd.detectChanges();
      }
    }
  }

  // public onAfterTreeInit(): void {
  // 	this.setTreeSelection(this.userOrg.orgChartService.treeData);
  // }

  // public setTreeSelection(treeNode: TreeNode[]): void {
  // 	for (const item of treeNode) {
  // 		if (
  // 			this.userData.userOrganization &&
  // 			(this.userData.userOrganization as any[]).some(
  // 				(x) => x.id === item.data.id
  // 			)
  // 		) {
  // 			this.userOrg.selectedOrgs.push(item);
  // 		}
  // 		if (item.children && item.children.length > 0) {
  // 			this.setTreeSelection(item.children);
  // 		}
  // 	}
  // }

  // public markFormTouched(): void {
  // 	setTimeout(() => {
  // 		this.form.form.markAsDirty();
  // 	}, 0);
  // }
}
