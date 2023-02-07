import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../../../../../core/_base/component/base-form.component';
import { ShipmentService } from '../../../../../services/modules/shipment/shipment.service';
import { FormDynamicData } from '../../../../partials/content/crud/component/form-dynamic-data.model';
import * as config from './shipment-edit.config';
import { DialogUploadFileComponent } from '../../../../partials/control/upload-file/upload-file.component';
import { MatPaginator } from '@angular/material';
import { DialogRef } from '../../../../partials/content/crud/dialog/dialog-ref.model';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { forkJoin } from 'rxjs';
import { ShipmentItemRequestPayload } from '../../../../../services/modules/shipment-item/shipment-item.request-payload';
import { ShipmentItemService } from '../../../../../services/modules/shipment-item/shipment-item.service';
import { ShipmentPackageRequestPayload } from '../../../../../services/modules/shipment-package/shipment-package.request-payload';
import { ShipmentPackageService } from '../../../../../services/modules/shipment-package/shipment-package.service';
import * as mainConfig from '../../../../../core/_config/main.config';
import { SupplierService } from '../../../../../services/modules/category/supplier/supplier.service';
import { CurrencyService } from '../../../../../services/modules/category/currency/currency.service';
import { ReceiptStep1Component } from './receipt-step1/receipt-step1.component';
import { SupplierRequestPayload } from '../../../../../services/modules/category/supplier/supplier.request.payload';
import { UserService } from '../../../../../services/modules/user/user.service';
import { UserRequestPayload } from '../../../../../services/modules/user/user-request.payload';
import { ShipmentRequestPayload, ShipmentRequestSaveDto } from '../../../../../services/modules/shipment/shipment.request-payload';
import { SaveConfirmation } from '../../../../../services/common/confirmation/save-confirmation';
import { ShipmentItemComponent } from './shipment-item/shipment-item.component';
import { PurchaseAttachmentRequestPayload } from '../../../../../services/modules/purchase-attachment/purchase-attachment.request.payload';
import { PurchaseAttachmentService } from '../../../../../services/modules/purchase-attachment/purchase-attachment.service';
import { ShipmentDto } from '../../../../../services/modules/shipment/shipment.model';
import { ReceiptRequestPayload } from '../../../../../services/modules/receipt/receipt.request-payload';
import { ReceiptService } from '../../../../../services/modules/receipt/receipt.service';
import { PurchaseInvoiceService } from '../../../../../services/modules/purchase-invoice/purchase-invoice.service';
import { PurchaseInvoiceItemService } from '../../../../../services/modules/purchase-invoice-item/purchase-invoice-item.service';
import {
  PurchaseInvoiceItemRequestPayload
} from '../../../../../services/modules/purchase-invoice-item/purchase-invoice-item.request-payload';
import { TreeNode } from 'primeng/api';
import { SyncErpService } from '../../../../../services/modules/sync-erp/sync-erp.service';
import { SyncErpRequestPayload } from '../../../../../services/modules/sync-erp/sync-erp.request-payload';
import { NotificationListService } from '../../../../../services/modules/notification-list/notification-list.service';
import { ConfigListService } from '../../../../../services/modules/config-list/config-list.service';
import { CustomConfirmation } from '../../../../../services/common/confirmation/custom-confirmation';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { currentUser } from '../../../../../core/auth';
import { ShipmentExportService } from '../../../../../services/modules/shipment-export/shipment-export.service';
import { CustomsBranchService } from '../../../../../services/modules/category/customs-branch/customs-branch.service';
import { FileService } from '../../../../../services/modules/file/file.service';
import { Location } from '@angular/common';
import { AttachDocumentComponent } from '../../../../partials/control/attach-document/attach-document.component';

@Component({
  selector: 'app-shipment-edit',
  templateUrl: './shipment-edit.component.html',
  styleUrls: ['./shipment-edit.component.scss']
})
export class ShipmentEditComponent extends BaseFormComponent implements OnInit {
  @ViewChild('importFile', { static: false }) importFile: DialogUploadFileComponent;
  @ViewChild('attachDocument', { static: false }) attachDocument: AttachDocumentComponent;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('form', { static: true }) form: NgForm;
  @ViewChild('shipmentItem', { static: false }) shipmentItem: ShipmentItemComponent;
  @ViewChild('packageListInfo', { static: false }) packageListInfo: any;
  @ViewChild('dialogReceipt1', { static: false }) dialogReceipt1: ReceiptStep1Component;

  public formData: FormDynamicData = new FormDynamicData();
  public supplierRequestPayload = new SupplierRequestPayload();
  public userRequestPayload = new UserRequestPayload();
  public tabs = config.TABS;
  public tabDetails = config.TAB_DETAILS;
  public profileStatus = config.PROFILE_STATUS;
  public shipmentStatus = config.SHIPMENT_STATUS;
  public statusOrc = config.STATUS_ORC;
  public importForms = config.IMPORT_FORM;
  public mainConfig: any = mainConfig.MAIN_CONFIG;
  public headerSuppliers = config.HEADER_SUPPLIER;
  public headercustomsBranch = config.HEADER_CUSTOMS_BRANCH;
  public storeItems = config.STORE_ITEMS;
  public headerUser = config.HEADER_USER;
  public headersSyncERP = config.HEADER_SYNC_ERP;
  public receiptStep1Data: any = {
    items: [],
    paginatorTotal: null
  };
  public shipmentData: any = {};
  public shipmentItemData: any = {
    items: [],
    paginatorTotal: null
  };
  public shipmentPackageData: any = {
    items: [],
    paginatorTotal: null
  };
  public shipmentItemDataOrigin: any = {
    items: [],
    paginatorTotal: null
  };
  public shipmentPackageDataOrigin: any = {
    items: [],
    paginatorTotal: null
  };
  public currentTab: number;
  public currentchangTab: number;
  public currentShipmentId: string;
  public isShowCopyPo = false;
  public isShowCopyInv = false;
  public isShowAddPo = false;
  public isShowExport = false;
  public hasEditRow = false;
  public acceptSave = true;
  public dialogRefPi: DialogRef = new DialogRef();
  public dialogRefPo: DialogRef = new DialogRef();
  public dialogRefAddPo: DialogRef = new DialogRef();
  public dialogRefReceipt1: DialogRef = new DialogRef();
  public configListDataBillTo: any[] = [];
  public id: string;
  public checkDeliveryRecords = false;
  public checkAllowReceiptB2Shipment = false;
  public copyFromPi = false;
  public isEditWaybillNumber = true;
  public activeIdTabchild = 1;
  // list pi gắn số vận đơn.
  public isShowBtnSave = true;
  public isShowBtnSaveDraft = false;
  public notificationData: any = {};
  public currentUser: any = {};

  public listPpHasFile = [];
  public listPrHasFile = [];
  public listPoHasFile = [];
  public listPiHasFile = [];

