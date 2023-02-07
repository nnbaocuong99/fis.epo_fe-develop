import { NgModule } from '@angular/core';
import { PermissionComponent } from './permission/permission.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoleComponent } from './permission/role/role.component';
import { OperationComponent } from './permission/operation/operation.component';
import { RouterModule, Routes } from '@angular/router';
import { PartialsModule } from '../../partials/partials.module';
import { AuthGuard, User } from '../../../core/auth';
import { CoreModule } from '../../../core/core.module';
import { TranslateModule } from '@ngx-translate/core';
import {
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    MatDatepickerModule,
    MatRadioModule,
    MatCheckboxModule,
} from '@angular/material';
import { DialogModule } from 'primeng/dialog';
import { RoleEditComponent } from './permission/role/role-edit/role-edit.component';
import { NgSelectAsyncModule } from '../../partials/control/ng-select-async/ng-select-async.component';
import { TreeTableModule } from 'primeng/treetable';
import { TreeModule } from 'primeng/tree';
import { OrgChartComponent } from './org-chart/org-chart.component';
import { UserEditComponent } from './user-management/user-edit/user-edit.component';
import { UsersListComponent } from './user-management/users-list.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ContextMenuModule } from 'primeng/contextmenu';
import { OperationEditComponent } from './permission/operation/operation-edit/operation-edit.component';
import { FileComponent } from './file/file.component';
import { UploadFileModule } from '../../partials/control/upload-file/upload-file.component';
import { UserOrgComponent } from './user-management/user-edit/user-org/user-org.component';
import { MappingSproComponent } from './mapping-spro/mapping-spro.component';
import { MappingSproEditComponent } from './mapping-spro/mapping-spro-edit/mapping-spro-edit.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RatingModule } from 'primeng/rating';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfigListComponent } from './config-list/config-list.component';
import { ConfigListEditComponent } from './config-list/config-list-edit/config-list-edit.component';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';
import { OperationAndDataComponent } from './permission/operation-and-data/operation-and-data.component';
import { ActionComponent } from './permission/operation-and-data/action/action.component';
import { OperationDataEditComponent } from './permission/operation-and-data/operation-edit/operation-edit.component';
import { OperationActionAddComponent } from './permission/operation-and-data/operation-action-add/operation-action-add.component';
import { RoleOperationComponent } from './permission/role/role-operation/role-operation.component';
import { ActionViewComponent } from './permission/operation-and-data/action/action-view/action-view.component';
import { CustomizeResourceComponent } from './permission/role/customize-resource/customize-resource.component';
import { InputTextModule } from 'primeng/inputtext';
import { RoleDetailsComponent } from './permission/role/role-details/role-details.component';
import { ConfigTempMailComponent } from './config-temp-mail/config-temp-mail.component';
import { ConfigTempMailEditComponent } from './config-temp-mail/config-temp-mail-edit/config-temp-mail-edit.component';
import { MessagesModule } from 'primeng/messages';
import { CKEditorModule } from 'ngx-ckeditor';
import { UserAfGroupComponent } from './user-management/user-edit/user-af-group/user-af-group.component';
import { UserProducerComponent } from './user-management/user-edit/user-producer/user-producer.component';
import { TreeService } from '../../../services/common/utility/tree.service';
import { UserBranchComponent } from './user-management/user-edit/user-branch/user-branch.component';
import { UserNameExistsValidatorDirective } from './user-management/validator/username-exists.validator';
import { AfGroupComponent } from './user-management/user-edit/af-group/af-group.component';
import { DownloadFileTemplateModule } from '../../partials/control/download-file/download-file.component';

const routes: Routes = [
    {
        path: 'system/permission',
        component: PermissionComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'permission/operation-and-data',
        component: OperationAndDataComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'system/org-chart',
        component: OrgChartComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'system/users',
        component: UsersListComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'system/users/add',
        component: UserEditComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'system/users/edit/:id',
        component: UserEditComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'system/users/af-group',
        component: AfGroupComponent,
        canActivate: [AuthGuard],
    },
    { path: 'system/file', component: FileComponent, canActivate: [AuthGuard] },
    {
        path: 'feature/config-list',
        component: ConfigListComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'feature/mapping-spro',
        component: MappingSproComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'feature/mapping-spro/add',
        component: MappingSproEditComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'feature/mapping-spro/edit/:id',
        component: MappingSproEditComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'config-mail/template',
        component: ConfigTempMailComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'config-mail/template/add',
        component: ConfigTempMailEditComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'config-mail/template/edit/:id',
        component: ConfigTempMailEditComponent,
        canActivate: [AuthGuard],
    }
];

@NgModule({
    declarations: [
        PermissionComponent,
        RoleComponent,
        RoleEditComponent,
        OperationComponent,
        OperationEditComponent,
        RoleEditComponent,
        OrgChartComponent,
        UsersListComponent,
        UserEditComponent,
        FileComponent,
        UserOrgComponent,
        MappingSproComponent,
        MappingSproEditComponent,
        ConfigListComponent,
        ConfigListEditComponent,
        OperationAndDataComponent,
        ActionComponent,
        OperationDataEditComponent,
        OperationActionAddComponent,
        RoleOperationComponent,
        ActionViewComponent,
        CustomizeResourceComponent,
        RoleDetailsComponent,
        ConfigTempMailComponent,
        ConfigTempMailEditComponent,
        UserAfGroupComponent,
        UserProducerComponent,
        UserBranchComponent,
        UserNameExistsValidatorDirective,
        AfGroupComponent
    ],
    exports: [
        UserOrgComponent,
        UserAfGroupComponent
    ],
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
        MatFormFieldModule,
        MatInputModule,
        RadioButtonModule,
        DialogModule,
        NgSelectAsyncModule,
        TreeTableModule,
        TreeModule,
        ReactiveFormsModule,
        MatInputModule,
        MatMenuModule,
        ContextMenuModule,
        UploadFileModule,
        MatIconModule,
        NgSelectModule,
        InputSwitchModule,
        MatDatepickerModule,
        ConfirmDialogModule,
        RatingModule,
        OverlayPanelModule,
        NgbModule,
        TableModule,
        InputTextModule,
        MessagesModule,
        CKEditorModule,
        MatRadioModule,
        MatCheckboxModule,
        DownloadFileTemplateModule
    ],
    providers: [TreeService],
})
export class SettingModule { }
