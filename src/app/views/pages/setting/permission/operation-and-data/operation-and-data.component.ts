import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeNode, MenuItem } from 'primeng/api';
import { BaseFormComponent } from '../../../../../core/_base/component';
import { CancelConfirmation, DeleteConfirmation, SaveConfirmation } from '../../../../../services/common/confirmation';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { OperationRequestPayload } from '../../../../../services/modules/operation/operation-request.payload';
import { OperationService } from '../../../../../services/modules/operation/operation.service';
import { FormDynamicData } from '../../../../partials/content/crud/component/form-dynamic-data.model';
import { ToolbarModel } from '../../../../partials/content/toolbar/toolbar.model';
import * as config from './operation-and-data.config';
import { TreeDragDropService } from 'primeng/api';
import { DialogRef } from '../../../../partials/content/crud/dialog/dialog-ref.model';
import { ActionService } from '../../../../../services/modules/action/action.service';

import { forkJoin } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { BusinessTaskService } from '../../../../../services/modules/business-task/business-task.service';
import { BusinessTaskRequestPayload } from '../../../../../services/modules/business-task/business-task.request.payload';

@Component({
  selector: 'app-operation-and-data',
  templateUrl: './operation-and-data.component.html',
  styleUrls: ['./operation-and-data.component.scss'],
  providers: [TreeDragDropService]
})
export class OperationAndDataComponent extends BaseFormComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  public dataSource: any = {};
  public actionOperationName: string;
  public actionInput: any;
  public selectedActions = [];
  public dialogRef: DialogRef = new DialogRef();
  public addDialogRef: DialogRef = new DialogRef();
  public parentName = 'OPERATION.DEFAULT';
  public isDisplay = false;
  public header = config.HEADER;
  public toolbarModel: ToolbarModel;
  public activeIdTab: string;
  public tabs = config.TABS;
  public menuData: any[];
  public treeData: TreeNode[];
  public selectedItem: TreeNode;
  public isVisible: boolean;
  public isShowOnlyMenu = false;
  public actionMenuItems: MenuItem[] = [
    { label: 'Delete', icon: 'pi pi-times', command: (event) => { this.onBtnDelActions(); } }
  ];
  public menuItems: MenuItem[] = [
    { label: 'Edit', icon: 'pi pi-fw pi-pencil', command: (event) => { this.onBtnEditClick(); } },
    { label: 'Delete', icon: 'pi pi-times', command: (event) => { this.onBtnDeleteClick(); } },
    { label: 'Add', icon: 'pi pi-user-plus', command: (event) => { this.onBtnAddCLick(this.selectedItem); } },
    { label: 'Add Action', icon: 'pi pi-plus-circle', command: (event) => { this.onBtnAddAction(this.selectedItem); } }
  ];
  public request = new OperationRequestPayload();
  public actionRequest = new OperationRequestPayload();
  public feMethod = config.FE_METHOD;
  public beMethod = config.BE_METHOD;
  public type: any[] = config.TYPE;
  public editingItem: any;
  public formData: FormDynamicData = new FormDynamicData();

  constructor(
    public router: Router,
    public operationService: OperationService,
    public actionService: ActionService,
    public businessTaskService: BusinessTaskService,
    public notification: NotificationService,
    public treeDragDropService: TreeDragDropService,
    public activatedRoute: ActivatedRoute,
    public cd: ChangeDetectorRef) {
    super();
    this.formData = {
      formId: 'user-edit',
      title: 'USER.HEADER_DETAIL',
      isCancel: true,
      service: this.operationService,
    };
  }

  ngOnInit() {
    this.actionRequest.pageIndex = 0;
    this.actionRequest.pageSize = 10;
    this.selectedActions = null;
    this.selectedItem = null;
    this.onFragmentChanged();
    this.reloadOperationData();
    this.actionInput = {};
    this.handleDragDrop();
  }

  private onFragmentChanged(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (!params.status) {
        this.activeIdTab = 'menu';
      } else {
        this.activeIdTab = params.status;
      }
    });
  }

  public checkLeaf(event: any) {
    if (event.data.method === 'MENU' || event.data.method === 'VIEW') {
      this.menuItems = [
        { label: 'Edit', icon: 'pi pi-fw pi-pencil', command: () => { this.onBtnEditClick(); } },
        { label: 'Delete', icon: 'pi pi-times', command: () => { this.onBtnDeleteClick(); } },
        { label: 'Add', icon: 'pi pi-plus', command: () => { this.onBtnAddCLick(this.selectedItem); } },
        { label: 'Add Action', icon: 'pi pi-plus-circle', command: () => { this.onBtnAddAction(this.selectedItem); } }
      ];
    } else {
      this.menuItems = [
        { label: 'Edit', icon: 'pi pi-fw pi-pencil', command: () => { this.onBtnEditClick(); } },
        { label: 'Delete', icon: 'pi pi-times', command: () => { this.onBtnDeleteClick(); } },
        { label: 'Add', icon: 'pi pi-plus', command: () => { this.onBtnAddCLick(this.selectedItem); } },
      ];
    }
  }

  private initOperationTaskData(): void {
    const request = new BusinessTaskRequestPayload();
    request.operationId = this.actionRequest.includeOperationId;

    const $selectAndCount = [
      this.businessTaskService.selectOperationBusinessTask(request),
      this.businessTaskService.countOperationBusinessTask(request)
    ];

    const sub = forkJoin($selectAndCount).subscribe(
      (response: any[]) => {
        this.dataSource.items = response[0];
        this.dataSource.paginatorTotal = response[1];
        this.cd.detectChanges();
      });

    this.subscriptions.push(sub);
  }

  public onPageChange(event: PageEvent) {
    this.actionRequest.pageIndex = event.pageIndex;
    this.actionRequest.pageSize = event.pageSize;
    this.initOperationTaskData();
  }

  private reloadOperationData(): void {
    this.operationService.getTreeViewMenu(this.isShowOnlyMenu).subscribe(res => {
      this.treeData = res;
      if (this.selectedItem && this.selectedItem.expandedIcon === 'fas fa-folder-open folder-explorer') {
        this.onNodeUnselect();
      }
      this.cd.detectChanges();
    });
  }

  private handleDragDrop(): void {
    this.treeDragDropService.dragStop$.subscribe(res => {
      const item = res.node.data;
      const newContext = this.findNewContext(this.treeData, null, item.id);
      for (let i = 0; i < newContext.selfNodes.length; i++) {
        if (newContext.selfNodes[i].data.id === item.id) {
          newContext.selfNodes[i].data.parentMenu = newContext.parent ? newContext.parent.data.id : null;
        }
        newContext.selfNodes[i].data.menuOrder = i + 1;
      }

      this.operationService.bulkUpdate(newContext.selfNodes.map(x => x.data)).subscribe(() => {

        this.notification.showSuccess();
      });
    });
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
          this.operationService.setIconForNode(item);
          const newContext = this.findNewContext(item.children, item, id);
          if (newContext.selfNodes.length > 0) {
            Object.assign(result, newContext);
            return result;
          }
        } else {
          this.operationService.setIconForNode(item, true);
        }
      }
    }

    return result;
  }

  public setParamsToRoute(event: any): void {
    this.router.navigate([], {
      queryParams: {
        status: event.nextId
      }
    });
    this.activeIdTab = event.nextId;
  }

  public onBtnDelActions(): void {
    const cancel = new CancelConfirmation();
    cancel.accept = () => {
      const request = new BusinessTaskRequestPayload();
      request.operationIds = this.selectedActions.map(x => x.id);
      this.businessTaskService.deleteOperationBusinessTask(request).subscribe(() => {
        this.initOperationTaskData();
      });
    };
    this.notification.confirm(cancel);
  }

  public onBtnAddCLick(event?: any) {
    if (event) {
      this.dialogRef.input = {};
      this.dialogRef.input.parentMenu = event.data.id;
      this.dialogRef.input.type = 1;
      this.dialogRef.input.method = 'MENU';
      this.dialogRef.input.menuOrder = 0;
      this.dialogRef.input.isShowDelete = true;
      this.dialogRef.input.link = event.data.link;
      this.dialogRef.show();
      this.cd.detectChanges();
    } else {
      this.dialogRef.input = {};
      this.dialogRef.input.type = 1;
      this.dialogRef.input.method = 'MENU';
      this.dialogRef.input.menuOrder = 0;
      this.dialogRef.input.isShowDelete = true;
      this.dialogRef.show();
      this.cd.detectChanges();
    }
  }

  public onBtnAddAction(event?: any) {
    const subEdit = this.operationService.selectById(event.data.id).subscribe(res => {
      this.addDialogRef.input = res;
      this.addDialogRef.show();
      this.cd.detectChanges();
    });
    this.subscriptions.push(subEdit);
  }

  public onNodeSelect(event?: any): void {
    this.onNodeUnselect();
    if (event.data.method !== 'MODULE') {
      this.actionRequest.includeOperationId = event.data.id;
      this.actionInput.id = event.data.id;
      this.actionOperationName = event.data.name;
      this.initOperationTaskData();
    }
  }

  public onBtnEditClick(): void {
    const subEdit = this.operationService.selectById(this.selectedItem.data.id).subscribe(res => {
      this.dialogRef.input = res;
      this.dialogRef.input.isShowDelete = true;
      this.dialogRef.show();
      this.cd.detectChanges();
    });
    this.subscriptions.push(subEdit);
  }

  public onNodeUnselect(): void {
    this.editingItem = null;
    this.dataSource.items = null;
    this.selectedActions = null;
    this.dataSource.paginatorTotal = null;
    this.cd.detectChanges();
  }

  public onChangeMethod() {
    if (this.editingItem.method !== 'MENU') {
      if (this.editingItem.menuOrder) {
        this.editingItem.menuOrder = 0;
      }
      if (this.editingItem.menuIcon) {
        this.editingItem.menuIcon = null;
      }
    }
    this.request.method = this.editingItem.method;
    this.cd.detectChanges();
  }

  /**
   * Handle event when select button
   */
  public onChangeSelectType() {
    const value = this.editingItem.type;

    if (value === 1) {
      this.editingItem.method = this.feMethod[1].value;
    }
    if (value === 0) {
      this.editingItem.method = this.beMethod[0].value;
    }

    this.request.type = this.editingItem.type;
    this.request.method = this.editingItem.method;
    this.request.excludeIds = this.editingItem.id;
    this.onChangeMethod();
  }

  /**
   * Hande event when click button save click
   */
  public onBtnSaveClick(): void {
    this.performSave(this.editingItem);
  }

  public performSave(item: any): void {
    this.operationService.merge(item).subscribe(res => {
      this.notification.showSuccess();
      this.editingItem = res;
      this.request.type = this.editingItem.type;
      this.request.method = this.editingItem.method;
      this.request.excludeIds = this.editingItem.id;
      this.reloadOperationData();
      this.cd.detectChanges();
    });
  }

  public onBtnCancelClick(): void {
    this.form.form.markAsPristine();
    this.cd.detectChanges();
  }

  /**
   * Handle event when delete click
   */
  public onBtnDeleteClick(): void {
    const deleteConfirmation = new DeleteConfirmation();
    deleteConfirmation.accept = () => {
      const tempId = this.selectedItem.data.id;
      this.operationService.delete(tempId).subscribe(res => {
        this.notification.showSuccess();
        if (this.editingItem) {
          if (this.editingItem.id === tempId) {
            this.editingItem = undefined;
          }
        }

        this.deleteInTreeById(this.treeData, tempId);
        this.treeData = [...this.treeData];

        this.onNodeUnselect();
      });
      this.cd.detectChanges();
    };
    this.notification.confirm(deleteConfirmation);
  }

  private deleteInTreeById(source: TreeNode[], id: string) {
    if (!source || source.length === 0) {
      return;
    }

    for (let i = 0; i < source.length; i++) {
      if (source[i].data.id === id) {
        source.splice(i, 1);
      } else {
        this.deleteInTreeById(source[i].children, id);
      }
    }
  }

  public onSuccess(event: string) {
    // if (event) {
    //   this.reloadOperationData();

    //   if (this.selectedItem.data && this.selectedItem.data.id !== null) {
    //     this.initActionData();
    //   }

    //   this.onNodeUnselect();
    // }

    if (event === 'UPDATE') {
      Object.assign(this.selectedItem.data, this.dialogRef.input);
      this.selectedItem.label = this.selectedItem.data.name;
      this.operationService.setIconForNode(this.selectedItem);
      this.treeData = [...this.treeData];
    } else if (event === 'INSERT') {
      this.reloadOperationData();
      if (this.selectedItem.data && this.selectedItem.data.id !== null) {
        this.initOperationTaskData();
      }
      this.onNodeUnselect();
    }
  }

  public onAddActionSuccess(event: boolean) {
    if (event) {
      this.initOperationTaskData();;
    }
  }
}
