import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseListComponent } from '../../../../../core/_base/component';
import { SupplierRequestPayload } from '../../../../../services/modules/category/supplier/supplier.request.payload';
import { SupplierService } from '../../../../../services/modules/category/supplier/supplier.service';
import { LicenseConformityRequestPayload } from '../../../../../services/modules/license-conformity/license-conformity.request-payload';
import { LicenseConformityService } from '../../../../../services/modules/license-conformity/license-conformity.service';
import { ToolbarModel } from '../../../../partials/content/toolbar/toolbar.model';
import * as config from '../license-conformity.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { ShipmentService } from '../../../../../services/modules/shipment/shipment.service';
import { ShipmentRequestPayload } from '../../../../../services/modules/shipment/shipment.request-payload';
import { PurchaseRequestService } from '../../../../../services/modules/purchase-request/purchase-request.service';
import { PurchaseOrderService } from '../../../../../services/modules/purchase-order/purchase-order.service';
import { PurchaseOrderRequestPayload } from '../../../../../services/modules/purchase-order/purchase-order.request-payload';
import { CertificateQualityComponent } from '../certificate-quality/certificate-quality.component';
import { EnergyEfficiencyComponent } from '../energy-efficiency/energy-efficiency.component';
import { ConformityComponent } from '../conformity/conformity.component';

@Component({
  selector: 'app-license-conformity-list',
  templateUrl: './license-conformity-list.component.html',
  styleUrls: ['./license-conformity-list.component.scss']
})
export class LicenseConformityListComponent extends BaseListComponent implements OnInit {

  public toolbarModel: ToolbarModel;
  public supplierRequestPayload = new SupplierRequestPayload();
  public shipmentRequestPayload = new ShipmentRequestPayload();
  public purchaseOrderRequestPayload = new PurchaseOrderRequestPayload();

  public headerShipment = config.HEADER_SHIPMENT;
  public headerSuppliers = config.HEADER_SUPPLIER;
  public executionStatus = config.EXECUTION_STATUS;
  public poStatus = config.PO_STATUS;
  public cols = config.HEADER;
  public tabs = config.TABS;
  public currentTab: number;
  public activeIdTab: number;
  public request: any = {};
  public mainConfig: any;

  constructor(
    public licenseConformityService: LicenseConformityService,
    public supplierService: SupplierService,
    public activatedRoute: ActivatedRoute,
    public shipmentService: ShipmentService,
    public purchaseRequestService: PurchaseRequestService,
    public purchaseOrderService: PurchaseOrderService,
    public router: Router
  ) {
    super();
  }

  ngOnInit() {
    this.baseService = this.licenseConformityService;
    this.request = new LicenseConformityRequestPayload();
    this.mainConfig = mainConfig.MAIN_CONFIG;
    this.configToolbar();
    this.onFragmentChanged();
    super.ngOnInit();
  }

  public onSearch(): void {
    super.ngOnInit();
  }

  public onBtnResetSearchClick(): void {
    this.request = new LicenseConformityRequestPayload();
    super.ngOnInit();
  }

  public setFragmentToRoute(event: any): void {
    if (event.nextId === 0) {
      this.router.navigate([]);
    } else {
      this.router.navigate([], {
        queryParams: {
          type: event.nextId
        }
      });
    }
    this.currentTab = event.nextId;
  }

  private onFragmentChanged(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (!params.type) {
        this.activeIdTab = 0;
        this.currentTab = 0;
      } else {
        this.activeIdTab = +params.type;
        this.currentTab = +params.type;
      }
    });
  }

  private configToolbar(): void {
    this.toolbarModel = new ToolbarModel();
    this.toolbarModel.option.disabled = true;
    this.toolbarModel.add.disabled = true;
  }

  public onChangeSmSupplier(event: any): void {
    if (event) {
      this.request.SmSupplier = event.code;
      this.request.SmSupplierName = event.name;
    }
  }

}
