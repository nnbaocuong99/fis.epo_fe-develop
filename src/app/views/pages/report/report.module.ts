import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule, MatIconModule, MatInputModule,
  MatMenuModule, MatPaginatorModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSlideToggleModule
} from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { AuthGuard } from '../../../core/auth';
import { CoreModule } from '../../../core/core.module';
import { PortletModule } from '../../partials/content/general/portlet/portlet.module';
import { NgSelectAsyncModule } from '../../partials/control/ng-select-async/ng-select-async.component';
import { PartialsModule } from '../../partials/partials.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputDateModule } from '../../partials/control/input-date/input-date.module';
import { TreeTableModule } from 'primeng/treetable';
import { ChartModule } from 'primeng/chart';
import { ReportSyncErpComponent } from './report-sync-erp/report-sync-erp.component';
import { ReportPoreportCargoTrackingComponent } from './report-po-cargo-tracking/report-po-cargo-tracking.component';
import { ReportPoRebateComponent } from './report-po-rebate/report-po-rebate.component';
import { ReportContractorTaxComponent } from './report-contractor-tax/report-contractor-tax.component';
import { ReportPoGuaranteeComponent } from './report-po-guarantee/report-po-guarantee.component';
import { ReportBrandHierarchyComponent } from './report-brand-hierarchy/report-brand-hierarchy.component';
import { ReportBrandVendorsPolicyComponent } from './report-brand-vendors-policy/report-brand-vendors-policy.component';
import { ReportPoManComponent } from './report-po-man/report-po-man.component';
import {
  ReportInvoiceImportGoodsTrackingComponent
} from './report-invoice-import-goods-tracking/report-invoice-import-goods-tracking.component';
import { ReportExpectedGoodsToArriveComponent } from './report-expected-goods-to-arrive/report-expected-goods-to-arrive.component';
import { ReportPaymentPlanComponent } from './report-payment-plan/report-payment-plan.component';
import { ReportShipmentStatusComponent } from './report-shipment-status/report-shipment-status.component';
import { ReportForeignPurchaseOrderComponent } from './report-foreign-purchase-order/report-foreign-purchase-order.component';
import {
  ReportPurchaseOrderValueBySupplierComponent
} from './report-purchase-order-value-by-supplier/report-purchase-order-value-by-supplier.component';
import { ReportPaymentTrackingComponent } from './report-payment-tracking/report-payment-tracking.component';
import { ReportOrderClassifyBySupplierComponent } from './report-order-classify-by-supplier/report-order-classify-by-supplier.component';
import {
  ReportOrderFulfillmentTimeBySupplierComponent
} from './report-order-fulfillment-time-by-supplier/report-order-fulfillment-time-by-supplier.component';
import { ReportAp04021Component } from './report-ap04021/report-ap04021.component';
import { ReportImportListComponent } from './report-import-list/report-import-list.component';
import { ReportSpendingPlanComponent } from './report-spending-plan/report-spending-plan.component';
import { ReportGl04021Component } from './report-gl04021/report-gl04021.component';
import { ReportAp0307Component } from './report-ap0307/report-ap0307.component';
import { ReportAp0208Component } from './report-ap0208/report-ap0208.component';
import { ReportInvoiceBpComponent } from './report-invoice-bp/report-invoice-bp.component';
import { ReportPurchaseRequestTrackingComponent } from './report-purchase-request-tracking/report-purchase-request-tracking.component';

