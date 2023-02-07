import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api/treenode';
import { forkJoin } from 'rxjs';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { ActionService } from '../../../../../../services/modules/action/action.service';
import { OperationService } from '../../../../../../services/modules/operation/operation.service';
import { RoleService } from '../../../../../../services/modules/role/role.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';

@Component({
  selector: 'app-role-operation',
  templateUrl: './role-operation.component.html',
  styleUrls: ['./role-operation.component.scss']
})
export class RoleOperationComponent implements OnInit {
  @Input() dialogRef: DialogRef;
  public customizeDialogRef = new DialogRef();
  public treeData: TreeNode[];
  public treeDataSelected: TreeNode[];
  public selectedItems: TreeNode[] = [];
  public currentStep = 0; // 0: Set operation to role, 1 custom field in/out of operation
  public isAdvanceConfig = false;
  public isSelectedChanged = false;

  constructor(
    public operationService: OperationService,
    public roleService: RoleService,
    public notification: NotificationService,
    public actionService: ActionService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.dialogRef.visibility$.subscribe(res => {
      if (res) {
        this.initOperationTree();
      } else {
        this.treeData = [];
        this.treeDataSelected = [];
        this.selectedItems = [];
        this.isSelectedChanged = false;
      }
    });
  }

  private initOperationTree(): void {
    const request = [
      this.operationService.getTreeViewMenu(false),
      this.roleService.selectRoleOperation(this.dialogRef.input.roleId)
    ];

    forkJoin(request).subscribe((response: any[]) => {
      this.treeData = response[0];
      setTimeout(() => {
        this.setSelection(response[1]);
        this.cd.detectChanges();
      }, 0);
    });
  }

  public onBtnNextClick(): void {
    if (this.isSelectedChanged) {
      const operationIds = this.selectedItems.filter(x => x.data.method == 'MENU' || x.data.method == 'VIEW').map(x => x.data).map(x => x.id);
      const roleId = this.dialogRef.input.roleId;
      this.roleService.bulkMergeRoleOperation(operationIds, roleId).subscribe(res => {
        this.notification.showSuccess();
        this.currentStep++;
        this.isAdvanceConfig = false;
        this.roleService.selectMenuOperation(roleId).subscribe(res => {
          this.treeDataSelected = this.operationService.getTreeViewMenuSelected(res);
          this.isSelectedChanged = false;
          this.cd.detectChanges();
        });
      });
    } else {
      this.onBtnSkipClick();
    }
  }

  public onBtnSkipClick(): void {
    this.currentStep++;
    this.isAdvanceConfig = false;
    this.getMenuOperation();
  }

  public getMenuOperation(): void {
    this.roleService.selectMenuOperation(this.dialogRef.input.roleId).subscribe(res => {
      this.roleService.selectMenuOperationCustomized(this.dialogRef.input.roleId).subscribe(customized => {
        this.treeDataSelected = this.operationService.getTreeViewMenuSelected(
          res.map(x => { x.isCustomized = customized.some(y => y.id === x.id); return x; })
        );
        this.cd.detectChanges();
      });
    });
  }

  public onBtnFinishClick(): void {
    this.dialogRef.hide();
  }

  public onBtnBackClick(): void {
    this.currentStep--;
    this.isAdvanceConfig = false;
    this.initOperationTree();
  }

  public onBtnResetClick(node: any): void {
    this.customizeDialogRef.input.operationId = node.data.id;
    this.customizeDialogRef.input.roleId = this.dialogRef.input.roleId;

    const request = {
      roleId: this.dialogRef.input.roleId,
      operationId: node.data.id,
      isCustomized: false,
      resourceRestricted: []
    }

    this.actionService.mergeResourceRestricted(request).subscribe(() => {
      this.getMenuOperation();
    });
  }

  public getHeader(): string {
    switch (this.currentStep) {
      case 0:
        return 'Permission for role';
      case 1:
        return 'Restrict access information';
    }
  }

  public onPerformSet(): void {
    this.getMenuOperation();
  }

  public setSelection(operationIds: string[]): void {
    this.selectedItems = [];
    this.setTreeSelection(undefined, this.treeData, operationIds);
  }

  public setTreeSelection(parent: TreeNode, treeNode: TreeNode[], operationIds: string[]): void {
    for (const item of treeNode) {
      if (operationIds && (operationIds as any[]).some(x => x === item.data.id)) {
        if (!!parent) {
          parent.partialSelected = true;
        }

        if (!this.selectedItems.some(x => x.data.id === item.data.id)) {
          this.selectedItems.push(item);
        }
      }
      if (item.children && item.children.length > 0) {
        this.setTreeSelection(item, item.children, operationIds);
      }
    }
    this.checkSelectParent(parent);
  }

  private checkSelectParent(parent: TreeNode): void {
    if (parent && parent.children.length === parent.children.filter(x => this.selectedItems.some(y => y.data.id === x.data.id)).length) {
      parent.partialSelected = false;
      if (!this.selectedItems.some(x => x.data.id === parent.data.id)) {
        this.selectedItems.push(parent);
      }
      const pparent = this.findParent(parent, this.treeData, null);
      if (pparent) {
        this.checkSelectParent(pparent);
      }
    }
  }

  private findParent(node: TreeNode, source: TreeNode[], parent: TreeNode) {
    for (let item of source) {
      if (item.data.id === node.data.id) {
        return parent;
      } else {
        if (item.children && item.children.length > 0) {
          for (let itemChildren of item.children) {
            return this.findParent(itemChildren, item.children, item);
          }
        } else {
          break;
        }
      }
    }
    return null;
  }

  public onBtnAdvanceConfigClick(): void {
    this.isAdvanceConfig = !this.isAdvanceConfig;
  }

  public onBtnCustomizeClick(node: any): void {
    this.customizeDialogRef.input.operationId = node.data.id;
    this.customizeDialogRef.input.roleId = this.dialogRef.input.roleId;
    this.customizeDialogRef.show();
  }

  public isScreen(node: any): boolean {
    return node && (node.data.method === 'MENU' || node.data.method === 'VIEW');
  }
}
