import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BaseComponent } from '../../../../core/_base/component/base-component';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { DepartmentService } from '../../../../services/modules/category/department/department.service';
import { OperatingUnitService } from '../../../../services/modules/category/organization-management/operating-unit/operating-unit.service';
import { ReportService } from '../../../../services/modules/report/report.service';
import { ToolbarModel } from '../../../partials/content/toolbar/toolbar.model';

@Component({
  selector: 'app-report-invoice-import-goods-tracking',
  templateUrl: './report-invoice-import-goods-tracking.component.html',
  styleUrls: ['./report-invoice-import-goods-tracking.component.scss']
})
export class ReportInvoiceImportGoodsTrackingComponent extends BaseComponent implements OnInit {
  @ViewChild('formFilter', { static: true }) formFilter: NgForm;

  public toolbarModel: ToolbarModel;
  public request: any = {};
  public listFisX = [];
  constructor(
    public notificationService: NotificationService,
    public reportService: ReportService,
    public cdr: ChangeDetectorRef,
    public departmentService: DepartmentService,
    public operatingUnitService: OperatingUnitService
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

  public btnExportInvoiceImportGoodsTracking(): void {
    const exportFileName = 'B??o c??o theo d??i nh???p h??ng h??a ????n';
    this.reportService.exportInvoiceImportGoodsTracking(this.request, exportFileName).subscribe(m => {
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
