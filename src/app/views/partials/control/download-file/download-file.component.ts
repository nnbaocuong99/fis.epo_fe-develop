import {
  Component, NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, OnInit, Input,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { FileService } from '../../../../services/modules/file/file.service';
import { DialogRef } from '../../content/crud/dialog/dialog-ref.model';
import { FileRequestPayload } from '../../../../services/modules/file/file.request.payload';
import { BaseFormComponent } from '../../../../core/_base/component/base-form.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'download-file',
  templateUrl: './download-file.component.html',
  styleUrls: ['./download-file.component.css']
})
export class DownloadFileTemplateComponent extends BaseFormComponent implements OnInit {
  @Input() module: string;
  @Input() label: string;
  @Input() icon: string;
  @Input() title = 'Download files';

  public listTemplateFile: any = [];
  public dialogRef: DialogRef = new DialogRef();

  constructor(
    public fileService: FileService,
    public cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
  }

  public onBtnDownloadFile(id: string, name: string): void {
    const fileDownload = new FileDownload();
    fileDownload.id = id;
    fileDownload.name = name;
    this.fileService.download(fileDownload);
  }

  public close() {
    this.dialogRef.hide();
  }

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

  public showDownloadFile(): void {
    const request = new FileRequestPayload();
    request.module = this.module;
    const fileTemplate = this.fileService.select(request).subscribe(res => {
      if (res) {
        this.listTemplateFile = res;
        this.dialogRef.show();
        this.cdr.detectChanges();
      }
    });
    this.subscriptions.push(fileTemplate);
  }
}

export class FileDownload {
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
    DownloadFileTemplateComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    DialogModule
  ],
  exports: [
    DownloadFileTemplateComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA,
  ]
})

export class DownloadFileTemplateModule { }
