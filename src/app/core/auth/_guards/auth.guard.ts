// Angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
// RxJS
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// NGRX
import { Store } from '@ngrx/store';
// Auth reducers and selectors
import { AppState } from '../../../core/reducers/';
import { Logout, Login } from '../_actions/auth.actions';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private store: Store<AppState>,
        private router: Router,
        private auth: AuthService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        let fullModuleUrl: any = '';
        let id: any = '';
        if (state.url.split('?')[0].startsWith('/error/')) {
            fullModuleUrl = state.root.queryParams.url;
        } else {
            fullModuleUrl = state.url.split('?')[0];
        }
        if (fullModuleUrl && fullModuleUrl.lastIndexOf('#') > -1) {
            fullModuleUrl = fullModuleUrl.substring(0, fullModuleUrl.lastIndexOf('#'));
        }

        const firstChild = this.getFirstChild(route);
        const paramsName = Object.getOwnPropertyNames(firstChild.params)[0];
        if (paramsName) {
            id = firstChild.params[paramsName];
            fullModuleUrl = fullModuleUrl.replace('/' + id, '');
        }
        return this.auth.authenticateAzureAD({ moduleUrl: fullModuleUrl }).pipe(map(result => {
            console.log(result);
            if (result.isAuthenticated) {
                if (result.newIdToken) {
                    this.auth.setCookie('id-token', result.newIdToken);
                }
                this.store.dispatch(new Login({ user: result.user }));
                if (state.url !== '/apps/dashboard') {
                    if (this.router.getCurrentNavigation().extras.state && this.router.getCurrentNavigation().extras.state.byPass) {
                        return true;
                    } else if (result.canAccess) {
                        if (state.url.split('?')[0].startsWith('/error/')) {
                            // tslint:disable-next-line:max-line-length
                            this.router.navigate([fullModuleUrl + (state.root.queryParams.id ? '/' + state.root.queryParams.id : '')], { state: { byPass: true } });
                        }
                        return true;
                    } else {
                        if (!state.url.split('?')[0].startsWith('/error/')) {
                            this.router.navigate(['error/403'], { queryParams: { url: fullModuleUrl, id: id }, state: { byPass: true } });
                        }
                        return true;
                    }
                } else {
                    return true;
                }
            } else {
                this.store.dispatch(new Logout());
                this.router.navigate(['auth']);
            }
        }));
    }

    private getFirstChild(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
        if (!route.firstChild) {
            return route;
        } else {
            return this.getFirstChild(route.firstChild);
        }
    }
}
