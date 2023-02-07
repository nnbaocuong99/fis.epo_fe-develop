import { Component, OnInit } from "@angular/core";
import * as config from "./operating-unit.config";
import { OperatingUnitService } from "../../../../../services/modules/category/organization-management/operating-unit/operating-unit.service";
import { BaseListComponent } from "../../../../../core/_base/component/base-list.component";
import { OperationRequestPayload } from "../../../../../services/modules/operation/operation-request.payload";
import * as mainConfig from "../../../../../core/_config/main.config";

@Component({
	selector: "app-operating-unit",
	templateUrl: "./operating-unit.component.html",
	styleUrls: ["./operating-unit.component.scss"],
})
export class OperatingUnitComponent
	extends BaseListComponent
	implements OnInit {
	constructor(public operatingUnitService: OperatingUnitService) {
		super();
	}

	ngOnInit() {
		this.pageSizeDefault = 10;
		this.mainConfig = mainConfig.MAIN_CONFIG;
		this.baseService = this.operatingUnitService;
		this.headers = config.HEADER;
		this.request = new OperationRequestPayload();
		super.ngOnInit();
	}
}
