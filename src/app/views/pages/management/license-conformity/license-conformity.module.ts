import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    MatCheckboxModule, MatIconModule, MatInputModule, MatMenuModule, MatPaginatorModule,
    MatProgressSpinnerModule
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
import { DialogModule } from 'primeng/dialog';
import { LicenseConformityListComponent } from './license-conformity-list/license-conformity-list.component';
import { ConformityComponent } from './conformity/conformity.component';
import { CertificateQualityComponent } from './certificate-quality/certificate-quality.component';
import { ButtonModule } from 'primeng/button';
import { ContextMenuModule } from 'primeng/contextmenu';
import { InputTextModule } from 'primeng/inputtext';
import { TreeTableModule } from 'primeng/treetable';
import { UploadFileModule } from '../../../partials/control/upload-file/upload-file.component';
import { EnergyEfficiencyComponent } from './energy-efficiency/energy-efficiency.component';
import { ShipmentQualityComponent } from './shipment-quality/shipment-quality.component';
import { ShipmentQualityItemComponent } from './shipment-quality/shipment-quality-item/shipment-quality-item.component';
import { CalendarModule } from 'primeng/calendar';
import { InputDateModule } from '../../../partials/control/input-date/input-date.module';

const routes: Routes = [
    { path: 'list', component: LicenseConformityListComponent, canActivate: [AuthGuard] },
    { path: 'list/energy-efficiency/registered/:id', component: ShipmentQualityComponent, canActivate: [AuthGuard], data: { type: 1 } },
    { path: 'list/certificate-quality/registered/:id', component: ShipmentQualityComponent, canActivate: [AuthGuard], data: { type: 2 } },
    { path: 'list/conformity/registered/:id', component: ShipmentQualityComponent, canActivate: [AuthGuard], data: { type: 3 } },
];

@NgModule({
    declarations: [
        LicenseConformityListComponent,
        EnergyEfficiencyComponent,
        ConformityComponent,
        CertificateQualityComponent,
        ShipmentQualityComponent,
        ShipmentQualityItemComponent
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
        NgbTabsetModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatCheckboxModule,
        NgbModule,
        NgSelectAsyncModule,
        NgSelectModule,
        DialogModule,
        ButtonModule,
        ContextMenuModule,
        InputTextModule,
        TreeTableModule,
        UploadFileModule,
        CalendarModule,
        InputDateModule
    ],
    providers: []
})

export class LicenseConformityModule {
}
