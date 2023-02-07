import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../../../../core/_base/component/base-component';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { ShipmentExportService } from '../../../../../../services/modules/shipment-export/shipment-export.service';
import { ShipmentItemService } from '../../../../../../services/modules/shipment-item/shipment-item.service';

@Component({
  selector: 'app-shipment-export',
  templateUrl: './shipment-export.component.html',
  styleUrls: ['./shipment-export.component.scss']
})
export class ShipmentExportComponent extends BaseComponent implements OnInit {

  @Input() shipmentData: any;
  @Input() shipmentItem: any;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public cdr: ChangeDetectorRef,
    public notificationService: NotificationService,
    public shipmentExportService: ShipmentExportService,
    public shipmentItemService: ShipmentItemService
  ) {
    super();
  }

  ngOnInit() {
  }

  public checkLicensedExport(): void {
    const request: any = { shipmentId: this.shipmentData.id };
    this.shipmentItemService.exportAll(request).subscribe(() => {
      this.notificationService.showMessage('Export complete');
    });
  }

  public btnExportMenuOfGoods(): void {
    const request: any = { shipmentId: this.shipmentData.id };
    this.shipmentExportService.exportMenuOfGoods(request).subscribe(() => {
      this.notificationService.showMessage('Export complete');
    });
  }

  public btnExportCommercialList(): void {
    const request: any = { shipmentId: this.shipmentData.id };
    this.shipmentExportService.exportCommercialList(request).subscribe(() => {
      this.notificationService.showMessage('Export complete');
    });
  }

  public btnExportElectronicDeclarationAppendix(): void {
    const request: any = { shipmentId: this.shipmentData.id };
    this.shipmentExportService.exportElectronicDeclarationAppendix(request).subscribe(() => {
      this.notificationService.showMessage('Export complete');
    });
  }

  public btnExportQualityRegistrationDocuments(): void {
    const request: any = { shipmentId: this.shipmentData.id };
    this.shipmentExportService.exportQualityRegistrationDocuments(request).subscribe(() => {
      this.notificationService.showMessage('Export complete');
    });
  }

  public getListShipmentItemIdSelected(): any {
    const arrItemSave = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.shipmentItem.selectedShipmentItems.length; i++) {
      const item = this.shipmentItem.selectedShipmentItems[i];
      if (!arrItemSave.some(m => m === item.data.id)) {
        arrItemSave.push(item.data.id);
      }
      if (item.children && item.children.length > 0) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < item.children.length; j++) {
          const children = item.children[j];
          if (!arrItemSave.some(m => m === children.data.id)) {
            arrItemSave.push(children.data.id);
          }
        }
      }
    }
    return arrItemSave;
  }

  public exportRequestPayTaxAllSheet() {
    const listShipmentItemId = this.getListShipmentItemIdSelected();
    const request: any = { shipmentId: this.shipmentData.id, listShipmentItemId: listShipmentItemId };
    this.shipmentExportService.exportRequestPayTaxAllSheet(request).subscribe(m => {
      this.notificationService.showMessage('Export complete');
    });
  }

  // public exportRequestPayTax() {
  //   const listShipmentItemId = this.getListShipmentItemIdSelected();
  //   const request: any = { shipmentId: this.shipmentData.id, listShipmentItemId: listShipmentItemId };
  //   this.shipmentExportService.exportRequestPayTax(request).subscribe(m => {
  //     this.notificationService.showMessage('Export complete');
  //   });
  // }

  // public exportStatementPayTax() {
  //   const listShipmentItemId = this.getListShipmentItemIdSelected();
  //   const request: any = { shipmentId: this.shipmentData.id, listShipmentItemId: listShipmentItemId };
  //   this.shipmentExportService.exportStatementPayTax(request).subscribe(m => {
  //     this.notificationService.showMessage('Export complete');
  //   });
  // }

  // public exportRequestPaymentCustomsFees() {
  //   const listShipmentItemId = this.getListShipmentItemIdSelected();
  //   const request: any = { shipmentId: this.shipmentData.id, listShipmentItemId: listShipmentItemId };
  //   this.shipmentExportService.exportRequestPaymentCustomsFees(request).subscribe(m => {
  //     this.notificationService.showMessage('Export complete');
  //   });
  // }

  // public exportPayMoneyIntoStateBudget() {
  //   const listShipmentItemId = this.getListShipmentItemIdSelected();
  //   const request: any = { shipmentId: this.shipmentData.id, listShipmentItemId: listShipmentItemId };
  //   this.shipmentExportService.exportPayMoneyIntoStateBudget(request).subscribe(m => {
  //     this.notificationService.showMessage('Export complete');
  //   });
  // }

  public exportRegisterCheckQualityOfGoods() {
    const listShipmentItemId = this.getListShipmentItemIdSelected();
    const request: any = { shipmentId: this.shipmentData.id, listShipmentItemId: listShipmentItemId };
    this.shipmentExportService.exportRegisterCheckQualityOfGoods(request).subscribe(m => {
      this.notificationService.showMessage('Export complete');
    });
  }

  public exportQualitySelfAssessmentReport() {
    const listShipmentItemId = this.getListShipmentItemIdSelected();
    const request: any = { shipmentId: this.shipmentData.id, listShipmentItemId: listShipmentItemId };
    this.shipmentExportService.exportQualitySelfAssessmentReport(request).subscribe(m => {
      this.notificationService.showMessage('Export complete');
    });
  }

}
