import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShipmentComponent } from './shipment.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../../core/auth';
import { CoreModule } from '../../../../core/core.module';
import { PartialsModule } from '../../../partials/partials.module';
import { TranslateModule } from '@ngx-translate/core';
import {
  MatButtonModule, MatCheckboxModule, MatIconModule,
  MatInputModule, MatMenuModule, MatPaginatorModule, MatProgressSpinnerModule, MatRadioModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { PortletModule } from '../../../partials/content/general/portlet/portlet.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ShipmentViewComponent } from './shipment-view/shipment-view.component';
import { ShipmentEditComponent } from './shipment-edit/shipment-edit.component';
import { UploadFileModule } from '../../../partials/control/upload-file/upload-file.component';
import { ShipmentPurchaseOrderComponent } from './shipment-edit/shipment-purchase-order/shipment-purchase-order.component';
import { ShipmentPurchaseInvoiceComponent } from './shipment-edit/shipment-purchase-invoice/shipment-purchase-invoice.component';
import { FieldsetModule } from 'primeng/fieldset';
import { TreeTableModule } from 'primeng/treetable';
import { PackageListInfoComponent } from './shipment-edit/package-list-info/package-list-info.component';
import { ButtonModule } from 'primeng/button';
import { ContextMenuModule } from 'primeng/contextmenu';
import { InputTextModule } from 'primeng/inputtext';
import { ShipmentAddFromPoComponent } from './shipment-edit/shipment-add-from-po/shipment-add-from-po.component';
import { ShipmentItemComponent } from './shipment-edit/shipment-item/shipment-item.component';
import { NgSelectAsyncModule } from '../../../partials/control/ng-select-async/ng-select-async.component';
import { ReceiptStep1Component } from './shipment-edit/receipt-step1/receipt-step1.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ShipmentCostBillComponent } from './shipment-edit/shipment-cost-bill/shipment-cost-bill.component';
import { AttachDocumentModule } from '../../../partials/control/attach-document/attach-document.module';
import { ConfigListModule } from '../../../partials/control/config-list/config-list-control.module';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { NgxCurrencyModule } from 'ngx-currency';
import { DateSmallerThanTomorrowValidatorDirective } from './validator/date-smaller-than-tomorrow.validator';
import { InputDateModule } from '../../../partials/control/input-date/input-date.module';
import { WaybillNumberExistsValidatorDirective } from './validator/waybillNumber-exists.validator';
import { SettingModule } from '../../setting/setting.module';
import { ShipmentExportComponent } from './shipment-edit/shipment-export/shipment-export.component';

const routes: Routes = [
  { path: 'list', component: ShipmentComponent, canActivate: [AuthGuard] },
  { path: 'list/add', component: ShipmentEditComponent, canActivate: [AuthGuard] },
  { path: 'list/edit/:id', component: ShipmentEditComponent, canActivate: [AuthGuard] },
  { path: 'list/view/:id', component: ShipmentViewComponent, canActivate: [AuthGuard] }
];

const listConfigModule: string[] =
  ['BUSINESS_TERM', 'TRANSPORTATION_MODE', 'BILL_FROM', 'BILL_TO',
    'FREIGHT_CARRIER', 'GATE', 'PACKING_TYPE', 'COUNTRY', 'ITEM', 'COST_TYPE'];

@NgModule({
  declarations: [
    ShipmentComponent,
    ShipmentViewComponent,
    ShipmentEditComponent,
    PackageListInfoComponent,
    ShipmentPurchaseOrderComponent,
    ShipmentPurchaseInvoiceComponent,
    ShipmentItemComponent,
    ShipmentAddFromPoComponent,
    ReceiptStep1Component,
    ShipmentCostBillComponent,
    DateSmallerThanTomorrowValidatorDirective,
    WaybillNumberExistsValidatorDirective,
    ShipmentExportComponent
  ],
  exports: [ShipmentViewComponent],
  imports: [
    CoreModule,
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    PortletModule,
    TranslateModule,
    PartialsModule,
    MatCheckboxModule,
    NgbModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    TableModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    DialogModule,
    UploadFileModule,
    FieldsetModule,
    TreeTableModule,
    ButtonModule,
    ContextMenuModule,
    InputTextModule,
    NgSelectAsyncModule,
    MatRadioModule,
    NgSelectModule,
    AttachDocumentModule,
    ConfigListModule.forChild(listConfigModule),
    CalendarModule,
    InputNumberModule,
    NgxCurrencyModule,
    InputDateModule,
    SettingModule
  ],
  providers: []
})

export class ShipmentModule {
}
