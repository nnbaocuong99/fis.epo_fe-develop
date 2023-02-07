import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import * as config from '../license-conformity.config';
import { DialogRef } from '../../../../partials/content/crud/dialog/dialog-ref.model';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { NgForm } from '@angular/forms';
import { FormDynamicData } from '../../../../partials/content/crud/component/form-dynamic-data.model';
import { BaseComponent } from '../../../../../core/_base/component/base-component';
import { ActivatedRoute, Router } from '@angular/router';
import { ShipmentQualityService } from '../../../../../services/modules/shipment-quality/shipment-quality.service';
import * as mainConfig from '../../../../../core/_config/main.config';
import { forkJoin } from 'rxjs';
import { ShipmentQualityRequestPayload } from '../../../../../services/modules/shipment-quality/shipment-quality.request-payload';
import { FileDownload } from '../../../../partials/control/download-file/download-file.component';
import { FileService } from '../../../../../services/modules/file/file.service';
import { FileRequestPayload } from '../../../../../services/modules/file/file.request.payload';
@Component({
  selector: 'app-shipment-quality',
  templateUrl: './shipment-quality.component.html',
  styleUrls: ['./shipment-quality.component.scss']
})
export class ShipmentQualityComponent extends BaseComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;

  public formData: FormDynamicData = new FormDynamicData();
  public dialogRef: DialogRef = new DialogRef();
  public request = new ShipmentQualityRequestPayload();
  public isShowDialogRef = false;
  public formTitle: string;

  public requestSave: any;
  public dataSource = {
    items: [],
    paginatorTotal: undefined
  };
  public headers = config.HEADER_SHIPMENT_QUALITY;
  public statusRegisted = config.STATUS_REGISTERED;
  public mainConfig = mainConfig.MAIN_CONFIG;

  constructor(
    public cdr: ChangeDetectorRef,
    public notification: NotificationService,
    public shipmentQualityService: ShipmentQualityService,
    private activatedRoute: ActivatedRoute,
    private fileService: FileService,
    public router: Router

  ) {
    super();
    this.formData = {
      formId: 'energy-efficiency',
      icon: 'fal fa-money-check-alt',
      title: '',
      isCancel: true,
      service: this.shipmentQualityService,
      hideHeader: false
    };
  }

  ngOnInit() {
    this.onParamsChanged();
    const routeSub = this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.request.shipmentId = params.id;
        this.request.type = this.dialogRef.input.type;
        const categorySub = forkJoin([
          this.shipmentQualityService.select(this.request),
          this.shipmentQualityService.count(this.request)
        ]).subscribe((res) => {
          this.dataSource.items = res[0];
          this.dataSource.paginatorTotal = res[1];
          this.cdr.detectChanges();
        });
        this.subscriptions.push(categorySub);
      }
    });
    this.subscriptions.push(routeSub);
  }

  private onParamsChanged(): void {
    const routeSub = this.activatedRoute.data.subscribe((data) => {
      if (data.type === 1) {
        this.dialogRef.input.type = 1;
        this.formTitle = 'Hiệu suất năng lượng';
      } else if (data.type === 2) {
        this.dialogRef.input.type = 2;
        this.formTitle = 'Kiểm tra chất lượng';
      } else {
        this.dialogRef.input.type = 3;
        this.formTitle = 'Hợp Quy';
      }
    });
    this.subscriptions.push(routeSub);
  }

  public onBtnCancelClick(): void {
    this.router.navigate([`../../../`], { relativeTo: this.activatedRoute,
      queryParams: {
        type: this.dialogRef.input.type
      }
    });
  }

  public onBtnRegisteredClick(): void {
    this.isShowDialogRef = false;
    this.cdr.detectChanges();
    this.isShowDialogRef = true;
    this.dialogRef.input.isDisabled = false;
    this.dialogRef.input.rowData = {};
    this.dialogRef.input.rowData.shipmentId = this.request.shipmentId;
    this.dialogRef.show();
    this.cdr.detectChanges();
  }

  public onBtnCompleteClick(rowData: any): void {
    this.isShowDialogRef = false;
    this.cdr.detectChanges();
    this.isShowDialogRef = true;
    this.dialogRef.input.isDisabled = false;
    this.dialogRef.input.rowData = rowData;
    this.dialogRef.show();
    this.cdr.detectChanges();
  }

  public onBtnViewClick(rowData: any): void {
    this.isShowDialogRef = false;
    this.cdr.detectChanges();
    this.isShowDialogRef = true;
    this.dialogRef.input.isDisabled = true;
    this.dialogRef.input.rowData = rowData;
    this.dialogRef.show();
    this.cdr.detectChanges();
  }

  public onBtnDownloadClick(file: any): void {
    if (file.docnumber) {
      const fileDownload = new FileDownload();
      const request = new FileRequestPayload();
      request.module = file.attachment;
      this.fileService.select(request).subscribe(res => {
        if (res[0]) {
          fileDownload.id = res[0].id;
          fileDownload.name = file.docnumber;
          this.fileService.download(fileDownload);
        }
      });
    }
  }

  public loadItems(data: any): any {
    this.ngOnInit();
    // this.requestSave = data;
  }

}
