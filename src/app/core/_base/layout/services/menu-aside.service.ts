// Angular
import { Injectable } from '@angular/core';
// RxJS
import { BehaviorSubject } from 'rxjs';
// Object path
import * as objectPath from 'object-path';
// Services
import { MenuConfigService } from './menu-config.service';
// import { OperationService } from 'src/app/services/modules/operation/operation.service';
import { OperationService } from '../../../../services/modules/operation/operation.service';

@Injectable()
export class MenuAsideService {
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
		this.loadMenu();
	}

	/**
	 * Load menu list
	 */
	loadMenu() {
		// get menu list
		// const menuItems: any[] = objectPath.get(this.menuConfigService.getMenus(), 'aside.items');
		// this.menuList$.next(menuItems);
		this.operationService.getMenuByUser().subscribe(res => {
			this.menuList$.next(res);
		});
	}
}
