import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FileService } from '../../../../services/modules/file/file.service';
import { TreeNode, MenuItem } from 'primeng/api';
import { BaseComponent } from '../../../../core/_base/component/base-component';
import * as config from './file.config';
import { FileInfo, FileRequestPayload } from '../../../../services/modules/file/file.request.payload';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { DeleteConfirmation } from '../../../../services/common/confirmation/delete-confirmation';
import { DialogRef } from '../../../partials/content/crud/dialog/dialog-ref.model';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent extends BaseComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public treeData: TreeNode[];
  public selectedFolder: TreeNode;
  public menuItems: MenuItem[];
  public modules: string[];
  public headers = config.HEADERS;
  public dataSource = {
    items: [],
    paginatorTotal: undefined
  };
  public request = new FileRequestPayload();
  public dialogRef = new DialogRef();
  public newFile: any = {};

  constructor(
    public fileService: FileService,
    public noticeService: NotificationService,
    public cd: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.menuItems = [
      {
        label: 'Unselect', icon: 'fal fa-times-circle', command: () => {
          this.selectedFolder = null; this.request.moduleStartsWith = null; this.getListFile();
        }
      },
      { label: 'View', icon: 'fal fa-list-ul', command: () => { } },
      { label: 'Properties', icon: 'fal fa-info-circle', command: () => { } }
    ];

    this.initData();

    const paginatorSubscriptions = merge(this.paginator.page).pipe(
      tap(() => {
        this.getListFile();
      })
    ).subscribe();
    this.subscriptions.push(paginatorSubscriptions);
  }

  public initData(): void {
    this.fileService.selectDistinctModule().subscribe(res => {
      this.modules = res;
      const modules: string[] = this.getMainModule(res);
      this.treeData = [];
      for (const module of modules) {
        const parentNode: TreeNode = {
          label: module,
          data: module,
          expandedIcon: 'fas fa-folder folder-explorer',
          collapsedIcon: 'fas fa-folder-open folder-explorer',
          expanded: true,
          children: []
        };
        if (module.split('\\')[0]) {
          this.treeData.push(parentNode);
        }
      }
      this.getSub(res, this.treeData);
      this.cd.detectChanges();
    });

    this.getListFile();
  }

  public getMainModule(source: string[]): string[] {
    const result: string[] = [];
    for (const module of source) {
      if (!result.includes(module.split('\\')[0])) {
        result.push(module.split('\\')[0]);
      }
    }

    return result;
  }

  private getSub(source: string[], parentNodes: TreeNode[]): void {
    for (const parentNode of parentNodes) {
      const childPaths = source.filter(x => x.startsWith(parentNode.data) && !!x.replace(parentNode.data, ''));
      if (childPaths.length > 0) {
        for (const childPath of childPaths) {
          const childLabel = childPath.replace(parentNode.data, '').split('\\')[1]; // Folder name
          const childData = parentNode.data + '\\' + childPath.replace(parentNode.data, '').split('\\')[1]; // Folder path
          const childNode: TreeNode = {
            label: childLabel,
            data: childData,
            expandedIcon: 'fas fa-folder-open folder-explorer',
            collapsedIcon: 'fas fa-folder folder-explorer',
            expanded: true,
            children: []
          };
          if (!parentNode.children.map(x => x.label).includes(childNode.label)) {
            parentNode.children.push(childNode);
          }
        }
        this.getSub(source, parentNode.children);
      }
    }
  }

  public onNodeSelect(event?: any): void {
    this.request.moduleStartsWith = event ? event.node.data : null;
    this.getListFile();
  }

  public getListFile(): void {
    this.request.pageIndex = this.paginator.pageIndex;
    this.request.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
    const selectSub = this.fileService.select(this.request).subscribe(res => {
      this.dataSource.items = res;
      this.cd.detectChanges();
    });
    const countSub = this.fileService.count(this.request).subscribe(res => {
      this.dataSource.paginatorTotal = res;
      this.cd.detectChanges();
    });
    this.subscriptions.push(...[selectSub, countSub]);
  }

  public onBtnDeleteClick(id: string): void {
    const confirmation = new DeleteConfirmation();
    confirmation.accept = () => {
      this.fileService.delete(id).subscribe(() => {
        this.getListFile();
        this.noticeService.showDeteleSuccess();
      });
    };
    this.noticeService.confirm(confirmation);
  }

  public onBtnDownloadClick(rowData: any): void {
    const fileInfo = new FileInfo();
    fileInfo.id = rowData.id;
    fileInfo.name = rowData.name;
    this.fileService.download(fileInfo);
  }

  public onBtnAddFileClick(): void {
    this.dialogRef.show();
  }

  public onBtnPerformClick(): void {
    const request = new FileRequestPayload();
    request.module = this.newFile.module;
    request.note = this.newFile.note;

    this.fileService.upload(this.newFile.value, request).subscribe(() => {
      this.initData();
      this.dialogRef.hide();
      this.noticeService.showSuccess();
    });
  }

  /**
     * Handle event when input files
     * @param files Files input
     */
  public onFilesInputChanged(files: File[]) {
    this.newFile.name = files[0].name;
    this.newFile.value = files;
    console.log(files);
  }

  public onInputNameFileClick(): void {
    if (!this.newFile.name) {
      document.getElementById('control-upload').click();
    }
  }

  public onBtnCancelClick(): void {
    this.dialogRef.hide();
  }
}
