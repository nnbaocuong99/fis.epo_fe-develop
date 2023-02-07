import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { DialogRef } from '../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from '../import-goods.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { BaseListComponent } from '../../../../../core/_base/component/base-list.component';
import { IgEliminationRequestPayload } from '../../../../../services/modules/ig-elimination/ig-elimination-request-payload';
import { DeleteConfirmation } from '../../../../../services/common/confirmation/delete-confirmation';
import {
  ImportGoodsEliminationShipmentEditComponent
} from './import-goods-elimination-shipment-edit/import-goods-elimination-shipment-edit.component';
import {
  ImportGoodsEliminationShipmentAddComponent
} from './import-goods-elimination-shipment-add/import-goods-elimination-shipment-add.component';
import { ShipmentService } from '../../../../../services/modules/shipment/shipment.service';
import { UpdateCostService } from '../../../../../services/modules/update-cost/update-cost.service';
import { SyncErpRequestPayload } from '../../../../../services/modules/sync-erp/sync-erp.request-payload';
import { forkJoin } from 'rxjs';
import { SyncErpService } from '../../../../../services/modules/sync-erp/sync-erp.service';
import { CustomConfirmation } from '../../../../../services/common/confirmation/custom-confirmation';

@Component({
  selector: 'app-import-goods-elimination-shipment',
  templateUrl: './import-goods-elimination-shipment.component.html',
  styleUrls: ['./import-goods-elimination-shipment.component.scss']
})
export class ImportGoodsEliminationShipmentComponent extends BaseListComponent implements OnInit {

  // tslint:disable-next-line:max-line-length
  @ViewChild('importGoodsEliminationShipmentAdd', { static: false }) importGoodsEliminationShipmentAdd: ImportGoodsEliminationShipmentAddComponent;
  // tslint:disable-next-line:max-line-length
  @ViewChild('importGoodsEliminationShipmentEdit', { static: false }) importGoodsEliminationShipmentEdit: ImportGoodsEliminationShipmentEditComponent;

  @Input() itemList: any;

  public dialogRefAdd: DialogRef = new DialogRef();
  public dialogRefEdit: DialogRef = new DialogRef();

  public elimTypeLabel = config.ELIM_TYPE_LABEL;
  public id: string;
  public checkAllowUpdateCost = false;
  public labelSyncStatus = config.ELIM_SYNC_STATUS;

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private notification: NotificationService,
    private updateCostService: UpdateCostService,
    private shipmentService: ShipmentService,
    private syncErpService: SyncErpService) {
    super();
  }

  ngOnInit() {
    this.baseService = this.updateCostService;
    this.headers = config.HEADER_ALLOCATION_SHIPMENT;
    this.mainConfig = mainConfig.MAIN_CONFIG;
    this.request = new IgEliminationRequestPayload();
    this.formTitle = 'Phân bổ chi phí';

    const routeSub = this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.id = params.id;
        this.request.shipmentId = params.id;
        this.init();
      }
    });
    this.subscriptions.push(routeSub);
  }

  init(): void {
    const requestSyncErp = new SyncErpRequestPayload();
    requestSyncErp.shipmentId = this.id;
    const initSub = forkJoin([
      this.syncErpService.checkAllowUpdateCost(requestSyncErp)
    ]).subscribe(res => {
      this.checkAllowUpdateCost = res[0];
      super.ngOnInit();
    });
    this.subscriptions.push(initSub);
  }

  public onBtnAddClick(): void {
    if (!this.checkAllowUpdateCost) {
      this.notification.showWarning('Hiện tại chưa thế thực hiện phân bổ');
      return;
    }

    const requestUpdateCost = new IgEliminationRequestPayload();
    requestUpdateCost.shipmentId = this.id;
    this.updateCostService.checkAllowAdd(requestUpdateCost).subscribe(checkAllowAdd => {
      if (!checkAllowAdd) {
        this.notification.showWarning('Một số bản ghi chưa được đồng bộ');
      } else {
        const params = {
          shipmentId: this.id,
          rowData: {}
        };
        this.dialogRefAdd.input = params;
        this.importGoodsEliminationShipmentAdd.ngOnInit();
        this.dialogRefAdd.show();
        this.cdr.detectChanges();
      }
    });
  }

  public onBtnEditClick(rowData: any) {
    this.dialogRefEdit.input.rowData = rowData;
    this.importGoodsEliminationShipmentEdit.ngOnInit();
    this.dialogRefEdit.show();
    this.cdr.detectChanges();
  }

  public onBtnDeleteClick(rowData: any) {
    const confirmation = new DeleteConfirmation();
    confirmation.accept = () => {
      this.updateCostService.delete(rowData.id).subscribe(() => {
        this.notification.showDeteleSuccess();
        this.init();
      });
    };
    this.notification.confirm(confirmation);
  }

  public onSuccess(data: any): any {
    this.init();
  }

  public returnUpdateCost(rowData) {
    const confirmation = new CustomConfirmation('SYNC_ERP.CONFIRM_RETURN_MESSAGE');
    confirmation.accept = () => {
      const request: any = {
        updateCostId: rowData.id
      };
      this.syncErpService.returnUpdateCost(request).subscribe(m => {
        if (m) {
          this.init();
          this.cd.detectChanges();
        }
      });
    };
    this.notification.confirm(confirmation);
  }

  public viewLogUpdateCost(rowData) {
    const request: any = {
      updateCostId: rowData.id
    };
    this.syncErpService.viewLogUpdateCost(request).subscribe(m => {
      console.log(m);
    });
  }

}
