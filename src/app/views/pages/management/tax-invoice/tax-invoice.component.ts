import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseListComponent } from '../../../../core/_base/component/base-list.component';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { ToolbarModel } from '../../../partials/content/toolbar/toolbar.model';
import * as mainConfig from '../../../../core/_config/main.config';
import * as config from './tax-invoice.config';
import { TaxInvoiceService } from '../../../../services/modules/tax-invoice/tax-invoice.service';
import { TaxInvoiceRequestPayload } from '../../../../services/modules/tax-invoice/tax-invoice.request-payload';
import { SupplierService } from '../../../../services/modules/category/supplier/supplier.service';
import { PurchaseOrderRequestPayload } from '../../../../services/modules/purchase-order/purchase-order.request-payload';
import { PurchaseOrderService } from '../../../../services/modules/purchase-order/purchase-order.service';
import { CustomConfirmation, DeleteConfirmation } from '../../../../services/common/confirmation';
import { DownloadFileTemplateComponent } from '../../../partials/control/download-file/download-file.component';
import { DialogUploadFileComponent } from '../../../partials/control/upload-file/upload-file.component';
import { DialogRef } from '../../../partials/content/crud/dialog/dialog-ref.model';
import { MenuItem } from 'primeng/api';
import { UserService } from '../../../../services/modules/user/user.service';

@Component({
  selector: 'app-tax-invoice',
  templateUrl: './tax-invoice.component.html',
  styleUrls: ['./tax-invoice.component.scss']
})
export class TaxInvoiceComponent extends BaseListComponent implements OnInit {
  selectedRowData: any = {};
  btnItems: MenuItem[] = [
    { label: 'Xem', icon: 'pi pi-fw pi-search', command: () => this.onBtnViewDialog(this.selectedRowData) },
    { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: () => this.onBtnEditClick(this.selectedRowData.id) },
    { label: 'Xóa', icon: 'pi pi-fw pi-times', command: () => this.onBtnDeleteClick(this.selectedRowData.id) },
    { label: 'Sao chép', icon: 'pi pi-copy', command: () => this.onBtnCloneClick(this.selectedRowData) }
  ];

  @ViewChild('form', { static: true }) form: NgForm;
  @ViewChild('downloadFileTemplateComponent', { static: false }) downloadFileTemplateComponent: DownloadFileTemplateComponent;
  @ViewChild(DialogUploadFileComponent, { static: false }) private importFile: DialogUploadFileComponent;
  public dialogRef: DialogRef = new DialogRef();
  public purchaseOrderRequestPayload = new PurchaseOrderRequestPayload();
  public dialogRefMatch: DialogRef = new DialogRef();
  public statusTaxInvoice = config.STATUS_TAX_INVOICE;
  public headerTable = config.HEADER_TAX_INVOICE;
  public toolbarModel: ToolbarModel;
  public listTemplateFile: any;
  public currentTaxInvoiceSelect: any = {};
  public currentTaxInvoiceIdSelect: any = '';
  public isShowMatchItem = false;
  public createdByNameDto: any;

  constructor(
    public taxInvoiceService: TaxInvoiceService,
    public supplierService: SupplierService,
    public purchaseOrderService: PurchaseOrderService,
    public activatedRoute: ActivatedRoute,
    public noticeService: NotificationService,
    public userService: UserService,
    public cdr: ChangeDetectorRef,
    public router: Router,
  ) {
    super();
  }

  ngOnInit() {
    this.baseService = this.taxInvoiceService;
    this.request = new TaxInvoiceRequestPayload();
    this.request.type = 'pagination';
    this.mainConfig = mainConfig.MAIN_CONFIG;
    super.ngOnInit();
    this.configToolbar();
  }

