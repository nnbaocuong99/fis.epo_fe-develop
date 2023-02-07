import { Component, OnInit } from "@angular/core";
import * as config from "./sub-iventory.config";
import { BaseListComponent } from "../../../../../core/_base/component/base-list.component";
import { SubIventoryService } from "../../../../../services/modules/category/organization-management/sub-inventory/sub-iventory.service";
import { SubIventoryRequestPayload } from "../../../../../services/modules/category/organization-management/sub-inventory/sub-iventory.request.payload";
import * as mainConfig from "../../../../../core/_config/main.config";

@Component({
	selector: "app-sub-inventory",
	templateUrl: "./sub-inventory.component.html",
	styleUrls: ["./sub-inventory.component.scss"],
})
export class SubInventoryComponent extends BaseListComponent implements OnInit {
	constructor(public subIventoryService: SubIventoryService) {
		super();
	}

	ngOnInit() {
		this.pageSizeDefault = 10;
		this.mainConfig = mainConfig.MAIN_CONFIG;
		this.baseService = this.subIventoryService;
		this.headers = config.HEADER;
		this.request = new SubIventoryRequestPayload();
		super.ngOnInit();
	}
}
