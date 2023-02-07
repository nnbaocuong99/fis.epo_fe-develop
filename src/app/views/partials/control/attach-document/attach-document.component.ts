import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as config from './attach-document.config';
import { TreeNode } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { BaseFormComponent } from '../../../../core/_base/component';
import { PurchaseAttachmentService } from '../../../../services/modules/purchase-attachment/purchase-attachment.service';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { FileService } from '../../../../services/modules/file/file.service';
import { PurchaseAttachmentRequestPayload } from '../../../../services/modules/purchase-attachment/purchase-attachment.request.payload';
import { ChangeConfirmation, DeleteConfirmation, SaveConfirmation } from '../../../../services/common/confirmation';
import { FileDownload } from '../download-file/download-file.component';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'attach-document',
    templateUrl: './attach-document.component.html',
    styleUrls: ['./attach-document.component.scss']
})
export class AttachDocumentComponent extends BaseFormComponent implements OnInit {
    @Input() mainModule: string; // Module name
    @Input() fileModule: string; // Module of file upload
    @Input() recordId: string; // Id of record
    @Input() hideOptional = false; // Id of record
    @Output() listFile: EventEmitter<any> = new EventEmitter();
    @Input() isRequired = false;
    @Input() multiple = false;
    @Input() formTitle = 'PROFILE.PROFILE_CATEGORY';
    // Control view
    @Input() viewMode = false;
    @Input() isDelete = true;
    public headers = [];
    public headersTree = [];
    public mainConfig: any;
    public request: any;
    public dataSource = {
        items: null,
        paginatorTotal: undefined,
    };

    public files: TreeNode[];
    public isEditMode = false;
    public newLine: any = {};
    public isShownAll: boolean;

    constructor(
        public purchaseAttachmentService: PurchaseAttachmentService,
        private noticeService: NotificationService,
        private cd: ChangeDetectorRef,
        public fileService: FileService
    ) {
        super();
    }

    ngOnInit() {
        this.isShownAll = !this.hideOptional;
        this.headers = config.HEADER;
        this.headersTree = config.HEADER_TREE;
        this.initData();
    }

    public initData(sendListFile?): void {
        this.files = [];
        const request = new PurchaseAttachmentRequestPayload();
        request.recordId = this.recordId;
        request.module = this.mainModule;
        this.purchaseAttachmentService.getPurchaseAttachment(request).subscribe(res => {
            this.dataSource.items = res;
            let showPart = [];

            if (this.hideOptional) {
                showPart = this.dataSource.items.filter(x => x.isRequired || x.files);
            } else {
                showPart = this.dataSource.items;
            }

            this.listDocumentToTreeView(showPart);
            if (sendListFile) {
                this.listFile.emit(showPart);
            }

            this.files = [...this.files];
            this.cd.detectChanges();
        });
    }

    public uploaded(data) {
        this.initData(true);
    }

    private listDocumentToTreeView(source: any[]): void {
        for (const item of source) {
            item.parent = true;
            const node: TreeNode = {
                data: { ...item },
                children: [],
                leaf: !item.files
            };

            for (const file of (item.files || [])) {
                const childNode: TreeNode = {
                    data: { ...file },
                    leaf: true
                };
                node.children.push(childNode);
            }

            this.files.push(node);
        }
    }

    handleFileInput(rowData: any, files: FileList): void {
        rowData.fileToUpload = files.item(0);
        rowData.fileName = rowData.fileToUpload.name;
    }

    removeChip(rowData: any): void {
        rowData.fileToUpload = null;
        rowData.fileName = null;
    }

    public onBtnDownloadFile(id: string, name: string): void {
        const fileDownload = new FileDownload();
        fileDownload.id = id;
        fileDownload.name = name;
        this.fileService.download(fileDownload);
    }

    public onBtnDeleteFileClick(id: string) {
        const confirmation = new DeleteConfirmation();
        confirmation.accept = () => {
            this.fileService.delete(id).subscribe(() => {
                this.initData();
            });
        };
        this.noticeService.confirm(confirmation);
    }

    public onBtnDeleteFileCategoryClick(id: string): void {
        const confirmation = new DeleteConfirmation();
        confirmation.accept = () => {
            this.purchaseAttachmentService.delete(id).subscribe(() => {
                this.noticeService.showDeteleSuccess();
                this.initData();
            });
        };
        this.noticeService.confirm(confirmation);
    }

    public onBtnMergeFileCategoryClick(form: NgForm): void {
        if (this.validateForm(form, 'file_attach')) {
            const confirmation = new SaveConfirmation();
            confirmation.accept = () => {
                this.newLine.recordId = this.recordId;
                this.newLine.module = this.mainModule;
                this.purchaseAttachmentService.merge(this.newLine).subscribe(() => {
                    this.isEditMode = false;
                    this.noticeService.showSuccess();
                    this.newLine = {};
                    this.initData();
                });
            };
            this.noticeService.confirm(confirmation);
        }
    }

    public onChangRequiredStatus(rowData: any, value: boolean): void {
        rowData.isRequired = value;
        let request: any;
        if (rowData.isDefault) {
            // Case 1: Change required status in default list
            request = {
                id: rowData.id,
                recordId: this.recordId,
                configListId: rowData.configListId,
                isRequired: rowData.isRequired
            };
        } else {
            request = { ...rowData };
            request.recordId = this.recordId;
        }

        // Case 2: Change required status in custom list
        const confirmation = new ChangeConfirmation();
        confirmation.accept = () => {
            this.purchaseAttachmentService.merge(request).subscribe(() => {
                this.noticeService.showSuccess();
            }, () => {
                // Back to old value when error
                rowData.isRequired = !rowData.isRequired;
                this.cd.detectChanges();
            });
        };
        confirmation.reject = () => {
            // Back to old value when error
            rowData.isRequired = !rowData.isRequired;
            this.cd.detectChanges();
        };
        this.noticeService.confirm(confirmation);
    }

    public onBtnToggleViewClick(): void {
        if (this.isShownAll) {
            // Hide
            this.files = [];
            const showPart = this.dataSource.items.filter(x => x.isRequired || x.files);
            this.listDocumentToTreeView(showPart);
        } else {
            // Show
            const hidePart = this.dataSource.items.filter(x => !x.isRequired && !x.files);
            this.listDocumentToTreeView(hidePart);
        }

        this.isShownAll = !this.isShownAll;
        this.files = [...this.files];
        this.cd.detectChanges();
    }

    public isShowBtnToggleView(): boolean {
        return this.hideOptional && this.dataSource.items && this.dataSource.items.some(x => !x.isRequired && !x.files);
    }
}