const routes: Routes = [
  { path: 'bp/cargo-tracking', component: ReportPoreportCargoTrackingComponent, canActivate: [AuthGuard] },
  { path: 'bp/rebate', component: ReportPoRebateComponent, canActivate: [AuthGuard] },
  { path: 'bp/guarantee', component: ReportPoGuaranteeComponent, canActivate: [AuthGuard] },
  { path: 'bp/brand-hierarchy', component: ReportBrandHierarchyComponent, canActivate: [AuthGuard] },
  { path: 'bp/brand-vendors-policy', component: ReportBrandVendorsPolicyComponent, canActivate: [AuthGuard] },
  { path: 'bp/po-man', component: ReportPoManComponent, canActivate: [AuthGuard] },
  { path: 'bp/purchase-request-tracking', component: ReportPurchaseRequestTrackingComponent, canActivate: [AuthGuard] },
  { path: 'bp/invoice-bp', component: ReportInvoiceBpComponent, canActivate: [AuthGuard] },
  { path: 'xnk/expected-goods-to-arrive', component: ReportExpectedGoodsToArriveComponent, canActivate: [AuthGuard] },
  { path: 'xnk/payment-plan', component: ReportPaymentPlanComponent, canActivate: [AuthGuard] },
  { path: 'xnk/shipment-status', component: ReportShipmentStatusComponent, canActivate: [AuthGuard] },
  { path: 'xnk/foreign-purchase-order', component: ReportForeignPurchaseOrderComponent, canActivate: [AuthGuard] },
  { path: 'xnk/purchase-order-value-by-supplier', component: ReportPurchaseOrderValueBySupplierComponent, canActivate: [AuthGuard] },
  { path: 'xnk/payment-tracking', component: ReportPaymentTrackingComponent, canActivate: [AuthGuard] },
  { path: 'xnk/order-classify-by-supplier', component: ReportOrderClassifyBySupplierComponent, canActivate: [AuthGuard] },
  { path: 'xnk/order-fulfillment-time-by-supplier', component: ReportOrderFulfillmentTimeBySupplierComponent, canActivate: [AuthGuard] },
  { path: 'af/purchase-sync-erp', component: ReportSyncErpComponent, canActivate: [AuthGuard] },
  { path: 'af/contractor-tax', component: ReportContractorTaxComponent, canActivate: [AuthGuard] },
  { path: 'af/invoice-import-goods-tracking', component: ReportInvoiceImportGoodsTrackingComponent, canActivate: [AuthGuard] },
  { path: 'af/ap0307', component: ReportAp0307Component, canActivate: [AuthGuard] },
  { path: 'af/ap0208', component: ReportAp0208Component, canActivate: [AuthGuard] },
  { path: 'af/ap04021', component: ReportAp04021Component, canActivate: [AuthGuard] },
  { path: 'af/gl04021', component: ReportGl04021Component, canActivate: [AuthGuard] },
  { path: 'af/spending-plan', component: ReportSpendingPlanComponent, canActivate: [AuthGuard] },
  { path: 'af/import-list', component: ReportImportListComponent, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [
    ReportSyncErpComponent,
    ReportPoreportCargoTrackingComponent,
    ReportPoRebateComponent,
    ReportContractorTaxComponent,
    ReportPoGuaranteeComponent,
    ReportBrandHierarchyComponent,
    ReportBrandVendorsPolicyComponent,
    ReportPoManComponent,
    ReportInvoiceImportGoodsTrackingComponent,
    ReportExpectedGoodsToArriveComponent,
    ReportPaymentPlanComponent,
    ReportShipmentStatusComponent,
    ReportForeignPurchaseOrderComponent,
    ReportPurchaseOrderValueBySupplierComponent,
    ReportPaymentTrackingComponent,
    ReportOrderClassifyBySupplierComponent,
    ReportOrderFulfillmentTimeBySupplierComponent,
    ReportAp04021Component,
    ReportGl04021Component,
    ReportSpendingPlanComponent,
    ReportImportListComponent,
    ReportAp0307Component,
    ReportAp0208Component,
    ReportInvoiceBpComponent,
    ReportPurchaseRequestTrackingComponent
  ],
  exports: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreModule,
    FormsModule,
    PortletModule,
    TranslateModule,
    PartialsModule,
    TableModule,
    TreeTableModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    NgbTabsetModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    NgbModule,
    NgSelectAsyncModule,
    NgSelectModule,
    DialogModule,
    PartialsModule,
    InputTextModule,
    InputDateModule,
    ChartModule
  ],
  providers: []
})
export class ReportModule { }
