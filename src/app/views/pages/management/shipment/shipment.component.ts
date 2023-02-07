import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BaseListComponent } from '../../../../core/_base/component/base-list.component';
import { ShipmentService } from '../../../../services/modules/shipment/shipment.service';
import { ShipmentRequestPayload } from '../../../../services/modules/shipment/shipment.request-payload';
import * as config from './shipment.config';
import * as mainConfig from '../../../../core/_config/main.config';
import { ToolbarModel } from '../../../partials/content/toolbar/toolbar.model';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogRef } from '../../../partials/content/crud/dialog/dialog-ref.model';
import { DeleteConfirmation } from '../../../../services/common/confirmation/delete-confirmation';
import { MenuItem } from 'primeng/api';
import { DepartmentService } from '../../../../services/modules/category/department/department.service';
import { UserService } from '../../../../services/modules/user/user.service';
import { ReceiptService } from '../../../../services/modules/receipt/receipt.service';
import { BaseComponent } from '../../../../core/_base/component/base-component';
import { MatPaginator } from '@angular/material';
import { forkJoin, merge } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';

@Component({
  selector: 'app-shipment',
  templateUrl: './shipment.component.html',
  styleUrls: ['./shipment.component.scss']
})
export class ShipmentComponent extends BaseComponent implements OnInit {
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('formFilter', { static: true }) formFilter: NgForm;
  @ViewChild('form', { static: true }) form: NgForm;

  btnItems: MenuItem[] = [
    { label: 'Xem', icon: 'pi pi-fw pi-search', command: () => this.onBtnViewDialog(this.selectedRowData) },
    { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: () => this.onBtnEditClick(this.selectedRowData.id) },
    { label: 'Xóa', icon: 'pi pi-fw pi-times', command: () => this.onBtnDeleteClick(this.selectedRowData) }
  ];

  public selectedRowData: any;
  public dialogRef: DialogRef = new DialogRef();
  public toolbarModel: ToolbarModel;
  public profileStatus = config.PROFILE_STATUS;
  public shipmentStatus = config.SHIPMENT_STATUS;
  public importForms = config.IMPORT_FORM;
  public complaintTypes = config.IMPORT_FORM;
  public processingStatus = config.IMPORT_FORM;
  public syncErp = config.SYNC_ERP;
  public elimStatus = config.ELIM_STATUS;
  public isShowFilterShipment = true;
  public isShowFilterMerchandiseService = false;
  public isShowDialog = false;
  public frozenCols: any[];

  public headers = [];
  public mainConfig: any;
  public request: any = {};
  public dataSource = {
    items: null,
    paginatorTotal: undefined
  };

  constructor(
    public shipmentService: ShipmentService,
    public departmentService: DepartmentService,
    public userService: UserService,
    public receiptService: ReceiptService,
    public noticeService: NotificationService,
    public cdr: ChangeDetectorRef,
    public router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    // Xử lý frozenCols table
    const temp = JSON.stringify(config.HEADER);
    this.headers = JSON.parse(temp);
    this.frozenCols = this.headers.slice(0, 2);
    this.headers.splice(0, 2);

    this.request = new ShipmentRequestPayload();
    this.mainConfig = mainConfig.MAIN_CONFIG;
    this.configToolbar();
    if (window.history.state.purchaseRequestData) {
      this.request.prId = window.history.state.purchaseRequestData.id;
    }
    if (window.history.state.purchaseOrderData) {
      this.request.poId = window.history.state.purchaseOrderData.id;
    }
    if (window.history.state.purchaseInvoiceData) {
      this.request.piId = window.history.state.purchaseInvoiceData.id;
    }
    this.initData();
    this.pagingData();
  }

  public initData(): void {
    if (this.paginator) {
      this.request.pageIndex = this.paginator.pageIndex;
      this.request.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 5;
    }
    const requests = [
      this.shipmentService.selectPost(this.request),
      this.shipmentService.countPost(this.request)
    ];
    const sub = forkJoin(requests).subscribe(
      (response: any[]) => {
        this.dataSource.items = response[0];
        this.dataSource.paginatorTotal = response[1];
        this.cdr.detectChanges();
      });
    this.subscriptions.push(sub);
  }

  public pagingData(): void {
    if (this.paginator) {
      const paginatorSubscriptions = merge(this.paginator.page).pipe(
        tap(() => {
          this.initData();
        })
      ).subscribe();
      this.subscriptions.push(paginatorSubscriptions);
    }
  }

  private configToolbar(): void {
    this.toolbarModel = new ToolbarModel();
    this.toolbarModel.add.routerLink = ['add'];
    this.toolbarModel.option.show = false;
  }

  public onSearch(): void {
    this.initData();
  }

  public onReset(): void {
    this.request = new ShipmentRequestPayload();
    this.initData();
  }

  public changeShowFilterShipment() {
    this.isShowFilterShipment = !this.isShowFilterShipment;
  }

  public changeShowFilterMerchandiseService() {
    this.isShowFilterMerchandiseService = !this.isShowFilterMerchandiseService;
  }

  public onBtnViewDialog(rowData: any): void {
    this.router.navigate([`view/${rowData.id}`], { relativeTo: this.route });
  }

  public onBtnEditClick(id: string): void {
    this.router.navigate([`edit/${id}`], { relativeTo: this.route });
  }

  public onBtnDeleteClick(id: string): void {
    const confirmation = new DeleteConfirmation();
    confirmation.accept = () => {
      this.shipmentService.delete(id).subscribe(() => {
        this.initData();
        this.noticeService.showDeteleSuccess();
      });
    };
    this.noticeService.confirm(confirmation);
  }

  public onShowContextMenu() {
    this.btnItems[2].visible = !this.selectedRowData.syncStatus || this.selectedRowData.syncStatus < 2;
  }
}
