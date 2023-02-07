import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as config from './energy-efficiency.config';
import { LicenseConformityService } from '../../../../../services/modules/license-conformity/license-conformity.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseListComponent } from '../../../../../core/_base/component';
import { LicenseConformityRequestPayload } from '../../../../../services/modules/license-conformity/license-conformity.request-payload';
import { NotificationService } from '../../../../../services/common/notification/notification.service';

@Component({
  selector: 'app-energy-efficiency',
  templateUrl: './energy-efficiency.component.html',
  styleUrls: ['./energy-efficiency.component.scss']
})
export class EnergyEfficiencyComponent extends BaseListComponent implements OnInit {

  public cols = config.HEADER;
  public executionStatus = config.EXECUTION_STATUS;
  public request: any = {};

  constructor(
    public licenseConformityService: LicenseConformityService,
    public cdr: ChangeDetectorRef,
    public activatedRoute: ActivatedRoute,
    private noticeService: NotificationService,
    public router: Router
  ) {
    super();
  }

  ngOnInit() {
    this.baseService = this.licenseConformityService;
    this.request = new LicenseConformityRequestPayload();
    this.request.type = 1;
    this.loadData();
  }

  public loadData(): void {
    super.ngOnInit();
    this.fnSuccess = () => {
      const arr = [];
      for (const element of this.dataSource.items) {
        const temp = JSON.parse(element.note);
        element.note = '';
        for (const el of temp) {
          if (el.note !== null) {
            if (element.note.search(el.note) === -1) {
              element.note = element.note + '\n' + el.note;
            }
          }
        }
        arr.push(element);
      }
      this.dataSource.items = arr;
    };
  }

  public onBtnExportAllDataClick(): void {

    // const exportModel = new ExportModel();
    // exportModel.description = 'Test export';
    // exportModel.source = this.dataSource.items;
    // exportModel.columns = [
    //   { bindLabel: 'invoice type', bindValue: 'invoiceType' },
    //   { bindLabel: 'created at', bindValue: 'createdAt', dataType: DataType.DateTime }
    // ];
    // this.exportService.export(this.request, 'p-invoice').subscribe(() => {
    //   this.noticeService.showMessage('Download complete');
    // });
    this.request.pageSize = 0;
    this.licenseConformityService.exportAll(this.request).subscribe(() => {
      this.noticeService.showMessage('Download complete');
    });
  }

  public onBtnRegisteredClick(rowData: any): void {
    this.router.navigate([`energy-efficiency/registered/${rowData.id}`], { relativeTo: this.activatedRoute });
  }

  public onBtnViewClick(rowData: any): void {
    this.router.navigate([`energy-efficiency/registered/${rowData.id}`], { relativeTo: this.activatedRoute });
  }

}
