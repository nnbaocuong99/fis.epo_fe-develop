// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../../../core/auth';

@NgModule({
	imports: [
		CommonModule,
		PartialsModule,
		CoreModule,
		RouterModule.forChild([
			{
				path: '',
				component: DashboardComponent,
				canActivate: [AuthGuard]
			},
		]),
	],
	providers: [AuthGuard],
	declarations: [
		DashboardComponent,
	]
})
export class DashboardModule {
}
