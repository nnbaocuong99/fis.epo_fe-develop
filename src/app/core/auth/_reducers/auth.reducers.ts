// Actions
import { AuthActions, AuthActionTypes } from '../_actions/auth.actions';
// Models
import { AccountInfo } from '../_models/account-info.model';

export interface AuthState {
    loggedIn: boolean;
    user: AccountInfo;
    isUserLoaded: boolean;
}

export const initialAuthState: AuthState = {
    loggedIn: false,
    user: undefined,
    isUserLoaded: false
};

export function authReducer(state = initialAuthState, action: AuthActions): AuthState {
    switch (action.type) {
        case AuthActionTypes.Login: {
            return {
                loggedIn: true,
                user: undefined,
                isUserLoaded: false
            };
        }

        case AuthActionTypes.Logout:
            return initialAuthState;

        case AuthActionTypes.UserLoaded: {
            const _user: AccountInfo = action.payload.user;
            return {
                ...state,
                user: _user,
                isUserLoaded: true
            };
        }

        default:
            return state;
    }
}
