import { UserRequestPayload } from './../../../../../services/modules/user/user-request.payload';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { RoleService } from '../../../../../services/modules/role/role.service';
import { RoleRequestPayload } from '../../../../../services/modules/role/role.request.payload';
import { BaseComponent } from '../../../../../core/_base/component/base-component';
import { merge, BehaviorSubject, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DialogRef } from '../../../../partials/content/crud/dialog/dialog-ref.model';
import { Role } from '../../../../../core/auth';
import { UserService } from '../../../../../services/modules/user/user.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent extends BaseComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public dialogRef: DialogRef = new DialogRef();
  public userDialogRef: DialogRef = new DialogRef();
  public dataSource = {
    items: [],
    paginatorTotal: undefined
  };
  public headers = [
    { width: '50px', title: 'No' },
    { width: '200px', title: 'Name' },
    { width: '100px', title: 'Code' }
  ];
  public request = new RoleRequestPayload();
  public userRequest = new UserRequestPayload();
  constructor(
    public roleService: RoleService,
    public userService: UserService,
    private cd: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.userRequest.pageIndex = 0;
    this.userRequest.pageSize = 10;
    this.initData();
    const paginatorSubscriptions = merge(this.paginator.page).pipe(
      tap(() => {
        this.initData();
      })
    ).subscribe();
    this.subscriptions.push(paginatorSubscriptions);

    this.dialogRef.config.style = { width: '750px', minWidth: '350px' }
  }

  /**
   * Initialize data for screen
   */
  public initData(): void {
    this.request.pageIndex = this.paginator.pageIndex;
    this.request.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
    const subSelect = this.roleService.select(this.request).subscribe(res => {
      this.dataSource.items = res;
      this.cd.detectChanges();
    });
    const subCount = this.roleService.count(this.request).subscribe(res => {
      this.dataSource.paginatorTotal = res;
      this.cd.detectChanges();
    });
    this.subscriptions.push(...[subSelect, subCount]);
  }

  public onBtnEditClick(rowData?: any): void {
    this.dialogRef.output = rowData;
    if (rowData) {
      this.userRequest.roleId = rowData.id;
      const subEdit = forkJoin([
        this.roleService.selectById(rowData.id),
        this.userService.select(this.userRequest),
        this.userService.count(this.userRequest)
      ]).subscribe(res => {
        this.dialogRef.input = res[0];
        this.userDialogRef.input.items = res[1];
        this.userDialogRef.input.paginatorTotal = res[2];
        this.dialogRef.input.isShowDelete = true;
        this.dialogRef.input.user = res[1];
        this.dialogRef.show();
        this.cd.detectChanges();
      });
      this.subscriptions.push(subEdit);
    } else {
      this.dialogRef.input = {};
      this.dialogRef.input.isShowDelete = true;
      this.userDialogRef.input.items = null;
      this.userDialogRef.input.paginatorTotal = 0;
      this.dialogRef.input.user = null;
      this.dialogRef.show();
      this.cd.detectChanges();
    }
  }

  public onSuccess(event: boolean) {
    if (event) {
      this.initData();
    }
  }
}
