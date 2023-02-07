// Angular
import { Component, Input, OnInit } from '@angular/core';
// RxJS
import { Observable } from 'rxjs';
// NGRX
import { select, Store } from '@ngrx/store';
// State
import { AppState } from '../../../../../core/reducers';
import { currentUser, Logout } from '../../../../../core/auth';
import { AccountInfo } from '../../../../../core/auth/_models/account-info.model';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../core/auth/_services/auth.service';

@Component({
    selector: 'kt-user-profile',
    templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
    // Public properties
    user$: Observable<AccountInfo>;

    @Input() avatar = true;
    @Input() greeting = true;
    @Input() badge: boolean;
    @Input() icon: boolean;

    constructor(
        private store: Store<AppState>,
        private router: Router,
        private authService: AuthService
    ) {
    }

    ngOnInit(): void {
        this.user$ = this.store.pipe(select(currentUser));
    }

    logout() {
        this.authService.deleteAllCookiesButNotThis('');
        // this.router.navigate(['auth']);

        window.location.href = `https://login.microsoftonline.com/fptcloud.onmicrosoft.com/oauth2/v2.0/logout?
        post_logout_redirect_uri=http://localhost:4200`;
    }
}
