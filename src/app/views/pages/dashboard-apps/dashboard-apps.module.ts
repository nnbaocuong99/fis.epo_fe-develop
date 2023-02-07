// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { AuthGuard } from '../../../core/auth';
import { DashboardAppsComponent } from './dashboard-apps.component';
import { CardModule, } from 'primeng/card';

@NgModule({
  imports: [
    CommonModule,
    PartialsModule,
    CoreModule,
    RouterModule.forChild([
      { path: '', component: DashboardAppsComponent, canActivate: [AuthGuard] }
    ]),
    CardModule
  ],
  providers: [AuthGuard],
  declarations: [
    DashboardAppsComponent,
  ]
})
export class DashboardAppsModule {
}