  constructor(
    public configListService: ConfigListService,
    public shipmentService: ShipmentService,
    private shipmentItemService: ShipmentItemService,
    public shipmentPackageService: ShipmentPackageService,
    private cdr: ChangeDetectorRef,
    public notificationListService: NotificationListService,
    private router: Router,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    public supplierService: SupplierService,
    public currencyService: CurrencyService,
    private location: Location,
    public purchaseInvoiceService: PurchaseInvoiceService,
    public purchaseInvoiceItemService: PurchaseInvoiceItemService,
    public userService: UserService,
    public receiptService: ReceiptService,
    private purchaseAttachmentService: PurchaseAttachmentService,
    private fileService: FileService,
    private syncErpService: SyncErpService,
    public shipmentExportService: ShipmentExportService,
    public customsBranchService: CustomsBranchService,
    private store: Store<AppState>
  ) {
    super();
    this.formData = {
      formId: 'shipment-edit',
      icon: 'fal fa-file-invoice',
      title: 'SHIPMENT.SHIPMENT_ADD',
      isCancel: true,
      service: this.shipmentService
    };

    this.store.pipe(select(currentUser)).subscribe(obj => {
      if (obj) {
        this.currentUser = obj;
      }
    });
  }

  ngOnInit() {
    this.initData();
  }

  private initData(): void {
    this.copyFromPi = false;
    this.currentTab = this.tabs[0].value;
    this.currentchangTab = this.tabDetails[0].value;
    this.getConfigList();
    const requestShipmentItem = new ShipmentItemRequestPayload();
    const requestShipmentPackage = new ShipmentPackageRequestPayload();
    const receiptStep1Request = new ReceiptRequestPayload();
    const routeSub = this.route.params.subscribe(params => {
      if (params.id) {
        this.id = params.id;
        this.currentShipmentId = params.id;
        this.getShipmentAttachment();
        requestShipmentItem.shipmentId = params.id;
        requestShipmentPackage.shipmentId = params.id;
        receiptStep1Request.shipmentId = params.id;
        const initSub = forkJoin([
          this.shipmentService.selectById(params.id),
          this.shipmentItemService.select(requestShipmentItem),
          this.shipmentItemService.count(requestShipmentItem),
          this.shipmentPackageService.select(requestShipmentPackage),
          this.shipmentPackageService.count(requestShipmentPackage),
          this.receiptService.selectViewData(receiptStep1Request),
          this.receiptService.countViewData(receiptStep1Request)
        ]).subscribe(res => {
          if (!res[0] || !res[0].id) {
            this.router.navigate([`list`], { relativeTo: this.route.parent });
          }
          this.shipmentData = new ShipmentDto(res[0]);
          if (this.shipmentData.smStatus === 9) {
            this.isShowBtnSaveDraft = true;
            this.form.form.markAsDirty();
          }
          const listShipmentItem = res[1].map(x => {
            x.originId = x.id; // giữ lại id cũ
            return x;
          });
          this.shipmentItemData = {
            items: listShipmentItem,
            paginatorTotal: res[2]
          };
          this.shipmentPackageData = {
            items: res[3],
            paginatorTotal: res[4]
          };
          if (res[5]) {
            this.receiptStep1Data = {
              items: res[5],
              paginatorTotal: res[6]
            };
          }
          this.shipmentData.billToTemp = this.shipmentData.billTo ? this.shipmentData.billTo.split(',') : [];
          // binding trường check validate khi tại form sửa thực hiện copy PO/Invoice
          if (this.shipmentData && this.shipmentData.currency) {
            this.shipmentData.checkVaidateCurrency = this.shipmentData.currency;
          }
          if (this.shipmentData && this.shipmentData.smSupplier) {
            this.shipmentData.checkVaidateVendorId = this.shipmentData.smSupplier;
          }
          if (this.shipmentItemData.items.length > 0 && this.shipmentItemData.items.find(x => x.ouCode)) {
            this.shipmentData.checkVaidateOuCode = this.shipmentItemData.items.find(x => x.ouCode).ouCode;
          }
          if (this.shipmentItemData.items.length > 0 && this.shipmentItemData.items.find(x => x.areaType)) {
            this.shipmentData.checkVaidateAreaType = this.shipmentItemData.items.find(x => x.areaType).areaType;
          }
          if (this.shipmentItemData.items.length > 0) {
            this.shipmentData.checkVaidateTaxpayer =
              this.shipmentItemData.items.find(x => x.taxpayer) ? this.shipmentItemData.items.find(x => x.taxpayer).taxpayer : 'undefined';
          }

          this.initDataDto(this.shipmentData);
          this.initShipmentPackageItem();
          this.initShipmentPackageItem();
          this.initObjectHasFile();

          let temp = JSON.stringify(this.shipmentItemData);
          this.shipmentItemDataOrigin = JSON.parse(temp);

          temp = JSON.stringify(this.shipmentPackageData);
          this.shipmentPackageDataOrigin = JSON.parse(temp);

          this.createItemDataTree();

          this.cdr.detectChanges();
          setTimeout(() => {
            this.form.form.markAsPristine();
          }, 200);
        });
        this.subscriptions.push(initSub);
      } else {
        // Default show btn lưu nháp
        this.isShowBtnSaveDraft = true;
        this.currentShipmentId = null;
        this.shipmentData = {};
        // Default trạng thái lô hàng là Hàng đang đi đường
        this.shipmentData.smStatus = 2;
        // Default trang thái hồ sơ là Đang gom hồ sơ
        this.shipmentData.docStatus = 1;
        // Default trang thái hồ sơ là Chưa đồng bộ
        this.shipmentData.syncStatus = 1;
        this.shipmentPackageData.items = [];
        // Default hàng qua kho
        this.shipmentData.isStoring = 0;

        // default là "Mậu dịch thông thường"
        this.shipmentData.importForm = 1;
      }
    });
    this.subscriptions.push(routeSub);
  }

  public getConfigList() {
    const requestBillTo: any = { type: 'BILL_TO' };

    const requests = [
      this.configListService.select(requestBillTo)
    ];
    const sub = forkJoin(requests).subscribe(res => {
      this.configListDataBillTo = res[0].sort(this.sortStringConfigList);
      this.cdr.detectChanges();
    });

    this.subscriptions.push(sub);
  }

  public onLoadData(): void {
    this.initData();
  }

  sortStringConfigList(a, b) {
    const str1 = a.name ? a.name : '';
    const str2 = b.name ? b.name : '';
    if (str1 < str2) { return -1; }
    if (str1 > str2) { return 1; }
    return 0;
  }

  private quote(source: string): string {
    return `.${source}.`;
  }

