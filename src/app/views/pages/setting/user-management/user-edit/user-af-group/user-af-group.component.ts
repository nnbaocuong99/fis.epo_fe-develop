import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { SaveConfirmation } from '../../../../../../services/common/confirmation';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { TreeService } from '../../../../../../services/common/utility/tree.service';
import { AfGroupService } from '../../../../../../services/modules/af-group/af-group.service';
import { RoleService } from '../../../../../../services/modules/role/role.service';
import { UserRequestPayload } from '../../../../../../services/modules/user/user-request.payload';
import { UserService } from '../../../../../../services/modules/user/user.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import { USER_ORG_CONTROL_VALUE_ACCESSOR } from '../user-org/user-org.component';

export const USER_AF_GROUP_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => UserAfGroupComponent),
  multi: true
};

@Component({
  selector: 'app-user-af-group',
  templateUrl: './user-af-group.component.html',
  styleUrls: ['./user-af-group.component.scss'],
  providers: [USER_AF_GROUP_CONTROL_VALUE_ACCESSOR]
})
export class UserAfGroupComponent implements OnInit {
  @Output() change: EventEmitter<any> = new EventEmitter();

  @Input() choose = false;
  @Input() placeholder: string;
  @Input() disabled = false;
  @Input() required = false;

  @Input() dialogRef: DialogRef = new DialogRef();
  @Input() userData: any = {};

  public selectedItems: TreeNode[] = [];
  public isPristine = true;
  public idShowTool: string;

  constructor(
    public cdr: ChangeDetectorRef,
    public afGroupService: AfGroupService,
    public notification: NotificationService,
    public treeService: TreeService,
    public userService: UserService,
    public roleService: RoleService
  ) { }

  public value: any = null;

  writeValue(value: any) {
    this.value = value;
    if (this.choose) {
      this.value = [];
      this.selectedItems = [];
    }
    if (this.cdr && !(this.cdr as ViewRef).destroyed) {
      this.cdr.detectChanges();
    }
  }

  onChange = (_: any) => { };
  onTouched = () => { };
  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  ngOnInit() {
    // this.dialogRef.visibility$.subscribe(isDisplay => {
    //   if (isDisplay) {
    if (!this.choose && !this.dialogRef.input.userId) {
      this.dialogRef.hide();
      this.cdr.detectChanges();
      return;
    }

    const request = new UserRequestPayload();
    request.id = !this.choose ? this.dialogRef.input.userId : '0';
    request.subRoleType = 'AF_GROUP';
    const observables = [
      this.afGroupService.getTreeView(),
      this.userService.selectSubRoleUser(request)
    ];

    forkJoin(observables).subscribe((res) => {
      const selected = this.getNodeFromTreeData(this.afGroupService.treeData, res[1], false);
      this.selectedItems = selected;
      const list = this.selectedItems.map(m => m.data.code);
      this.value = list.join(', ');
      this.cdr.detectChanges();
    });
    //   }
    // });
  }

  public getNodeFromTreeData(treeData: TreeNode[], listSubRoleUser?: any[], isSubNode?: boolean) {
    const result: TreeNode[] = [];

    for (let node of treeData) {
      node.data.countSelected = 0;
      const index = listSubRoleUser.findIndex(x => x.subRoleValue === node.data.id);
      if (index > -1) {
        if (listSubRoleUser[index].roles) {
          node.data.rolesDto = listSubRoleUser[index].roles.split(',').map(m => {
            const data = {
              code: m.trim()
            };
            return data;
          });
          node.data.roles = listSubRoleUser[index].roles;
        }
        result.push(node);
        listSubRoleUser.splice(index, 1);
        if (!isSubNode) {
          node.data.countSelected++;
        }
      }

      if (node.children && node.children.length > 0) {
        const childResult = this.getNodeFromTreeData(node.children, listSubRoleUser, true);
        if (childResult.length > 0) {
          result.push(...childResult);
          node.data.countSelected = node.data.countSelected + childResult.length;
        }
      }
    }

    return result;
  }

  public onBtnUnselectAllClick(): void {
    this.selectedItems = [];
    this.cdr.detectChanges();
  }

  public onFunctionClick(): void {
    this.dialogRef.show();
  }

  public onBtnCancelClick(): void {
    this.dialogRef.hide();
  }

  public onBtnChooseClick(): void {
    if (this.selectedItems) {
      if (!this.choose) {
        const list = this.selectedItems.map(m => m.data.code);
        this.value = list.join(', ');
        this.change.emit(this.selectedItems);
        this.isPristine = false;
        this.dialogRef.hide();
      } else {
        const temp = this.selectedItems.filter(m => m.data && m.data.subDepartmentId);
        const list = temp.map(({ data }) => data.subDepartmentId);
        this.value = list;
        this.onChange(this.value);
        this.dialogRef.hide();
      }
    }
  }

  public onModelChangeInput(data: any) {
    if (!this.value) {
      this.selectedItems = [];
      this.isPristine = false;
    }
    if (this.choose) {
      this.selectedItems = [];
      this.value = [];
      this.onChange([]);
    }
  }

  public onChangeRoles(rowData, event) {
    if (rowData.rolesDto && rowData.rolesDto.length > 0) {
      const listRole = rowData.rolesDto.map(m => m.code);
      rowData.roles = listRole.join(', ');
    } else {
      rowData.roles = null;
    }
  }

  public nodeSelect(event): void {
    // những node có parent mới gán role
    if (!this.choose && event.node.parent) {
      if (!event.node.data.roles) {
        event.node.data.rolesDto = this.userData.userRole;
        this.onChangeRoles(event.node.data, null);
      }
    } else {
      event.node.data.roles = null;
      event.node.data.rolesDto = null;
    }

    if (!this.choose && event.node.children) {
      this.recursiveChildrenNodeSelect(event.node.children);
    }
  }

  public recursiveChildrenNodeSelect(children) {
    for (const item of children) {
      if (!item.data.roles) {
        item.data.rolesDto = this.userData.userRole;
        this.onChangeRoles(item.data, null);
      }
      if (item.children) {
        this.recursiveChildrenNodeSelect(item.children);
      }
    }
  }

  public nodeUnselect(event): void {
    event.node.data.roles = null;
    event.node.data.rolesDto = null;
    if (event.node.children) {
      this.recursiveChildrenNodeUnselect(event.node.children);
    }
  }

  public recursiveChildrenNodeUnselect(children) {
    for (const item of children) {
      item.data.roles = null;
      item.data.rolesDto = null;
      if (item.children) {
        this.recursiveChildrenNodeSelect(item.children);
      }
    }
  }

}
