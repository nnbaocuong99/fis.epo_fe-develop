// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './views/theme/base/base.component';
import { ErrorPageComponent } from './views/theme/content/error-page/error-page.component';
// Auth
import { AuthGuard } from './core/auth';
import { HomePageComponent } from './views/pages/apps/home-page/home-page.component';


const routes: Routes = [
    {
        path: 'template',
        component: BaseComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'home', component: HomePageComponent },
            {
                path: 'dashboard',
                loadChildren: () => import('../app/views/pages/dashboard/dashboard.module').then(m => m.DashboardModule),
            },
            {
                path: 'ngbootstrap',
                loadChildren: () => import('../app/views/pages/ngbootstrap/ngbootstrap.module').then(m => m.NgbootstrapModule),
            },
            {
                path: 'material',
                loadChildren: () => import('../app/views/pages/material/material.module').then(m => m.MaterialModule),
            },
            {
                path: 'wizard',
                loadChildren: () => import('../app/views/pages/wizard/wizard.module').then(m => m.WizardModule),
            },
            {
                path: 'builder',
                loadChildren: () => import('../app/views/theme/content/builder/builder.module').then(m => m.BuilderModule),
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
        ]
    },
    { path: 'auth', loadChildren: () => import('../app/views/pages/auth/auth.module').then(m => m.AuthModule) },
    {
        path: 'apps',
        component: BaseComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'home', component: HomePageComponent },
            {
                path: 'dashboard',
                loadChildren: () => import('../app/views/pages/dashboard-apps/dashboard-apps.module').then(m => m.DashboardAppsModule),
            },
            {
                path: 'setting',
                loadChildren: () => import('../app/views/pages/setting/setting.module').then(m => m.SettingModule),
            },
            {
                path: 'management',
                loadChildren: () => import('../app/views/pages/management/management.module').then(m => m.ManagementModule),
            },
            {
                path: 'category',
                loadChildren: () => import('../app/views/pages/category/category.module').then(m => m.CategoryModule),
            },
            {
                path: 'report',
                loadChildren: () => import('../app/views/pages/report/report.module').then(m => m.ReportModule),
            },
            {
                path: 'request-for-quotation-bids',
                loadChildren: () =>
                    import('../app/views/pages/request-for-quotation-bids-management/request-for-quotation-bids-management.module')
                        .then(m => m.RequestForQuotationBidsManagementModule)
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
        ]
    },
    {
        path: 'error/403',
        component: ErrorPageComponent,
        canActivate: [AuthGuard],
        data: {
            type: 'error-v6',
            code: 403,
            title: '403... Access forbidden',
            desc: 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator',
        },
    },
    { path: 'error/:type', component: ErrorPageComponent },
    { path: '**', redirectTo: 'apps/dashboard', pathMatch: 'full' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule],
})

export class AppRoutingModule {
}
