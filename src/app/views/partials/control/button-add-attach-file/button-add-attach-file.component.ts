import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { BaseFormComponent } from '../../../../core/_base/component';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { FileRequestPayload } from '../../../../services/modules/file/file.request.payload';
import { FileService } from '../../../../services/modules/file/file.service';
import { DialogRef } from '../../content/crud/dialog/dialog-ref.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'button-add-attach-file',
  templateUrl: './button-add-attach-file.component.html',
  styleUrls: ['./button-add-attach-file.component.scss']
})
export class ButtonAttachFileComponent extends BaseFormComponent implements OnInit {
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() uploaded: EventEmitter<any> = new EventEmitter();
  @Output() noSave: EventEmitter<any> = new EventEmitter();
  @Input() module: string;
  @Input() isRequired = false;
  @Input() multiple = false;
  @Input() hasDirectSave = true;
  public controlId: any = Guid.create().toString();
  public formId: any = Guid.create().toString();
  public newFile: any = {};
  public dialogRef = new DialogRef();

  constructor(
    public fileService: FileService,
    public noticeService: NotificationService
  ) {
    super();
  }

  ngOnInit() {
  }

  /**
   * Handle event when input files
   * @param files Files input
   */
  public onFilesInputChanged(files: File[]) {
    if (files[0]) {
      const listFileName = [];
      for (let i = 0; i < files.length; i++) {
        listFileName.push(files[i].name);
      }
      this.newFile.name = listFileName.join(', ');
      this.newFile.value = files;
      this.change.emit(this.newFile);
    }
  }

  public onInputNameFileClick(): void {
    if (!this.newFile.name) {
      this.clickControlInputFile();
    }
  }

  public clickControlInputFile(): void {
    document.getElementById(this.controlId).click();
  }

  public onBtnPerformClick(form: NgForm): void {
    if (this.validateForm(form, this.formId)) {
      const request = new FileRequestPayload();
      request.module = this.module;
      request.note = this.newFile.note;
      if (this.hasDirectSave) {
        this.fileService.upload(this.newFile.value, request).subscribe(res => {
          this.dialogRef.hide();
          this.noticeService.showSuccess();
          this.uploaded.emit(res);
        });
      } else {
        this.dialogRef.hide();
        request.newFile = this.newFile;
        this.noSave.emit(request);
      }
    }
  }

  public onBtnCancelClick(): void {
    this.dialogRef.hide();
  }
}
