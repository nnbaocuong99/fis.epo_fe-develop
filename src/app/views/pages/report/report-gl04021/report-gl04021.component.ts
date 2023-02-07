import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { ReportAFService } from '../../../../services/modules/report-af/report-af.service';
import { ToolbarModel } from '../../../partials/content/toolbar/toolbar.model';

@Component({
  selector: 'app-report-gl04021',
  templateUrl: './report-gl04021.component.html',
  styleUrls: ['./report-gl04021.component.scss']
})
export class ReportGl04021Component implements OnInit {
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

  public exportGL04021(): void {
    this.reportAFService.exportGL04021(this.request).subscribe(m => {
      this.notificationService.showSuccess();
    });
  }
}
