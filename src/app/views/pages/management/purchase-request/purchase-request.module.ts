import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    MatCheckboxModule,
    MatRadioModule
} from '@angular/material';
import {
    NgbDropdownModule,
    NgbTabsetModule,
    NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NgSelectAsyncModule } from '../../../partials/control/ng-select-async/ng-select-async.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CoreModule } from '../../../../core/core.module';
import { PartialsModule } from '../../../partials/partials.module';
import { UploadFileModule } from '../../../partials/control/upload-file/upload-file.component';
import { InputContractModule } from './purchase-request-add/input-contract/input-contract.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TreeTableModule } from 'primeng/treetable';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { PurchaseRequestComponent } from './purchase-request.component';
import { PurchaseRequestAddComponent } from './purchase-request-add/purchase-request-add.component';
import { PurchaseRequestViewComponent } from './purchase-request-view/purchase-request-view.component';
import { PurchaseRequestItemComponent } from './purchase-request-add/purchase-request-item/purchase-request-item.component';
import { AuthGuard } from '../../../../core/auth';
import { PurchaseRequestAreaTypeComponent } from './purchase-request-area-type/purchase-request-area-type.component';
import {
    PurchaseRequestItemDialogComponent
} from './purchase-request-add/purchase-request-item/purchase-request-item-dialog/purchase-request-item-dialog.component';
import { PurchasePlanViewComponent } from './purchase-request-add/purchase-plan-view/purchase-plan-view.component';
import { PurchaseRequestEditComponent } from './purchase-request-edit/purchase-request-edit.component';
import { PurchaseRequestEditItemComponent } from './purchase-request-edit/purchase-request-edit-item/purchase-request-edit-item.component';
import { MatChipsModule } from '@angular/material/chips';
import { MultiSelectModule } from 'primeng/multiselect';
import {
    PurchaseRequestItemUpdateDialogComponent
} from './purchase-request-edit/purchase-request-item-update-dialog/purchase-request-item-update-dialog.component';
import { AttachDocumentModule } from '../../../partials/control/attach-document/attach-document.module';
import { PurchaseRequestAppendixAddComponent } from './purchase-request-appendix-add/purchase-request-appendix-add.component';
import { FieldsetModule } from 'primeng/fieldset';
import {
    PurchaseRequestAppendixDialogComponent
} from './purchase-request-appendix-add/purchase-request-appendix-dialog/purchase-request-appendix-dialog.component';
import { ConfigListModule } from '../../../partials/control/config-list/config-list-control.module';
import { CalendarModule } from 'primeng/calendar';
import { InputDateModule } from '../../../partials/control/input-date/input-date.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { RatingModule } from 'primeng/rating';
import { ContextMenuModule } from 'primeng/contextmenu';
import { PurchaseRequestItemFollowComponent } from './purchase-request-item-follow/purchase-request-item-follow.component';
import { InputTextModule } from 'primeng/inputtext';
import { IpoNumberExistsValidatorDirective } from './validator/ipo-number-exists.validator';
import { PurchaseRequestHistoryComponent } from './purchase-request-history/purchase-request-history.component';
import { PurchaseRequestViewDetailComponent } from './purchase-request-history/purchase-request-view-detail/purchase-request-view-detail.component';

const routes: Routes = [
    {
        path: 'list',
        component: PurchaseRequestComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'list/view/:id',
        component: PurchaseRequestViewComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'list/add',
        component: PurchaseRequestAddComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'list/add/:id',
        component: PurchaseRequestAddComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'list/edit/:id',
        component: PurchaseRequestEditComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'list/classify',
        component: PurchaseRequestAreaTypeComponent,
        canActivate: [AuthGuard]
    },
];

const listConfigModule = ['DELIVERY_LOCATION'];

@NgModule({
    declarations: [
        PurchaseRequestComponent,
        PurchaseRequestAddComponent,
        PurchaseRequestViewComponent,
        PurchaseRequestItemComponent,
        PurchaseRequestItemDialogComponent,
        PurchaseRequestAreaTypeComponent,
        PurchasePlanViewComponent,
        PurchaseRequestEditComponent,
        PurchaseRequestEditItemComponent,
        PurchaseRequestItemUpdateDialogComponent,
        PurchaseRequestAppendixAddComponent,
        PurchaseRequestAppendixDialogComponent,
        PurchaseRequestItemFollowComponent,
        IpoNumberExistsValidatorDirective,
        PurchaseRequestHistoryComponent,
        PurchaseRequestViewDetailComponent
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
        ReactiveFormsModule,
        MatMenuModule,
        MatIconModule,
        NgbTabsetModule,
        NgbTooltipModule,
        UploadFileModule,
        InputContractModule,
        NgSelectModule,
        TreeTableModule,
        DynamicDialogModule,
        ConfirmDialogModule,
        DialogModule,
        MatFormFieldModule,
        MatInputModule,
        TableModule,
        SelectButtonModule,
        NgSelectAsyncModule,
        RadioButtonModule,
        MatCheckboxModule,
        MatRadioModule,
        MatChipsModule,
        MultiSelectModule,
        AttachDocumentModule,
        FieldsetModule,
        CalendarModule,
        ConfigListModule.forChild(listConfigModule),
        InputDateModule,
        NgxCurrencyModule,
        RatingModule,
        ContextMenuModule,
        InputTextModule
    ],
    providers: [],
    entryComponents: [],
})
export class PurchaseRequestModule { }
