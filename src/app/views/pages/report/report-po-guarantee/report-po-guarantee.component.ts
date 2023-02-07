import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { BrandService } from '../../../../services/modules/category/brand/brand.service';
import { SupplierService } from '../../../../services/modules/category/supplier/supplier.service';
import { PurchaseOrderRequestPayload } from '../../../../services/modules/purchase-order/purchase-order.request-payload';
import { PurchaseOrderService } from '../../../../services/modules/purchase-order/purchase-order.service';
import { ReportService } from '../../../../services/modules/report/report.service';
import { UserService } from '../../../../services/modules/user/user.service';
import { ToolbarModel } from '../../../partials/content/toolbar/toolbar.model';
import { ConfigListFactory } from '../../../partials/control/config-list/config-list-control.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-report-po-guarantee',
  templateUrl: './report-po-guarantee.component.html',
  styleUrls: ['./report-po-guarantee.component.scss']
})
export class ReportPoGuaranteeComponent implements OnInit {
  @ViewChild('formFilter', { static: true }) formFilter: NgForm;
  // public toolbarModel: ToolbarModel;
  public request: any = {};
  public purchaseOrderRequestPayload = new PurchaseOrderRequestPayload();
  public createdByNameDto: any;

  constructor(
    public notificationService: NotificationService,
    public reportService: ReportService,
    public router: Router,
    public route: ActivatedRoute,
    public brandService: BrandService,
    public purchaseOrderService: PurchaseOrderService,
    public userService: UserService,
    public supplierService: SupplierService,
  ) {
  }

  ngOnInit() {
    // this.configToolbar();
  }

  // private configToolbar(): void {
  //   this.toolbarModel = new ToolbarModel();
  //   this.toolbarModel.option.show = false;
  //   this.toolbarModel.add.show = false;
  //   this.toolbarModel.search.show = false;
  // }

  public goBack(): void {
    this.router.navigate([`purchase-plan`], { relativeTo: this.route.parent });
  }

  public exportPoIForGuarantee(): void {
    const exportFileName = 'BPImportNewPO_bao-hanh';
    this.reportService.exportPoItemsForGuarantee(this.request, exportFileName).subscribe(m => {
      this.notificationService.showSuccess();
    });
  }

  public onChangeSupplier(event: any): void {
    if (event) {
      this.request.vendorId = event.vendorId;
      this.request.supplierName = event.name;
    } else {
      this.request.vendorId = null;
      this.request.supplierName = null;
    }
  }

  public onChangeProductName(producerNameDto: any): void {
    if (producerNameDto) {
      this.request.producerId = producerNameDto.id;
      this.request.producerName = producerNameDto.acronymName;
    }
  }

}

