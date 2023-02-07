import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { ReportService } from '../../../../services/modules/report/report.service';
import { ToolbarModel } from '../../../partials/content/toolbar/toolbar.model';

@Component({
  selector: 'app-report-contractor-tax',
  templateUrl: './report-contractor-tax.component.html',
  styleUrls: ['./report-contractor-tax.component.scss']
})
export class ReportContractorTaxComponent implements OnInit {
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

  public exportContractorTaxAll(type: any): void {
    this.request.type = type;
    let exportFileName = 'Báo cáo thuế nhà thầu đã tính nguyên tệ (NT)';
    if (type !== 'OriginalCurrency') {
      exportFileName = 'Báo cáo thuế nhà thầu đã tính quy đổi (VND)';
    }
    this.reportService.exportContractorTax(this.request, exportFileName).subscribe(m => {
      this.notificationService.showSuccess();
    });
  }

}
