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
import { AuthGuard } from '../../../../core/auth';
import { CoreModule } from '../../../../core/core.module';
import { PortletModule } from '../../../partials/content/general/portlet/portlet.module';
import { NgSelectAsyncModule } from '../../../partials/control/ng-select-async/ng-select-async.component';
import { PartialsModule } from '../../../partials/partials.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ImportGoodsListComponent } from './import-goods-list/import-goods-list.component';
import { ImportSyncStatusComponent } from './import-sync-status/import-sync-status.component';
import { ImportGoodsShipmentComponent } from './import-goods-shipment/import-goods-shipment.component';
import { ImportGoodsInvoiceComponent } from './import-goods-invoice/import-goods-invoice.component';
import { DialogImportSyncErpComponent } from './dialog-import-sync-erp/dialog-import-sync-erp.component';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputDateModule } from '../../../partials/control/input-date/input-date.module';
import {
    ImportGoodsEliminationInvoiceComponent
} from './import-goods-elimination-invoice/import-goods-elimination-invoice.component';
import {
    ImportGoodsEliminationShipmentComponent
} from './import-goods-elimination-shipment/import-goods-elimination-shipment.component';
import {
    ImportGoodsEliminationShipmentAddComponent
} from './import-goods-elimination-shipment/import-goods-elimination-shipment-add/import-goods-elimination-shipment-add.component';
import {
    ImportGoodsEliminationShipmentEditComponent
} from './import-goods-elimination-shipment/import-goods-elimination-shipment-edit/import-goods-elimination-shipment-edit.component';
import {
    ImportGoodsEliminationInvoiceAddComponent
} from './import-goods-elimination-invoice/import-goods-elimination-invoice-add/import-goods-elimination-invoice-add.component';
import {
    ImportGoodsEliminationInvoiceEditComponent
} from './import-goods-elimination-invoice/import-goods-elimination-invoice-edit/import-goods-elimination-invoice-edit.component';
import { TreeTableModule } from 'primeng/treetable';
import { SettingModule } from '../../setting/setting.module';

const routes: Routes = [
    { path: 'invoice', component: ImportGoodsListComponent, canActivate: [AuthGuard], data: { type: 'invoice' } },
    { path: 'shipment', component: ImportGoodsListComponent, canActivate: [AuthGuard], data: { type: 'shipment' } },
    { path: 'invoice/:id', component: ImportGoodsInvoiceComponent, canActivate: [AuthGuard], data: { type: 'invoice' } },
    { path: 'shipment/:id', component: ImportGoodsShipmentComponent, canActivate: [AuthGuard], data: { type: 'shipment' } },
    { path: 'sync-allocation-status', component: ImportSyncStatusComponent, canActivate: [AuthGuard] }
];

@NgModule({
    declarations: [
        ImportGoodsListComponent,
        ImportSyncStatusComponent,
        ImportGoodsShipmentComponent,
        ImportGoodsInvoiceComponent,
        DialogImportSyncErpComponent,
        ImportGoodsEliminationInvoiceComponent,
        ImportGoodsEliminationShipmentComponent,
        ImportGoodsEliminationShipmentAddComponent,
        ImportGoodsEliminationShipmentEditComponent,
        ImportGoodsEliminationInvoiceAddComponent,
        ImportGoodsEliminationInvoiceEditComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        CoreModule,
        FormsModule,
        PortletModule,
        TranslateModule,
        PartialsModule,
        TableModule,
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
        TreeTableModule,
        SettingModule
    ],
    providers: []
})

export class ImportGoodsModule {
}