  private configToolbar(): void {
    this.toolbarModel = new ToolbarModel();
    this.toolbarModel.add.routerLink = [`add`];
    this.toolbarModel.option.export.click = () => this.exportAllDataClick();
    this.toolbarModel.option.import.click = () => this.importFileDataClick();
    this.toolbarModel.option.customize.title = 'Download Template';
    this.toolbarModel.option.customize.icons = 'kt-nav__link-icon fal fa-cloud-download';
    this.toolbarModel.option.customize.click = () => this.downloadTemplateFile();
    this.toolbarModel.option.add.show = false;
    this.toolbarModel.option.save.show = false;
    this.toolbarModel.option.update.show = false;
  }

  public downloadTemplateFile(): void {
    this.downloadFileTemplateComponent.showDownloadFile();
  }

  public exportAllDataClick(): void {
    this.taxInvoiceService.exportAll(this.request).subscribe(() => {
      this.noticeService.showMessage('Download complete');
    });
  }

  public importFileDataClick(): void {
    this.importFile.open();
  }

  public onBtnUploadClick(): void {
    const confirm = new CustomConfirmation('TAX_INVOICE.WARNING_IMPORT_ITEM');
    confirm.accept = () => {
      const files = this.importFile.tableFile.map((x) => x.file);
      this.taxInvoiceService
        .import(files, this.request)
        .subscribe(
          (res) => {
            this.importFile.close();
            this.ngOnInit();
            this.noticeService.showSuccess();
            this.form.form.markAsDirty();
            this.cdr.detectChanges();
          }
        );
    };
    this.noticeService.confirm(confirm);
  }

  public onBtnSearchClick(): void {
    this.initData();
  }

  public onBtnResetSearchClick(): void {
    this.request = new TaxInvoiceRequestPayload();
    this.request.type = 'pagination';
    this.initData();
  }

  public onChangeSupplier(supplierDto: any): void {
    if (supplierDto) {
      this.request.supplierName = supplierDto.name;
      this.request.vendorId = supplierDto.vendorId;
    } else {
      this.request.supplierName = null;
      this.request.vendorId = null;
    }
  }

  public onBtnViewDialog(rowData: any): void {
    this.dialogRef.input.rowData = rowData;
    this.dialogRef.show();
  }

  public onBtnEditClick(id: string): void {
    this.router.navigate([`edit/${id}`], { relativeTo: this.activatedRoute });
  }

  public onBtnDeleteClick(id: string): void {
    const confirmation = new DeleteConfirmation();
    confirmation.accept = () => {
      this.taxInvoiceService.delete(id).subscribe(() => {
        this.initData();
        this.noticeService.showDeteleSuccess();
      });
    };
    this.noticeService.confirm(confirmation);
  }

  public onBtnCloneClick(rowData: any): void {
    this.router.navigate(['add'], {
      relativeTo: this.activatedRoute,
      state: {
        rowTaxInvoiceClone: rowData
      }
    });
  }

  public onBtnMatchClick(): void {
    if (!this.currentTaxInvoiceSelect || !this.currentTaxInvoiceIdSelect) {
      return this.noticeService.showWarning('Chưa có Tax Invoice nào được chọn!');
    }
    if (this.currentTaxInvoiceSelect && this.currentTaxInvoiceSelect.status === 2) {
      return this.noticeService.showWarning('Tax Invoice đã được map COM!');
    }
    this.isShowMatchItem = false;
    this.cdr.detectChanges();
    this.dialogRefMatch.input.rowData = this.currentTaxInvoiceSelect;
    this.dialogRefMatch.config = {
      style: { width: '92vw' },
      baseZIndex: 10000,
      draggable: true,
      maximizable: true,
      title: 'Match'
    };
    this.isShowMatchItem = true;
    this.dialogRefMatch.show();
  }

  public onClickTaxInvoiceItemClick(element): void {
    this.currentTaxInvoiceSelect = element;
    this.currentTaxInvoiceIdSelect = element.id;
  }

  public onSuccess(): void {
    this.currentTaxInvoiceSelect = null;
    this.currentTaxInvoiceIdSelect = null;
    this.ngOnInit();
  }

  public onShowContextMenu() {
    // Xử lý ẩn hiện nút ở đây

  }
}

