import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as config from './user-edit.config';
import { UserService } from '../../../../../services/modules/user/user.service';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { RoleService } from '../../../../../services/modules/role/role.service';
import { CustomvalidationService } from '../../../../../services/common/validation/custom-validation.service';
import { NgForm } from '@angular/forms';
import * as mainConfig from '../../../../../core/_config/main.config';
import { FormDynamicData } from '../../../../partials/content/crud/component/form-dynamic-data.model';
import { UserOrgComponent } from './user-org/user-org.component';
import { TreeNode } from 'primeng/api';
import { DialogRef } from '../../../../partials/content/crud/dialog/dialog-ref.model';
import { BuyerService } from '../../../../../services/modules/category/buyer/buyer.service';
import { OrgChartService } from '../../../../../services/modules/org-chart/org-chart.service';
import { OrgChartDto } from '../../../../../services/modules/org-chart/org-chart.model';
import { BaseFormComponent } from '../../../../../core/_base/component';
import { UserBranchComponent } from './user-branch/user-branch.component';
import { UserAfGroupComponent } from './user-af-group/user-af-group.component';
import { UserProducerComponent } from './user-producer/user-producer.component';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent extends BaseFormComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  @ViewChild('userOrg', { static: false }) userOrg: UserOrgComponent;
  @ViewChild('userBrach', { static: true }) userBrach: UserBranchComponent;
  @ViewChild('userAfGroup', { static: false }) userAfGroup: UserAfGroupComponent;
  @ViewChild('userProducer', { static: false }) userProducer: UserProducerComponent;

  public formData: FormDynamicData = new FormDynamicData();
  public userData: any = {};
  public titles = config.TITLE;
  public mainConfig: any = mainConfig.MAIN_CONFIG;
  public formTitle = 'USER.HEADER_DETAIL';
  public operationDialogRef = new DialogRef();
  public buyerHeader = config.HEADER_BUYER;
  public currentUserId: string;
  public userAfDialogRef = new DialogRef();
  public userProducerDialogRef = new DialogRef();
  public roleCheck = {
    isAfRole: false,
    isBpRole: false
  };
  public isChangeRole = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public userService: UserService,
    public orgService: OrgChartService,
    public cd: ChangeDetectorRef,
    private notice: NotificationService,
    public roleService: RoleService,
    public buyerService: BuyerService,
    public customValidate: CustomvalidationService
  ) {
    super();
    this.formData = {
      formId: 'user-edit',
      title: 'USER.HEADER_DETAIL',
      isCancel: true,
      service: this.roleService,
    };
  }

  ngOnInit() {
    const routeSub = this.route.params.subscribe((params) => {
      if (params.id) {
        this.currentUserId = params.id;
        this.userService.selectById(params.id).subscribe((res) => {
          this.userBrach.initData(res.userBranch);
          this.userData = new OrgChartDto(res);
          this.userData.buyerNameDto = this.userData.buyerName ? this.toDto('userName', this.userData.buyerName) : null;
          this.userAfDialogRef.input.userId = params.id;
          this.userProducerDialogRef.input.userId = params.id;
          this.setCheckRole();
          this.cd.detectChanges();
          setTimeout(() => {
            this.form.form.markAsPristine();
          }, 0);
        });

        // Set role id for operation dialog ref
        this.operationDialogRef.visibility$.subscribe(res => {
          if (res) {
            this.operationDialogRef.input.roleId = params.id;
          }
        });

        this.operationDialogRef.input.styleClass = 'action-sm action-link';
        this.operationDialogRef.input.text = 'ROLE.CUSTOMIZE_RESOURCE';
      } else {
        this.userData = {};
        this.userData.userOrganization = [];
        this.userBrach.initData([]);
      }
    });
    this.subscriptions.push(routeSub);
  }

  public onBtnSaveClick(): void {
    const query = {
      isUpdUserOrg: !this.userOrg.isPristine,
      isUpdUserRole: this.isChangeRole,
      isUpdateSubRoleUserAf: this.userAfGroup ? !this.userAfGroup.isPristine : true,
      isUpdateSubRoleUserBp: this.userProducer ? !this.userProducer.isPristine : true,
      isUpdateUserBranch: this.userBrach ? !this.userBrach.isPristine : true
    };
    this.userData.userOrganization = this.userOrg.selectedOrgs.map(m => {
      return { id: m.data.id };
    });
    this.userData.subRoleUserAf = this.roleCheck.isAfRole ? this.userAfGroup.selectedItems.map(m => {
      m.data.subRoleValue = m.data.id;
      return m.data;
    }) : [];
    this.userData.subRoleUserBp = this.roleCheck.isBpRole ? this.userProducer.selectedItems.map(m => {
      m.subRoleValue = m.id;
      return m;
    }) : [];
    this.userData.userBranch = this.userBrach.selectedItems;
    this.userData.userName = this.userData.userName.trim().toLowerCase();
    this.userData.email = this.userData.email.trim().toLowerCase();
    this.userService.merge(this.userData, true, query).subscribe(() => {
      this.notice.showSuccess();
      this.onBtnCancelClick();
    });
  }

  public onAfterTreeInit(): void {
    this.setTreeSelection(undefined, this.userOrg.orgChartService.treeData,
      this.userData.userOrganization ? this.userData.userOrganization.map(x => x.id) : []);
  }

  public setTreeSelection(parent: TreeNode, treeNode: TreeNode[], orgSelectedIds: string[]): void {
    for (const item of treeNode) {
      if (orgSelectedIds && (orgSelectedIds as any[]).some(x => x === item.data.id)) {
        if (!!parent) {
          parent.partialSelected = true;
        }

        if (!this.userOrg.selectedOrgs.some(x => x.data.id === item.data.id)) {
          this.userOrg.selectedOrgs.push(item);
        }
      }
      if (item.children && item.children.length > 0) {
        this.setTreeSelection(item, item.children, orgSelectedIds);
      }
    }
    this.checkSelectParent(parent);
  }

  private checkSelectParent(parent: TreeNode): void {
    const arrOrgChartId = this.userOrg.selectedOrgs.map(m => m.data.id);
    if (parent && parent.children.length === parent.children.filter(x => arrOrgChartId.includes(x.data.id)).length) {
      parent.partialSelected = false;
      if (!this.userOrg.selectedOrgs.some(x => x.data.id === parent.data.id)) {
        this.userOrg.selectedOrgs.push(parent);
      }
      const pparent = this.findParent(parent, this.userOrg.orgChartService.treeData, null);
      if (pparent) {
        this.checkSelectParent(pparent);
      }
    }
  }

  private findParent(node: TreeNode, source: TreeNode[], parent: TreeNode) {
    for (const item of source) {
      if (item.data.id === node.data.id) {
        return parent;
      } else {
        if (item.children && item.children.length > 0) {
          for (const itemChildren of item.children) {
            return this.findParent(itemChildren, item.children, item);
          }
        } else {
          break;
        }
      }
    }
    return null;
  }

  public markFormTouched(): void {
    setTimeout(() => {
      this.form.form.markAsDirty();
    }, 0);
  }

  public onChangeBuyer(event: any): void {
    if (event) {
      this.userData.userId = event.personId;
      this.userData.lastName = event.lastName;
    } else {
      this.userData.userId = null;
      this.userData.lastName = null;
    }
  }

  public onBtnCancelClick(): void {
    this.router.navigate([`../../`], { relativeTo: this.route });
  }

  setCheckRole(): void {
    if (this.userData.userRole) {
      this.roleCheck.isAfRole = this.userData.userRole.some(m => m.code && m.code.includes('AF_'));
      this.roleCheck.isBpRole = this.userData.userRole.some(m => m.code && m.code.includes('BP_'));
    } else {
      this.roleCheck.isAfRole = false;
      this.roleCheck.isBpRole = false;
    }
  }

}
