import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { FileService } from '../../../../services/modules/file/file.service';
import { DialogRef } from '../../content/crud/dialog/dialog-ref.model';

@Component({
  selector: 'app-dialog-view-pdf-file',
  templateUrl: './dialog-view-pdf-file.component.html',
  styleUrls: ['./dialog-view-pdf-file.component.scss']
})
export class DialogViewPdfFileComponent implements OnInit {
  @ViewChild('iframeViewPdf', { static: true }) iframeViewPdf: ElementRef;
  @Output() checkPdf: EventEmitter<any> = new EventEmitter();
  @Input() file: any;
  public dialogRefViewFile: DialogRef = new DialogRef();
  public src: any;

  constructor(
    public fileService: FileService,
    public notificationService: NotificationService,
    public cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getFileInfo();
  }

  private getFileInfo() {
    if (this.file.id) {
      this.fileService.getFileInfo(this.file).subscribe(res => {
        if (res.type === 'application/pdf') {
          this.src = window.URL.createObjectURL(res);
          this.iframeViewPdf.nativeElement.src = this.src;
          this.cdr.detectChanges();
          this.checkPdf.emit(true);
        }
      });
    }
  }

  public onBtnViewFile() {
    this.dialogRefViewFile.show();
  }

  public closeDialogViewFile() {
    this.dialogRefViewFile.hide();
  }

}
