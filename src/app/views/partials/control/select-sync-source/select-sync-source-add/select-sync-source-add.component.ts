import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { DialogRef } from '../../../content/crud/dialog/dialog-ref.model';

@Component({
  selector: 'app-select-sync-source-add',
  templateUrl: './select-sync-source-add.component.html',
  styleUrls: ['./select-sync-source-add.component.scss']
})
export class SelectSyncSourceAddComponent implements OnInit {
  @Input() dialogRef: DialogRef = new DialogRef();
  @ViewChild('form', { static: true }) form: NgForm;

  public dataSource: any = {};
  constructor(private noticficationService: NotificationService) { }

  ngOnInit() {
  }

  public onBtnSaveClick(): void {
    this.dialogRef.input.service.merge(this.dataSource).subscribe(res => {
      if (res) {
        this.dialogRef.hide();
        this.noticficationService.showSuccess();
      }
    });
  }
}
