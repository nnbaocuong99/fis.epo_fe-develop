import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PartialsModule } from '../../partials/partials.module';
import { AuthGuard } from '../../../core/auth';
import { CoreModule } from '../../../core/core.module';
import { TranslateModule } from '@ngx-translate/core';
import {
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule, MatProgressSpinnerModule, MatRadioModule
} from '@angular/material';
import { ItemComponent } from './item/item.component';
import { SupplierComponent } from './supplier/supplier.component';
import { ExchangeRateCurrencyComponent } from './exchange-rate-currency/exchange-rate-currency.component';
import { NgbModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { ProjectComponent } from './project/project.component';
import { CustomerComponent } from './customer/customer.component';
import { OrganizationManagementComponent } from './organization-management/organization-management.component';
import { OperatingUnitComponent } from './organization-management/operating-unit/operating-unit.component';
import { OrganizationComponent } from './organization-management/organization/organization.component';
import { SubInventoryComponent } from './organization-management/sub-inventory/sub-inventory.component';
import { TreeTableModule } from 'primeng/treetable';
import { SubDepartmentComponent } from './organization-management/sub-department/sub-department.component';
import { DialogModule } from 'primeng/dialog';
import { SupplierAddComponent } from './supplier/supplier-add/supplier-add.component';
import { NgSelectAsyncModule } from '../../partials/control/ng-select-async/ng-select-async.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfigListModule } from '../../partials/control/config-list/config-list-control.module';
import { InputDateModule } from '../../partials/control/input-date/input-date.module';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SupplierViewComponent } from './supplier/supplier-view/supplier-view.component';
import { SupplierCodeExistsValidatorDirective } from './supplier/validator/supplier-code-exists.validator';
import { ContextMenuModule } from 'primeng/contextmenu';
import { BrandComponent } from './brand/brand.component';
import { BrandAddComponent } from './brand/brand-add/brand-add.component';
import { BrandViewComponent } from './brand/brand-view/brand-view.component';
import { AttachDocumentModule } from '../../partials/control/attach-document/attach-document.module';
import { ContactInfoComponent } from './brand/brand-add/contact-info/contact-info.component';
import { PortletModule } from '../../partials/content/general/portlet/portlet.module';
import { SettingModule } from '../setting/setting.module';
import { ToastModule } from 'primeng/toast';
import { SupplierHistoryComponent } from './supplier/supplier-history/supplier-history.component';
import {
    SupplierHistoryViewDetailsComponent
} from './supplier/supplier-history/supplier-history-view-details/supplier-history-view-details.component';
import { PartnerHierarchyComponent } from './brand/brand-add/partner-hierarchy/partner-hierarchy.component';
import { NgSelectAddTagComponent } from './supplier/ng-select-add-tag/ng-select-add-tag.component';
import { PurchaseOrderInSupplierComponent } from './supplier/purchase-order-in-supplier/purchase-order-in-supplier.component';
import { RatingModule } from 'primeng/rating';
import { BrandHistoryComponent } from './brand/brand-history/brand-history.component';
import { BrandHistoryViewDetailsComponent } from './brand/brand-history/brand-history-view-details/brand-history-view-details.component';
import { BrandCodeExistsValidatorDirective } from './brand/validator/brand-code-exists.validator';
import { UploadFileModule } from '../../partials/control/upload-file/upload-file.component';
import { DownloadFileTemplateModule } from '../../partials/control/download-file/download-file.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SupplierEmailExistsValidatorDirective } from './supplier/validator/supplier-email-exists.validator';
import { BrandViewYearComponent } from './brand/brand-view-year/brand-view-year.component';
import { CalendarModule } from 'primeng/calendar';
import { BrandRevenueComponent } from './brand/brand-add/brand-revenue/brand-revenue.component';
import { BrandMembershipRequirementComponent } from './brand/brand-add/brand-membership-requirement/brand-membership-requirement.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { BrandMarketingFundInfoComponent } from './brand/brand-add/brand-marketing-fund-info/brand-marketing-fund-info.component';
import { CustomsBranchComponent } from './customs-branch/customs-branch.component';
import { CustomsBranchAddComponent } from './customs-branch/customs-branch-add/customs-branch-add.component';
import { CustomsBranchViewComponent } from './customs-branch/customs-branch-view/customs-branch-view.component';

