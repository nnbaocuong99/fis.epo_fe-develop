import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { ReportService } from '../../../../services/modules/report/report.service';
import { ToolbarModel } from '../../../partials/content/toolbar/toolbar.model';

@Component({
  selector: 'app-report-brand-vendors-policy',
  templateUrl: './report-brand-vendors-policy.component.html',
  styleUrls: ['./report-brand-vendors-policy.component.scss']
})
export class ReportBrandVendorsPolicyComponent implements OnInit {
  @ViewChild('formFilter', { static: true }) formFilter: NgForm;
  public toolbarModel: ToolbarModel;
  public request: any = {};

  constructor(
    public notificationService: NotificationService,
    public reportService: ReportService,
  ) { }

  ngOnInit() {
    this.configToolbar();
  }

  private configToolbar(): void {
    this.toolbarModel = new ToolbarModel();
    this.toolbarModel.option.show = false;
    this.toolbarModel.add.show = false;
    this.toolbarModel.search.show = false;
  }

  public exportBrandVendorsPolicy(): void {
    this.reportService.exportBrandVendorsPolicy(this.request).subscribe(m => {
      this.notificationService.showSuccess();
    });
  }

}
