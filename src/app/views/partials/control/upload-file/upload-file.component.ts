import {
    Component, Input, NgModule,
    NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, Output, EventEmitter, ViewChild} from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { FileService } from '../../../../services/modules/file/file.service';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'upload-file',
    templateUrl: './upload-file.component.html',
    styleUrls: ['./upload-file.component.css']
})

export class DialogUploadFileComponent {
    @ViewChild('file', { static: true }) input: any;
    @Input() multiple = true;
    @Input() accept: string;
    @Input() message: string;
    @Output() onupload: EventEmitter<any> = new EventEmitter();
    @Output() onclose: EventEmitter<any> = new EventEmitter();
    @Output() onopen: EventEmitter<any> = new EventEmitter();
    @Output() ondelete: EventEmitter<any> = new EventEmitter();

    public isDisplay = false;
    public tableFile: FileUpload[] = [];

    constructor(
        private translateService: TranslateService,
        private sysFileService: FileService
    ) {
        this.translateService.addLangs(['en', 'vn']);
        this.translateService.setDefaultLang('vn');
    }

    /**
     * Handle event when input files
     * @param files Files input
     */
    public onFilesInputChanged(files: File[]) {
        this.addFilesToList(files);
        this.input.nativeElement.value = '';
    }

    /**
     * Delete a file in queue by index
     * @param index index of file input
     */
    public deleteFileAttached(file: FileUpload): void {
        if (file.id) {
            this.ondelete.emit(file);
        } else {
            this.deleteItemOnTable(file);
        }

        if (this.tableFile.length === 0) {
            this.message = null;
        }
    }

    public deleteItemOnTable(file: FileUpload) {
        const index = this.tableFile.indexOf(file);
        this.tableFile.splice(index, 1);
    }

    /**
     * Clear all files in queue
     */
    public clearFilesAttached(): void {
        this.tableFile = this.tableFile.filter(x => x.id);
        this.message = '';
    }

    /**
     * Get volume of file
     * @param byte: volume of file by byte
     */
    public getVolume(byte: number): string {
        let result = '';
        if (byte < 1048576) {
            result = (byte / 1024).toFixed(2) + ' KB';
        } else if (byte >= 1048576) {
            result = (byte / 1048576).toFixed(2) + ' MB';
        } else if (byte >= 1073741824) {
            result = (byte / 1073741824).toFixed(2) + ' GB';
        }
        return result;
    }

    public getSummary(source: any[], property: string): number {
        return source
            .map((y: any) => y[property])
            .reduce((a: number, b: number) => a + b, 0);
    }

    onDragOverAndEnter(event: any): void {
        event.preventDefault();
    }

    onDropFile(event: any): void {
        const files = event.dataTransfer.files;
        this.addFilesToList(files);
        event.preventDefault();
    }

    private addFilesToList(files: File[]) {
        if (!this.multiple) {
            const item = new FileUpload(files[0]);
            this.tableFile = this.tableFile.filter(x => !x.file);
            this.tableFile.push(item);
        } else {
            for (const file of files) {
                const item = new FileUpload(file);
                this.tableFile.push(item);
            }
        }
    }

    public open(fileUploads?: FileUpload[]) {
        this.onopen.emit();
        if (fileUploads && fileUploads.length > 0) {
            this.tableFile.push(...fileUploads);
        }
        this.isDisplay = true;
    }

    public close() {
        this.message = null;
        this.onclose.emit();
        this.tableFile = [];
        this.isDisplay = false;
    }

    public checkOverwrite(file: FileUpload): boolean {
        return !this.multiple && !file.file && this.tableFile.length > 1;
    }

    public onBtnDownloadFile(file: FileUpload): void {
        this.sysFileService.download(file);
    }

    public disabledUpload(): boolean {
        return this.tableFile.filter(x => x.file).length === 0;
    }

    public preventSelectText(): void {
        document.getSelection().empty();
    }
}

export class FileUpload {
    id?: string;
    name: string;
    size: number;
    path?: string;
    file?: File;
    delete?: boolean;
    constructor(file?: File) {
        if (file) {
            this.name = file.name;
            this.size = file.size;
            this.file = file;
        }
    }
}

@NgModule({
    declarations: [
        DialogUploadFileComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        DialogModule
    ],
    exports: [
        DialogUploadFileComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA,
        CUSTOM_ELEMENTS_SCHEMA,
    ]
})

export class UploadFileModule { }
