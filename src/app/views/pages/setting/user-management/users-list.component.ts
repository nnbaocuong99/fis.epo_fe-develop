import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import * as config from './users-list.config';
import { UserService } from '../../../../services/modules/user/user.service';
import { UserRequestPayload } from '../../../../services/modules/user/user-request.payload';
import * as mainConfig from '../../../../core/_config/main.config';
import { OrgChartService } from '../../../../services/modules/org-chart/org-chart.service';
import { BaseListComponent } from '../../../../core/_base/component/base-list.component';
import { TreeNode } from 'primeng/api';
import { AfGroupComponent } from './user-edit/af-group/af-group.component';
import { DownloadFileTemplateComponent } from '../../../partials/control/download-file/download-file.component';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { currentUser } from '../../../../core/auth';
import { DialogUploadFileComponent } from '../../../partials/control/upload-file/upload-file.component';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { CustomConfirmation } from '../../../../services/common/confirmation';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent extends BaseListComponent implements OnInit {
  @ViewChild('afGroup', { static: true }) afGroup: AfGroupComponent;
  @ViewChild('downloadFileTemplateComponent', { static: true }) downloadFileTemplateComponent: DownloadFileTemplateComponent;
  @ViewChild(DialogUploadFileComponent, { static: false }) private importFile: DialogUploadFileComponent;

  public selectedOrg: TreeNode;
  public activeChecked = false;
  public currentUser: any = {};
  public showbtnImport = false;
  public isShowImport = false;
  public typeImport: number;

  constructor(
    public userService: UserService,
    public orgChartService: OrgChartService,
    public cd: ChangeDetectorRef,
    private store: Store<AppState>,
    public notificationService: NotificationService,
  ) {
    super();
    this.store.pipe(select(currentUser)).subscribe(obj => {
      if (obj) {
        this.currentUser = obj;
      }
    });
  }

  ngOnInit() {
    this.showbtnImport = this.currentUser.roles.some(x => x === 'SUPER_ADMIN');
    this.baseService = this.userService;
    this.headers = config.HEADER;
    this.mainConfig = mainConfig.MAIN_CONFIG;
    this.request = new UserRequestPayload();
    this.formTitle = 'USER.HEADER_LIST';
    super.ngOnInit();
    const getTreeOrgSub = this.orgChartService.getTreeView().subscribe(() => {
      this.cd.detectChanges();
    });
    this.subscriptions.push(getTreeOrgSub);
  }

  public changeActive(event): void {
    super.ngOnInit();
  }

  public onNodeSelect(event?: any): void {
    this.request.orgId = event ? event.node.data.id : null;
    this.initData();
  }

  public onNodeUnselect(): void {
    this.request.orgId = null;
    this.initData();
  }

  public showDownloadFile(): void {
    this.downloadFileTemplateComponent.showDownloadFile();
  }

  public importFileDataClick(type?: number): void {
    this.typeImport = type;
    this.importFile.open();
    // alert('Tính năng đang được update');
  }

  public onBtnUploadClick(): void {
    let message = 'Phân quyền AF người dùng sẽ được update. Dự liệu cũ sẽ bị xóa ???';
    this.request.type = 1;
    if (this.typeImport === 2) {
      message = 'Thông tin người dùng được thêm mới nếu chưa có. Nếu đã có sẽ update. Bạn muốn thực hiện ??';
      this.request.type = 2;
    }
    const confirm = new CustomConfirmation('message');
    confirm.accept = () => {
      const files = this.importFile.tableFile.map((x) => x.file);
      this.userService
        .import(files, this.request)
        .subscribe(
          (res) => {
            this.importFile.close();
            this.ngOnInit();
            this.notificationService.showSuccess();
            // this.cdr.detectChanges();
          }
        );
    };
    this.notificationService.confirm(confirm);
  }

}
