import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import * as config from './certificate-quality.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { MatPaginator } from '@angular/material';
import { LicenseConformityService } from '../../../../../services/modules/license-conformity/license-conformity.service';
import { BaseListComponent } from '../../../../../core/_base/component';
import { LicenseConformityRequestPayload } from '../../../../../services/modules/license-conformity/license-conformity.request-payload';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../../services/common/notification/notification.service';

@Component({
  selector: 'app-certificate-quality',
  templateUrl: './certificate-quality.component.html',
  styleUrls: ['./certificate-quality.component.scss']
})
export class CertificateQualityComponent extends BaseListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public cols = config.HEADER;
  public executionStatus = config.EXECUTION_STATUS;
  public request: any = {};

  public dataSource = {
    items: null,
    paginatorTotal: undefined
  };

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
    this.request.type = 2;
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
    this.request.pageSize = 0;
    this.licenseConformityService.exportAll(this.request).subscribe(() => {
      this.noticeService.showMessage('Download complete');
    });
  }

  public onBtnRegisteredClick(id: string): void {
    this.router.navigate([`certificate-quality/registered/${id}`], { relativeTo: this.activatedRoute });
  }

  public onBtnViewClick(id: string): void {
    this.router.navigate([`certificate-quality/registered/${id}`], { relativeTo: this.activatedRoute });
  }

}

