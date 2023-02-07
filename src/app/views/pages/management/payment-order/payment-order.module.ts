import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../../core/auth';
import { PortletModule } from '../../../partials/content/general/portlet/portlet.module';
import { TranslateModule } from '@ngx-translate/core';
import {
    MatButtonModule,
    MatCheckboxModule,
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
import { UploadFileModule } from '../../../partials/control/upload-file/upload-file.component';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TreeTableModule } from 'primeng/treetable';
import { NgSelectModule } from '@ng-select/ng-select';
import { CoreModule } from '../../../../core/core.module';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { ContextMenuModule } from 'primeng/contextmenu';
import { InputTextModule } from 'primeng/inputtext';
import { PartialsModule } from '../../../partials/partials.module';
import { InputNumberModule } from 'primeng/inputnumber';
import { AttachDocumentModule } from '../../../partials/control/attach-document/attach-document.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { InputDateModule } from '../../../partials/control/input-date/input-date.module';
import { DownloadFileTemplateModule } from '../../../partials/control/download-file/download-file.component';
import { PaymentOrderComponent } from './payment-order.component';
import { PaymentOrderViewComponent } from './payment-order-view/payment-order-view.component';
import { PaymentOrderAddComponent } from './payment-order-add/payment-order-add.component';
import { PaymentOrderItemComponent } from './payment-order-add/payment-order-item/payment-order-item.component';
import { PaymentOrderPrepayComponent } from './payment-order-add/payment-order-prepay/payment-order-prepay.component';
import {
    PaymentOrderPurchaseInvoiceComponent
} from './payment-order-add/payment-order-purchase-invoice/payment-order-purchase-invoice.component';
import { ConfigListModule } from '../../../partials/control/config-list/config-list-control.module';


const routes: Routes = [
    { path: 'list', component: PaymentOrderComponent, canActivate: [AuthGuard] },
    { path: 'list/add', component: PaymentOrderAddComponent, canActivate: [AuthGuard] },
    { path: 'list/add/:id', component: PaymentOrderAddComponent, canActivate: [AuthGuard] },
    { path: 'list/edit/:id', component: PaymentOrderAddComponent, canActivate: [AuthGuard] },
    { path: 'list/view/:id', component: PaymentOrderViewComponent, canActivate: [AuthGuard] },
];

const listConfigModule: string[] = ['COST_TYPE'];

@NgModule({
    declarations: [
        PaymentOrderComponent,
        PaymentOrderViewComponent,
        PaymentOrderAddComponent,
        PaymentOrderItemComponent,
        PaymentOrderPrepayComponent,
        PaymentOrderPurchaseInvoiceComponent,
    ],
    exports: [],
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
        NgxCurrencyModule,
        InputDateModule,
        DownloadFileTemplateModule,
        ConfigListModule.forChild(listConfigModule),
    ],
    providers: []
})

export class PaymentOrderModule {
}
