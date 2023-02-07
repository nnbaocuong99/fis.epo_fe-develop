import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ToolbarModel } from '../../../partials/content/toolbar/toolbar.model';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { NgForm } from '@angular/forms';
import { BaseFormComponent } from '../../../../core/_base/component/base-form.component';
import { SupplierService } from '../../../../services/modules/category/supplier/supplier.service';
import { EpoApHeader1InService } from '../../../../services/modules/epo-ap-header-1-in/epo-ap-header-1-in.service';
import { EpoPoHeaderInRequestPayload } from '../../../../services/modules/epo-po-header-in/epo-po-header-in-request-payload';
import { EpoPoHeaderInService } from '../../../../services/modules/epo-po-header-in/epo-po-header-in.service';
import { EpoSearchTmpService } from '../../../../services/modules/epo-search-tmp/epo-search-tmp.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { EpoSearchTmpRequestPayload } from '../../../../services/modules/epo-search-tmp/epo-search-tmp-request-payload';
import { EpoApHeader1InRequestPayload } from '../../../../services/modules/epo-ap-header-1-in/epo-ap-header-1-in-request-payload';
import { SupplierRequestPayload } from '../../../../services/modules/category/supplier/supplier.request.payload';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-report-sync-erp',
  templateUrl: './report-sync-erp.component.html',
  styleUrls: ['./report-sync-erp.component.scss']
})
export class ReportSyncErpComponent extends BaseFormComponent implements OnInit {
  @ViewChild('formFilter', { static: true }) formFilter: NgForm;