const routes: Routes = [
    { path: 'item', component: ItemComponent, canActivate: [AuthGuard] },
    { path: 'supplier', component: SupplierComponent, canActivate: [AuthGuard] },
    { path: 'supplier/add', component: SupplierAddComponent, canActivate: [AuthGuard] },
    { path: 'supplier/edit/:id', component: SupplierAddComponent, canActivate: [AuthGuard] },
    { path: 'supplier/view/:id', component: SupplierViewComponent, canActivate: [AuthGuard] },
    { path: 'brand', component: BrandComponent, canActivate: [AuthGuard] },
    { path: 'brand/add', component: BrandAddComponent, canActivate: [AuthGuard] },
    { path: 'brand/edit/:id', component: BrandAddComponent, canActivate: [AuthGuard] },
    { path: 'brand/view/:id', component: BrandViewComponent, canActivate: [AuthGuard] },
    { path: 'exchange-rate-currency', component: ExchangeRateCurrencyComponent, canActivate: [AuthGuard] },
    { path: 'project', component: ProjectComponent, canActivate: [AuthGuard] },
    { path: 'organization', component: OrganizationManagementComponent, canActivate: [AuthGuard] },
    { path: 'customer', component: CustomerComponent, canActivate: [AuthGuard] },
    { path: 'customs-branch', component: CustomsBranchComponent, canActivate: [AuthGuard] },
    { path: 'customs-branch/add', component: CustomsBranchAddComponent, canActivate: [AuthGuard] },
    { path: 'customs-branch/edit/:id', component: CustomsBranchAddComponent, canActivate: [AuthGuard] },
    { path: 'customs-branch/view/:id', component: CustomsBranchViewComponent, canActivate: [AuthGuard] },
];

// tslint:disable-next-line:max-line-length
const listConfigModule = ['COUNTRY', 'ITEM', 'BUSINESS_TERM', 'TRANSPORTATION_MODE', 'BILL_FROM', 'BILL_TO', 'BRAND_PAMER_REGION', 'BRAND_PARADIGM',
    'BRAND_REVENUE', 'BRAND_NEW_PRODUCT', 'BRAND_PARTNER_RATING', 'BRAND_WARRANTY_VALIDITY', 'BRAND_PRIORITY', 'BRAND_FIS_PARTNER_LEVEL',
    'BRAND_CONTRACTOR_TAX', 'BRAND_FUND_STATUS', 'BRAND_FUND_FISX', 'SUPPLIER_POSITION'];

@NgModule({
    declarations: [
        ItemComponent,
        SupplierComponent,
        ExchangeRateCurrencyComponent,
        ProjectComponent,
        OrganizationManagementComponent,
        OrganizationComponent,
        OperatingUnitComponent,
        SubInventoryComponent,
        CustomerComponent,
        SubDepartmentComponent,
        SupplierAddComponent,
        SupplierViewComponent,
        BrandComponent,
        SupplierCodeExistsValidatorDirective,
        SupplierEmailExistsValidatorDirective,
        BrandAddComponent,
        BrandViewComponent,
        ContactInfoComponent,
        SupplierHistoryComponent,
        SupplierHistoryViewDetailsComponent,
        PartnerHierarchyComponent,
        NgSelectAddTagComponent,
        PurchaseOrderInSupplierComponent,
        BrandHistoryComponent,
        BrandHistoryViewDetailsComponent,
        BrandCodeExistsValidatorDirective,
        BrandViewYearComponent,
        BrandRevenueComponent,
        BrandMembershipRequirementComponent,
        BrandMarketingFundInfoComponent,
        CustomsBranchComponent,
        CustomsBranchAddComponent,
        CustomsBranchViewComponent

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
        NgbTabsetModule,
        MatFormFieldModule,
        MatInputModule,
        TreeTableModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        DialogModule,
        ToastModule,
        MatCheckboxModule,
        NgSelectAsyncModule,
        NgSelectModule,
        ConfigListModule.forChild(listConfigModule),
        MatRadioModule,
        InputDateModule,
        TableModule,
        InputTextModule,
        ButtonModule,
        ContextMenuModule,
        AttachDocumentModule,
        PortletModule,
        NgbModule,
        SettingModule,
        RatingModule,
        UploadFileModule,
        DownloadFileTemplateModule,
        InputSwitchModule,
        CalendarModule,
        MultiSelectModule
    ],
    providers: []
})

export class CategoryModule {
}
