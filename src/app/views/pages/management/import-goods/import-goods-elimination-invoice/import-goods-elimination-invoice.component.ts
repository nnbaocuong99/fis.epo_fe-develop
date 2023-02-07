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
  ImportGoodsEliminationInvoiceEditComponent
} from './import-goods-elimination-invoice-edit/import-goods-elimination-invoice-edit.component';
import {
  ImportGoodsEliminationInvoiceAddComponent
} from './import-goods-elimination-invoice-add/import-goods-elimination-invoice-add.component';
import { ShipmentService } from '../../../../../services/modules/shipment/shipment.service';
import { UpdateCostService } from '../../../../../services/modules/update-cost/update-cost.service';
import { SyncErpRequestPayload } from '../../../../../services/modules/sync-erp/sync-erp.request-payload';
import { forkJoin } from 'rxjs';
import { SyncErpService } from '../../../../../services/modules/sync-erp/sync-erp.service';
import { CustomConfirmation } from '../../../../../services/common/confirmation/custom-confirmation';

@Component({
  selector: 'app-import-goods-elimination-invoice',
  templateUrl: './import-goods-elimination-invoice.component.html',
  styleUrls: ['./import-goods-elimination-invoice.component.scss']
})
export class ImportGoodsEliminationInvoiceComponent extends BaseListComponent implements OnInit {
  // tslint:disable-next-line:max-line-length
  @ViewChild('importGoodsEliminationInvoiceAdd', { static: false }) importGoodsEliminationInvoiceAdd: ImportGoodsEliminationInvoiceAddComponent;
  // tslint:disable-next-line:max-line-length
  @ViewChild('importGoodsEliminationInvoiceEdit', { static: false }) importGoodsEliminationInvoiceEdit: ImportGoodsEliminationInvoiceEditComponent;

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
        this.request.piId = params.id;
        this.init();
      }
    });
    this.subscriptions.push(routeSub);
  }

  init(): void {
    const requestSyncErp = new SyncErpRequestPayload();
    requestSyncErp.piId = this.id;

    const initSub = forkJoin([
      this.syncErpService.checkAllowUpdateCost(requestSyncErp),
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
    requestUpdateCost.piId = this.id;
    this.updateCostService.checkAllowAdd(requestUpdateCost).subscribe(checkAllowAdd => {
      if (!checkAllowAdd) {
        this.notification.showWarning('Một số bản ghi chưa được đồng bộ');
      } else {
        const params = {
          piId: this.id,
          rowData: {}
        };
        this.dialogRefAdd.input = params;
        this.importGoodsEliminationInvoiceAdd.ngOnInit();
        this.dialogRefAdd.show();
        this.cdr.detectChanges();
      }
    });
  }

  public onBtnEditClick(rowData: any) {
    this.dialogRefEdit.input.rowData = rowData;
    this.importGoodsEliminationInvoiceEdit.ngOnInit();
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
