import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { ReportService } from '../../../../services/modules/report/report.service';
import { ToolbarModel } from '../../../partials/content/toolbar/toolbar.model';

@Component({
  selector: 'app-report-po-rebate',
  templateUrl: './report-po-rebate.component.html',
  styleUrls: ['./report-po-rebate.component.scss']
})
export class ReportPoRebateComponent implements OnInit {
  @ViewChild('formFilter', { static: true }) formFilter: NgForm;
  public toolbarModel: ToolbarModel;
  public request: any = {};

  constructor(
    public notificationService: NotificationService,
    public reportService: ReportService,
  ) {
  }

  ngOnInit() {
    this.configToolbar();
  }

  private configToolbar(): void {
    this.toolbarModel = new ToolbarModel();
    this.toolbarModel.option.show = false;
    this.toolbarModel.add.show = false;
    this.toolbarModel.search.show = false;
  }

  public exportPoInfoSupportRebateTool(): void {
    this.reportService.exportPoInfoSupportRebateTool(this.request).subscribe(m => {
      this.notificationService.showSuccess();
    });
  }

}
