import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule, MatProgressSpinnerModule, MatRadioModule, MatSelectModule
} from '@angular/material';
import { CoreModule } from '../../../../core/core.module';
import { PartialsModule } from '../../../partials/partials.module';
import { NgbModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from '../../../../core/auth';
import { PurchaseOrderComponent } from './purchase-order.component';
import { PurchaseOrderAddComponent } from './purchase-order-add/purchase-order-add.component';
import { RatingModule } from 'primeng/rating';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { NgSelectAsyncModule } from '../../../partials/control/ng-select-async/ng-select-async.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { UploadFileModule } from '../../../partials/control/upload-file/upload-file.component';
import { TreeTableModule } from 'primeng/treetable';
import { TableModule } from 'primeng/table';
import {
    PurchaseOrderItemEditComponent
} from './purchase-order-add/purchase-order-item/purchase-order-item-edit/purchase-order-item-edit.component';
import { PurchaseOrderViewComponent } from './purchase-order-view/purchase-order-view.component';
import { PurchaseOrderItemComponent } from './purchase-order-add/purchase-order-item/purchase-order-item.component';
import { PurchaseRequestAreaTypeComponent } from './purchase-order-add/purchase-request-area-type/purchase-request-area-type.component';
import { FieldsetModule } from 'primeng/fieldset';
import {
    PurchaseOrderItemMatchComponent
} from './purchase-order-add/purchase-order-item/purchase-order-item-match/purchase-order-item-match.component';
import { AppendixAddComponent } from './appendix-add/appendix-add.component';
import { AppendixDialogComponent } from './appendix-add/appendix-dialog/appendix-dialog.component';
import { PurchaseOrderEditComponent } from './purchase-order-edit/purchase-order-edit.component';
import { DatePastValidatorDirective } from '../../../../core/validator/date-past.validator';
import { CodeExistsValidatorDirective } from './validator/code-exists.validator';
import { ResponseDateValueValidatorDirective } from './validator/response-date-value.validator';
import {
    PurchaseOrderItemViewMatchComponent
} from './purchase-order-add/purchase-order-item/purchase-order-item-view-match/purchase-order-item-view-match.component';
import { IndexNoPurchaseOrderItemValidatorDirective } from './validator/index-no-purchase-order-item.validator';
import { AttachDocumentModule } from '../../../partials/control/attach-document/attach-document.module';
import { OrderProcessingStatusComponent } from './purchase-order-edit/order-processing-status/order-processing-status.component';
import { PurchaseOrderPaymentComponent } from './purchase-order-edit/purchase-order-payment/purchase-order-payment.component';
import {
    PurchaseOrderPaymentDialogComponent
} from './purchase-order-edit/purchase-order-payment/purchase-order-payment-dialog/purchase-order-payment-dialog.component';
import { DownloadFileTemplateModule } from '../../../partials/control/download-file/download-file.component';
import { CheckInvalidOrgApplyValidatorDirective } from './validator/check-invalid-orgApply.validator';
import { ConfigListModule } from '../../../partials/control/config-list/config-list-control.module';
import { CalendarModule } from 'primeng/calendar';
import { NgxCurrencyModule } from 'ngx-currency';
import { InputDateModule } from '../../../partials/control/input-date/input-date.module';
import { ContextMenuModule } from 'primeng/contextmenu';
import {
    ConfirmChangeResponseDateComponent
} from './purchase-order-add/purchase-order-item/confirm-change-response-date/confirm-change-response-date.component';
import { ViewHistoryChangeComponent } from './purchase-order-add/purchase-order-item/view-history-change/view-history-change.component';
import { QuantityValidatorDirective } from './validator/quantity.validator';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { PurchaseOrderHistoryComponent } from './purchase-order-history/purchase-order-history.component';
import {
    PurchaseOrderViewDetailsComponent
} from './purchase-order-history/purchase-order-view-details/purchase-order-view-details.component';
import {
    PurchaseOrderItemHistoryComponent
} from './purchase-order-history/purchase-order-item-history/purchase-order-item-history.component';
import { SettingModule } from '../../setting/setting.module';
import {
    PurchaseOrderItemMapComponent
} from './purchase-order-add/purchase-order-item/purchase-order-item-map/purchase-order-item-map.component';
import { PurchaseOrderPaymentTrackingComponent } from './purchase-order-payment-tracking/purchase-order-payment-tracking.component';

const routes: Routes = [
    { path: 'list', component: PurchaseOrderComponent, canActivate: [AuthGuard] },
    { path: 'list/add', component: PurchaseOrderAddComponent, canActivate: [AuthGuard] },
    { path: 'list/add/:id', component: PurchaseOrderAddComponent, canActivate: [AuthGuard] },
    { path: 'list/edit/:id', component: PurchaseOrderEditComponent, canActivate: [AuthGuard] },
    { path: 'list/view/:id', component: PurchaseOrderViewComponent, canActivate: [AuthGuard] },
    { path: 'list/payment-tracking/:id', component: PurchaseOrderPaymentTrackingComponent, canActivate: [AuthGuard] }
];

const listConfigModule = ['COUNTRY', 'ITEM', 'BUSINESS_TERM', 'TRANSPORTATION_MODE', 'BILL_FROM', 'BILL_TO'];

@NgModule({
    declarations: [
        PurchaseOrderComponent,
        PurchaseOrderAddComponent,
        PurchaseRequestAreaTypeComponent,
        PurchaseOrderItemComponent,
        PurchaseOrderItemEditComponent,
        PurchaseOrderViewComponent,
        PurchaseOrderItemMatchComponent,
        AppendixAddComponent,
        AppendixDialogComponent,
        PurchaseOrderEditComponent,
        DatePastValidatorDirective,
        CodeExistsValidatorDirective,
        ResponseDateValueValidatorDirective,
        PurchaseOrderPaymentComponent,
        PurchaseOrderPaymentDialogComponent,
        OrderProcessingStatusComponent,
        PurchaseOrderItemViewMatchComponent,
        IndexNoPurchaseOrderItemValidatorDirective,
        CheckInvalidOrgApplyValidatorDirective,
        ConfirmChangeResponseDateComponent,
        ViewHistoryChangeComponent,
        QuantityValidatorDirective,
        PurchaseOrderHistoryComponent,
        PurchaseOrderViewDetailsComponent,
        PurchaseOrderItemHistoryComponent,
        PurchaseOrderItemMapComponent,
        PurchaseOrderPaymentTrackingComponent
    ],
    exports: [PurchaseOrderViewComponent],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        CoreModule,
        PartialsModule,
        TranslateModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        NgbTabsetModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatButtonModule,
        RatingModule,
        NgSelectModule,
        ConfirmDialogModule,
        DialogModule,
        NgSelectAsyncModule,
        InputSwitchModule,
        UploadFileModule,
        TreeTableModule,
        MatMenuModule,
        TableModule,
        MatCheckboxModule,
        MatRadioModule,
        FieldsetModule,
        NgbModule,
        AttachDocumentModule,
        DownloadFileTemplateModule,
        ConfigListModule.forChild(listConfigModule),
        CalendarModule,
        NgxCurrencyModule,
        InputDateModule,
        ContextMenuModule,
        InputTextModule,
        InputNumberModule,
        SettingModule
    ],
    providers: []
})

export class PurchaseOrderModule {
}