  public toolbarModel: ToolbarModel;
  public supplierRequestPayload = new SupplierRequestPayload();
  public headerSuppliers = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '150px', title: 'SUPPLIER.CODE', field: 'code' },
    { width: '250px', title: 'SUPPLIER.NAME', field: 'name' },
    { width: '150px', title: 'SUPPLIER.TAX_CODE', field: 'taxCode' }
  ];
  public request: any = {};
  public requestEpoPoHeaderIn: any = {};
  public requestEpoApHeader1In: any = {};
  public requestEpoSearchTmp: any = {};

  public selectedYear = new Date().getFullYear();
  public listYearSelect = [];
  public listMonthSelect = [];
  public listMonth = [];

  public basicChartDataPo: any;
  public basicChartDataPi: any;
  public basicChartDataUpdateCost: any;
  public strMonth: string;

  constructor(
    private cdr: ChangeDetectorRef,
    public notificationService: NotificationService,
    public supplierService: SupplierService,
    public epoPoHeaderInService: EpoPoHeaderInService,
    public epoApHeader1InService: EpoApHeader1InService,
    public epoSearchTmpService: EpoSearchTmpService,
    private translate: TranslateService,
  ) {
    super();
  }

  ngOnInit() {
    this.strMonth = this.translate.instant('REPORT.SYNC_ERP.MONTH');
    this.listMonth = [];
    this.listMonthSelect = [];
    for (let i = 0; i < 12; i++) {
      this.listMonth.push(this.strMonth + ' ' + (i + 1));
      this.listMonthSelect.push({ key: this.strMonth + ' ' + (i + 1), value: i });
    }

    const selectedYearTemp = new Date().getFullYear();
    this.listYearSelect = [];
    const strYear = this.translate.instant('REPORT.SYNC_ERP.YEAR');
    for (let i = selectedYearTemp - 5; i < selectedYearTemp + 5; i++) {
      this.listYearSelect.push({ key: strYear + ' ' + i, value: i });
    }
    this.configToolbar();
    this.initData();
  }

  public initData(): void {
    this.requestEpoPoHeaderIn = new EpoPoHeaderInRequestPayload();
    this.requestEpoApHeader1In = new EpoApHeader1InRequestPayload();
    this.requestEpoSearchTmp = new EpoSearchTmpRequestPayload();

    this.requestEpoPoHeaderIn.year = this.selectedYear;
    this.requestEpoApHeader1In.year = this.selectedYear;
    this.requestEpoSearchTmp.year = this.selectedYear;

    const initSub = forkJoin([
      this.epoPoHeaderInService.selectTotalAmount(this.requestEpoPoHeaderIn),
      this.epoApHeader1InService.selectTotalAmount(this.requestEpoApHeader1In),
      this.epoSearchTmpService.selectTotalAmount(this.requestEpoSearchTmp)
    ]).subscribe(res => {
      if (res) {
        // console.log(res[0]);
        // console.log(res[1]);
        // console.log(res[2]);

        this.basicChartDataPo = {
          labels: this.listMonth,
          datasets: [{
            type: 'bar',
            label: 'HN',
            backgroundColor: '#66BB6A',
            data: [
              res[0].HN.month1,
              res[0].HN.month2,
              res[0].HN.month3,
              res[0].HN.month4,
              res[0].HN.month5,
              res[0].HN.month6,
              res[0].HN.month7,
              res[0].HN.month8,
              res[0].HN.month9,
              res[0].HN.month10,
              res[0].HN.month11,
              res[0].HN.month12
            ],
            borderColor: 'white',
            borderWidth: 2
          }, {
            type: 'bar',
            label: 'HCM',
            backgroundColor: '#FFA726',
            data: [
              res[0].HCM.month1,
              res[0].HCM.month2,
              res[0].HCM.month3,
              res[0].HCM.month4,
              res[0].HCM.month5,
              res[0].HCM.month6,
              res[0].HCM.month7,
              res[0].HCM.month8,
              res[0].HCM.month9,
              res[0].HCM.month10,
              res[0].HCM.month11,
              res[0].HCM.month12
            ]
          }]
        };

        this.basicChartDataPi = {
          labels: this.listMonth,
          datasets: [{
            type: 'bar',
            label: 'HN',
            backgroundColor: '#66BB6A',
            data: [
              res[1].HN.month1,
              res[1].HN.month2,
              res[1].HN.month3,
              res[1].HN.month4,
              res[1].HN.month5,
              res[1].HN.month6,
              res[1].HN.month7,
              res[1].HN.month8,
              res[1].HN.month9,
              res[1].HN.month10,
              res[1].HN.month11,
              res[1].HN.month12
            ],
            borderColor: 'white',
            borderWidth: 2
          }, {
            type: 'bar',
            label: 'HCM',
            backgroundColor: '#FFA726',
            data: [
              res[1].HCM.month1,
              res[1].HCM.month2,
              res[1].HCM.month3,
              res[1].HCM.month4,
              res[1].HCM.month5,
              res[1].HCM.month6,
              res[1].HCM.month7,
              res[1].HCM.month8,
              res[1].HCM.month9,
              res[1].HCM.month10,
              res[1].HCM.month11,
              res[1].HCM.month12
            ]
          }]
        };

        this.basicChartDataUpdateCost = {
          labels: this.listMonth,
          datasets: [{
            type: 'bar',
            label: 'HN',
            backgroundColor: '#66BB6A',
            data: [
              res[2].HN.month1,
              res[2].HN.month2,
              res[2].HN.month3,
              res[2].HN.month4,
              res[2].HN.month5,
              res[2].HN.month6,
              res[2].HN.month7,
              res[2].HN.month8,
              res[2].HN.month9,
              res[2].HN.month10,
              res[2].HN.month11,
              res[2].HN.month12
            ],
            borderColor: 'white',
            borderWidth: 2
          }, {
            type: 'bar',
            label: 'HCM',
            backgroundColor: '#FFA726',
            data: [
              res[2].HCM.month1,
              res[2].HCM.month2,
              res[2].HCM.month3,
              res[2].HCM.month4,
              res[2].HCM.month5,
              res[2].HCM.month6,
              res[2].HCM.month7,
              res[2].HCM.month8,
              res[2].HCM.month9,
              res[2].HCM.month10,
              res[2].HCM.month11,
              res[2].HCM.month12
            ]
          }]
        };
        this.cdr.detectChanges();
      }
    });

    this.subscriptions.push(initSub);
  }

  private configToolbar(): void {
    this.toolbarModel = new ToolbarModel();
    this.toolbarModel.option.show = false;
    this.toolbarModel.add.show = false;
    this.toolbarModel.search.show = false;
  }

  public onChangeSupplier(): void {
    if (this.request.supplierDto) {
      this.request.vendorId = this.request.supplierDto.vendorId;
    } else {
      this.request.vendorId = null;
    }
  }

  public exportPO(): void {
    this.epoPoHeaderInService.export(this.request).subscribe(m => {
      this.notificationService.showSuccess();
    });
  }

  public exportPI(): void {
    this.epoApHeader1InService.export(this.request).subscribe(m => {
      this.notificationService.showSuccess();
    });
  }

  public exportUpdateCost(): void {
    this.epoSearchTmpService.export(this.request).subscribe(m => {
      this.notificationService.showSuccess();
    });
  }

  public changeYear(data): void {
    this.selectedYear = data;
  }

  public onSearch(): void {
    this.initData();
  }

  public onResetFormSearch(): void {
    this.selectedYear = new Date().getFullYear();
  }
}
