import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import * as config from './supplier.config';
import * as configPO from '../../../pages/management/purchase-order/purchase-order.config';
import * as mainConfig from '../../../../core/_config/main.config';
import { BaseListComponent } from '../../../../core/_base/component/base-list.component';
import { SupplierService } from '../../../../services/modules/category/supplier/supplier.service';
import { SupplierRequestPayload } from '../../../../services/modules/category/supplier/supplier.request.payload';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { PurchaseOrderRequestPayload } from '../../../../services/modules/purchase-order/purchase-order.request-payload';
import { PurchaseOrderService } from '../../../../services/modules/purchase-order/purchase-order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarModel } from '../../../partials/content/toolbar/toolbar.model';
import { DeleteConfirmation } from '../../../../services/common/confirmation/delete-confirmation';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { MenuItem } from 'primeng/api';
import { CustomConfirmation } from '../../../../services/common/confirmation';
import { DialogUploadFileComponent } from '../../../partials/control/upload-file/upload-file.component';
import { DownloadFileTemplateComponent } from '../../../partials/control/download-file/download-file.component';
import { DialogRef } from '../../../partials/content/crud/dialog/dialog-ref.model';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent extends BaseListComponent implements OnInit {
  @ViewChild(DialogUploadFileComponent, { static: false }) private importFile: DialogUploadFileComponent;
  @ViewChild('downloadFileTemplateComponent', { static: false }) downloadFileTemplateComponent: DownloadFileTemplateComponent;

  public btnItems: MenuItem[] = [
    { label: 'Xem', icon: 'pi pi-fw pi-search', command: () => this.onBtnViewClick(this.selectedNode.data.id) },
    { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: () => this.onBtnEditClick(this.selectedNode.data.id) },
    { label: 'Xóa', icon: 'pi pi-fw pi-times', command: () => this.onBtnDeleteClick(this.selectedNode.data.id) }
  ];
  selectedNode: any;

  public headerSupplier = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '150px', title: 'SUPPLIER.CODE', field: 'code' },
    { width: '250px', title: 'SUPPLIER.NAME', field: 'name' },
    { width: '150px', title: 'SUPPLIER.TAX_CODE', field: 'taxCode' }
  ];

  public activeIdTab: any;
  public toolbarModel: ToolbarModel;
  public headersPo = config.HEADER_PO;
  public areaTypes = config.AREA_TYPE;
  public tabs = config.TABS;
  public arrType = config.TYPE;
  public arrStatus = config.STATUS;
  public arrCommissionPolicy = config.COMMISSION_POLICY;
  public arrHeaderSales = config.HEADER_SALES;
  public productTypes = configPO.PRODUCT_TYPES;
  public poStatus = configPO.PO_STATUS;
  public exportDialogRef = new DialogRef();
  public exportRequest = new SupplierRequestPayload();
  public requestExportInList: any = {};
  public isShowExport = false;

  constructor(
    public supplierService: SupplierService,
    public purchaseOrderService: PurchaseOrderService,
    public notification: NotificationService,
    private cdr: ChangeDetectorRef,
    public router: Router,
    public route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    this.pageSizeDefault = 10;
    this.baseService = this.supplierService;
    this.headers = config.HEADER;
    this.mainConfig = mainConfig.MAIN_CONFIG;
    this.request = new SupplierRequestPayload();

    this.configToolbar();
    this.onFragmentChanged();
    super.ngOnInit();
  }

  public setFragmentToRoute(event: any): void {
    this.router.navigate([], {
      queryParams: {
        createdSource: event.nextId
      }
    });
  }

  private onFragmentChanged(): void {
    this.route.queryParams.subscribe(params => {
      if (!params.createdSource) {
        this.activeIdTab = 'all';
        this.request.createdSource = 'all';
      } else {
        this.activeIdTab = params.createdSource;
        this.request.createdSource = params.createdSource;
      }
      this.initData();
    });
  }

  private configToolbar(): void {
    this.toolbarModel = new ToolbarModel();
    this.toolbarModel.add.routerLink = ['add'];
    // this.toolbarModel.option.export.click = () => this.exportFileDataClick();
    this.toolbarModel.option.export.click = () => this.exportSupplierInfo();
    this.toolbarModel.option.import.click = () => this.importFileDataClick();
    this.toolbarModel.option.customize.title = 'Download Template';
    this.toolbarModel.option.customize.icons = 'kt-nav__link-icon fal fa-cloud-download';
    this.toolbarModel.option.customize.click = () => this.downloadTemplateFile();
    this.toolbarModel.option.add.show = false;
    this.toolbarModel.option.save.show = false;
    this.toolbarModel.option.update.show = false;

  }

  public exportFileDataClick(): void {
    // Show dialog
    this.exportDialogRef.isDisplay = true;
  }

  public exportSupplierInfo(): void {
    this.exportRequest = this.request;
    this.supplierService.exportAll(this.exportRequest).subscribe(() => {
      this.notification.showMessage('Export complete');
    });
  }

  public downloadTemplateFile(): void {
    this.downloadFileTemplateComponent.showDownloadFile();
  }

  public importFileDataClick(): void {
    this.importFile.open();
    // alert('Tính năng đang được update');
  }

  public onBtnUploadClick(): void {
    const confirm = new CustomConfirmation('BRAND.WARNING_IMPORT_ITEM_LIST');
    confirm.accept = () => {
      const files = this.importFile.tableFile.map((x) => x.file);
      this.supplierService
        .import(files, this.request)
        .subscribe(
          (res) => {
            this.importFile.close();
            this.ngOnInit();
            this.notification.showSuccess();
            // this.cdr.detectChanges();
          }
        );
    };
    this.notification.confirm(confirm);
  }

  public initData(): void {
    if (this.paginator) {
      this.request.pageIndex = this.paginator.pageIndex;
      this.request.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
    }
    const purchaseRequestSub = forkJoin([
      this.supplierService.selectAndCountPO(this.request),
      this.supplierService.countAndCountPO(this.request)
    ]).subscribe(res => {
      this.dataSource.items = [];
      this.dataSource.paginatorTotal = res[1];

      if (res[0] && res[0].length > 0) {
        res[0].forEach((element, index) => {
          const node = {
            data: {
              ...element,
              indexNo: this.request.pageIndex * this.request.pageSize + index + 1,
            },
            leaf: element.countPo > 0 ? false : true,
          };
          this.dataSource.items.push(node);
        });
      }

      this.dataSource.items = [...this.dataSource.items];
      this.cdr.detectChanges();
    });
    this.subscriptions.push(purchaseRequestSub);
  }

  public onSearch(): void {
    this.initData();
  }

  public onBtnResetSearchClick() {
    this.request = new SupplierRequestPayload();
    this.initData();
  }

  public onNodeExpand(event: any): void {
    this.getDataPaging(event);
  }

  public onNodeCollapse(event: any): void {
    const node = event.node;
    // TODO

  }

  public onItemPagingChange(event: any, rowNode: any, rowData: any) {
    rowData.pageIndex = event.pageIndex;
    this.getDataPaging(rowNode, event.pageIndex, event.pageSize);
  }

  public getDataPaging(event: any, pageIndex?: number, pageSize?: number): void {
    let node = null;

    if (!pageIndex && !pageSize) {
      node = event.node;
    } else {
      node = event.parent;
    }

    const request = new PurchaseOrderRequestPayload();
    request.vendorId = node.data.vendorId;

    if (!pageIndex && !pageSize) {
      request.pageIndex = 0;
      request.pageSize = 10;
    } else {
      request.pageIndex = pageIndex;
      request.pageSize = pageSize;
    }

    // Call api lay du lieu
    const purchaseRequestItemSub = this.purchaseOrderService.select(request).subscribe(res => {

      if (!pageIndex && !pageSize) {
        node.children = [];
      } else {
        node.children = node.children.filter(m => m.data.isPagingRow);
      }

      for (let i = 0; i < res.length; i++) {
        const nodeChild = {
          data: {
            ...res[i],
            indexNo: (pageIndex && pageSize) ? pageIndex * pageSize + i + 1 : i + 1,
          }
        };
        // node.children.push(nodeChild);
        node.children.splice(i, 0, nodeChild);
      }

      // Add header row
      const nodeHeader = {
        data: { isHeaderRow: true }
      };
      node.children.splice(0, 0, nodeHeader);

      // Add paging row
      if (!pageIndex && !pageSize) {
        const nodePaging = {
          data: { isPagingRow: true }
        };
        node.children.push(nodePaging);
      }
      this.dataSource.items = [...this.dataSource.items];
      this.cdr.detectChanges();
    });
    this.subscriptions.push(purchaseRequestItemSub);
  }

  public onBtnEditClick(id: string): void {
    this.router.navigate([`edit/${id}`], { relativeTo: this.route });
  }

  public onBtnViewClick(id: string): void {
    this.router.navigate([`view/${id}`], { relativeTo: this.route });
  }

  public onBtnDeleteClick(id: string): void {
    const confirmation = new DeleteConfirmation();
    confirmation.accept = () => {
      this.supplierService.delete(id).subscribe(() => {
        this.initData();
        this.notification.showDeteleSuccess();
      });
    };
    this.notification.confirm(confirmation);
  }

  public onShowContextMenu() {
    this.btnItems[0].visible = true;
    this.btnItems[1].visible = true;
    this.btnItems[2].visible = !this.selectedNode.data.vendorId;
  }

  public exportEvaluate(): void {
    this.supplierService.exportEvaluate(this.requestExportInList).subscribe(m => {
      this.notification.showSuccess();
    });
  }

  public exportList(): void {
    this.supplierService.exportList(this.requestExportInList).subscribe(m => {
      this.notification.showSuccess();
    });
  }

  public onChangeSupplier(): void {
    if (this.requestExportInList.supplierDto) {
      this.requestExportInList.vendorId = this.requestExportInList.supplierDto.vendorId;
    } else {
      this.requestExportInList.vendorId = null;
    }
  }

}
