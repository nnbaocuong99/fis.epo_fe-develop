import { Component, OnInit } from "@angular/core";
import * as config from "./organization.config";
import { BaseListComponent } from "../../../../../core/_base/component/base-list.component";
import { OrganizationService } from "../../../../../services/modules/category/organization-management/organization/organization.service";
import { OrganizationRequestPayload } from "../../../../../services/modules/category/organization-management/organization/organization.request.payload";
import * as mainConfig from "../../../../../core/_config/main.config";

@Component({
	selector: "app-organization",
	templateUrl: "./organization.component.html",
	styleUrls: ["./organization.component.scss"],
})
export class OrganizationComponent extends BaseListComponent implements OnInit {
	constructor(public organizationService: OrganizationService) {
		super();
	}

	ngOnInit() {
		this.pageSizeDefault = 10;
		this.mainConfig = mainConfig.MAIN_CONFIG;
		this.baseService = this.organizationService;
		this.headers = config.HEADER;
		this.request = new OrganizationRequestPayload();
		super.ngOnInit();
	}
}
