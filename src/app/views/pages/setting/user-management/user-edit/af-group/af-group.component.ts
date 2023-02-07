import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, TreeNode } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { TreeService } from '../../../../../../services/common/utility/tree.service';
import { AfGroupService } from '../../../../../../services/modules/af-group/af-group.service';
import { UserService } from '../../../../../../services/modules/user/user.service';
import { TreeDragDropService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { SaveConfirmation } from '../../../../../../services/common/confirmation/save-confirmation';
import { BaseFormComponent } from '../../../../../../core/_base/component/base-form.component';
import * as config from './af-group.config';
import {
  OperatingUnitService
} from '../../../../../../services/modules/category/organization-management/operating-unit/operating-unit.service';
import { DepartmentService } from '../../../../../../services/modules/category/department/department.service';
import { DepartmentRequestPayload } from '../../../../../../services/modules/category/department/department.request.payload';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import { DeleteConfirmation } from '../../../../../../services/common/confirmation/delete-confirmation';
import { Tree } from 'primeng/tree';
import { Location } from '@angular/common';
@Component({
  selector: 'app-af-group',
  templateUrl: './af-group.component.html',
  styleUrls: ['./af-group.component.scss'],
  providers: [TreeDragDropService]
})
export class AfGroupComponent extends BaseFormComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;

  public selectedItem: TreeNode = {};
  btnItems: MenuItem[] = [
    { label: 'Add', icon: 'pi pi-plus', command: () => this.onBtnAddCLick(true) },
    { label: 'Edit', icon: 'pi pi-fw pi-pencil', command: () => this.onBtnEditCLick() },
    { label: 'Delete', icon: 'pi pi-fw pi-times', command: () => this.onBtnDeleteCLick() }
  ];

  public dialogRef: DialogRef = new DialogRef();
  public treeData: TreeNode[];
  public afGroupData: any = {};
  public actionType: string;

  public headerDepartment = config.HEADER_DEPARMENT;
  public headerOperatingUnit = config.HEADER_OPERATING_UNIT;
  public headerAfGroup = config.AF_FROUP;
  public departmentRequestPayload = new DepartmentRequestPayload();

  constructor(
    public userService: UserService,
    public afGroupService: AfGroupService,
    public notification: NotificationService,
    public treeService: TreeService,
    public treeDragDropService: TreeDragDropService,
    public operatingUnitService: OperatingUnitService,
    public departmentService: DepartmentService,
    public cdr: ChangeDetectorRef,
    public router: Router,
    public route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    this.initData();

    Tree.prototype.allowDrop = (dragNode: any, dropNode: any, dragNodeScope: any): boolean => {
      return this._overrideAllowDrop(dragNode, dropNode, dragNodeScope);
    };

  }

  public initData(): void {
    this.afGroupData = {};
    this.selectedItem = {};
    this.form.form.markAsPristine();
    const observables = [
      this.afGroupService.getTreeView()
    ];
    forkJoin(observables).subscribe(res => {
      this.treeData = res[0];
      this.cdr.detectChanges();
    });
  }

  _overrideAllowDrop(dragNode, dropNode, dragNodeScope): boolean {
    if (dragNode && dropNode) {
      const dragData = dragNode.data;
      const dropData = dropNode.data;
      if (dragData.id === dropData.id) {
        return false;
      } else {
        if (dragData.ouId === dropData.ouId) {
          return true;
        }
      }
    }
    return false;
  }

  onNodeDrop(event): void {
    if (event) {
      const item = event.dragNode.data;
      const newContext = this.findNewContext(this.treeData, null, item.id);
      for (let i = 0; i < newContext.selfNodes.length; i++) {
        if (newContext.selfNodes[i].data.id === item.id) {
          newContext.selfNodes[i].data.parentId = newContext.parent ? newContext.parent.data.id : null;
          if (newContext.parent) {
            newContext.selfNodes[i].data.ouId = newContext.parent.data.ouId;
            newContext.selfNodes[i].data.ouDto = { code: newContext.parent.data.ouCode };
          }
        }
        newContext.selfNodes[i].data.indexNo = i + 1;
      }

      let listChildren = [];
      if (event.dragNode.children) {
        listChildren = this.recursiveChild(listChildren, event.dragNode.children,
          newContext.parent ? newContext.parent.data : null);
      }

      let dataSave = [];
      dataSave = newContext.selfNodes.map(x => x.data);
      dataSave = dataSave.concat(listChildren);

      this.afGroupService.bulkMerge(dataSave).subscribe(() => {
        this.notification.showSuccess();
        this.initData();
      });
      this.afGroupData = {};
    }
  }

  recursiveChild(listChildren: any[], source: any[], dataSet: any): any {
    for (const child of source) {
      if (dataSet) {
        child.data.ouId = dataSet.ouId;
        child.data.ouDto = { code: dataSet.ouCode };
      }
      listChildren.push(child.data);
      if (child.children && child.children.length > 0) {
        listChildren = this.recursiveChild(listChildren, child.children, dataSet);
      }
    }
    return listChildren;
  }

  private findNewContext(source: any[], parent: any, id: string): any {
    const result = {
      parent,
      selfNodes: []
    };

    for (const item of source) {
      if (item.data.id === id) {
        result.parent = parent;
        result.selfNodes = source;
        return result;
      } else {
        if (item.children && item.children.length > 0) {
          const newContext = this.findNewContext(item.children, item, id);
          if (newContext.selfNodes.length > 0) {
            Object.assign(result, newContext);
            return result;
          }
        }
      }
    }

    return result;
  }

  public onNodeSelect(event: any): void {

  }

  public onNodeUnselect(event: any): void {

  }

  initDto(data: any): any {
    if (data) {
      const temp = JSON.parse(JSON.stringify(data));
      temp.ouDto = temp.ouCode ? { code: temp.ouCode } : null;
      temp.subDepartmentDto = temp.subDepartmentName ? { name: temp.subDepartmentName } : null;
      temp.parentDto = temp.parentName ? { name: temp.parentName } : null;
      return temp;
    } else {
      return null;
    }
  }

  public onBtnSaveClick(): void {
    if (this.form) {
      if (!this.validateForm(this.form, 'id-form-af-group')) {
        this.notification.showMessage('VALIDATION.FORM_VALID');
        return;
      }
      if (this.form.dirty) {
        const saveConfirmation = new SaveConfirmation();
        saveConfirmation.accept = () => {
          const dataSave: any = {
            ...this.afGroupData
          };
          this.afGroupService.merge(dataSave).subscribe(m => {
            if (m) {
              this.notification.showSuccess();
              this.form.form.markAsPristine();
              this.cdr.detectChanges();
              if (this.actionType === 'add') {
                this.initData();
              } else {
                this.selectedItem.data = this.initDto(m);
              }
              this.close();
            }
          });
        };
        this.notification.confirm(saveConfirmation);
      }
    }
  }

  public onChangeParent(event: any): void {
    if (event && event.id) {
      this.afGroupData.parentId = event.id;
    } else {
      this.afGroupData.parentId = null;
    }
  }

  public onChangeLegal(event: any): void {
    if (event && event.id) {
      this.afGroupData.ouId = event.ouId;
      this.departmentRequestPayload.ouId = this.afGroupData.ouId;
    } else {
      this.afGroupData.ouId = null;
      this.departmentRequestPayload.ouId = null;
    }
    this.afGroupData.subDepartmentDto = null;
  }

  public onModelChangeLegal(event: any) {
    this.departmentRequestPayload.ouId = this.afGroupData.ouId;
  }

  public onChangeOrgApply(event: any): void {
    if (event && event.id) {
      this.afGroupData.subDepartmentId = event.subDepartmentId;
    } else {
      this.afGroupData.subDepartmentId = null;
    }
  }

  public onBtnAddCLick(addTo?: boolean) {
    this.actionType = 'add';
    this.afGroupData = {};
    if (addTo) {
      const temp = JSON.parse(JSON.stringify(this.selectedItem.data));
      this.afGroupData.parentId = temp.id;
      this.afGroupData.parentDto = temp.name ? { name: temp.name } : null;
      this.afGroupData.ouId = temp.ouId;
      this.afGroupData.ouDto = temp.ouCode ? { code: temp.ouCode } : null;
      this.departmentRequestPayload.ouId = this.afGroupData.ouId;
    }
    this.selectedItem = {};
    this.form.form.markAsPristine();
    this.showDialog();
  }

  public onBtnEditCLick() {
    this.actionType = 'edit';
    this.afGroupData = this.initDto(this.selectedItem ? this.selectedItem.data : null);
    this.form.form.markAsPristine();
    this.showDialog();
  }

  public onBtnDeleteCLick() {
    const confirmation = new DeleteConfirmation();
    confirmation.accept = () => {
      this.afGroupService.delete(this.selectedItem.data.id).subscribe(() => {
        this.initData();
        this.notification.showDeteleSuccess();
      });
    };
    this.notification.confirm(confirmation);
  }

  public showDialog() {
    this.dialogRef.show();
    this.cdr.detectChanges();
  }

  public close() {
    this.dialogRef.hide();
    this.cdr.detectChanges();
  }

  public onBtnCancelClick(): void {
    this.goBack();
  }

  public goBack(): void {
    window.close();
  }

  public onShowContextMenu() {

  }

}
