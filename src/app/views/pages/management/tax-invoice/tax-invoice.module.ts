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
import { TaxInvoiceComponent } from './tax-invoice.component';
import { TaxInvoiceEditComponent } from './tax-invoice-edit/tax-invoice-edit.component';
import { DownloadFileTemplateModule } from '../../../partials/control/download-file/download-file.component';
import { TaxInvoiceViewComponent } from './tax-invoice-view/tax-invoice-view.component';
import { TaxInvoiceMapCommercialComponent } from './tax-invoice-map-commercial/tax-invoice-map-commercial.component';

const routes: Routes = [
    { path: 'list', component: TaxInvoiceComponent, canActivate: [AuthGuard] },
    { path: 'list/add', component: TaxInvoiceEditComponent, canActivate: [AuthGuard] },
    { path: 'list/add/:id', component: TaxInvoiceEditComponent, canActivate: [AuthGuard] },
    { path: 'list/edit/:id', component: TaxInvoiceEditComponent, canActivate: [AuthGuard] },
];

@NgModule({
    declarations: [
        TaxInvoiceComponent,
        TaxInvoiceEditComponent,
        TaxInvoiceViewComponent,
        TaxInvoiceMapCommercialComponent
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
        DownloadFileTemplateModule
    ],
    providers: []
})

export class TaxInvoiceModule {
}
