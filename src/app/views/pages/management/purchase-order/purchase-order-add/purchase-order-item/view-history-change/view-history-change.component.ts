import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ChangeHistoryDto } from '../../../../../../../services/modules/change-history/change-history.model';
import { ChangeHistoryRequestPayload } from '../../../../../../../services/modules/change-history/change-history.request-payload';
import { ChangeHistoryService } from '../../../../../../../services/modules/change-history/change-history.service';
import { DialogRef } from '../../../../../../partials/content/crud/dialog/dialog-ref.model';

@Component({
  selector: 'app-view-history-change',
  templateUrl: './view-history-change.component.html',
  styleUrls: ['./view-history-change.component.scss']
})
export class ViewHistoryChangeComponent implements OnInit {
  @Input() dialogRef = new DialogRef();
  public dataSource: ChangeHistoryDto[] = [];

  constructor(
    public changeHistoryService: ChangeHistoryService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.dialogRef.visibility$.subscribe(res => {
      if (res && this.dialogRef.input.module) {
        const request = new ChangeHistoryRequestPayload();
        request.module = this.dialogRef.input.module;
        this.changeHistoryService.select(request).subscribe(res => {
          this.dataSource = res;
          this.cd.detectChanges();
        });
      }
    });
  }

  public onHide(): void {
    this.dataSource = [];
  }
}