  createItemDataTree() {
    const itemSourceTemp = this.shipmentItemData.items;
    this.shipmentItemData.items = [];
    const parentItems = itemSourceTemp.filter(x => !x.isSubItem);
    for (const parent of parentItems) {
      const node: TreeNode = {
        data: { ...parent },
        children: [],
        expanded: true,
        leaf: true
      };
      const childItems = itemSourceTemp.filter(x => x.isSubItem && this.quote(x.indexNo).startsWith(this.quote(parent.indexNo)));
      for (const child of childItems) {
        const childNode = {
          data: { ...child },
          leaf: true,
        };
        node.children.push(childNode);
        node.leaf = false;
      }
      this.shipmentItemData.items.push(node);
    }
    this.shipmentItemData.paginatorTotal = this.shipmentItemData.items.length;
    this.shipmentItemData.items = [...this.shipmentItemData.items];
    this.getTotalItem();
  }

  private initShipmentPackageItem(): void {
    if (this.packageListInfo && this.shipmentPackageData.items.length > 0) {
      let itemQuantityTotal = 0;
      let volumeTotal = 0;
      let weightTotal = 0;
      let grossWeightTotal = 0;
      let packageQuantityTotal = 0;
      for (const item of this.shipmentPackageData.items) {
        itemQuantityTotal += +item.itemQuantity;
        volumeTotal += +item.volume;
        weightTotal += +item.weight;
        grossWeightTotal += +item.grossWeight;
        packageQuantityTotal += +item.packageQuantity;
      }
      this.packageListInfo.itemQuantityTotal = itemQuantityTotal;
      this.packageListInfo.volumeTotal = volumeTotal;
      this.packageListInfo.weightTotal = weightTotal;
      this.packageListInfo.grossWeightTotal = grossWeightTotal;
      this.packageListInfo.packageQuantityTotal = packageQuantityTotal;
    }
  }

  private initObjectHasFile() {
    const requestPp: any = { shipmentId: this.shipmentData.id, fileModule: 'PP' };
    const requestPr: any = { shipmentId: this.shipmentData.id, fileModule: 'PR' };
    const requestPo: any = { shipmentId: this.shipmentData.id, fileModule: 'PO' };
    const requestPi: any = { shipmentId: this.shipmentData.id, fileModule: 'PI' };
    const initSub = forkJoin([
      this.fileService.selectObjectHasFileInModule(requestPp),
      this.fileService.selectObjectHasFileInModule(requestPr),
      this.fileService.selectObjectHasFileInModule(requestPo),
      this.fileService.selectObjectHasFileInModule(requestPi),
    ]).subscribe(res => {
      this.listPpHasFile = res[0];
      this.listPrHasFile = res[1];
      this.listPoHasFile = res[2];
      this.listPiHasFile = res[3];
    });
    this.subscriptions.push(initSub);
  }

  private initDataDto(source: any): void {
    this.shipmentData.currencyDto = this.toDto('name', source.currency);
    this.shipmentData.smSupplierNameDto = this.toDto('name', source.smSupplierName);
    this.shipmentData.receivingDeptNameDto = this.toDto('fullName', source.receivingDeptName);
    this.shipmentData.coOriginBorrowerNameDto = this.toDto('fullName', source.coOriginBorrowerName);
    this.shipmentData.coOriginBorrowerDto = this.toDto('name', source.coOriginBorrower);
    this.shipmentData.gateDto = this.toDto('acronym', source.gate);
  }

  public onBtnCancelClick(): void {
    this.location.back();
    // this.redirectToParentPage();
  }

  private redirectToParentPage(): void {
    this.router.navigate([`list`], { relativeTo: this.route.parent });
  }

  public setFragmentToRoute(event: any): void {
    if (event.nextId === 2) {
      this.formData.isCancel = false;
      this.isShowBtnSave = false;
    } else {
      this.formData.isCancel = true;
      this.isShowBtnSave = true;
    }
    if (event.nextId === 2 && !this.currentShipmentId) {
      this.notificationService.showWarning('VALIDATION.SHIPMENT.MSG_012');
    } else {
      this.currentTab = event.nextId;
    }
  }

  public changTabDetail(tabId: number) {
    this.activeIdTabchild = tabId;
    if (this.activeIdTabchild === 2) {
      this.formData.isCancel = false;
      this.isShowBtnSave = false;
    } else {
      this.formData.isCancel = true;
      this.isShowBtnSave = true;
    }
  }

  public onBtnCopyPoClick(): void {
    this.isShowCopyPo = false;
    this.cdr.detectChanges();
    this.isShowCopyPo = true;
    this.dialogRefPo.config = {
      style: { width: '92vw' },
      baseZIndex: 10000,
      draggable: true,
      maximizable: true,
      title: 'Danh sách đơn hàng',
      btnTitle: 'Copy'
    };
    // this.dialogRefPo.input.id = this.id;
    this.dialogRefPo.input.isShowDelete = false;
    this.dialogRefPo.show();
  }

  public onBtnCopyPiClick(): void {
    this.isShowCopyInv = false;
    this.cdr.detectChanges();
    this.isShowCopyInv = true;
    this.dialogRefPi.config = {
      style: { width: '92vw' },
      baseZIndex: 10000,
      draggable: true,
      maximizable: true,
      title: 'Danh sách hoá đơn',
      btnTitle: 'Copy'
    };
    this.dialogRefPi.input.isShowDelete = false;
    this.dialogRefPi.show();
  }

  // Add item from PO
  public onBtnAddFromPoClick(): void {
    this.isShowAddPo = false;
    this.cdr.detectChanges();
    this.isShowAddPo = true;
    this.dialogRefAddPo.config = {
      style: { width: '92vw' },
      baseZIndex: 10000,
      draggable: true,
      maximizable: true,
      title: 'Add item từ đơn hàng',
      btnTitle: 'COMMON.CRUD.ADD'
    };
    // this.dialogRefPo.input.id = this.id;
    this.dialogRefAddPo.input.isShowDelete = false;
    this.dialogRefAddPo.show();
  }

  // Add item from PO
  public loadItemAddFromPo(data: any): void {
    if (data) {
      this.shipmentItemData = {
        items: this.shipmentItemData.items.concat(data.listChildren),
      };
      this.shipmentItemData.paginatorTotal = this.shipmentItemData.items.length;

      // đánh lại indexNo
      for (let i = 0; i < this.shipmentItemData.items.length; i++) {
        const item = this.shipmentItemData.items[i];
        item.data.indexNo = (i + 1).toString();
        if (item.children && item.children.length > 0) {
          for (let j = 0; j < item.children.length; j++) {
            const children = item.children[j];
            children.data.indexNo = (i + 1).toString() + '.' + (j + 1).toString();
          }
        }
      }

      this.getTotalItem();
    }
    this.cdr.detectChanges();
  }

