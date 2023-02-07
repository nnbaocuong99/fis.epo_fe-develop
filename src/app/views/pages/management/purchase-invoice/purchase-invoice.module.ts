import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseInvoiceComponent } from './purchase-invoice.component';
import { AuthGuard } from '../../../../core/auth';
import { PortletModule } from '../../../partials/content/general/portlet/portlet.module';
import { TranslateModule } from '@ngx-translate/core';
import {
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectAsyncModule } from '../../../partials/control/ng-select-async/ng-select-async.component';
import { PurchaseInvoiceEditComponent } from './purchase-invoice-edit/purchase-invoice-edit.component';
import { UploadFileModule } from '../../../partials/control/upload-file/upload-file.component';
import { TableModule } from 'primeng/table';
import { PurchaseInvoiceViewComponent } from './purchase-invoice-view/purchase-invoice-view.component';
import { DialogModule } from 'primeng/dialog';
import {
    PurchaseInvoiceEditCopyPoComponent
} from './purchase-invoice-edit/purchase-invoice-edit-copy-po/purchase-invoice-edit-copy-po.component';
import {
    PurchaseInvoiceEditCopyInvComponent
} from './purchase-invoice-edit/purchase-invoice-edit-copy-inv/purchase-invoice-edit-copy-inv.component';
import { TreeTableModule } from 'primeng/treetable';
import { PurchaseInvoicePaymentComponent } from './purchase-invoice-edit/purchase-invoice-payment/purchase-invoice-payment.component';
import {
    PurchaseInvoicePaymentDialogComponent
} from './purchase-invoice-edit/purchase-invoice-payment/purchase-invoice-payment-dialog/purchase-invoice-payment-dialog.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CoreModule } from '../../../../core/core.module';
import { FieldsetModule } from 'primeng/fieldset';
import { ContractorTaxCalculationComponent } from './purchase-invoice-edit/contractor-tax-calculation/contractor-tax-calculation.component';

import { ButtonModule } from 'primeng/button';
import { PurchaseInvoiceItemComponent } from './purchase-invoice-edit/purchase-invoice-item/purchase-invoice-item.component';
import { ContextMenuModule } from 'primeng/contextmenu';
import { InputTextModule } from 'primeng/inputtext';
import { PartialsModule } from '../../../partials/partials.module';
import { InputNumberModule } from 'primeng/inputnumber';
import { AttachDocumentModule } from '../../../partials/control/attach-document/attach-document.module';
import {
    PurchaseInvoiceItemAddDialogComponent
} from './purchase-invoice-edit/purchase-invoice-item/purchase-invoice-item-add-dialog/purchase-invoice-item-add-dialog.component';
import { ConfigListModule } from '../../../partials/control/config-list/config-list-control.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { DialogSyncErpApComponent } from './purchase-invoice-edit/dialog-sync-erp-ap/dialog-sync-erp-ap.component';
import { InputDateModule } from '../../../partials/control/input-date/input-date.module';
import { DialogRequestUpdateOrgComponent } from './dialog-request-update-org/dialog-request-update-org.component';
import { RatingModule } from 'primeng/rating';
import { DialogRequestImportComponent } from './purchase-invoice-edit/dialog-request-import/dialog-request-import.component';
import { SettingModule } from '../../setting/setting.module';
import { PurchaseInvoicePaymentTrackingComponent } from './purchase-invoice-payment-tracking/purchase-invoice-payment-tracking.component';
import { PaymentOrderComponent } from './payment-order/payment-order.component';
import { PaymentOrderAddComponent } from './payment-order/payment-order-add/payment-order-add.component';
import { PaymentOrderItemComponent } from './payment-order/payment-order-add/payment-order-item/payment-order-item.component';
import { PaymentOrderPrepayComponent } from './payment-order/payment-order-add/payment-order-prepay/payment-order-prepay.component';
import {
    PurchaseInvoiceEditCopyForCreditNoteComponent
} from './purchase-invoice-edit/purchase-invoice-edit-copy-for-credit-note/purchase-invoice-edit-copy-for-credit-note.component';
import { PaymentOrderViewComponent } from './payment-order/payment-order-view/payment-order-view.component';
import { PaymentOrderPurchaseInvoiceComponent } from './payment-order/payment-order-add/payment-order-purchase-invoice/payment-order-purchase-invoice.component';

const routes: Routes = [
    { path: 'list', component: PurchaseInvoiceComponent, canActivate: [AuthGuard] },
    { path: 'list/add', component: PurchaseInvoiceEditComponent, canActivate: [AuthGuard] },
    { path: 'list/add/:id', component: PurchaseInvoiceEditComponent, canActivate: [AuthGuard] },
    { path: 'list/edit/:id', component: PurchaseInvoiceEditComponent, canActivate: [AuthGuard] },
    { path: 'list/view/:id', component: PurchaseInvoiceViewComponent, canActivate: [AuthGuard] },
    { path: 'list/payment-tracking/:id', component: PurchaseInvoicePaymentTrackingComponent, canActivate: [AuthGuard] },
    { path: 'payment-order/list/:id', component: PaymentOrderComponent, canActivate: [AuthGuard] },
    { path: 'payment-order/add', component: PaymentOrderAddComponent, canActivate: [AuthGuard] },
    { path: 'payment-order/edit/:id', component: PaymentOrderAddComponent, canActivate: [AuthGuard] },
    { path: 'payment-order/view/:id', component: PaymentOrderViewComponent, canActivate: [AuthGuard] }
];

const listConfigModule = ['COST_TYPE', 'COUNTRY', 'TRANSPORTATION_MODE', 'ITEM', 'TAX'];

@NgModule({
    declarations: [
        PurchaseInvoiceComponent,
        PurchaseInvoiceEditComponent,
        PurchaseInvoiceViewComponent,
        PurchaseInvoiceEditCopyPoComponent,
        PurchaseInvoiceEditCopyInvComponent,
        PurchaseInvoicePaymentComponent,
        PurchaseInvoicePaymentDialogComponent,
        ContractorTaxCalculationComponent,
        PurchaseInvoiceItemComponent,
        PurchaseInvoiceItemAddDialogComponent,
        DialogSyncErpApComponent,
        DialogRequestUpdateOrgComponent,
        DialogRequestImportComponent,
        PurchaseInvoicePaymentTrackingComponent,
        PaymentOrderComponent,
        PaymentOrderAddComponent,
        PaymentOrderItemComponent,
        PaymentOrderPrepayComponent,
        PurchaseInvoiceEditCopyForCreditNoteComponent,
        PaymentOrderViewComponent,
        PaymentOrderPurchaseInvoiceComponent
    ],
    exports: [PurchaseInvoiceViewComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        PortletModule,
        TranslateModule,
        PartialsModule,
        MatCheckboxModule,
        NgbModule,
        NgSelectAsyncModule,
        UploadFileModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        TableModule,
        MatMenuModule,
        MatIconModule,
        MatInputModule,
        DialogModule,
        TreeTableModule,
        MatRadioModule,
        NgSelectModule,
        CoreModule,
        MatButtonModule,
        FieldsetModule,
        ButtonModule,
        ContextMenuModule,
        InputTextModule,
        InputNumberModule,
        AttachDocumentModule,
        ConfigListModule.forChild(listConfigModule),
        NgxCurrencyModule,
        InputDateModule,
        RatingModule,
        SettingModule
    ],
    providers: []
})

export class PurchaseInvoiceModule {
}
