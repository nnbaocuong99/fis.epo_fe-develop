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
import { RequestForQuotationManagementComponent } from './request-for-quotation-management/request-for-quotation-management.component';
import { BidsManagementComponent } from './bids-management/bids-management.component';
import { ContextMenuModule } from 'primeng/contextmenu';
import { BidsManagementAddComponent } from './bids-management/bids-management-add/bids-management-add.component';
import { BidsManagementViewComponent } from './bids-management/bids-management-view/bids-management-view.component';
import { ButtonModule } from 'primeng/button';
import {
  RequestForQuotationManagementAddComponent
} from './request-for-quotation-management/request-for-quotation-management-add/request-for-quotation-management-add.component';
import {
  RequestForQuotationManagementViewComponent
} from './request-for-quotation-management/request-for-quotation-management-view/request-for-quotation-management-view.component';
import {
  BidsManagementViewSupplierProfileComponent
} from './bids-management/bids-management-view-supplier-profile/bids-management-view-supplier-profile.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { ConfigListModule } from '../../partials/control/config-list/config-list-control.module';
import { ViewEnterQuoteDialogComponent } from './request-for-quotation-management/request-for-quotation-management-add/view-enter-quote-dialog/view-enter-quote-dialog.component';
import { DiscussWithFptComponent } from './request-for-quotation-management/request-for-quotation-management-add/discuss-with-fpt/discuss-with-fpt.component';
import { BidsManagementSelectEmailComponent } from './bids-management/bids-management-select-email/bids-management-select-email.component';

const listConfigModule = ['TAX'];

const routes: Routes = [
  { path: 'rfq', component: RequestForQuotationManagementComponent, canActivate: [AuthGuard] },
  { path: 'rfq/quotation/add', component: RequestForQuotationManagementAddComponent, canActivate: [AuthGuard] },
  { path: 'rfq/quotation/edit/:id', component: RequestForQuotationManagementAddComponent, canActivate: [AuthGuard] },
  { path: 'rfq/quotation-enter/edit/:id', component: RequestForQuotationManagementAddComponent, canActivate: [AuthGuard] },
  { path: 'rfq/quotation/view/:id', component: RequestForQuotationManagementViewComponent, canActivate: [AuthGuard] },
  { path: 'bids', component: BidsManagementComponent, canActivate: [AuthGuard] },
  { path: 'bids/add', component: BidsManagementAddComponent, canActivate: [AuthGuard] },
  { path: 'bids/edit/:id', component: BidsManagementAddComponent, canActivate: [AuthGuard] },
  { path: 'bids/view/:id', component: BidsManagementViewComponent, canActivate: [AuthGuard] },
];
@NgModule({
  declarations: [
    RequestForQuotationManagementComponent,
    BidsManagementComponent,
    BidsManagementAddComponent,
    BidsManagementViewComponent,
    RequestForQuotationManagementAddComponent,
    RequestForQuotationManagementViewComponent,
    BidsManagementViewSupplierProfileComponent,
    ViewEnterQuoteDialogComponent,
    DiscussWithFptComponent,
    BidsManagementSelectEmailComponent
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
    ChartModule,
    ContextMenuModule,
    ButtonModule,
    NgxCurrencyModule,
    ConfigListModule.forChild(listConfigModule)
  ],
  providers: []
})
export class RequestForQuotationBidsManagementModule { }
