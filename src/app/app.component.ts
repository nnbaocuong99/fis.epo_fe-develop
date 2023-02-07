import { Observable, Subscription } from 'rxjs';
// Angular
import { AfterViewChecked, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
// Layout
import { LayoutConfigService, SplashScreenService } from './core/_base/layout';
// language list
import { TranslateService } from '@ngx-translate/core';
import { Configuration } from './services/common';
import { select, Store } from '@ngrx/store';
import { AppState } from './core/reducers';
import { AccountInfo } from './core/auth/_models/account-info.model';
import { currentUser } from './core/auth';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy, AfterViewChecked {
	// Public properties
	title = 'E-Purchase Order';
	loader: boolean;
	private unsubscribe: Subscription[] = [];
	user$: Observable<AccountInfo>;

	/**
	 * Component constructor
	 *
	 * @param translationService: TranslationService
	 * @param router: Router
	 * @param layoutConfigService: LayoutCongifService
	 * @param splashScreenService: SplashScreenService
	 * @param configuration: AppSettingsService
	 */
	constructor(
		private translationService: TranslateService,
		private router: Router,
		private layoutConfigService: LayoutConfigService,
		private splashScreenService: SplashScreenService,
		private configuration: Configuration,
		private store: Store<AppState>) {
		// register translations
		this.translationService.setDefaultLang('vn');
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		// enable/disable loader
		this.loader = this.layoutConfigService.getConfig('loader.enabled');

		const routerSubscription = this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				// hide splash screen
				this.splashScreenService.hide();

				// scroll to top on every route change
				window.scrollTo(0, 0);

				// to display back the body content
				setTimeout(() => {
					document.body.classList.add('kt-page--loaded');
				}, 500);
			}
		});

		this.configuration.getConfiguration();

		this.user$ = this.store.pipe(select(currentUser));

		this.unsubscribe.push(routerSubscription);
	}

	/**
	 * On after view checked
	 */
	ngAfterViewChecked() {
		this.user$.subscribe(res => {
			if (res) {
				const buttons = document.getElementsByTagName('BUTTON');
				for (let i = 0; i < buttons.length; i++) {
					const buttonRole = buttons[i].getAttribute('user-role');
					if (!!buttonRole && !this.check(res.roles, buttonRole)) {
						(buttons[i] as any).style.display = 'none';
					}
				}
			}
		});
	}

	check(roles: string[], buttonRoleSource: string): boolean {
		let result = false;
		if (!buttonRoleSource) {
			result = true;
		}

		const buttonRoles = buttonRoleSource.split(',');

		if (roles.some(x => x ==='SUPER_ADMIN')) {
			result = true;
		}

		for (let role of roles) {
			for (let buttonRole of buttonRoles) {
				if (role === buttonRole) {
					result = true;
				}
			}
		}

		return result;
	}

	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.unsubscribe.forEach(sb => sb.unsubscribe());
	}
}
