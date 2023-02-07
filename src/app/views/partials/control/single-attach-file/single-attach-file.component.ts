import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Guid } from 'guid-typescript';
import { DeleteConfirmation } from '../../../../services/common/confirmation';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { FileRequestPayload } from '../../../../services/modules/file/file.request.payload';
import { FileService } from '../../../../services/modules/file/file.service';
import { DialogRef } from '../../content/crud/dialog/dialog-ref.model';
import { DialogViewPdfFileComponent } from '../dialog-view-pdf-file/dialog-view-pdf-file.component';
import { FileDownload } from '../download-file/download-file.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'single-attach-file',
  templateUrl: './single-attach-file.component.html',
  styleUrls: ['./single-attach-file.component.scss']
})
export class SingleAttachFileComponent implements OnInit {
  @ViewChild('dialogViewPdfFile', { static: false }) dialogViewPdfFile: DialogViewPdfFileComponent;

  // @Input() module: string;
  _module: any;
  get module(): any {
    return this._module;
  }
  @Input() set module(data: any) {
    this._module = data;
    this.initData();
  }

  @Input() edit = true;
  @Output() uploaded: EventEmitter<any> = new EventEmitter();
  @Output() success: EventEmitter<any> = new EventEmitter();
  @Output() noSave: EventEmitter<any> = new EventEmitter();
  @Input() multiple = false;
  @Input() disabled = false;
  @Input() hasDirectSave = true;

  public isError: boolean;
  public fileInfo: any;
  public controlId: any = Guid.create().toString();
  public src: any;
  public checkPdf = false;

  constructor(
    public fileService: FileService,
    public notificationService: NotificationService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.initData();
  }

  public onUploaded(event?: any) {
    this.uploaded.emit(event);
    this.initData(event);
  }

  public initData(event?: any): void {
    const request = new FileRequestPayload();
    request.module = this.module;
    this.fileService.select(request).subscribe(res => {
      if (!res || res.length === 0) {
        this.fileInfo = undefined;
        this.isError = false;
      } else if (res && res.length === 1) {
        this.fileInfo = res[0];
        this.success.emit(this.fileInfo);
        this.isError = false;
      } else {
        this.isError = true;
        this.fileInfo = undefined;
      }
      this.detectChanges();
    }, () => {
      this.isError = true;
      this.detectChanges();
    });
  }

  public bindingDataToSave(event?: any): void {
    if (event) {
      this.fileInfo = { name: event.newFile.name };
      this.noSave.emit(event);
      this.detectChanges();
    }
  }

  private detectChanges(): void {
    // tslint:disable-next-line:no-string-literal
    if (this.cd && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  public onBtnDeleteFile(): void {
    // Delete file
    if (this.fileInfo.id) {
      const confirmation = new DeleteConfirmation();
      confirmation.accept = () => {
        this.fileService.delete(this.fileInfo.id).subscribe(() => {
          this.initData();
          this.success.emit();
          this.detectChanges();
        });
      };
      this.notificationService.confirm(confirmation);
    } else {
      this.fileInfo = null;
    }
  }

  public onLinkDownloadClick(file: any): void {
    if (file.id) {
      const fileDownload = new FileDownload();
      fileDownload.id = file.id;
      fileDownload.name = file.name;
      this.fileService.download(fileDownload);
    }
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
}
