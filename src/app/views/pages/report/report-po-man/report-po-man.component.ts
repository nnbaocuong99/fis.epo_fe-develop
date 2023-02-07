import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BaseComponent } from '../../../../core/_base/component/base-component';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { DepartmentService } from '../../../../services/modules/category/department/department.service';
import { OrgChartService } from '../../../../services/modules/org-chart/org-chart.service';
import { ReportService } from '../../../../services/modules/report/report.service';
import { UserService } from '../../../../services/modules/user/user.service';
import { ToolbarModel } from '../../../partials/content/toolbar/toolbar.model';
@Component({
  selector: 'app-report-po-man',
  templateUrl: './report-po-man.component.html',
  styleUrls: ['./report-po-man.component.scss']
})
export class ReportPoManComponent extends BaseComponent implements OnInit {
  @ViewChild('formFilter', { static: true }) formFilter: NgForm;

  public toolbarModel: ToolbarModel;
  public request: any = {};
  public listFisX = [];
  constructor(
    public notificationService: NotificationService,
    public reportService: ReportService,
    public orgService: OrgChartService,
    public userService: UserService,
    public departmentService: DepartmentService,
    public cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.configToolbar();
    const sub = this.departmentService.select().subscribe(res => {
      if (res) {
        const listtem = Object.keys(this.groupBy(res.filter(x => x.acronym), 'acronym'));
        for (const fisX of listtem) {
          this.listFisX.push({ label: fisX });
        }
        this.cdr.detectChanges();
      }
    });
    this.subscriptions.push(sub);
  }

  private configToolbar(): void {
    this.toolbarModel = new ToolbarModel();
    this.toolbarModel.option.show = false;
    this.toolbarModel.add.show = false;
    this.toolbarModel.search.show = false;
  }

  public btnExportPoMan(): void {
    const exportFileName = 'Báo cáo Po man';
    this.reportService.exportPoMan(this.request, exportFileName).subscribe(m => {
      this.notificationService.showSuccess();
    });
  }

  public groupBy(xs: any[], key: string) {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

}
