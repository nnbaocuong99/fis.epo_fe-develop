import { AccountInfo } from './account-info.model';

export class Account {
    isAuthenticated: boolean;
    canAccess: boolean;
    user: AccountInfo;
    redirect: string;
    newIdToken: string;
}
