import { Component, OnInit } from '@angular/core';
import * as config from './project.config';
import * as mainConfig from '../../../../core/_config/main.config';
import { BaseListComponent } from '../../../../core/_base/component/base-list.component';
import { ProjectService } from '../../../../services/modules/category/project/project.service';
import { ProjectRequestPayload } from '../../../../services/modules/category/project/project.request.payload';

@Component({
	selector: 'app-project',
	templateUrl: './project.component.html',
	styleUrls: ['./project.component.scss'],
})
export class ProjectComponent extends BaseListComponent implements OnInit {
	constructor(public projectService: ProjectService) {
		super();
	}

	ngOnInit() {
		this.pageSizeDefault = 10;
		this.baseService = this.projectService;
		this.headers = config.HEADER;
		this.mainConfig = mainConfig.MAIN_CONFIG;
		this.request = new ProjectRequestPayload();
		this.formTitle = 'PROJECT.HEADER_LIST';
		super.ngOnInit();
	}
}
