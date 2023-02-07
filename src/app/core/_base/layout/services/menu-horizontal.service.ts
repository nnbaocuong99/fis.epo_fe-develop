// Angular
import { Injectable } from '@angular/core';
// RxJS
import { BehaviorSubject } from 'rxjs';
// Object path
import * as objectPath from 'object-path';
// Services
import { MenuConfigService } from './menu-config.service';
import { OperationService } from '../../../../services/modules/operation/operation.service';

@Injectable()
export class MenuHorizontalService {
    // Public properties
    menuList$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

    /**
     * Service constructor
     *
     * @param menuConfigService: MenuConfigService
     */
    constructor(
        private menuConfigService: MenuConfigService,
        private operationService: OperationService) {
        const arrPathName = window.location.pathname.split('/');
        // nếu là site apps thì không load menu vì cần token của người đăng nhập thuộc fpt
        if (arrPathName.some(m => m === 'apps')) {
            this.loadMenu();
        }
    }

    /**
     * Load menu list
     */
    loadMenu() {
        // get menu list
        // const menuItems: any[] = objectPath.get(this.menuConfigService.getMenus(), 'header.items');
        // this.menuList$.next(menuItems);
        this.operationService.getMenuByUser().subscribe(res => {
            if (res) {
                this.menuList$.next(res);
            }
        });
    }
}
