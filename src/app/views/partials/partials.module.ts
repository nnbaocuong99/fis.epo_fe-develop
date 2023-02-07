// Angular
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
} from '@angular/material';
// NgBootstrap
import { NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
// Perfect Scrollbar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// Core module
import { CoreModule } from '../../core/core.module';
// CRUD Partials
import {
    ActionNotificationComponent,
    AlertComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
} from './content/crud';
// Layout partials
import {
    ContextMenu2Component,
    ContextMenuComponent,
    LanguageSelectorComponent,
    NotificationComponent,
    QuickActionComponent,
    QuickPanelComponent,
    ScrollTableComponent,
    ScrollTopComponent,
    FloatHeaderComponent,
    SearchDefaultComponent,
    SearchDropdownComponent,
    SearchResultComponent,
    SplashScreenComponent,
    StickyToolbarComponent,
    Subheader1Component,
    Subheader2Component,
    Subheader3Component,
    Subheader4Component,
    Subheader5Component,
    SubheaderSearchComponent,
    UserProfile2Component,
    UserProfile3Component,
    UserProfileComponent
} from './layout';
// General
import { NoticeComponent } from './content/general/notice/notice.component';
import { PortletModule } from './content/general/portlet/portlet.module';
// Errpr
import { ErrorComponent } from './content/general/error/error.component';
// Extra module
import { WidgetModule } from './content/widgets/widget.module';
// SVG inline
import { InlineSVGModule } from 'ng-inline-svg';
import { CartComponent } from './layout/topbar/cart/cart.component';
import { DialogComponent } from './content/crud/dialog/dialog.component';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';
import { ValidateMessageComponent } from './content/crud/validate-message/validate-message.component';
import { FormDynamicComponent } from './content/crud/component/form-dynamic.component';
import { ToolbarComponent } from './content/toolbar/toolbar.component';
import { TableModule } from 'primeng/table';
import { SelectSyncSourceComponent } from './control/select-sync-source/select-sync-source.component';
import { SelectSyncSourceListComponent } from './control/select-sync-source/select-sync-source-list/select-sync-source-list.component';
import { NgSelectAsyncModule } from './control/ng-select-async/ng-select-async.component';
import { ExchangeRateControlComponent } from './control/exchange-rate-control/exchange-rate-control.component';
import {
    ExchangeRateControlDialogComponent
} from './control/exchange-rate-control/exchange-rate-control-dialog/exchange-rate-control-dialog.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectTermAccountComponent } from './control/select-term-account/select-term-account.component';
import { SelectProjectMilestoneComponent } from './control/select-project-milestone/select-project-milestone.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonAttachFileComponent } from './control/button-add-attach-file/button-add-attach-file.component';
import { ViewEmptyComponent } from './content/crud/view-empty/view-empty.component';
import { SelectMapItemCodeComponent } from './control/select-map-item-code/select-map-item-code.component';
import { MapItemCodeComponent } from './control/map-item-code/map-item-code.component';
import { SingleAttachFileComponent } from './control/single-attach-file/single-attach-file.component';
import { SelectSyncSourceAddComponent } from './control/select-sync-source/select-sync-source-add/select-sync-source-add.component';
import { ValidateTooltipDirective } from './content/crud/validate-message/validate-message.directive';
import { MapItemCodeTreeComponent } from './control/map-item-code-tree/map-item-code-tree.component';
import { TreeTableModule } from 'primeng/treetable';
import { InputDateModule } from './control/input-date/input-date.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { RatingModule } from 'primeng/rating';
import { MapTermAccountComponent } from './control/map-term-account/map-term-account.component';
import { ContextMenuModule } from 'primeng/contextmenu';
import { NotificationListComponent } from './layout/topbar/notification-list/notification-list.component';
import { NotificationDialogComponent } from './layout/topbar/notification-list/notification-dialog/notification-dialog.component';
import { NumberMaskValidatorDirective } from './common/number-mask.validator';
import { DateMoreThanCurrentDateValidatorDirective } from './common/date-more-than-current-date.validator';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DialogViewPdfFileComponent } from './control/dialog-view-pdf-file/dialog-view-pdf-file.component';
import { CheckMaxLengthValidatorDirective } from './common/custom-max-length.validator';
import { EmailTypeValidatorDirective } from './common/email-type.validator';
import { SelectSubdepartmentTreeComponent } from './control/select-subdepartment-tree/select-subdepartment-tree.component';
import { TreeModule } from 'primeng/tree';
import { BusinessProcessManagementComponent } from './business-process-management/business-process-management.component';
@NgModule({
    declarations: [
        ScrollTopComponent,
        ScrollTableComponent,
        FloatHeaderComponent,
        NoticeComponent,
        ActionNotificationComponent,
        DeleteEntityDialogComponent,
        FetchEntityDialogComponent,
        UpdateStatusDialogComponent,
        AlertComponent,

        // topbar components
        ContextMenu2Component,
        ContextMenuComponent,
        QuickPanelComponent,
        SearchResultComponent,
        SplashScreenComponent,
        StickyToolbarComponent,
        Subheader1Component,
        Subheader2Component,
        Subheader3Component,
        Subheader4Component,
        Subheader5Component,
        SubheaderSearchComponent,
        LanguageSelectorComponent,
        NotificationComponent,
        QuickActionComponent,
        SearchDefaultComponent,
        SearchDropdownComponent,
        UserProfileComponent,
        UserProfile2Component,
        UserProfile3Component,
        CartComponent,

        ErrorComponent,

        DialogComponent,
        FormDynamicComponent,
        ValidateMessageComponent,
        ToolbarComponent,
        SelectSyncSourceComponent,
        SelectSyncSourceListComponent,
        SelectSyncSourceListComponent,
        ExchangeRateControlComponent,
        ExchangeRateControlDialogComponent,
        SelectTermAccountComponent,
        SelectProjectMilestoneComponent,
        ButtonAttachFileComponent,
        ViewEmptyComponent,
        SelectMapItemCodeComponent,
        MapItemCodeComponent,
        SingleAttachFileComponent,
        SelectSyncSourceAddComponent,
        ValidateTooltipDirective,
        MapItemCodeTreeComponent,
        MapTermAccountComponent,
        NotificationListComponent,
        NotificationDialogComponent,
        NumberMaskValidatorDirective,
        DateMoreThanCurrentDateValidatorDirective,
        DialogViewPdfFileComponent,
        CheckMaxLengthValidatorDirective,
        EmailTypeValidatorDirective,
        SelectSubdepartmentTreeComponent,
        BusinessProcessManagementComponent
    ],
    exports: [
        WidgetModule,
        PortletModule,

        ScrollTopComponent,
        ScrollTableComponent,
        FloatHeaderComponent,
        NoticeComponent,
        ActionNotificationComponent,
        DeleteEntityDialogComponent,
        FetchEntityDialogComponent,
        UpdateStatusDialogComponent,
        AlertComponent,

        // topbar components
        ContextMenu2Component,
        ContextMenuComponent,
        QuickPanelComponent,
        SearchResultComponent,
        SplashScreenComponent,
        StickyToolbarComponent,
        Subheader1Component,
        Subheader2Component,
        Subheader3Component,
        Subheader4Component,
        Subheader5Component,
        SubheaderSearchComponent,
        LanguageSelectorComponent,
        NotificationComponent,
        NotificationListComponent,
        NotificationDialogComponent,
        QuickActionComponent,
        SearchDefaultComponent,
        SearchDropdownComponent,
        UserProfileComponent,
        UserProfile2Component,
        UserProfile3Component,
        CartComponent,

        ErrorComponent,
        DialogComponent,
        ValidateMessageComponent,
        FormDynamicComponent,
        ToolbarComponent,
        SelectSyncSourceComponent,
        SelectSyncSourceListComponent,
        ExchangeRateControlComponent,
        ExchangeRateControlDialogComponent,
        SelectTermAccountComponent,
        SelectProjectMilestoneComponent,
        ButtonAttachFileComponent,
        ViewEmptyComponent,
        SelectMapItemCodeComponent,
        MapItemCodeComponent,
        MapItemCodeTreeComponent,
        SingleAttachFileComponent,
        ValidateTooltipDirective,
        MapTermAccountComponent,
        NumberMaskValidatorDirective,
        DateMoreThanCurrentDateValidatorDirective,
        DialogViewPdfFileComponent,
        CheckMaxLengthValidatorDirective,
        EmailTypeValidatorDirective,
        SelectSubdepartmentTreeComponent,
        BusinessProcessManagementComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        PerfectScrollbarModule,
        InlineSVGModule,
        CoreModule,
        PortletModule,
        WidgetModule,

        // angular material modules
        MatButtonModule,
        MatMenuModule,
        MatSelectModule,
        MatInputModule,
        MatTableModule,
        MatAutocompleteModule,
        MatRadioModule,
        MatIconModule,
        MatNativeDateModule,
        MatProgressBarModule,
        MatDatepickerModule,
        MatCardModule,
        MatPaginatorModule,
        MatSortModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatTabsModule,
        MatTooltipModule,
        MatDialogModule,

        // ng-bootstrap modules
        NgbDropdownModule,
        NgbTabsetModule,
        NgbTooltipModule,
        DialogModule,
        TranslateModule,
        ConfirmDialogModule,
        TableModule,
        NgSelectAsyncModule,
        NgSelectModule,
        InputTextModule,
        TooltipModule,
        TreeTableModule,
        InputDateModule,
        NgxCurrencyModule,
        RatingModule,
        ContextMenuModule,
        NgxExtendedPdfViewerModule,
        TreeModule
    ],
    providers: [ConfirmationService]
})
export class PartialsModule {
}
