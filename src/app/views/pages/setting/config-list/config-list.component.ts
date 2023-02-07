import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Guid } from 'guid-typescript';
import { MenuItem } from 'primeng/api';
import { TreeNode } from 'primeng/api/treenode';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { BaseComponent } from '../../../../core/_base/component/base-component';
import { CancelConfirmation } from '../../../../services/common/confirmation/cancel-confirmation';
import { DeleteConfirmation } from '../../../../services/common/confirmation/delete-confirmation';
import { SaveConfirmation } from '../../../../services/common/confirmation/save-confirmation';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { ConfigListRequestPayload } from '../../../../services/modules/config-list/config-list.request.payload';
import { ConfigListService } from '../../../../services/modules/config-list/config-list.service';
import { DialogRef } from '../../../partials/content/crud/dialog/dialog-ref.model';
import { ToolbarModel } from '../../../partials/content/toolbar/toolbar.model';
import * as config from './config-list.config';

@Component({
  selector: 'app-config-list',
  templateUrl: './config-list.component.html',
  styleUrls: ['./config-list.component.scss']
})
export class ConfigListComponent extends BaseComponent implements OnInit {
  btnItems: MenuItem[] = [
    { label: 'Thêm vào', icon: '', command: () => this.onBtnEditClick(this.selectedNode) },
    { label: 'Sắp xếp', icon: '', command: () => this.onBtnReorderClick(this.selectedNode) },
    { label: 'Sửa', icon: '', command: () => this.onBtnEditClick(this.selectedNode) },
    { label: 'Xóa', icon: '', command: () => this.onBtnDeleteClick(this.selectedNode) }
  ];
  selectedNode: any;

  @ViewChild('dlgConfirm', { static: true }) dlgConfirm: ConfirmDialog;
  public formTitle = 'CONFIG_LIST.HEADER_LIST';
  public rows = 10;
  public cols: any[] = config.HEADER;
  public toolbarModel: ToolbarModel;
  public treeData: TreeNode[];
  public dialogRef: DialogRef = new DialogRef();
  public configListDataSub: any;
  public showDialogReorder = false;
  public key: string;
  public parentNodeData: any;
  public rowNodeCurrent: any;

  constructor(
    public configListService: ConfigListService,
    private cd: ChangeDetectorRef,
    private notification: NotificationService) {
    super();
    this.key = Guid.create().toString();
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.dialogRef.isDisplay) {
      switch (event.code) {
        case 'Escape':
          if (!this.dlgConfirm.maskVisible) {
            this.onBtnCancelDialogClick();
          }
          break;
        case 'Enter':
        case 'NumpadEnter':
          if (!this.dlgConfirm.maskVisible && event.ctrlKey) {
            this.onBtnSaveDialogClick();
          } else {
            this.dlgConfirm.accept();
          }
          break;
        default:
          break;
      }
    }
  }

  ngOnInit() {
    this.configToolbar();
    this.dialogRef = new DialogRef();
  }

  private configToolbar(): void {
    this.toolbarModel = new ToolbarModel();
    this.toolbarModel.add.click = () => {
      this.dialogRef.config.style = { width: '80%', minWidth: '50%' };
      this.dialogRef.input = { types: this.parentNodeData };
      this.dialogRef.show();
    };
  }

  public loadNodes(event?: any): void {
    this.treeData = [];
    const selectSub = this.configListService.selectDistinctType().subscribe(res => {
      this.parentNodeData = res;
      res.forEach(element => {
        const node = {
          data: {
            type: element.key,
            count: element.count
          },
          leaf: false
        };
        this.treeData.push(node);
      });
      this.treeData = [...this.treeData];
      this.cd.detectChanges();
    });
    this.subscriptions.push(selectSub);
  }

  public onNodeExpand(event: any): void {
    const request = new ConfigListRequestPayload();
    const node = event.node;
    request.type = node.data.type;

    const selectSub = this.configListService.select(request).subscribe(res => {
      node.children = [];
      for (const item of res) {
        const childNode: TreeNode = {
          data: item,
          leaf: true
        };
        node.children.push(childNode);
      }
      this.treeData = [...this.treeData];
      this.cd.detectChanges();
    });

    this.subscriptions.push(selectSub);
  }

  public onBtnEditClick(rowNode: TreeNode): void {
    this.rowNodeCurrent = rowNode;
    const rowData = rowNode.data;
    this.dialogRef.config.style = { width: '80%', minWidth: '50%' };
    if (rowData) {
      this.dialogRef.output = rowData;
      rowData.types = this.parentNodeData;
      let temp = JSON.stringify(rowData);
      temp = JSON.parse(temp);
      this.dialogRef.input = temp;
      this.dialogRef.show();
      this.cd.detectChanges();
    } else {
      this.dialogRef.input = {};
      this.dialogRef.show();
    }
  }

  public onSuccess(event?: any): any {
    if (this.rowNodeCurrent && this.rowNodeCurrent.parent) {
      const node = {
        node: this.rowNodeCurrent.parent
      };
      this.onNodeExpand(node);
    } else {
      this.loadNodes();
    }
    this.cd.detectChanges();
  }

  // Handle event when delete click
  public onBtnDeleteClick(rowNode: TreeNode): void {
    this.rowNodeCurrent = rowNode;
    const rowData = rowNode.data;
    const deleteConfirmation = new DeleteConfirmation();
    deleteConfirmation.accept = () => {
      this.configListService.delete(rowData.id).subscribe(res => {
        this.notification.showSuccess();
        this.onSuccess();
        this.cd.detectChanges();
      });
    };
    this.notification.confirm(deleteConfirmation);
  }

  public onBtnReorderClick(rowNode: TreeNode): void {
    const rowData = rowNode.data;
    this.showDialogReorder = true;
    const request = new ConfigListRequestPayload();
    request.type = rowData.type;
    const selectSub = this.configListService.select(request).subscribe(res => {
      this.configListDataSub = res;
      this.cd.detectChanges();
    });
    this.subscriptions.push(selectSub);
  }

  public onBtnSaveDialogClick(): void {
    this.configListDataSub.forEach((element, index) => {
      element.indexNo = index + 1;
    });
    const saveConfirmation = new SaveConfirmation();
    saveConfirmation.accept = () => {
      const bulkUpdateSub = this.configListService.bulkUpdate(this.configListDataSub).subscribe(res => {
        if (res) {
          this.notification.showSuccess();
          this.showDialogReorder = false;
          this.loadNodes();
          this.cd.detectChanges();
        }
      });
      this.subscriptions.push(bulkUpdateSub);
    };
    this.notification.confirm(saveConfirmation);
  }

  public onBtnCancelDialogClick(): void {
    const cancelConfirmation = new CancelConfirmation();
    cancelConfirmation.accept = () => {
      this.showDialogReorder = false;
      this.cd.detectChanges();
    };
    this.notification.confirm(cancelConfirmation);
  }

  public onShowContextMenu() {
    if (!this.selectedNode.data.code) {
      this.btnItems[0].visible = true;
      this.btnItems[1].visible = true;
      this.btnItems[2].visible = false;
      this.btnItems[3].visible = false;
    } else {
      this.btnItems[0].visible = false;
      this.btnItems[1].visible = false;
      this.btnItems[2].visible = true;
      this.btnItems[3].visible = true;
    }
  }

}
