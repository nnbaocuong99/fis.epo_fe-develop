import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PurchasePlanComponent } from './purchase-plan.component';
import { PurchasePlanEditComponent } from './purchase-plan-edit/purchase-plan-edit.component';
import { AuthGuard } from '../../../../core/auth';
import { CoreModule } from '../../../../core/core.module';
import { PartialsModule } from '../../../partials/partials.module';
import { TranslateModule } from '@ngx-translate/core';
import {
    MatPaginatorModule, MatProgressSpinnerModule,
    MatButtonModule, MatFormFieldModule, MatInputModule, MatMenuModule, MatIconModule, MatCheckboxModule
} from '@angular/material';
import { NgbDatepickerModule, NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadFileModule } from '../../../partials/control/upload-file/upload-file.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PurchasePlanItemComponent } from './purchase-plan-edit/purchase-plan-item/purchase-plan-item.component';
import { TreeTableModule } from 'primeng/treetable';
import {
    PurchasePlanItemDialogComponent
} from './purchase-plan-edit/purchase-plan-item/purchase-plan-item-dialog/purchase-plan-item-dialog.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PurchasePlanViewComponent } from './purchase-plan-view/purchase-plan-view.component';
import { DialogModule } from 'primeng/dialog';
import { NgSelectAsyncModule } from '../../../partials/control/ng-select-async/ng-select-async.component';
import { TableModule } from 'primeng/table';
import { DownloadFileTemplateModule } from '../../../partials/control/download-file/download-file.component';
import { InputContractModule } from './purchase-plan-edit/input-contract/input-contract.module';
import { InputNumberModule } from 'primeng/inputnumber';
import {
    CheckDuplicateDirective
} from './purchase-plan-edit/purchase-plan-item/purchase-plan-item-dialog/purchase-plan-item-dialog.validator';
import { IndexNoPurchasePlanItemValidatorDirective } from './validator/index-no-purchase-plan-item.validator';
import { ConfigListModule } from '../../../partials/control/config-list/config-list-control.module';
import { CalendarModule } from 'primeng/calendar';
import { NgxCurrencyModule } from 'ngx-currency';
import { InputDateModule } from '../../../partials/control/input-date/input-date.module';
import { ContextMenuModule } from 'primeng/contextmenu';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { PurchasePlanHistoryComponent } from './purchase-plan-history/purchase-plan-history.component';
import { PurchasePlanViewDetailsComponent } from './purchase-plan-history/purchase-plan-view-details/purchase-plan-view-details.component';

const routes: Routes = [
    { path: '', component: PurchasePlanComponent, canActivate: [AuthGuard] },
    { path: 'list', component: PurchasePlanComponent, canActivate: [AuthGuard] },
    { path: 'list/add', component: PurchasePlanEditComponent, canActivate: [AuthGuard] },
    { path: 'list/edit/:id', component: PurchasePlanEditComponent, canActivate: [AuthGuard] },
    { path: 'list/view/:id', component: PurchasePlanViewComponent, canActivate: [AuthGuard] },
];

const listConfigModule = ['DELIVERY_LOCATION'];

@NgModule({
    declarations: [
        PurchasePlanComponent,
        PurchasePlanEditComponent,
        PurchasePlanItemComponent,
        PurchasePlanItemDialogComponent,
        PurchasePlanViewComponent,
        CheckDuplicateDirective,
        IndexNoPurchasePlanItemValidatorDirective,
        PurchasePlanHistoryComponent,
        PurchasePlanViewDetailsComponent
    ],
    exports: [],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        CoreModule,
        PartialsModule,
        TranslateModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        NgbDropdownModule,
        MatMenuModule,
        MatIconModule,
        NgbTabsetModule,
        NgbTooltipModule,
        UploadFileModule,
        InputContractModule,
        NgSelectModule,
        TableModule,
        TreeTableModule,
        ConfirmDialogModule,
        MatFormFieldModule,
        MatInputModule,
        NgSelectAsyncModule,
        DialogModule,
        DownloadFileTemplateModule,
        InputNumberModule,
        ConfigListModule.forChild(listConfigModule),
        CalendarModule,
        NgxCurrencyModule,
        InputDateModule,
        ContextMenuModule,
        MatCheckboxModule,
        InputTextModule,
        DropdownModule
    ],
    providers: []
})

export class PurchasePlanModule {
}
