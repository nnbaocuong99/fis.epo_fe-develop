import { Component, OnInit } from '@angular/core';
import { BaseListComponent } from '../../../../../core/_base/component/base-list.component';
import {
  ImportGoodsRequestPayload as Request,
  ImportGoodsService as Service
} from '../../../../../services/modules/import-goods';
import { ToolbarModel } from '../../../../partials/content/toolbar/toolbar.model';
import * as config from '../import-goods.config';

@Component({
  selector: 'app-import-sync-status',
  templateUrl: './import-sync-status.component.html',
  styleUrls: ['./import-sync-status.component.scss']
})
export class ImportSyncStatusComponent extends BaseListComponent implements OnInit {
  public formTitle = 'IMPORT_GOODS.SYNC_STATUS_TITLE';
  public toolbarModel = new ToolbarModel();
  public headers = config.COL_SYNC_STATUS;
  public importStatus = config.STATUS_IMPORT_GOODS;
  public importStatusFilter = config.STATUS_IMPORT_GOODS.filter(x => !this.isArray(x.value));
  public elimStatus = config.STATUS_ELIMINATION;
  public importTypes = config.IMPORT_TYPE;

  constructor(
    public importGoodsService: Service) {
    super();
  }

  ngOnInit() {
    this.setDefaultConfig();
    this.getData();
    this.pagingData();
  }

  public getData(): void {
    this.initData();
  }

  private setDefaultConfig(): void {
    this.baseService = this.importGoodsService;
    this.request = new Request();
    this.fnSelectName = 'getListSyncElimStatus';
    this.fnCountName = 'countListSyncElimStatus';
    this.configToolbar();
  }

  public isArray(obj: any): boolean {
    return Array.isArray(obj);
  }

  private configToolbar(): void {
    this.toolbarModel.option.disabled = true;
    this.toolbarModel.add.disabled = true;
  }

}