  // Lấy thông tin từ form Copy PO
  public loadItemFromPo(data: any): void {
    if (data) {
      if (data.listChildren && data.listChildren.length > 0) {
        this.bindingExpectedDate(data, 'listChildren');
        const checkIsStoring = data.listChildren.some(m => m.data.isStoring === 1);
        if (checkIsStoring) {
          this.shipmentData.isStoring = 1;
        }
      }
      if (data.listParent.length > 0) {
        const po = data.listParent[0];
        //
        if (!this.shipmentData.smSupplier) {
          this.shipmentData.checkVaidateVendorId = po.vendorId;
          this.shipmentData.smSupplier = po.vendorId;
          this.shipmentData.smSupplierName = po.supplierName;
        }
        //
        if (!this.shipmentData.currency) {
          this.shipmentData.checkVaidateCurrency = po.currency;
          this.shipmentData.currency = po.currency;
        }
        //
        if (!this.shipmentData.businessTerm) {
          this.shipmentData.businessTerm = po.freightTerm;
        }
        //
        if (!this.shipmentData.transportationMode) {
          this.shipmentData.transportationMode = po.delivery;
        }
        //
        if (!this.shipmentData.billFrom) {
          this.shipmentData.billFrom = po.deliveryLocationGoOut;
        }
        //
        if (!this.shipmentData.billTo) {
          this.shipmentData.billTo = po.deliveryLocationComeIn;
          this.shipmentData.billToTemp = this.shipmentData.billTo ? this.shipmentData.billTo.split(',') : [];
        }
        // binding thêm trường để checkvaildate trường hợp copy tiếp. push thêm items
        if (!this.shipmentData.checkVaidateAreaType) {
          this.shipmentData.checkVaidateAreaType = po.areaType;
        }
        if (!this.shipmentData.checkVaidateOuCode) {
          this.shipmentData.checkVaidateOuCode = po.ouCode;
        }
        if (!this.shipmentData.checkVaidateTaxpayer) {
          this.shipmentData.checkVaidateTaxpayer = po.taxpayer ? po.taxpayer : 'undefined';
        }
      }

      setTimeout(() => {
        this.initDataDto(this.shipmentData);
      }, 0);

      if (this.shipmentItemData && data.listChildren && this.shipmentItemData.items.length > 0) {
        for (const element of data.listChildren) {
          if (!this.shipmentItemData.items.find(x => x.data.id === element.data.id)) {
            const index = this.shipmentItemData.items.findIndex(x =>
              x.data.piId === element.data.piId && x.data.piItemId === element.data.piItemId);
            if (index > -1) {
              if (this.shipmentItemData.items[index].data.quantity < this.shipmentItemData.items[index].data.poiQuantity) {
                this.shipmentItemData.items[index].data.quantity += +element.data.quantity;
              }
              if (element.children && element.children.length > 0) {
                for (const obj of element.children) {
                  this.shipmentItemData.items[index].children.find(x => {
                    if (x.data.piItemId === obj.data.piItemId) {
                      if (x.data.quantity < obj.data.poiQuantity) {
                        x.data.quantity += +obj.data.quantity;
                      }
                    }
                  });
                }
              }
            } else {
              // get indexNo cho items new
              element.data.indexNo = (this.shipmentItemData.items.length + 1).toString();
              if (element.children && element.children.length > 0) {
                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < element.children.length; i++) {
                  element.children[i].data.indexNo = (element.data.indexNo + '.' + (i + 1)).toString();
                }
              }
              this.shipmentItemData.items = this.shipmentItemData.items.concat(element);
            }
          }
        }
        this.shipmentItemData.paginatorTotal = this.shipmentItemData.items.length;
      } else {
        this.shipmentItemData = {
          items: data.listChildren,
          paginatorTotal: data.listChildren.length
        };
      }
      this.sortShipmentItem();
      this.getTotalItem();
      setTimeout(() => {
        this.form.form.markAsDirty();
        this.cdr.detectChanges();
      }, 100);
    }
  }

  public sortShipmentItem(): void {
    // Sắp xếp theo tên từ A - Z theo số PO hay số PI
    this.shipmentItemData.items.sort((item1, item2) => {
      const a = item1.data.poCode.toLowerCase();
      const b = item2.data.poCode.toLowerCase();
      return a === b ? 0 : a > b ? 1 : -1;
    });
    this.getIndexNo();
  }

  private getIndexNo(): void {
    let index = 1;
    for (const item of this.shipmentItemData.items) {
      item.data.indexNo = index.toString();
      for (let i = 0; i < item.children.length; i++) {
        item.children[i].data.indexNo = (item.data.indexNo + '.' + (i + 1)).toString();
      }
      index++;
    }
  }

  // Lấy thông tin từ form Copy PI
  public loadItemFromPi(data: any): void {
    if (data) {
      if (data.listParent.length > 0) {
        const pi = data.listParent[0];
        //
        if (!this.shipmentData.smSupplier) {
          this.shipmentData.checkVaidateVendorId = pi.vendorId;
          this.shipmentData.smSupplier = pi.vendorId;
          this.shipmentData.smSupplierName = pi.supplierName;
        }
        //
        if (!this.shipmentData.isStoring) {
          this.shipmentData.isStoring = pi.isStoring;
        }
        //
        if (!this.shipmentData.receivingDeptName) {
          this.shipmentData.receivingDeptName = pi.receivingDeptName;
        }
        //
        if (!this.shipmentData.currency) {
          this.shipmentData.currency = pi.currency;
          this.shipmentData.checkVaidateCurrency = pi.currency;
        }
        if (!this.shipmentData.checkVaidateOuCode) {
          this.shipmentData.checkVaidateOuCode = pi.ouCode;
        }
      }

      if (data.listChildren && data.listChildren.length > 0) {
        this.bindingExpectedDate(data, 'listChildren');
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < data.listChildren.length; i++) {
          //
          if (!this.shipmentData.businessTerm) {
            this.shipmentData.businessTerm = data.listChildren[i].data.freightTerm;
          }
          //
          if (!this.shipmentData.transportationMode) {
            this.shipmentData.transportationMode = data.listChildren[i].data.delivery;
          }
          //
          if (!this.shipmentData.billFrom) {
            this.shipmentData.billFrom = data.listChildren[i].data.deliveryLocationGoOut;
          }
          //
          if (!this.shipmentData.billTo) {
            this.shipmentData.billTo = data.listChildren[i].data.deliveryLocationComeIn;
            this.shipmentData.billToTemp = this.shipmentData.billTo ? this.shipmentData.billTo.split(',') : [];
          }
          if (!this.shipmentData.checkVaidateAreaType) {
            this.shipmentData.checkVaidateAreaType = data.listChildren[i].data.areaType;
          }
          if (!this.shipmentData.checkVaidateTaxpayer) {
            this.shipmentData.checkVaidateTaxpayer = data.listChildren[i].data.taxpayer;
          }
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < data.listChildren[i].children.length; j++) {
            //
            if (!this.shipmentData.businessTerm) {
              this.shipmentData.businessTerm = data.listChildren[i].children[j].data.freightTerm;
            }
            //
            if (!this.shipmentData.transportationMode) {
              this.shipmentData.transportationMode = data.listChildren[i].children[j].data.delivery;
            }
            //
            if (!this.shipmentData.billFrom) {
              this.shipmentData.billFrom = data.listChildren[i].children[j].data.deliveryLocationGoOut;
            }
            //
            if (!this.shipmentData.billTo) {
              this.shipmentData.billTo = data.listChildren[i].children[j].data.deliveryLocationComeIn;
              this.shipmentData.billToTemp = this.shipmentData.billTo ? this.shipmentData.billTo.split(',') : [];
            }
            if (!this.shipmentData.checkVaidateAreaType) {
              this.shipmentData.checkVaidateAreaType = data.listChildren[i].children[j].data.areaType;
            }
            if (!this.shipmentData.checkVaidateTaxpayer) {
              this.shipmentData.checkVaidateTaxpayer = data.listChildren[i].children[j].data.taxpayer;
            }
          }
        }
        if (!this.shipmentData.checkVaidateTaxpayer) {
          this.shipmentData.checkVaidateTaxpayer = 'undefined';
        }
      }
      setTimeout(() => {
        this.initDataDto(this.shipmentData);
      }, 0);

      if (this.shipmentItemData && data.listChildren && this.shipmentItemData.items.length > 0) {
        for (const element of data.listChildren) {
          if (!this.shipmentItemData.items.find(x => x.data.id === element.data.id)) {
            // Check nếu cùng item và cùng xuất phát từ 1 hóa đơn ==> chỉ cộng số lượng
            const index = this.shipmentItemData.items.findIndex(x =>
              x.data.piId === element.data.piId && x.data.piItemId === element.data.piItemId);
            if (index > -1) {
              if (this.shipmentItemData.items[index].data.quantity < this.shipmentItemData.items[index].data.poiQuantity) {
                this.shipmentItemData.items[index].data.quantity += +element.data.quantity;
              }
              if (element.children && element.children.length > 0) {
                for (const obj of element.children) {
                  this.shipmentItemData.items[index].children.find(x => {
                    if (x.data.piItemId === obj.data.piItemId) {
                      if (x.data.quantity < obj.data.poiQuantity) {
                        x.data.quantity += +obj.data.quantity;
                      }
                    }
                  });
                }
              }
            } else {
              // get indexNo cho items new
              element.data.indexNo = (this.shipmentItemData.items.length + 1).toString();
              if (element.children && element.children.length > 0) {
                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < element.children.length; i++) {
                  element.children[i].data.indexNo = (element.data.indexNo + '.' + (i + 1)).toString();
                }
              }
              this.shipmentItemData.items = this.shipmentItemData.items.concat(element);
            }
          }
        }
        this.shipmentItemData.paginatorTotal = this.shipmentItemData.items.length;
      } else {
        this.shipmentItemData = {
          items: data.listChildren,
          paginatorTotal: data.listChildren.length
        };
      }

      if (this.shipmentItemData.items.length > 0) {
        this.copyFromPi = true;
      } else {
        this.copyFromPi = false;
      }
      this.sortShipmentItem();
      this.getTotalItem();
      setTimeout(() => {
        this.form.form.markAsDirty();
        this.cdr.detectChanges();
      }, 100);
    }
  }

  private bindingExpectedDate(data: any, dataSource): void {
    if (!this.shipmentData.expectedToDate) {
      const dateTemp = data[dataSource].find(x => x.data.responseDate);
      if (dateTemp) {
        this.shipmentData.expectedToDate = dateTemp.data.responseDate;
        for (const element of data[dataSource]) {
          if (Date.parse(element.data.responseDate) < Date.parse(dateTemp.data.responseDate)) {
            this.shipmentData.expectedToDate = element.data.responseDate;
          }
        }
      }
    }
  }

  public onBtnSaveClick() {
    if (!this.acceptSave) {
      this.notificationService.showWarning('VALIDATION.SHIPMENT.MSG_002');
      return;
    } else {

      const checkData = this.getListShipmentItemSave();
      if (checkData.length > 200) {
        this.notificationService.showWarning('Số lượng vượt quá giới hạn cho phép lưu 200 item');
        return;
      }

      if (checkData.find(x => !x.itemOrigin)) {
        this.notificationService.showWarning('Danh sách hàng hóa - dịch vụ : Xuất xứ hàng hóa bắt buộc nhập');
        return;
      }

      const requestSave = this.createRequestSave();
      // lô hàng trạng thái lưu nháp thì đổi trạng thái khi click btn Lưu
      if (requestSave.shipment.smStatus === 9) {
        const request = new ShipmentRequestPayload();
        request.waybillNumber = this.shipmentData.waybillNumber;
        this.shipmentService.checkShipmentExist(request, false).subscribe(response => {
          if (response) {
            this.notificationService.showWarning('Số vận đơn đã tồn tại');
            this.form.form.controls[`waybillNumber`].setErrors({ ALREADY_EXISTS: true });
            this.validateForm(this.form, this.formData.formId);
            return;
          } else {
            // Thêm trường check lưu QuantityRemain Pii trong trường hợp lưu nháp ==> Lưu chính thức
            requestSave.shipment.smStatusOrigin = this.shipmentData.smStatus;
            this.shipmentData.smStatusOrigin = this.shipmentData.smStatus;
            // Default trạng thái lô hàng là Hàng đang đi đường
            requestSave.shipment.smStatus = 2;
            this.shipmentData.smStatus = 2;

            this.processSave(requestSave);
          }
        });
      } else {
        // Check nếu hàng không qua kho thì không cần click btn Xác nhận hàng đã về kho. Update trạng thái để có thể sang bước nhập hàng
        // if (requestSave.shipment.isStoring === 1) {
        //   requestSave.shipment.importStatus = requestSave.shipment.importStatus ? requestSave.shipment.importStatus : 1;
        //   // tslint:disable-next-line:max-line-length
        //   requestSave.shipment.smStatus = requestSave.shipment.smStatus < 3 ? 3 : requestSave.shipment.smStatus; // Hàng đã về kho, chờ nhập ERP
        // }
        this.processSave(requestSave);
      }
    }
  }

  public processSave(requestSave: any): void {
    const saveSub = this.shipmentService.save(requestSave).subscribe(res => {
      if (res && res.id) {
        this.router.navigate([`list/view/${res.id}`], { relativeTo: this.route.parent });
        if (!this.currentShipmentId && requestSave.shipment.isStoring === 0) {
          this.defaultInfoSaveNotification('AF_MANAGER_WAREHOUSE');
        }
        this.initData();
        this.notificationService.showSuccess();
      }
    });
    this.subscriptions.push(saveSub);
  }

  public onBtnSaveAsDraftClick(): void {
    const requestSave = this.createRequestSave();
    // Trạng thái lưu nháp shipment
    requestSave.shipment.smStatus = 9;
    const saveSub = this.shipmentService.saveDraft(requestSave).subscribe(res => {
      if (res && res.id) {
        this.router.navigate([`list/view/${res.id}`], { relativeTo: this.route.parent });
        this.initData();
        this.notificationService.showSuccess();
      }
    });
    this.subscriptions.push(saveSub);
  }

  private createRequestSave() {
    const requestSave = new ShipmentRequestSaveDto();
    requestSave.shipment = this.shipmentData;

    // Lấy danh sách id item package cần xoá
    if (this.shipmentPackageDataOrigin.items.length > 0) {
      requestSave.shipmentPackageIdDeletes = this.shipmentPackageDataOrigin.items.map(x => x.id);
    }

    // lấy thông tin package dùng bulk insert item package
    requestSave.shipmentPackage = this.shipmentPackageData.items;

    // Chưa đồng bộ ERP mới phi vào đây
    if (!this.shipmentData.syncErp || this.shipmentData.syncErp < 2) {

      // lấy danh sách id item cần xoá
      if (this.shipmentItemDataOrigin.items.length > 0) {
        requestSave.shipmentItemIdDeletes = this.shipmentItemDataOrigin.items.map(x => x.id);
      }

      // lấy danh sách shipment item và danh sách purchase order item cần update
      if (this.shipmentItemData.items.length > 0) {
        // Dùng biến tạm tránh binding 2 chiều
        const temp = JSON.stringify(this.getListShipmentItemSave());

        // Lấy thông tin shipment item
        requestSave.shipmentItem = JSON.parse(temp);
        requestSave.shipmentItem.map(x => {
          if (!x.poItemId && x.id && x.poId) {
            x.poItemId = x.id;
          }
          x.igOrgCode = x.orgCode;
          x.igSubInventory = x.subInventory;
          // originId là id cũ của bản ghi
          if (this.shipmentData.id && x.originId) {
            x.id = x.originId;
          } else {
            delete x.id;
          }
          return x;
        });

        // Trường hợp sửa mới update thông tin purchase order item hoặc trạng thái lô hàng là lưu nháp
        if (this.hasEditRow || this.shipmentData.smStatus === 9) {
          requestSave.purchaseOrderItem = JSON.parse(temp);
          requestSave.purchaseOrderItem.map(x => {
            x.quantity = x.poiQuantity;
            if (x.shipmentId) {
              x.id = x.poItemId;
            } else {
              if (this.copyFromPi) { // copy từ pi đang lấy danh sách piItem nên gán lại poItemId qua, copy từ po thì không cần
                x.id = x.poItemId;
              }
            }
            return x;
          });
        }
      }
    }
    return requestSave;
  }

  public getListShipmentItemSave(): any {
    const arrItemSave = [];
    for (let i = 0; i < this.shipmentItemData.items.length; i++) {
      const item = this.shipmentItemData.items[i];
      item.data.indexNo = (i + 1).toString();
      item.data.isSubItem = false;
      arrItemSave.push(item.data);
      if (item.children && item.children.length > 0) {
        for (let j = 0; j < item.children.length; j++) {
          const children = item.children[j];
          children.data.indexNo = (i + 1).toString() + '.' + (j + 1).toString();
          children.data.isSubItem = true;
          arrItemSave.push(children.data);
        }
      }
    }
    return arrItemSave;
  }

  public editRow(acceptSave: any): void {
    if (acceptSave !== undefined) {
      this.acceptSave = false;
    } else {
      this.acceptSave = true;
    }
    this.hasEditRow = true;
    if (this.shipmentItem) {
      this.shipmentData.totalAmount = this.shipmentItem.priceTotal;
    }
    if (acceptSave === 'dirty') {
      this.form.form.markAsDirty();
      this.shipmentItemData.items = this.shipmentItem.shipmentItemData.items;
      this.acceptSave = true;
    }
  }

  private getTotalItem(): void {

    if (this.shipmentItem && this.shipmentItemData.items && this.shipmentItemData.items.length > 0) {
      let total = 0;
      let totalAmount = 0;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.shipmentItemData.items.length; i++) {
        total += this.shipmentItemData.items[i].data.quantity ? +this.shipmentItemData.items[i].data.quantity : 0;
        if (this.shipmentItemData.items[i].data.quantity && this.shipmentItemData.items[i].data.price) {
          totalAmount += +this.shipmentItemData.items[i].data.quantity * +this.shipmentItemData.items[i].data.price;
        }
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.shipmentItemData.items[i].children.length; j++) {
          total += this.shipmentItemData.items[i].children[j].data.quantity ? +this.shipmentItemData.items[i].children[j].data.quantity : 0;
          if (this.shipmentItemData.items[i].children[j].data.quantity && this.shipmentItemData.items[i].children[j].data.price) {
            // tslint:disable-next-line:max-line-length
            totalAmount += +this.shipmentItemData.items[i].children[j].data.quantity * +this.shipmentItemData.items[i].children[j].data.price;
          }
        }
      }
      this.shipmentItem.quantityTotal = total;
      this.shipmentItem.priceTotal = totalAmount;
      this.shipmentData.totalAmount = this.shipmentItem.priceTotal;
    } else {
      this.shipmentItem.quantityTotal = 0;
      this.shipmentItem.priceTotal = 0;
    }
  }

  public onBtnSyncErpClick(): void {
    if (!this.validateBeforeSyncErp()) {
      return;
    }

    // tslint:disable-next-line:new-parens
    const request = new PurchaseInvoiceItemRequestPayload;
    let items = null;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.shipmentItem.shipmentItemData.items.length; i++) {
      items = !items ? this.shipmentItem.shipmentItemData.items[i].data : items;
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < this.shipmentItem.shipmentItemData.items[i].children.length; j++) {
        items = !items ? this.shipmentItem.shipmentItemData.items[i].children.data : items;
      }
    }

    request.piId = items.piId;
    let purchaseInvoice: any;
    let purchaseInvoiceItems = [];

    const requestSyncErp = new SyncErpRequestPayload();
    requestSyncErp.shipmentId = this.id;

    const subCountAndLoad = forkJoin([
      this.purchaseInvoiceService.selectById(items.piId),
      this.purchaseInvoiceItemService.select(request),
      this.syncErpService.checkAllowReceipt(requestSyncErp)
    ]).subscribe(
      (res: any[]) => {
        purchaseInvoice = res[0];
        purchaseInvoiceItems = res[1];
        const contractorTaxInvoice = purchaseInvoiceItems.find(x => x.taxpayer);
        if (contractorTaxInvoice && purchaseInvoice.taxStatus !== 4) {
          // tslint:disable-next-line:max-line-length
          this.notificationService.showWarning('Chưa thực hiện tính thuế nhà thầu và gửi XNK (Hóa đơn)');
          this.defaultInfoSaveNotification('AF_TAX');
          // return; // fix chỉ thông báo chứ không chặn
        }
        if (res[2]) {
          this.dialogRefReceipt1.config.style = { width: '90%' };
          this.dialogRefReceipt1.config.title = 'Xác nhận đẩy Receipt bước 1';
          this.dialogReceipt1.ngOnInit();
          this.dialogRefReceipt1.show();
          this.cdr.detectChanges();
        } else {
          this.shipmentService.selectById(this.id).subscribe(m => {
            this.shipmentData = m;
            this.initDataDto(this.shipmentData);
            this.notificationService.showWarning('Vui lòng thử lại sau ít phút');
          });
        }
      });
    this.subscriptions.push(subCountAndLoad);
  }

  public flatSpreadTreeTable(shipmentItems: any): any {
    const shipmentItemsData = shipmentItems;
    // trải phẳng tree. Bỏ tree table
    const arrItemSave = [];
    for (let i = 0; i < shipmentItemsData.length; i++) {
      const item = shipmentItemsData[i];
      item.data.indexNo = (i + 1).toString();
      item.data.isSubItem = false;
      arrItemSave.push(item.data);
      if (item.children && item.children.length > 0) {
        for (let j = 0; j < item.children.length; j++) {
          const children = item.children[j];
          children.data.indexNo = (i + 1).toString() + '.' + (j + 1).toString();
          children.data.isSubItem = true;
          arrItemSave.push(children.data);
        }
      }
    }
    return arrItemSave;
  }

  public defaultInfoSaveNotification(type?: any): void {
    this.notificationData.status = 1;
    this.notificationData.module = 'shipment';
    const shipmentInfor = { id: this.currentShipmentId, code: this.shipmentData ? this.shipmentData.waybillNumber : '' };
    this.notificationData.messageContent = JSON.stringify(shipmentInfor);
    if (type === 'AF_ADMIN') {
      // Gửi AF_ADMIN
      this.notificationData.role = 'AF_ADMIN';
      this.notificationData.description = 'Cần check thông tin PO, Cập nhật thông tin định khoản';
    }

    if (type === 'AF_TAX') {
      // Gửi AF_ADMIN
      this.notificationData.role = 'AF_TAX';
      this.notificationData.description = ' Cần check thông tin Hóa đơn, Tính thuế nhà thầu';
    }

    if (type === 'AF_MANAGER_WAREHOUSE') {
      this.notificationData.role = 'AF_MANAGER_WAREHOUSE';
      if (this.shipmentData.expectedToDate) {
        // tslint:disable-next-line:max-line-length
        this.notificationData.description = ' Lô hàng mới dự kiến về ngày [' + this.shipmentData.expectedToDate + '] - Chuẩn bị tiếp nhận hàng về kho';
      } else {
        this.notificationData.description = 'Lô hàng tạo mới(Hàng qua kho) - Chuẩn bị tiếp nhận hàng về kho';
      }

    }


    const saveSub = this.notificationListService.merge(this.notificationData).subscribe(() => { });
    this.subscriptions.push(saveSub);
  }

  private validateBeforeSyncErp(): boolean {
    if (!this.shipmentData.id || (this.shipmentData.syncErp && this.shipmentData.syncErp >= 2)) {
      return false;
    }
    if (this.form.dirty) {
      this.notificationService.showWarning('VALIDATION.SHIPMENT.MSG_003');
      return false;
    }
    if (this.shipmentItem.shipmentItemData.items.length < 1) {
      this.notificationService.showWarning('VALIDATION.SHIPMENT.MSG_004');
      return false;
    }

    if (this.shipmentData.smStatus !== 2) {
      this.notificationService.showWarning('VALIDATION.SHIPMENT.MSG_014');
      return false;
    }
    const checkItemData = this.flatSpreadTreeTable(this.shipmentItem.shipmentItemData.items);
    if (checkItemData.find(item => !item.termAccount && item.itemType === 'SRV' && item.isUpdateSrv)) {
      this.defaultInfoSaveNotification('AF_ADMIN');
    }

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.shipmentItem.shipmentItemData.items.length; i++) {
      const item = this.shipmentItem.shipmentItemData.items[i];
      if (!item.data.itemCode) {
        this.notificationService.showWarning('VALIDATION.SHIPMENT.MSG_005');
        return false;
      }
      if (!item.data.termAccount && item.data.itemType === 'SRV' && item.data.isUpdateSrv) {
        this.notificationService.showWarning('VALIDATION.SHIPMENT.MSG_006');
        this.sendMailRequestUpdateTermAccount();
        return false;
      }

      if (item.children && item.children.length > 0) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < item.children.length; j++) {
          const children = item.children[j];
          if (!children.data.itemCode) {
            this.notificationService.showWarning('VALIDATION.SHIPMENT.MSG_005');
            return false;
          }
          if (!children.data.termAccount && children.data.itemType === 'SRV' && children.data.isUpdateSrv) {
            this.notificationService.showWarning('VALIDATION.SHIPMENT.MSG_006');
            this.sendMailRequestUpdateTermAccount();
            return false;
          }
        }
      }
    }

    return true;
  }

  private checkExistsInArray(arr: any, item: any): boolean {
    for (const obj of arr) {
      if (item.id === obj.id) {
        return true;
      }
    }
    return false;
  }

  public sendMailRequestUpdateTermAccount() {
    const listTemp = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.shipmentItem.shipmentItemData.items.length; i++) {
      const item = this.shipmentItem.shipmentItemData.items[i];
      if (!item.data.termAccount && item.data.itemType === 'SRV' && item.data.isUpdateSrv) {
        if (!this.checkExistsInArray(listTemp, item.data)) {
          listTemp.push(item.data);
        }
      }
      if (item.children && item.children.length > 0) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < item.children.length; j++) {
          const children = item.children[j];
          if (!children.data.termAccount && children.data.itemType === 'SRV' && children.data.isUpdateSrv) {
            if (!this.checkExistsInArray(listTemp, children.data)) {
              listTemp.push(children.data);
            }
          }
        }
      }
    }
    const listPoId = listTemp.map(({ poId }) => poId);
    const requestBody: any = {
      id: this.shipmentData.id,
      listPoId: listPoId
    };
    this.shipmentService.sendMailRequestUpdateTermAccount(requestBody).subscribe(m => {
      // Không cần xử lý gì thêm
    });
  }

  public confirmGoodsInStock(): void {
    if (!this.validateBeforeSave()) {
      return;
    }
    const saveConfirmation = new SaveConfirmation();
    saveConfirmation.accept = () => {
      this.shipmentService.confirmGoodsInStock(this.shipmentData).subscribe(() => {
        this.shipmentData.importStatus = 1;
        this.shipmentData.smStatus = 3; // Hàng đã về kho, chờ nhập ERP
        this.cdr.detectChanges();
        this.notificationService.showSuccess();
      });
    };

    this.notificationService.confirm(saveConfirmation);
  }

  private validateBeforeSave(): boolean {
    if (!this.shipmentData.id || (this.shipmentData.importStatus && this.shipmentData.importStatus >= 1)) {
      return false;
    }
    if (this.form.dirty) {
      this.notificationService.showWarning('VALIDATION.SHIPMENT.MSG_003');
      return false;
    }
    if (this.shipmentItem.shipmentItemData.items.length < 1) {
      this.notificationService.showWarning('VALIDATION.SHIPMENT.MSG_004');
      return false;
    }
    if (!this.shipmentData.syncErp || this.shipmentData.syncErp < 2) {
      this.notificationService.showWarning('VALIDATION.SHIPMENT.MSG_009');
      return false;
    }

    if (!this.checkAllowReceiptB2Shipment) {
      // tslint:disable-next-line:max-line-length
      this.notificationService.showWarning('Hiện tại chưa thế thực hiện xác nhận hàng về kho, vui lòng đợi kết quả đồng bộ Receipt bước 1 thành công');
      return false;
    }

    // Trường hợp lô hàng có thuế nhà thầu thì check không cần up Biên bản bàn giao lên hệ thống
    const check = this.shipmentItem.shipmentItemData.items.find(x => x.data.taxpayer);
    if (!this.checkDeliveryRecords && !check) {
      this.notificationService.showWarning('VALIDATION.SHIPMENT.MSG_010');
      return false;
    }
    return true;
  }

  public syncSuccess(data: any): void {
    if (data) {
      this.ngOnInit();
      this.cdr.detectChanges();
    }
  }

  public valueStoreChange(event: any): void {
    this.shipmentData.isStoring = event.value;
  }

  public onChangeAccount(): void {
    this.shipmentData.receivingDept = this.shipmentData.receivingDeptNameDto ? this.shipmentData.receivingDeptNameDto.userName : '';
  }

  public onChangeSupplier(): void {
    this.shipmentData.smSupplier = this.shipmentData.smSupplierNameDto ? this.shipmentData.smSupplierNameDto.vendorId : null;
    this.shipmentData.checkVaidateVendorId = this.shipmentData.smSupplier;
  }

  public onChangeCurrency(): void {
    this.shipmentData.currency = this.shipmentData.currencyDto ? this.shipmentData.currencyDto.name : null;
    this.shipmentData.checkVaidateCurrency = this.shipmentData.currency;
  }

  public onChangeSmStatus(event: any): void {
    this.isEditWaybillNumber = true;
    if (event && event.target) {
      if (event.target.value === '1') {
        this.isEditWaybillNumber = false;
      }
    }
  }

  public getShipmentAttachment(): void {
    this.checkDeliveryRecords = false;
    let files = [];
    const request = new PurchaseAttachmentRequestPayload();
    request.recordId = this.currentShipmentId;
    request.module = 'SHIPMENT_ATTACHMENT';

    const requestSyncErp = new SyncErpRequestPayload();
    requestSyncErp.shipmentId = this.id;

    const subCheckData = forkJoin([
      this.purchaseAttachmentService.getPurchaseAttachment(request),
      this.syncErpService.checkAllowReceiptB2Shipment(requestSyncErp),
    ]).subscribe(res => {
      if (res) {
        files = res[0];
        files = files.filter(x => x.files);
        const obj = files.find(m => m.name === 'Biên bản bàn giao');
        if (obj) {
          this.checkDeliveryRecords = true;
        }
        this.checkAllowReceiptB2Shipment = res[1];
      }
    });
    this.subscriptions.push(subCheckData);
  }

  public checkListFile(data) {
    this.checkDeliveryRecords = false;
    let docStatus = 1;
    const files = data.filter(x => x.files);
    if (files.length > 0) {
      const obj = files.find(m => m.name === 'Biên bản bàn giao');
      if (obj) {
        this.checkDeliveryRecords = true;
        docStatus = 3;
      } else {
        docStatus = 2;
      }
      this.shipmentService.selectById(this.id).subscribe(shipment => {
        if (shipment) {
          const dataUpdate: any = {
            ...shipment,
            docStatus
          };
          if (this.checkDeliveryRecords) {
            this.shipmentService.confirmGoodsToTheWarehouse(dataUpdate).subscribe(res => {
              this.shipmentData.docStatus = docStatus;
            });
          } else {
            this.shipmentService.update(dataUpdate).subscribe(res => {
              this.shipmentData.docStatus = docStatus;
            });
          }
        }
      });
    }
  }

  public returnReceipt() {
    const confirmation = new CustomConfirmation('SYNC_ERP.CONFIRM_RETURN_MESSAGE');
    confirmation.accept = () => {
      const request: any = {
        shipmentId: this.shipmentData.id
      };
      this.syncErpService.returnReceipt(request).subscribe(m => {
        if (m) {
          this.initData();
          this.notificationService.showSuccess();
          this.cdr.detectChanges();
        }
      });
    };
    this.notificationService.confirm(confirmation);
  }

  public viewLogReceipt() {
    const request: any = {
      shipmentId: this.shipmentData.id
    };
    this.syncErpService.viewLogReceipt(request).subscribe(m => {
      console.log(m);
    });
  }

  public importFileDataClick(): void {
    this.importFile.open();
  }

  public onBtnUploadClick(): void {
    const request = new ShipmentRequestPayload();
    request.id = this.currentShipmentId;
    let mess = 'Dữ liệu thông tin tờ khai sẽ được import ??';
    if (this.currentShipmentId) {
      mess = 'Dữ liệu thông tin tờ khai sẽ được update ??';
    }
    const confirm = new CustomConfirmation(mess);
    confirm.accept = () => {
      const files = this.importFile.tableFile.map((x) => x.file);
      this.shipmentService
        .import(files, request)
        .subscribe(
          (res) => {
            this.importFile.close();
            if (this.currentShipmentId) {
              this.ngOnInit();
              this.attachDocument.ngOnInit();
              this.notificationService.showSuccess();
            } else {
              if (res) {
                this.shipmentData.declarationNumber = res.declarationNumber;
                this.shipmentData.declarationType = res.declarationType;
                this.shipmentData.gate = res.gate;
                this.shipmentData.declarationDate = res.declarationDate;
                this.shipmentData.exporterName = res.exporterName;
                this.shipmentData.exporterAddress = res.exporterAddress;
                this.shipmentData.importVat = res.importVat;
                this.shipmentData.importTax = res.importTax;
                this.shipmentData.gateDto = this.toDto('acronym', this.shipmentData.gate);
                this.cdr.detectChanges();
              }
            }

          }
        );
    };
    this.notificationService.confirm(confirm);
  }

}
