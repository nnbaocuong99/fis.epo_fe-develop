import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { ReportAFService } from '../../../../services/modules/report-af/report-af.service';
import { ToolbarModel } from '../../../partials/content/toolbar/toolbar.model';

@Component({
  selector: 'app-report-ap04021',
  templateUrl: './report-ap04021.component.html',
  styleUrls: ['./report-ap04021.component.scss']
})
export class ReportAp04021Component implements OnInit {
  @ViewChild('formFilter', { static: true }) formFilter: NgForm;
  public toolbarModel: ToolbarModel;
  public request: any = {};

  constructor(
    public notificationService: NotificationService,
    public reportAFService: ReportAFService,
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

  public exportAP04021(): void {
    this.reportAFService.exportAP04021(this.request).subscribe(m => {
      this.notificationService.showSuccess();
    });
  }

}
