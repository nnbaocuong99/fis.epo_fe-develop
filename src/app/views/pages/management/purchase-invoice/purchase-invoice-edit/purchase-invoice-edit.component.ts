import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { PurchaseInvoiceService } from '../../../../../services/modules/purchase-invoice/purchase-invoice.service';
import { DialogUploadFileComponent } from '../../../../partials/control/upload-file/upload-file.component';
import * as config from './purchase-invoice-edit.config';
import * as parentconfig from '../purchase-invoice.config';
import { forkJoin } from 'rxjs';
import { PurchaseInvoiceItemService } from '../../../../../services/modules/purchase-invoice-item/purchase-invoice-item.service';
import {
  PurchaseInvoiceItemRequestPayload
} from '../../../../../services/modules/purchase-invoice-item/purchase-invoice-item.request-payload';
import { DialogRef } from '../../../../partials/content/crud/dialog/dialog-ref.model';
import { SaveConfirmation } from '../../../../../services/common/confirmation/save-confirmation';
import { FormDynamicData } from '../../../../partials/content/crud/component/form-dynamic-data.model';
import { BaseFormComponent } from '../../../../../core/_base/component/base-form.component';
import { SupplierService } from '../../../../../services/modules/category/supplier/supplier.service';
import { UserService } from '../../../../../services/modules/user/user.service';
import * as mainConfig from '../../../../../core/_config/main.config';
import { CurrencyService } from '../../../../../services/modules/category/currency/currency.service';
import { SupplierSiteService } from '../../../../../services/modules/category/supplier-site/supplier-site.service';
import { SubInventoryService } from '../../../../../services/modules/category/sub-inventory/sub-inventory.service';
import { PurchaseOrderService } from '../../../../../services/modules/purchase-order/purchase-order.service';
import { ShipmentService } from '../../../../../services/modules/shipment/shipment.service';
import {
  PurchaseInvoiceRequestPayload,
  PurchaseInvoiceRequestSaveDto
} from '../../../../../services/modules/purchase-invoice/purchase-invoice.request-payload';
import { AccountSyncService } from '../../../../../services/modules/category/account/account.service';
import { InvoiceTypeService } from '../../../../../services/modules/category/invoice-type/invoice-type.service';
import { TaxCodeService } from '../../../../../services/modules/category/tax-code/tax-code.service';
import { InvoiceTypeRequestPayload } from '../../../../../services/modules/category/invoice-type/invoice-type.request.payload';
import { TaxTypeNotDeductionService } from '../../../../../services/modules/category/tax-type-not-deduction/tax-type-not-deduction.service';
import {
  InputInvoiceInformationService
} from '../../../../../services/modules/category/input-invoice-information/input-invoice-information.service';
import {
  InputInvoiceInformationRequestPayload
} from '../../../../../services/modules/category/input-invoice-information/input-invoice-information.request.payload';
import {
  TaxTypeNotDeductionRequestPayload
} from '../../../../../services/modules/category/tax-type-not-deduction/tax-type-not-deduction.request.payload';
// NGRX
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { currentUser } from '../../../../../core/auth';
import { ProjectService } from '../../../../../services/modules/category/project/project.service';
import { DepartmentService } from '../../../../../services/modules/category/department/department.service';
import {
  OperatingUnitService
} from '../../../../../services/modules/category/organization-management/operating-unit/operating-unit.service';
import { ConfigListFactory } from '../../../../partials/control/config-list/config-list-control.service';
import { take } from 'rxjs/operators';
import { DialogSyncErpApComponent } from './dialog-sync-erp-ap/dialog-sync-erp-ap.component';
import { PaymentTermService } from '../../../../../services/modules/category/payment-term/payment-term.service';
import { ShipmentItemService } from '../../../../../services/modules/shipment-item/shipment-item.service';
import { ShipmentItemRequestPayload } from '../../../../../services/modules/shipment-item/shipment-item.request-payload';
import { TreeNode } from 'primeng/api';
import { PurchaseInvoiceItemComponent } from './purchase-invoice-item/purchase-invoice-item.component';
import { ConfigListRequestPayload } from '../../../../../services/modules/config-list/config-list.request.payload';
import { ConfigListService } from '../../../../../services/modules/config-list/config-list.service';
import { CustomConfirmation } from '../../../../../services/common/confirmation';
import { DialogRequestImportComponent } from './dialog-request-import/dialog-request-import.component';
import { OrgChartService } from '../../../../../services/modules/org-chart/org-chart.service';
import { NotificationListService } from '../../../../../services/modules/notification-list/notification-list.service';
import { SyncErpService } from '../../../../../services/modules/sync-erp/sync-erp.service';
import {
  PurchaseInvoiceEditCopyForCreditNoteComponent
} from './purchase-invoice-edit-copy-for-credit-note/purchase-invoice-edit-copy-for-credit-note.component';
import { FileService } from '../../../../../services/modules/file/file.service';
import { Location } from '@angular/common';

export enum InvoiceTypes {
  OtherInvoice = 'Other Invoice',
  PrePaymentInvoice = 'PrePayment Invoice',
  PurchaseInvoice = 'Purchase Invoice'
}
@Component({
  selector: 'app-purchase-invoice-edit',
  templateUrl: './purchase-invoice-edit.component.html',
  styleUrls: ['./purchase-invoice-edit.component.scss']
})
export class PurchaseInvoiceEditComponent extends BaseFormComponent implements OnInit {
  @ViewChild('importFile', { static: false }) importFile: DialogUploadFileComponent;
  @ViewChild('form', { static: true }) form: NgForm;
  @ViewChild('purchaseInvoiceItems', { static: false }) purchaseInvoiceItems: PurchaseInvoiceItemComponent;
  @ViewChild('contractorTaxCalculation', { static: false }) contractorTaxCalculation: any;
  @ViewChild('dialogSyncErpAp', { static: false }) dialogSyncErpAp: DialogSyncErpApComponent;
  @ViewChild('dialogRequestImport', { static: false }) dialogRequestImport: DialogRequestImportComponent;
  @ViewChild('dialogCopyForCreditNote', { static: false }) dialogCopyForCreditNote: PurchaseInvoiceEditCopyForCreditNoteComponent;

  public formData: FormDynamicData = new FormDynamicData();
  public dialogRefPIItem: DialogRef = new DialogRef();
  public dialogRefPi: DialogRef = new DialogRef();
  public dialogRefPo: DialogRef = new DialogRef();
  public dialogRefAddPiItem: DialogRef = new DialogRef();
  public dialogRefSyncAp: DialogRef = new DialogRef();
  public dialogRefConfigList: DialogRef = new DialogRef();
  public dialogRefRequestUpdOrg: DialogRef = new DialogRef();

  public requestPiItem = new PurchaseInvoiceItemRequestPayload();
  public purchaseInvoiceRequestPayload = new PurchaseInvoiceRequestPayload();

  public formTitle = 'Thông tin hoá đơn';
  public tabs = config.TABS;
  public tabDetails = config.TAB_DETAILS;
  public purchaseInvoiceData: any = {};
  public exchangeRateData: any = {};

  public headerItemsTreeTableOrigin = config.HEADERS_ITEMS_TREE_TABLE;
  public headerItemsTableOrigin = config.HEADERS_ITEMS_TABLE;
  public headerItemsTableCostShipmentOrigin = config.HEADERS_ITEMS_TABLE_COST_SHIPMENT;
  public headerItemsTableCreditNoteOrigin = config.HEADERS_ITEMS_TABLE_CREDIT_NOTE;

  public headerItemsTreeTable = config.HEADERS_ITEMS_TREE_TABLE;
  public headerItemsTable = config.HEADERS_ITEMS_TABLE;

  public headerPaymentTerm = config.HEADER_PAYMENT_TERM;
  public invoiceTypeOnLists = config.INVOICE_TYPE_ON_LIST;
  public statusInvoices = config.STATUS_INVOICE;
  public statusErps = config.STATUS_ERP;
  public exchangeRates = config.EXCHANGE_RATE;
  public taxPayers = config.TAX_PAYER;
  public supplierSites = config.SUPPLIER_SITE;
  public headerSuppliers = config.HEADER_SUPPLIER;
  public headerSupplierSites = config.HEADER_SUPPLIER_SITE;
  public storeItems = config.STORE_ITEMS;
  public taxVats = config.TAX_VAT;
  public columnSubInventory = config.SUB_INVENTORY;
  public headerPo = config.HEADER_PO;
  public headerShipment = config.HEADER_SHIPMENT;
  public headerPurchaseInvoice = config.HEADER_PURCHASE_INVOICE;
  public headerReceivingDept = config.DERPARTMENT_RECEIVING_GOODS;
  public headerUser = config.HEADER_USER;
  public headerInvoiceType = config.HEADER_INVOICE_TYPE;
  public headerinputInvoiceInformation = config.HEADER_INPUT_INVOICE_INFOMATION;
  public headerTaxTypeNotDeduction = config.HEADER_TAX_TYPE_NOT_DEDUCTION;
  public headerProject = config.HEADER_PROJECT;
  public statusTaxs = parentconfig.STATUS_TAX;
  public headerDepartment = config.HEADER_DEPARMENT;
  public headerOperatingUnit = config.HEADER_OPERATING_UNIT;

  public dataSource = {
    items: [],
    paginatorTotal: undefined
  };

  public isShowCopyInv = false;
  public isShowCopyPo = false;
  public isShowConfigList = true;
  public currentPiId: string;
  public currentTab: number;
  public currentchangTab: number;
  public isShowDialogRefTermAccount = false;
  public isShowDialogRefProjectMilestone = false;
  public isShowAddItemPI = false;
  public hasEditRow = false;
  public acceptSave = true;
  public costTypes: any;
  public mainConfig: any = mainConfig.MAIN_CONFIG;
  public currencyFrom: string;
  public isDisabledAmount = true;
  private purchaseInvoiceItemDataOrgin: any = [];
  public taxCodeData: any[];
  public notificationData: any = {};
  public isShowCostTypeGoodsService = true;
  public invoiceTypeRequestPayload = new InvoiceTypeRequestPayload();
  public inputInvoiceInformationRequestPayload = new InputInvoiceInformationRequestPayload();
  public taxTypeNotDeductionRequestPayload = new TaxTypeNotDeductionRequestPayload();
  public allowRequestImportGoods = false;
  public isHideBtnAfCaculationTax = false;
  public showBtnSuggestionImport = false;
  public showBtnSyncErp = false;
  public isCostTypeCredit = false;
  public isCostTypeCreditNote = false;
  public isCostTypeForShipment = false;

  // tslint:disable-next-line:max-line-length
  // Hide/show control với loại hóa đơn other invoice và prepayment không cần các trường: loại hóa đơn trên bảng kê, số seri hóa đơn, ký hiệu mẫu hóa đơn
  public isShowInvoiceType = true;
  public isShowCostTypeInsurranceTransport = true;
  // Show control if loại chi phí: Credit note, thanh toán trả trước, khác
  public isShowPoNumber = false;
  // Ẩn hiện phần tab thuế nhà thầu và cột thuế nhà thầu ở line hàng
  public isShowContractorTax = true;
  // Ẩn hiện control VAT được khấu trừ/ Không được khấu trừ - chỉ hiển thị khi hóa đơn trong nước, loại chi phí creditNote , khác
  public isShowIsDeduct = false;
  public costTypeInsurrance = false;

  public invoiceTypes = InvoiceTypes;
  public isShowTreeTable = false;
  // Show/hide btn lưu nháp
  public isShowBtnSaveDraft = false;
  public isBuyInternalUse = false;

  public listCostType = [];
  public listInvoiceTypeOnList = [];
  public useNameLoginData: any = {};
  public orgChart: any = {};
  public fnRunFirstSuccess: () => void;

  public listPpHasFile = [];
  public listPrHasFile = [];
  public listPoHasFile = [];
  public isRoleSuperAdmin = false;

  constructor(
    public purchaseInvoiceService: PurchaseInvoiceService,
    private purchaseInvoiceItemService: PurchaseInvoiceItemService,
    private notificationService: NotificationService,
    public supplierService: SupplierService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    public currencyService: CurrencyService,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    public userService: UserService,
    public supplierSiteService: SupplierSiteService,
    public subInventoryService: SubInventoryService,
    public shipmentService: ShipmentService,
    public shipmentItemService: ShipmentItemService,
    public accountService: AccountSyncService,
    public purchaseOrderService: PurchaseOrderService,
    public invoiceTypeService: InvoiceTypeService,
    public orgChartService: OrgChartService,
    public taxCodeService: TaxCodeService,
    public inputInvoiceInformationService: InputInvoiceInformationService,
    public taxTypeNotDeductionService: TaxTypeNotDeductionService,
    public operatingUnitService: OperatingUnitService,
    public projectService: ProjectService,
    public notificationListService: NotificationListService,
    public departmentService: DepartmentService,
    public paymentTermService: PaymentTermService,
    public configListService: ConfigListService,
    private syncErpService: SyncErpService,
    private store: Store<AppState>,
    private fileService: FileService
  ) {
    super();
    this.formData = {
      formId: 'purchase-invoice-edit',
      icon: 'fal fa-file-invoice',
      title: 'PURCHASE_INVOICE.INVOICE_ADD',
      isCancel: true,
      service: this.purchaseInvoiceService,
      isHideFooter: true
    };
  }

  ngOnInit() {
    this.getDefaultConfig();
    this.fnRunFirstSuccess = () => {
      this.initDataInvoice();
    };
  }

  // Get default config
  public getDefaultConfig(): void {
    // Get tên loại chi phí
    const requestConfigList = new ConfigListRequestPayload();
    requestConfigList.type = 'COST_TYPE';
    const temp = forkJoin([
      this.taxCodeService.select(),
      this.inputInvoiceInformationService.select(),
      this.store.select(currentUser).pipe(take(1)),
      this.configListService.select(requestConfigList)
    ]).subscribe(res => {
      this.taxCodeData = res[0] ? res[0] : null;
      this.listInvoiceTypeOnList = res[1] ? res[1] : null;
      this.useNameLoginData = res[2] ? res[2] : null;
      if (this.useNameLoginData && this.useNameLoginData.roles && this.useNameLoginData.roles.length > 0) {
        this.isRoleSuperAdmin = this.useNameLoginData.roles.find(x => x === 'SUPER_ADMIN') ? true : false;
      }
      if (this.useNameLoginData && this.useNameLoginData.groupId) {
        this.orgChartService.selectById(this.useNameLoginData.groupId).subscribe(rs => {
          this.orgChart = rs;
        });
      }
      this.listCostType = res[3];
      this.purchaseInvoiceItems.listCostType = res[3];
      this.purchaseInvoiceItems.taxCodeData = res[0] ? res[0] : null;
      if (this.fnRunFirstSuccess) {
        this.fnRunFirstSuccess();
      }
      this.cdr.detectChanges();
    });
    this.subscriptions.push(temp);

    this.currentTab = this.tabs[0].value;
    this.currentchangTab = this.tabDetails[0].value;
  }

  public initDataInvoice(): void {
    const routeSub = this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.formData.title = 'PURCHASE_INVOICE.INVOICE_INFORMATION';
        // Case 1: When edit an item
        this.currentPiId = params.id;
        this.requestPiItem.piId = params.id;
        this.fillForm();
      } else {
        // Case 2: When edit an item
        this.currentPiId = null;
        this.requestPiItem.piId = '0';

        if (!this.purchaseInvoiceData.costType) {
          // Default loại chi phí là Giá hàng hóa/dịch vụ
          this.purchaseInvoiceData.costType = ConfigListFactory.default('COST_TYPE', 'name');
          // Default hiển thị tính thuế
          this.purchaseInvoiceData.showImportVAT = true;
          // Default hiển thị control
          this.isShowCostTypeGoodsService = false;
          this.showBtnSyncErp = false;
        }
        // Default show btn lưu nháp với form add
        this.isShowBtnSaveDraft = true;
        // Default trạng thái là đang mở
        this.purchaseInvoiceData.status = this.statusInvoices[1].value;
        // Default trạng thái đồng bộ là Chưa đồng bộ
        this.purchaseInvoiceData.syncStatus = this.statusErps[0].value;
        // Default Loại hoá đơn là Purchase Invoice
        this.purchaseInvoiceData.invoiceType = InvoiceTypes.PurchaseInvoice;
        // Default Loại hóa đơn trên bảng kê 'Hàng hoá, dịch vụ mua trong nước'
        this.purchaseInvoiceData.invoiceTypeOnList = this.getInvoiceTypeOnListName(this.listInvoiceTypeOnList, '01');
        this.isShowInvoiceType = true;
        // default người tạo hóa đơn là người đăng nhập
        this.purchaseInvoiceData.createdByInvoice = this.useNameLoginData.userName;
        this.purchaseInvoiceData.fullName = this.useNameLoginData.fullName;
        // Default Ngày hoá đơn là ngày hiện tại
        // this.purchaseInvoiceData.date = new Date();
        // Default check hàng qua kho
        this.purchaseInvoiceData.isStoring = 0;
        // Default check thuế VAT được khấu trừ
        this.purchaseInvoiceData.isDeduct = 0;
        this.purchaseInvoiceData.isShowContractorTax = true;

        this.purchaseInvoiceDto(this.purchaseInvoiceData);
        setTimeout(() => {
          this.form.form.markAsPristine();
        }, 50);

        if (window.history.state.fromSm) {
          // tạo hóa đơn chi phí từ màn hình edit lô hàng chuyển sang
          this.getDataLocalStorageFromShipment();
        }
        if (window.history.state.purchaseOrderDataCreatePrepayment) {
          // tạo hóa đơn prepayment từ màn hình edit PO chuyển sang
          this.purchaseInvoiceData.invoiceType = InvoiceTypes.PrePaymentInvoice;
          this.purchaseInvoiceData.costType = this.getCostTypeName(this.listCostType, '7');
          setTimeout(() => {
            this.getPurchaseOrderDataCreatePrepaymentFromState();
          }, 0);
        }
      }
    });
    this.subscriptions.push(routeSub);
  }

  public purchaseInvoiceDto(source: any): void {
    this.purchaseInvoiceData.invoiceTypeDto = this.toDto('name', source.invoiceType);
    this.purchaseInvoiceData.invoiceTypeOnListDto = this.toDto('description', source.invoiceTypeOnList);
    this.purchaseInvoiceData.supplierNameDto = this.toDto('name', source.supplierName);
    this.purchaseInvoiceData.supplierSiteNameDto = this.toDto('code', source.supplierSiteName);
    this.purchaseInvoiceData.receivingDeptNameDto = this.toDto('fullName', source.receivingDeptName);
    this.purchaseInvoiceData.poCodeDto = this.toDto('code', source.poCode);
    this.purchaseInvoiceData.waybillNumberDto = this.toDto('waybillNumber', source.waybillNumber);
    this.purchaseInvoiceData.fullNameDto = this.toDto('fullName', source.fullName);
    this.purchaseInvoiceData.invoiceExportedNoDto = this.toDto('code', source.invoiceExportedNo);
    this.purchaseInvoiceData.projectCodeDto = this.toDto('code', source.projectCode);
    this.purchaseInvoiceData.ouNameDto = this.toDto('code', source.ouName);
    this.purchaseInvoiceData.orgApplyNameDto = this.toDto('name', source.orgApplyName);
    this.purchaseInvoiceData.taxTypeDto = this.toDto('description', source.taxType);
    this.purchaseInvoiceData.currencyDto = this.toDto('code', source.currency);
    this.purchaseInvoiceData.createdByInvoiceDto = this.toDto('fullName', source.fullName);
    this.purchaseInvoiceData.paymentTermDto = this.toDto('name', source.paymentTerm);

    const arrPeopleInvolved = this.purchaseInvoiceData.peopleInvolved ? this.purchaseInvoiceData.peopleInvolved.split(',') : [];
    this.purchaseInvoiceData.peopleInvolvedDto = [];
    arrPeopleInvolved.forEach(element => {
      this.purchaseInvoiceData.peopleInvolvedDto.push({ userName: element });
    });

    this.cdr.detectChanges();
  }

  public fillForm(): void {
    const initSub = this.purchaseInvoiceService.selectById(this.currentPiId).subscribe(res => {
      if (res) {
        if (!res.id) {
          this.router.navigate([`list`], { relativeTo: this.route.parent });
        }
        this.purchaseInvoiceData = res;
        this.purchaseInvoiceData.useNameLoginData = this.useNameLoginData;
        // Get shipmentId phục vụ bntBack
        if (window.history.state.fromSm) {
          const shipmentData = window.history.state.shipmentData;
          if (shipmentData && shipmentData.id) {
            this.purchaseInvoiceData.shipmentIdFromShipment = shipmentData.id;
          }
        }
        if ((this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '8')) ||
          (this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '9'))) {
          // Ẩn tính thuế cho Loại chi phí thuế VAT, thuế VAT nhập khẩu, control seri, symbol hóa đơn
          this.purchaseInvoiceData.showImportVAT = false;
          this.purchaseInvoiceData.seriNo = null;
          this.purchaseInvoiceData.symbol = null;
        } else {
          // Hiển thị tính thuế cho Loại chi phí thuế VAT, thuế VAT nhập khẩu, control seri, symbol hóa đơn
          this.purchaseInvoiceData.showImportVAT = true;
        }
        // Check ẩn/ hiện tính thuế với loại chi phí Thuế nhà thầu, Credit hãng thuế nhà thầu
        if ((this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '10')) ||
          (this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '11'))) {
          this.purchaseInvoiceData.showImportVAT = false;
        } else {
          this.purchaseInvoiceData.showImportVAT = true;
        }

        // disable btn đồng bộ nếu loại chi phí là Giá hàng hóa dịch vụ, vận chuyển, bảo hiểm
        if (this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '1')
          || this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '2')
          || this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '3')) {
          this.showBtnSyncErp = false;
        } else {
          this.showBtnSyncErp = true;
        }

        if (this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '4') ||
          this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '5') ||
          this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '6') ||
          this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '7') ||
          this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '12')) {
          // show control VAT được khấu trừ/ Không được khấu trừ - chỉ hiển thị khi hóa đơn trong nước, loại chi phí creditNote , khác
          this.isShowIsDeduct = true;
          this.showBtnSuggestionImport = true;
        }

        // Ẩn button AF tính thuế
        if (this.purchaseInvoiceData.taxStatus && this.purchaseInvoiceData.taxStatus !== 1) {
          this.isHideBtnAfCaculationTax = true; // Ẩn button
        }
        // // Ẩn button gửi XNK
        // if (this.purchaseInvoiceData.taxStatus && this.purchaseInvoiceData.taxStatus === 4) {
        //   this.isHideBtnSendXNK = true; // ẩn button gửi XNK
        // }
        this.purchaseInvoiceData.isShowContractorTax = this.isShowContractorTax;
        // Gửi dữ liệu sang control exchange-rate
        this.exchangeRateData = {
          date: this.purchaseInvoiceData.exchangeRateDate,
          type: this.purchaseInvoiceData.exchangeRateType,
          conversionRate: this.purchaseInvoiceData.conversionRate,
          currencyFrom: this.purchaseInvoiceData.currency
        };
        this.purchaseInvoiceDto(this.purchaseInvoiceData);

        this.initPiItemData();
        this.initObjectHasFile();
        this.cdr.detectChanges();
      } else {
        this.router.navigate([`list`], { relativeTo: this.route.parent });
      }
    });
    this.subscriptions.push(initSub);
  }

  public initPiItemData(): void {
    const paginatorSub = forkJoin([
      this.purchaseInvoiceItemService.select(this.requestPiItem),
      this.purchaseInvoiceItemService.count(this.requestPiItem)
    ]).subscribe(res => {
      if (res[0]) {
        this.dataSource.items = res[0];
        this.setAllowRequestImportGoodsAndBuyInternalUse();
        const temp = JSON.stringify(res[0]);
        this.purchaseInvoiceItemDataOrgin = JSON.parse(temp);
        this.dataSource.items.map(x => {
          // giữ lại id cũ
          x.originId = x.id;
          // Doanh thu có thuế TNDN binding nếu NCC chịu
          if (x.revenueCorporateTax === null || x.revenueCorporateTax === undefined) {
            // tslint:disable-next-line:max-line-length
            x.revenueCorporateTax = (((x.taxpayer === this.taxPayers[1].value || x.taxpayer === this.taxPayers[2].value) && x.amount) ? +(x.amount).toFixed(2) : null);
          }
          // Doanh thu chưa thuế binding nếu FIS chịu
          if ((x.revenueWithoutTax === null || x.revenueWithoutTax === undefined)) {
            x.revenueWithoutTax = ((x.taxpayer === this.taxPayers[0].value && x.amount) ? +(x.amount).toFixed(2) : null);
          }
          return x;
        });
        // Check ẩn tab tính thuế nhà thầu và cột thuế nhà thầu nếu hình thức mua hàng trong nước
        if (this.dataSource.items.length > 0) {
          // tslint:disable-next-line:max-line-length
          const check = this.dataSource.items.find(x => (x.taxpayer !== undefined && x.taxpayer !== null && x.taxpayer !== 0) && x.areaType !== 1);
          // check có thuế nhà thầu và loại chi phí là giá hàng hóa dịch vụ hoặc thanh toán trả trước
          if (check && (this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '1'))) {
            this.headerItemsTreeTable = config.HEADERS_ITEMS_TREE_TABLE;
            this.isShowContractorTax = true;
            this.isShowIsDeduct = false;
            this.purchaseInvoiceData.isShowContractorTax = true;
          } else {
            // set again header items ẩn thuế nhà thầu
            const tempHeader = JSON.stringify(this.headerItemsTreeTableOrigin);
            this.headerItemsTreeTable = JSON.parse(tempHeader);
            const index = this.headerItemsTreeTable.findIndex(x => x.field === 'taxpayer');
            if (index > -1) {
              this.headerItemsTreeTable.splice(index, 1);
            }
            this.isShowContractorTax = false;
            this.purchaseInvoiceData.isShowContractorTax = false;
            if (this.dataSource.items.find(x => x.areaType === 1)) {
              // show control VAT được khấu trừ/ Không được khấu trừ - chỉ hiển thị khi hóa đơn trong nước
              this.isShowIsDeduct = true;
            }
          }
        }

        // binding thêm trường để checkvaildate trường hợp copy tiếp từ PO. push thêm items
        if (this.purchaseInvoiceData.currency) {
          this.purchaseInvoiceData.checkVaidateCurrency = this.purchaseInvoiceData.currency;
        }
        if (this.purchaseInvoiceData.vendorId) {
          this.purchaseInvoiceData.checkVaidateVendorId = this.purchaseInvoiceData.vendorId;
        }
        if (this.dataSource.items && this.dataSource.items.length > 0) {
          this.purchaseInvoiceData.checkVaidatePoId = this.dataSource.items[0].poId;
        }
        if (this.purchaseInvoiceData.ouCode) {
          this.purchaseInvoiceData.checkVaidateOuCode = this.purchaseInvoiceData.ouCode;
        }
        if (this.dataSource.items && this.dataSource.items.length > 0) {
          this.purchaseInvoiceData.checkVaidateBuyInternalUse = this.dataSource.items.some(m => m.buyInternalUse === true);
        }
        if (this.dataSource.items && this.dataSource.items.length > 0) {
          this.purchaseInvoiceData.checkVaidateTaxpayer =
            this.dataSource.items.find(x => x.taxpayer) ? this.dataSource.items.find(x => x.taxpayer).taxpayer : 'undefined';
        }
        if (this.dataSource.items && this.dataSource.items.length > 0
          && this.dataSource.items.find(x => x.areaType)) {
          this.purchaseInvoiceData.checkVaidateAreaType =
            this.dataSource.items.find(x => x.areaType).areaType;
        }

        if (this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '1')) {
          const itemSourceTemp = this.dataSource.items;
          this.dataSource.items = [];
          const parentItems = itemSourceTemp.filter(x => !x.isSubItem);
          for (const parent of parentItems) {
            const node: TreeNode = {
              // tslint:disable-next-line:max-line-length
              data: { ...parent, quantityOrigin: parent.quantity, priceOrigin: parent.price, isFormEdit: true, taxDto: { name: parent.tax } },
              children: [],
              expanded: true,
              leaf: true
            };
            const childItems = itemSourceTemp.filter(x => x.isSubItem && this.quote(x.indexNo).startsWith(this.quote(parent.indexNo)));
            for (const child of childItems) {
              const childNode = {
                data: { ...child, quantityOrigin: child.quantity, priceOrigin: child.price, isFormEdit: true, taxDto: { name: child.tax } },
                leaf: true,
              };
              node.children.push(childNode);
              node.leaf = false;
            }
            this.dataSource.items.push(node);
          }
          this.dataSource.paginatorTotal = this.dataSource.items.length;
          this.dataSource.items = [...this.dataSource.items];

        } else {
          this.dataSource.paginatorTotal = res[1];
        }

        this.getTotalItems();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.form.form.markAsPristine();
          // Btn lưu nháp show khi hóa đơn đang trạng thái lưu nháp.
          if (this.purchaseInvoiceData.status === 9) {
            this.isShowBtnSaveDraft = true;
            this.form.form.markAsDirty();
          } else {
            this.isShowBtnSaveDraft = false;
          }
        }, 50);
      }
    });
    this.subscriptions.push(paginatorSub);
  }

  private initObjectHasFile() {
    const requestPp: any = { piId: this.purchaseInvoiceData.id, fileModule: 'PP' };
    const requestPr: any = { piId: this.purchaseInvoiceData.id, fileModule: 'PR' };
    const requestPo: any = { piId: this.purchaseInvoiceData.id, fileModule: 'PO' };
    const initSub = forkJoin([
      this.fileService.selectObjectHasFileInModule(requestPp),
      this.fileService.selectObjectHasFileInModule(requestPr),
      this.fileService.selectObjectHasFileInModule(requestPo)
    ]).subscribe(res => {
      this.listPpHasFile = res[0];
      this.listPrHasFile = res[1];
      this.listPoHasFile = res[2];
    });
    this.subscriptions.push(initSub);
  }

  private quote(source: string): string {
    return `.${source}.`;
  }

  public setAllowRequestImportGoodsAndBuyInternalUse() {
    let check = false;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.dataSource.items.length; i++) {
      if (this.dataSource.items[i]) {
        if (this.dataSource.items[i].areaType === 1 || this.dataSource.items[i].areaType === 2) {
          check = true;
        }
        if (this.dataSource.items[i].buyInternalUse) {
          this.isBuyInternalUse = true;
        }
      }
    }
    if (check && !this.isBuyInternalUse && this.purchaseInvoiceData.costType === 'Giá hàng hóa/dịch vụ') {
      this.allowRequestImportGoods = true;
    }
  }

  public onBtnCancelClick(): void {
    this.location.back();
    // if (this.purchaseInvoiceData.shipmentIdFromShipment) {
    //   if (this.currentPiId) {
    //     this.router.navigate([`../../../../shipment/list/edit/${this.purchaseInvoiceData.shipmentIdFromShipment}`],
    //       { relativeTo: this.activatedRoute });
    //   } else {
    //     this.router.navigate([`../../../shipment/list/edit/${this.purchaseInvoiceData.shipmentIdFromShipment}`],
    //       { relativeTo: this.activatedRoute });
    //   }
    // } else {
    //   this.router.navigate([`list`], { relativeTo: this.activatedRoute.parent });
    // }
  }

  public setFragmentToRoute(event: any): void {
    if (event.nextId !== 1 && !this.currentPiId) {
      if (event.nextId === 2) {
        // event.nextId === 2
        this.notificationService.showWarning('Vui lòng lưu thông tin trước khi thêm thông tin thanh toán');
      } else {
        // event.nextId === 3
        this.notificationService.showWarning('Vui lòng lưu thông tin trước khi đính kèm hồ sơ');
      }
    } else {
      this.currentTab = event.nextId;
    }
  }

  public changTabDetail(event: any) {
    this.currentchangTab = event.nextId;
  }

  private getDataLocalStorageFromShipment(): void {
    const shipmentData = window.history.state.shipmentData;
    const purchaseInvoiceData = window.history.state.purchaseInvoiceData;
    const purchaseOrderData = window.history.state.purchaseOrderData;
    if (purchaseOrderData && purchaseOrderData.ouCode) {
      this.purchaseInvoiceData.ouCode = purchaseOrderData.ouCode;
    }

    const costTypeCode = window.history.state.purchaseInvoiceData.costTypeDto.code;
    // tslint:disable-next-line:max-line-length
    this.purchaseInvoiceData.costType = costTypeCode ? this.getCostTypeName(this.listCostType, costTypeCode) : null; // Loại chi phí bảo hiểm - vận tải

    if (shipmentData) {
      // binding số vận đơn
      this.purchaseInvoiceData.waybillNumber = shipmentData.waybillNumber;

      // Check binding nếu là hóa đơn chi phí là thuế NK hoặc thuế VAT NK
      if (costTypeCode === '8' || costTypeCode === '9') {
        // Default hiển thị tính thuế
        this.purchaseInvoiceData.showImportVAT = false;
        // Default hiển thị control
        this.purchaseInvoiceData.seriNo = null;
        this.purchaseInvoiceData.symbol = null;

        this.purchaseInvoiceData.projectCode = shipmentData.projectCode ? shipmentData.projectCode : null;
        this.purchaseInvoiceData.ouCode = shipmentData.ouCode ? shipmentData.ouCode : null;
        this.purchaseInvoiceData.ouName = shipmentData.ouName ? shipmentData.ouName : null;
        this.purchaseInvoiceData.subDepartmentId = purchaseOrderData.subDepartmentId ? purchaseOrderData.subDepartmentId : null;
        this.purchaseInvoiceData.orgApplyName = shipmentData.orgApplyName ? shipmentData.orgApplyName : null;
        this.purchaseInvoiceData.invoiceDesc = purchaseInvoiceData.invoiceDesc;
        this.purchaseInvoiceItems.addItem.note = this.purchaseInvoiceData.invoiceDesc;
      }
      if (costTypeCode === '2' || costTypeCode === '3') {
        this.purchaseInvoiceData.projectCode = purchaseInvoiceData.projectCode;
        this.purchaseInvoiceData.invoiceDesc = purchaseInvoiceData.invoiceDesc;
        this.purchaseInvoiceItems.addItem.note = this.purchaseInvoiceData.invoiceDesc;
      }
      // Check default hóa đơn bảo hiểm mặc định loại tiền là VND
      if (costTypeCode === '2' || costTypeCode === '8' || costTypeCode === '9') {
        // defalt Loại tiền là VND
        this.purchaseInvoiceData.currency = 'VND';
      } else {
        // binding Loại tiền lô hàng
        // Khác loại chi phí vận tải mới binding
        this.purchaseInvoiceData.currency = costTypeCode !== '3' ? shipmentData.currency : null;
      }

      // binding bộ phận nhận hàng
      this.purchaseInvoiceData.receivingDept = shipmentData.receivingDept;
      this.purchaseInvoiceData.receivingDeptName = shipmentData.receivingDeptName;
      // Get shipmentId phục vụ bntBack
      if (shipmentData && shipmentData.id) {
        this.purchaseInvoiceData.shipmentIdFromShipment = shipmentData.id;
      }

      this.purchaseInvoiceDto(this.purchaseInvoiceData);

      if (this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '1')
        || this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '2')
        || this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '3')) {
        this.showBtnSyncErp = false;
      } else {
        this.showBtnSyncErp = true;
      }
    }
  }

  private getPurchaseOrderDataCreatePrepaymentFromState(): void {
    const po = window.history.state.purchaseOrderDataCreatePrepayment;
    if (po && po.id) {
      if (!this.purchaseInvoiceData.poCode) {
        this.purchaseInvoiceData.poCode = po.code;
      }
      //
      if (!this.purchaseInvoiceData.currency) {
        this.purchaseInvoiceData.currency = po.currency;
      }
      //
      if (!this.purchaseInvoiceData.invoiceDesc) {
        this.purchaseInvoiceData.invoiceDesc = po.note;
      }
      //
      if (!this.purchaseInvoiceData.vendorId) {
        this.purchaseInvoiceData.vendorId = po.vendorId;
        this.purchaseInvoiceData.supplierName = po.supplierName;
      }
      //
      if (!this.purchaseInvoiceData.siteId) {
        this.purchaseInvoiceData.siteId = po.siteId;
      }
      //
      if (!this.purchaseInvoiceData.supplierTax) {
        this.purchaseInvoiceData.supplierTax = po.supplierTax;
      }
      //
      if (!this.purchaseInvoiceData.supplierSiteName) {
        this.purchaseInvoiceData.supplierSiteName = po.supplierSiteName;
      }
      //
      if (!this.purchaseInvoiceData.ouCode) {
        this.purchaseInvoiceData.ouCode = po.ouCode;
        this.purchaseInvoiceData.ouName = po.ouName;
      }
      //
      if (!this.purchaseInvoiceData.subDepartmentId) {
        this.purchaseInvoiceData.subDepartmentId = po.subDepartmentId;
        this.purchaseInvoiceData.orgApplyName = po.orgApplyName;
      }
      //
      if (!this.purchaseInvoiceData.paymentTerm) {
        this.purchaseInvoiceData.paymentTerm = po.paymentTerm;
      }
      //
      if (!this.purchaseInvoiceData.projectCode) {
        this.purchaseInvoiceData.projectCode = po.projectCode;
      }

      this.checkCurrency();
      this.purchaseInvoiceDto(this.purchaseInvoiceData);

      const piiTemp = [];
      const temp: any = {};
      temp.id = null;
      temp.quantity = 1;
      if (po.prepaymentRatio) {
        temp.price = this.rounding(po.totalAmount * po.prepaymentRatio / 100);
        temp.amount = temp.price;
      }
      piiTemp.push(temp);

      this.dataSource = {
        items: piiTemp,
        paginatorTotal: piiTemp.length
      };

    }
  }

  public rounding(value: number): number {
    return (Math.round(value * 100) / 100);
  }

  public onBtnCopyForCreditNoteClick(): void {
    this.dialogCopyForCreditNote.showDialog();
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
    this.dialogRefPo.input.id = this.currentPiId;
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
    this.dialogRefPi.input.id = this.currentPiId;
    this.dialogRefPi.input.isShowDelete = false;
    this.dialogRefPi.show();
  }

  // Lấy thông tin từ form Copy PO
  public loadItemFromPo(data: any): void {
    if (data) {
      if (data.listParent[0]) {
        if (!this.purchaseInvoiceData.currency) {
          this.purchaseInvoiceData.currency = data.listParent[0].currency;
          this.purchaseInvoiceData.checkVaidateCurrency = data.listParent[0].currency;
        }
        //
        this.purchaseInvoiceData.checkVaidateBuyInternalUse = data.listParent[0].buyInternalUse;
        //
        if (!this.purchaseInvoiceData.invoiceDesc) {
          this.purchaseInvoiceData.invoiceDesc = data.listParent[0].note;
        }
        //
        if (!this.purchaseInvoiceData.vendorId) {
          this.purchaseInvoiceData.checkVaidateVendorId = data.listParent[0].vendorId;
          this.purchaseInvoiceData.vendorId = data.listParent[0].vendorId;
          this.purchaseInvoiceData.supplierName = data.listParent[0].supplierName;
        }
        //
        if (!this.purchaseInvoiceData.siteId) {
          this.purchaseInvoiceData.siteId = data.listParent[0].siteId;
        }
        //
        if (!this.purchaseInvoiceData.supplierTax) {
          this.purchaseInvoiceData.supplierTax = data.listParent[0].supplierTax;
        }
        //
        if (!this.purchaseInvoiceData.supplierSiteName) {
          this.purchaseInvoiceData.supplierSiteName = data.listParent[0].supplierSiteName;
        }
        //
        this.purchaseInvoiceData.checkVaidatePoId = data.listParent[0].id;
        //
        if (!this.purchaseInvoiceData.ouCode) {
          this.purchaseInvoiceData.checkVaidateOuCode = data.listParent[0].ouCode;
          this.purchaseInvoiceData.ouCode = data.listParent[0].ouCode;
        }
        //
        if (!this.purchaseInvoiceData.subDepartmentId) {
          this.purchaseInvoiceData.subDepartmentId = data.listParent[0].subDepartmentId;
        }
        //
        if (!this.purchaseInvoiceData.paymentTerm) {
          this.purchaseInvoiceData.paymentTerm = data.listParent[0].paymentTerm;
        }
        //
        if (!this.purchaseInvoiceData.projectCode) {
          this.purchaseInvoiceData.projectCode = data.listParent[0].projectCode;
        }
        // binding thêm trường để checkvaildate trường hợp copy tiếp. push thêm items
        if (!this.purchaseInvoiceData.checkVaidateTaxpayer) {
          this.purchaseInvoiceData.checkVaidateTaxpayer =
            data.listParent.find(x => x.taxpayer) ? data.listParent.find(x => x.taxpayer).taxpayer : 'undefined';
        }
        //
        if (!this.purchaseInvoiceData.checkVaidateAreaType && data.listParent.find(x => x.areaType)) {
          this.purchaseInvoiceData.checkVaidateAreaType = data.listParent.find(x => x.areaType).areaType;
        }

        // Check ẩn tab tính thuế nhà thầu và cột thuế nhà thầu nếu hình thức mua hàng trong nước
        // check có thuế nhà thầu và loại chi phí là giá hàng hóa dịch vụ hoặc thanh toán trả trước
        if (this.purchaseInvoiceData.checkVaidateTaxpayer && this.purchaseInvoiceData.checkVaidateAreaType !== 1
          && (this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '1'))) {
          // set again header items có thuế nhà thầu
          this.headerItemsTreeTable = config.HEADERS_ITEMS_TREE_TABLE;
          this.purchaseInvoiceData.isShowContractorTax = true;
        } else {
          // set again header items ẩn thuế nhà thầu
          const tempHeader = JSON.stringify(this.headerItemsTreeTableOrigin);
          this.headerItemsTreeTable = JSON.parse(tempHeader);
          const index = this.headerItemsTreeTable.findIndex(x => x.field === 'taxpayer');
          if (index > -1) {
            this.headerItemsTreeTable.splice(index, 1);
          }
          this.purchaseInvoiceData.isShowContractorTax = false;
        }
        if (this.purchaseInvoiceData.checkVaidateAreaType === 1) {
          // Hiển thị control VAT được khấu trừ / Không được khấu trừ khi hóa đơn trong nước
          this.isShowIsDeduct = true;
        }

        if (this.purchaseInvoiceData.checkVaidateAreaType === 3 || this.purchaseInvoiceData.checkVaidateAreaType === 4) {
          // Default Loại hoá đơn là Other Invoice với đơn hàng ngoại và vẫn cho phép sửa
          this.purchaseInvoiceData.invoiceType = InvoiceTypes.OtherInvoice;
        }

        this.checkCurrency();
        this.purchaseInvoiceDto(this.purchaseInvoiceData);
      }

      if (this.dataSource.items && data.listChildren && this.dataSource.items.length > 0) {
        for (const element of data.listChildren) {
          if (!this.dataSource.items.find(x => x.data.id === element.data.id)) {
            const index = this.dataSource.items.findIndex(x => x.data.poId === element.data.poId && x.data.poItemId === element.data.id);
            if (index > -1) {
              if (this.dataSource.items[index].data.quantity < this.dataSource.items[index].data.poiQuantity) {
                this.dataSource.items[index].data.quantity += +element.data.quantityRemain;
                this.purchaseInvoiceItems.calculateAmount(this.dataSource.items[index].data);
              }
              if (element.children && element.children.length > 0) {
                for (const obj of element.children) {
                  this.dataSource.items[index].children.find(x => {
                    if (x.data.poId === obj.data.poId && x.data.poItemId === obj.data.id) {
                      if (x.data.quantity < x.data.poiQuantity) {
                        x.data.quantity += +obj.data.quantityRemain;
                        this.purchaseInvoiceItems.calculateAmount(x.data);
                      }
                    }
                  });
                }
              }
            } else {
              // get indexNo cho items new
              element.data.indexNo = (this.dataSource.items.length + 1).toString();
              if (element.children && element.children.length > 0) {
                for (let i = 0; i < element.children.length; i++) {
                  element.children[i].data.indexNo = (element.data.indexNo + '.' + (i + 1)).toString();
                }
              }
              this.dataSource.items = this.dataSource.items.concat(element);
            }
          }
        }
        this.dataSource.paginatorTotal = this.dataSource.items.length;
      } else {
        this.dataSource = {
          items: data.listChildren,
          paginatorTotal: data.listChildren.length
        };
      }

      // bingding thêm thông tin cho line hàng
      this.dataSource.items.map(x => {
        // binding thông tin items cha
        if (x.data && !x.data.piId) {
          const parent = data.listParent.filter(y => y.id === x.data.poId);
          x.data.quantity = x.data.quantityRemain;
          x.data.quantityOrigin = x.data.quantity;
          x.data.priceOrigin = x.data.price;
          x.data.status = null; // Không binding trạng thái
          // Trường hợp SRV có số lượng là 1 thì đơn giá bằng số tiền còn lại
          if (x.data.quantity === 1 && x.data.itemType === 'SRV') {
            x.data.price = x.data.amountRemain;
          }
          if (x && !x.data.amount) {
            x.data.amount = x.data.amountRemain;
          }
          if (parent && parent.length > 0) {
            x.data.delivery = parent[0].delivery;
            x.data.taxpayer = parent[0].taxpayer;
            x.data.orgCode = parent[0].orgCode;
          }
          this.purchaseInvoiceItems.calculateAmount(x.data);
        }
        // binding thông tin items con
        if (x.children && x.children.length > 0) {
          x.children.map(chil => {
            if (chil && chil.data && !chil.data.piId) {
              const parent = data.listParent.filter(y => y.id === chil.data.poId);
              chil.data.quantity = chil.data.quantityRemain;
              chil.data.quantityOrigin = chil.data.quantity;
              chil.data.priceOrigin = chil.data.price;
              chil.data.status = null; // Không binding trạng thái
              if (!chil.data.amount) {
                chil.data.amount = chil.data.amountRemain;
              }
              if (parent && parent.length > 0) {
                chil.data.delivery = parent[0].delivery;
                chil.data.taxpayer = parent[0].taxpayer;
                chil.data.orgCode = parent[0].orgCode;
              }
              this.purchaseInvoiceItems.calculateAmount(chil.data);
            }
          });
        }
        return x;
      });

      if (this.purchaseInvoiceData.invoiceTypeOnList === 'Hàng hoá, dịch vụ không được khấu trừ thuế') {
        this.dataSource.items.map(x => {
          // binding thông tin items cha
          x.data.tax = 'IP-KHONG CHIU THUE';
          if (x.children && x.children.length > 0) {
            x.children.map(chil => {
              if (chil.data) {
                // binding thông tin items con
                chil.data.tax = 'IP-KHONG CHIU THUE';
              }
            });
          }
          return x;
        });
      }
      this.dataSource.paginatorTotal = this.dataSource.items.length;
      // Check nếu khác loại chi phí giá hàng hóa dịch vụ và thanh toán trả trước ==> Không copy line hàng PO
      if (this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '1')) {
        this.getTotalItems();
      } else {
        this.dataSource = { items: [], paginatorTotal: undefined };
      }
      this.hasEditRow = true;
      setTimeout(() => {
        this.form.form.markAsDirty();
        this.cdr.detectChanges();
      }, 100);
    }
  }

  // Lấy thông tin từ form Copy PI
  public loadItemFromPi(data: any): void {
    if (data) {
      this.requestPiItem.piId = data.id;
      const initSub = forkJoin([
        this.purchaseInvoiceService.selectById(data.id),
        this.purchaseInvoiceItemService.select(this.requestPiItem),
      ]).subscribe(res => {
        this.purchaseInvoiceData = res[0];
        if (!this.currentPiId) {
          this.purchaseInvoiceData.id = null;
        }
        this.purchaseInvoiceData.syncStatus = 1;
        this.purchaseInvoiceData.syncErp = null;
        this.purchaseInvoiceData.erpInvoiceId = null;
        this.purchaseInvoiceData.errorSyncReceipt = null;
        this.purchaseInvoiceData.errorSyncAp = null;
        this.purchaseInvoiceData.isSuggestionImport = null;
        this.purchaseInvoiceData.waybillNumber = null;
        this.purchaseInvoiceData.createdByInvoiceDto = this.toDto('fullName', this.purchaseInvoiceData.fullName);
        this.purchaseInvoiceData.code = this.purchaseInvoiceData.code + '-CLONE';

        this.checkCurrency();
        this.purchaseInvoiceDto(this.purchaseInvoiceData);

        if (this.purchaseInvoiceData.invoiceTypeOnList === 'Hàng hoá, dịch vụ không được khấu trừ thuế') {
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.dataSource.items.length; i++) {
            const item = this.dataSource.items[i];
            item.data.tax = 'IP-KHONG CHIU THUE';
            if (item.children && item.children.length > 0) {
              // tslint:disable-next-line:prefer-for-of
              for (let j = 0; j < item.children.length; j++) {
                const children = item.children[j];
                children.data.tax = 'IP-KHONG CHIU THUE';
              }
            }
          }
        }
        // Check ẩn tab tính thuế nhà thầu và cột thuế nhà thầu nếu hình thức mua hàng trong nước
        if (res[1][0].areaType === 1) {
          // set again header items ẩn thuế nhà thầu
          const tempHeader = JSON.stringify(this.headerItemsTreeTableOrigin);
          this.headerItemsTreeTable = JSON.parse(tempHeader);
          const index = this.headerItemsTreeTable.findIndex(x => x.field === 'taxpayer');
          if (index > -1) {
            this.headerItemsTreeTable.splice(index, 1);
          }
          this.isShowIsDeduct = true;
          this.purchaseInvoiceData.isShowContractorTax = false;
        } else {
          // check có thuế nhà thầu và loại chi phí là giá hàng hóa dịch vụ hoặc thanh toán trả trước
          // tslint:disable-next-line:max-line-length
          const check = this.dataSource.items.find(x => (x.taxpayer !== undefined && x.taxpayer !== null && x.taxpayer !== 0) && x.areaType !== 1);
          if (check && this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '1')) {
            // set again header items có thuế nhà thầu
            this.headerItemsTreeTable = config.HEADERS_ITEMS_TREE_TABLE;
            this.isShowIsDeduct = false;
            this.purchaseInvoiceData.isShowContractorTax = true;
          }
        }

        this.dataSource.paginatorTotal = res[1].length;
        this.getTotalItems();
        setTimeout(() => {
          this.form.form.markAsDirty();
          this.cdr.detectChanges();
        }, 100);
      });
      this.subscriptions.push(initSub);
    }
  }

  public loadItemForCreditNote(data) {
    const costType = this.purchaseInvoiceData.costType;
    this.purchaseInvoiceData = data.pi;
    if (!this.currentPiId) {
      this.purchaseInvoiceData.id = null;
    }
    this.purchaseInvoiceData.costType = costType;
    this.purchaseInvoiceData.syncStatus = 1;
    this.purchaseInvoiceData.syncErp = null;
    this.purchaseInvoiceData.erpInvoiceId = null;
    this.purchaseInvoiceData.errorSyncReceipt = null;
    this.purchaseInvoiceData.errorSyncAp = null;
    this.purchaseInvoiceData.isSuggestionImport = null;
    this.purchaseInvoiceData.waybillNumber = null;
    this.purchaseInvoiceData.createdByInvoiceDto = this.toDto('fullName', this.purchaseInvoiceData.fullName);
    this.purchaseInvoiceData.code = this.purchaseInvoiceData.code + '/credit-note-CLONE';
    this.checkCurrency();
    this.purchaseInvoiceDto(this.purchaseInvoiceData);

    const piiTemp = [];
    for (const item of data.pii) {
      const temp: any = {};
      temp.id = null;
      temp.rootPiItemId = item.id;
      temp.quantity = 1;
      temp.projectCodeCreditNote = item.projectCode;
      temp.poIdCreditNote = item.poId;
      temp.poCodeCreditNote = item.poCode;
      temp.itemCodeCreditNote = item.itemCode;
      temp.partNoCreditNote = item.partNo;
      temp.itemNameCreditNote = item.itemName;
      temp.itemTypeCreditNote = item.itemType;
      temp.unitCreditNote = item.unit;
      piiTemp.push(temp);
    }

    this.dataSource = {
      items: piiTemp,
      paginatorTotal: piiTemp.length
    };
  }

  public onBtnSavePurchaseInvoiceClick(): void {
    if (this.form && !!this.validateBeforeSave() && !!this.checkinvoiceDateBeforeSave()) {
      this.processSavePurchaseInvoice();
    }
  }

  public checkinvoiceDateBeforeSave(): boolean {
    if (this.purchaseInvoiceData && this.purchaseInvoiceData.date) {
      let nowDate = new Date();
      nowDate = new Date(nowDate.toDateString());
      let invoiceDate = new Date(this.purchaseInvoiceData.date);
      invoiceDate = new Date(invoiceDate.toDateString());
      if (nowDate && invoiceDate && invoiceDate > nowDate) {
        this.notificationService.showWarning('Ngày hóa đơn không được lớn hơn ngày hiện tại');
        return false;
      }
      return true;
    }
  }

  // Lưu nháp
  public onBtnSaveAsDraftClick(): void {
    this.processSavePurchaseInvoice('save-draft');
  }

  public processSavePurchaseInvoice(saveDraft?: string): void {
    if (this.form.form.dirty || this.hasEditRow) {
      const saveConfirmation = new SaveConfirmation();
      saveConfirmation.accept = () => {
        const requestSaveDto = this.createRequestSave();
        if (saveDraft) {
          // Trạng thái hóa đơn là lưu nháp khi click btn lưu nháp
          requestSaveDto.purchaseInvoice.status = 9;
          this.purchaseInvoiceData.status = 9;
          this.purchaseInvoiceService.saveDraft(requestSaveDto).subscribe(res => {
            if (res) {
              setTimeout(() =>
                this.form.form.markAsPristine(), 0);
              this.currentPiId = res.id;
              this.router.navigate([`list/view/${this.currentPiId}`], { relativeTo: this.activatedRoute.parent });
              this.notificationService.showSuccess();
              this.hasEditRow = false;
              this.initPiItemData();
            }
          });
        } else {
          if (requestSaveDto.purchaseInvoice.status === 9) {
            // Thêm trường check lưu update QuantityRemain poi trong trường hợp lưu nháp ==> Lưu chính thức
            requestSaveDto.purchaseInvoice.statusOrigin = this.purchaseInvoiceData.status;
            // Đang trạng thái lưu nháp click btn lưu hóa đơn ==> trạng thái đang mở
            requestSaveDto.purchaseInvoice.status = this.statusInvoices[1].value;
            this.purchaseInvoiceData.status = this.statusInvoices[1].value;
            this.isShowBtnSaveDraft = false;
          }
          this.purchaseInvoiceService.save(requestSaveDto).subscribe(res => {
            if (res) {
              setTimeout(() => this.form.form.markAsPristine(), 0);
              this.redirectAfterSave(res.id);
              this.currentPiId = res.id;
              this.notificationService.showSuccess();
              this.hasEditRow = false;
              this.initPiItemData();
            }
          });
        }
      };
      this.notificationService.confirm(saveConfirmation);
    } else {
      this.redirectToParentPage();
    }
  }

  private redirectAfterSave(id: string): void {
    if (this.purchaseInvoiceData.shipmentIdFromShipment) {
      if (this.currentPiId) {
        // back về lô hàng nếu hóa đơn được thêm từ lô hàng
        this.router.navigate([`../../../../shipment/list/edit/${this.purchaseInvoiceData.shipmentIdFromShipment}`]
          , { relativeTo: this.activatedRoute });
      } else {
        // back về lô hàng nếu hóa đơn được thêm từ lô hàng
        this.router.navigate([`../../../shipment/list/edit/${this.purchaseInvoiceData.shipmentIdFromShipment}`]
          , { relativeTo: this.activatedRoute });
      }
    } else {
      // Trường hợp sửa
      if (this.currentPiId) {
        this.router.navigate([], { relativeTo: this.activatedRoute });
      } else {
        this.router.navigate([`../view/${id}`], { relativeTo: this.activatedRoute });
      }
    }
  }

  private validateBeforeSave(saveDraft?: string): boolean {
    if (!this.validateForm(this.form, this.formData.formId)) {
      // Chức năng lưu nháp không validate form
      if (!saveDraft) {
        return false;
      }
    }
    if (this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '1')) {
      const checkData = this.flatSpreadTreeTable(this.purchaseInvoiceItems.purchaseInvoiceItemsData.items);
      if (checkData.length > 200) {
        this.notificationService.showWarning('Số lượng vượt quá giới hạn cho phép lưu');
        return false;
      }
    } else {
      if (this.purchaseInvoiceItems.purchaseInvoiceItemsData.items.length > 200) {
        this.notificationService.showWarning('Số lượng vượt quá giới hạn cho phép lưu');
        return false;
      }
    }

    if (this.purchaseInvoiceItems.formPii) {
      if (!this.validateForm(this.purchaseInvoiceItems.formPii, 'purchase-invoice-item')) {
        // Chức năng lưu nháp không validate form
        if (!saveDraft) {
          return false;
        }
      }
    }

    if (!this.acceptSave) {
      this.notificationService.showWarning('Số lượng hoặc giá trị tạo HĐ không hợp lệ');
      return false;
    }

    let listItemCheck = [];
    if (this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '1')) {
      listItemCheck = this.getListNotTree(this.purchaseInvoiceItems.purchaseInvoiceItemsData.items);
    } else {
      listItemCheck = this.purchaseInvoiceItems.purchaseInvoiceItemsData.items;
    }
    if (listItemCheck.length === 0) {
      this.notificationService.showWarning('Vui lòng thêm ít nhất một line hàng để thực hiện lưu');
      return false;
    }
    if (listItemCheck.find(x => x.quantity === 0)) {
      this.notificationService.showWarning('Vui lòng nhập số lượng cho tất cả hàng hoá');
      return false;
    }
    if (listItemCheck.find(x => x.price === null || x.price === undefined)) {
      this.notificationService.showWarning('Vui lòng nhập giá cho tất cả hàng hoá');
      return false;
    }
    return true;
  }

  public getListNotTree(data: any[]): any {
    // trải phẳng dữ liệu
    const arrResult = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      arrResult.push(item.data);
      if (item.children && item.children.length > 0) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < item.children.length; j++) {
          const children = item.children[j];
          arrResult.push(children.data);
        }
      }
    }
    return arrResult;
  }

  private redirectToParentPage(): void {
    this.router.navigate([`list`], { relativeTo: this.activatedRoute.parent });
  }

  public loadFromPurchaseInvoiceItem(data?: any): void {
    this.initPiItemData();
    this.cdr.detectChanges();
  }

  public onChangeSupplier() {
    if (this.purchaseInvoiceData.supplierNameDto) {
      const supplierDto = this.purchaseInvoiceData.supplierNameDto;
      this.purchaseInvoiceData.vendorId = supplierDto.vendorId;
      this.purchaseInvoiceData.supplierTax = supplierDto.taxCode;

      if (this.purchaseInvoiceData.costType !== this.getCostTypeName(this.listCostType, '8')
        && this.purchaseInvoiceData.costType !== this.getCostTypeName(this.listCostType, '9')) {
        this.getSupplierSiteBySupplier();
      }
      this.focusOutCheckExists();
    } else {
      this.purchaseInvoiceData.supplierTax = null;
    }
    this.purchaseInvoiceData.siteId = null;
    this.purchaseInvoiceData.supplierSiteName = null;
    this.purchaseInvoiceData.supplierSiteNameDto = null;
  }

  private getSupplierSiteBySupplier(): void {
    if (this.purchaseInvoiceData.ouCode && this.purchaseInvoiceData.vendorId) {
      const requestSupplierSite: any = {
        ouId: this.purchaseInvoiceData.ouCode,
        vendorId: this.purchaseInvoiceData.vendorId
      };
      this.supplierSiteService.select(requestSupplierSite).subscribe(resp => {
        if (resp && resp.length > 0) {
          // TODO tìm site công nợ
          const item = resp.find(x => x.code === 'CONG NO');
          if (item) {
            this.purchaseInvoiceData.siteId = item.siteId;
            this.purchaseInvoiceData.supplierSiteName = item.name;
            this.purchaseInvoiceData.supplierSiteNameDto = this.toDto('code', this.purchaseInvoiceData.supplierSiteName);
            this.cdr.detectChanges();
          } else {
            this.purchaseInvoiceData.siteId = null;
            this.purchaseInvoiceData.supplierSiteName = null;
            this.purchaseInvoiceData.supplierSiteNameDto = null;
            this.cdr.detectChanges();
          }
        }
      });
    }
  }

  public onChangeSupplierSite(event: any) {
    if (event) {
      this.purchaseInvoiceData.siteId = event.siteId;
    }
  }

  public onChangeSubInventoryCode(subInventoryDto: any) {
    if (subInventoryDto) {
      this.purchaseInvoiceData.subInventory = subInventoryDto.code;
      this.purchaseInvoiceData.subInventoryName = subInventoryDto.name;
    }
  }

  private getTotalItems(): void {
    if (!this.dataSource || this.dataSource.items.length === 0) {
      return;
    }
    if (this.purchaseInvoiceData && this.dataSource.items && this.dataSource.items.length > 0) {
      let quantityTotal = 0;
      let quantitySuggestTotal = 0;
      let moneyTotal = 0;
      let totalWithTax = 0;

      if (this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '1')) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.dataSource.items.length; i++) {
          // xử lý items cha
          const item = this.dataSource.items[i];
          quantityTotal += +item.data.quantity ? item.data.quantity : 0;
          quantitySuggestTotal += +item.data.quantitySuggest ? +item.data.quantitySuggest : 0;
          moneyTotal += item.data.amount ? +item.data.amount : 0;
          totalWithTax += +item.data.taxAmount ? +item.data.taxAmount : 0;
          // xử lý items con
          if (item.children && item.children.length > 0) {
            // tslint:disable-next-line:prefer-for-of
            for (let j = 0; j < item.children.length; j++) {
              const children = item.children[j];
              quantityTotal += children.data.quantity ? +children.data.quantity : 0;
              quantitySuggestTotal += children.data.quantitySuggest ? +children.data.quantitySuggest : 0;
              moneyTotal += children.data.amount ? +children.data.amount : 0;
              totalWithTax += +children.data.taxAmount ? +children.data.taxAmount : 0;
            }
          }
        }
      } else {
        for (const item of this.dataSource.items) {
          if (item.quantity) {
            quantityTotal += +item.quantity;
          }
          quantitySuggestTotal += +item.quantitySuggest;
          if (item.amount) {
            moneyTotal += +item.amount;
          }
          if (item.tax) {
            totalWithTax += +item.taxAmount ? +item.taxAmount : 0;
          }
        }
      }
      // Hóa đơn thuế không update ở đây
      if (this.purchaseInvoiceData.code && !this.purchaseInvoiceData.code.search('/Tax')) {
        this.purchaseInvoiceData.totalAmount = moneyTotal;
      }

      this.purchaseInvoiceItems.priceTotal = moneyTotal;
      this.purchaseInvoiceItems.quantityTotal = quantityTotal;
      this.purchaseInvoiceItems.quantitySuggestTotal = quantitySuggestTotal;
      this.purchaseInvoiceItems.moneyTotal = moneyTotal;
      this.purchaseInvoiceItems.totalWithTax = totalWithTax;
    } else {
      this.purchaseInvoiceData.totalAmount = 0;
      this.purchaseInvoiceItems.priceTotal = 0;
      this.purchaseInvoiceItems.quantityTotal = 0;
      this.purchaseInvoiceItems.quantitySuggestTotal = 0;
      this.purchaseInvoiceItems.moneyTotal = 0;
      this.purchaseInvoiceItems.totalWithTax = 0;
    }
  }

  public editRow(acceptSave: any): void {
    if (acceptSave === true || acceptSave === false) {
      this.acceptSave = acceptSave;
    }
    this.hasEditRow = true;
    if (this.purchaseInvoiceItems) {
      this.purchaseInvoiceData.totalAmount = this.purchaseInvoiceItems.priceTotal;
    }
    this.getTotalItems();
    if (acceptSave === 'dirty') {
      this.form.form.markAsDirty();
    }
  }

  public onBtnSyncErpClick(): void {
    if (this.purchaseInvoiceData.syncErp && this.purchaseInvoiceData.syncErp >= 2) {
      return;
    }
    if (!this.isBuyInternalUse) {
      if (this.form.dirty) {
        this.notificationService.showWarning('VALIDATION.PURCHASE_INVOICE.MSG_006');
        return;
      }
      let purchaseInvoiceItemsData = [];
      if (this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '1')) {
        purchaseInvoiceItemsData = this.flatSpreadTreeTable(this.purchaseInvoiceItems.purchaseInvoiceItemsData.items);
      } else {
        purchaseInvoiceItemsData = this.purchaseInvoiceItems.purchaseInvoiceItemsData.items;
      }

      if (purchaseInvoiceItemsData.length < 1) {
        this.notificationService.showWarning('VALIDATION.PURCHASE_INVOICE.MSG_001');
        return;
      }

      const contractorTax = purchaseInvoiceItemsData.find(x => x.taxpayer);
      // tslint:disable-next-line:max-line-length
      if (contractorTax && this.purchaseInvoiceData.taxStatus < 4 && this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '1')) {
        this.notificationService.showWarning('Vui lòng thực hiện tính thuế nhà thầu và gửi XNK để thực hiện đồng bộ.');
        return;
      }

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < purchaseInvoiceItemsData.length; i++) {
        // if (!this.purchaseInvoiceItems.purchaseInvoiceItemsData.items[i].projectMilestone) {
        //   this.notificationService.showWarning('VALIDATION.PURCHASE_INVOICE.MSG_004');
        //   return;
        // }
        if (!purchaseInvoiceItemsData[i].termAccount) {
          this.notificationService.showWarning('VALIDATION.PURCHASE_INVOICE.MSG_007');
          return;
        }
      }
    }

    this.dialogRefSyncAp.config.style = { width: '50%' };
    this.dialogRefSyncAp.config.title = 'Xác nhận đồng bộ ERP';
    this.dialogSyncErpAp.ngOnInit();
    this.dialogRefSyncAp.show();
    this.cdr.detectChanges();
  }

  public goToImportGoods() {
    this.router.navigate([`import-goods/invoice/${this.purchaseInvoiceData.id}`], {
      relativeTo: this.route.parent.parent,
      fragment: '1'
    });
  }

  public requestImportGoods() {
    if (!this.validateBeforeImportGoods()) {
      return;
    }
    this.dialogRequestImport.onShowDialog();
  }

  public printPaperImportGoods() {
    this.dialogRequestImport.purchaseInvoiceData.print = true;
    this.dialogRequestImport.onShowDialog();
  }

  public updateStatusImportGoods(event: any): void {
    this.purchaseInvoiceService.selectById(this.currentPiId).subscribe(res => {
      if (res) {
        const dataUpdate: any = {
          ...res,
          importStatus: 1
        };
        // Lưu người đề nghị nhập kho là người đăng nhập
        if (event) {
          dataUpdate.warehouseImport = event;
        }
        // Trạng thái tính thuế khác hoàn thành, đổi trạng thái sang AF tính thuế
        if (this.purchaseInvoiceData.taxStatus !== 4) {
          dataUpdate.taxStatus = 2;
        }
        this.purchaseInvoiceService.requestImportGoods(dataUpdate).subscribe(m => {
          this.purchaseInvoiceData.importStatus = 1;
          this.defaultInfoSaveNotification('AF_INV');
          this.notificationService.showSuccess();
          this.dialogRequestImport.close();
          this.cdr.detectChanges();
        });
      }
    });
  }

  public defaultInfoSaveNotification(type?: any): void {
    this.notificationData.status = 1;
    this.notificationData.module = 'Request-import-goods';
    const requestImportGoods = { id: this.currentPiId, code: this.purchaseInvoiceData ? this.purchaseInvoiceData.code : '' };
    this.notificationData.messageContent = JSON.stringify(requestImportGoods);

    if (type === 'AF_ADMIN') {
      this.notificationData.role = 'AF_ADMIN';
      this.notificationData.description = 'Check thông tin items SRV cập nhật tài khoản định khoản';
    }
    if (type === 'AF_TAX') {
      this.notificationData.role = 'AF_TAX';
      this.notificationData.description = 'Check thông tin hóa đơn, tính thuế nhà thầu';
    }

    if (type === 'AF_INV') {
      this.notificationData.role = 'AF_INV';
      this.notificationData.description = 'Check thông tin hóa đơn, PO và làm nhập hàng hóa đơn';
    }

    if (type === 'Calculate-tax') {
      this.notificationData.module = 'Calculate-tax';
      this.notificationData.role = 'AF_TAX';
      this.notificationData.description = 'Check thông tin hóa đơn, tính thuế nhà thầu';
    }

    if (type === 'Suggestion-import') {
      this.notificationData.module = 'Suggestion-import';
      this.notificationData.role = 'AF_AP';
      this.notificationData.description = ' Đề nghị nhập. Cần check thông tin Hóa đơn và làm nhập hàng (đẩy đồng bộ ERP phân hệ AP)';
    }

    const saveSub = this.notificationListService.merge(this.notificationData).subscribe(() => { });
    this.subscriptions.push(saveSub);

  }

  private validateBeforeImportGoods(): boolean {
    if (this.purchaseInvoiceData.importStatus && this.purchaseInvoiceData.importStatus >= 1) {
      return false;
    }

    if (this.form.dirty) {
      this.notificationService.showWarning('VALIDATION.PURCHASE_INVOICE.MSG_006');
      return false;
    }

    const checkItemData = this.flatSpreadTreeTable(this.purchaseInvoiceItems.purchaseInvoiceItemsData.items);
    if (checkItemData.find(item => !item.taxpayer !== null && item.taxpayer !== undefined)) {
      // Thông báo tính thuế
      this.defaultInfoSaveNotification('AF_TAX');
    }
    if (checkItemData.find(item => !item.termAccount && item.itemType === 'SRV')) {
      // Thông báo cập nhật thông tin tài khoản định khoản
      this.defaultInfoSaveNotification('AF_ADMIN');
    }
    for (const item of checkItemData) {
      if (!item.itemCode) {
        this.notificationService.showWarning('VALIDATION.PURCHASE_INVOICE.MSG_002');
        return false;
      }
      // if (!item.termAccount && item.itemType === 'SRV' && item.isUpdateSrv) {
      //   this.notificationService.showWarning('VALIDATION.PURCHASE_INVOICE.MSG_003');
      //   return false;
      // }
      if ((!item.subInventory && item.itemType !== 'SRV') ||
        (!item.subInventory && item.itemType === 'SRV' && !item.isUpdateSrv)) {
        this.notificationService.showWarning('VALIDATION.PURCHASE_INVOICE.MSG_008');
        return false;
      }
    }
    return true;
  }

  public btnAfCalculateTax(): void {
    if (this.isHideBtnAfCaculationTax) {
      return;
    }
    const saveConfirmation = new SaveConfirmation();
    saveConfirmation.accept = () => {
      this.purchaseInvoiceData.taxStatus = 2; // Đổi trạng thái sang AF tính thuế
      this.isHideBtnAfCaculationTax = true; // Ẩn button
      this.purchaseInvoiceService.afCacuationTax(this.purchaseInvoiceData).subscribe(m => {
        this.purchaseInvoiceData.taxStatus = 2;
        this.defaultInfoSaveNotification('Calculate-tax');
        this.cdr.detectChanges();
        this.notificationService.showSuccess();
      });
    };
    this.notificationService.confirm(saveConfirmation);
  }

  public valueStoreChange(event: any): void {
    this.purchaseInvoiceData.isStoring = event.value;
    this.form.form.markAsDirty();
  }

  public valueTaxVatChange(event: any): void {
    this.purchaseInvoiceData.isDeduct = event.value;
    if (event.value === 1) {
      this.purchaseInvoiceData.invoiceTypeOnList = 'Hàng hoá, dịch vụ không được khấu trừ thuế';
      this.purchaseInvoiceData.invoiceTypeOnListDto = {
        description: 'Hàng hoá, dịch vụ không được khấu trừ thuế'
      };
    }
    this.form.form.markAsDirty();
  }

  public onChangeCurrency() {
    this.purchaseInvoiceData.currency = this.purchaseInvoiceData.currencyDto ? this.purchaseInvoiceData.currencyDto.code : null;
    // set giá trị exchangeRateType về null
    this.purchaseInvoiceData.exchangeRateType = null;
    this.exchangeRateData.currencyFrom = this.purchaseInvoiceData.currency;
    if (this.purchaseInvoiceItems && this.contractorTaxCalculation) {
      this.contractorTaxCalculation.exchangeRateData.currencyFrom = this.purchaseInvoiceData.currency;
    }
    this.checkCurrency();
  }

  public onChangeExchangeRate(exchangeRateData: any): void {
    if (exchangeRateData) {
      this.purchaseInvoiceData.exchangeRateDate = exchangeRateData.date;
      this.purchaseInvoiceData.exchangeRateType = exchangeRateData.type;
      this.purchaseInvoiceData.conversionRate = exchangeRateData.conversionRate;
    }
  }

  public onChangeAccount(): void {
    if (this.purchaseInvoiceData.receivingDeptNameDto) {
      this.purchaseInvoiceData.receivingDept = this.purchaseInvoiceData.receivingDeptNameDto.userName;
    }
  }

  private createRequestSave(): PurchaseInvoiceRequestSaveDto {
    const requestSave = new PurchaseInvoiceRequestSaveDto();
    requestSave.purchaseInvoice = this.purchaseInvoiceData;
    if (!this.currentPiId) {
      delete requestSave.purchaseInvoice.id;
    }
    // Trạng thái AF đã tính thuế
    if (this.dataSource.items.find(x => x.corporateTaxRate || x.vatTaxRate)) {
      requestSave.purchaseInvoice.taxStatus = 3; // Đổi trạng thái tính thuế sang AF tạm tính
    }
    // default trạng thái tính thuế là chưa gửi AF nếu khác hình thức mua hàng trong nước và có thuế nhà thầu.
    if (!this.dataSource.items.find(x => x.areaType === 1 || (x.taxpayer === undefined || x.taxpayer === null || x.taxpayer === 0))) {
      requestSave.purchaseInvoice.taxStatus = requestSave.purchaseInvoice.taxStatus ? requestSave.purchaseInvoice.taxStatus : 1;
    }
    // Form thêm hoặc form edit nếu sửa item mới xử lý item
    if (!this.currentPiId || (this.currentPiId && (this.hasEditRow || (this.purchaseInvoiceData.status === 9 && this.isShowTreeTable)))) {
      requestSave.idPiItemDeletes = this.purchaseInvoiceItemDataOrgin.map(x => x.id);

      // bỏ binding 2 chiều
      let dataSourceTemp = [];
      if (this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '1')) {
        dataSourceTemp = this.flatSpreadTreeTable(this.dataSource.items);
      } else {
        dataSourceTemp = this.dataSource.items;
      }
      const temp = JSON.stringify(dataSourceTemp);
      requestSave.purchaseInvoiceItem = JSON.parse(temp);

      requestSave.purchaseInvoiceItem.map(x => {
        if (!x.poItemId && x.id && x.poId) {
          x.poItemId = x.id;
        }
        x.igOrgCode = x.orgCode;
        x.igSubInventory = x.subInventory;
        // Bảo hiểm, vận tải, THuế NK
        if (this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '2') ||
          this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '3') ||
          this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '8')
        ) {
          if (!x.termAccount) {
            x.termAccount = '062000.000.7000A.15690010.00.00.000000.0000';
            // FIS HCM
            if (this.purchaseInvoiceData.ouCode === 1160) {
              x.termAccount = '063000.000.7000A.15690010.00.00.000000.0000';
            }
          }
        } else if (this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '9')) { // Thuế VAT NK
          if (!x.termAccount) {
            x.termAccount = '062000.000.7000A.13310020.00.00.000000.0000';
          }
        }

        // originId là id cũ của bản ghi
        if (this.currentPiId && x.originId) {
          x.id = x.originId;
        } else {
          delete x.id;
        }
        return x;
      });

      if ((this.hasEditRow || this.purchaseInvoiceData.status === 9) && this.isShowTreeTable) { // Có update ngược lại PO hay không
        const purchaseOrderItem = JSON.parse(temp);
        if (purchaseOrderItem && purchaseOrderItem.length > 0) {
          requestSave.purchaseOrderItem = purchaseOrderItem.filter(x => x.poItemId || !this.currentPiId);
        }
        if (requestSave.purchaseOrderItem.length > 0) {
          requestSave.purchaseOrderItem.map(x => {
            x.quantityRequestSave = x.quantity; // quantity request save pi
            x.quantity = x.poiQuantity;
            if (x.piId) {
              x.id = x.poItemId;
            }
            return x;
          });
        }
      }
    }
    return requestSave;
  }

  public flatSpreadTreeTable(purchaseInvoiceItems: any): any {
    const purchaseInvoiceItemsData = purchaseInvoiceItems;
    // trải phẳng tree. Bỏ tree table
    const arrItemSave = [];
    for (let i = 0; i < purchaseInvoiceItemsData.length; i++) {
      const item = purchaseInvoiceItemsData[i];
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

  public onChangeCostType(event: any): void {
    if (event) {
      this.dataSource = { items: [], paginatorTotal: undefined };
      this.purchaseInvoiceData.costType = event;
      this.isCostTypeCredit = false;
      this.isCostTypeCreditNote = false;
      this.isCostTypeForShipment = false;
      this.isShowCostTypeGoodsService = true;
      this.showBtnSyncErp = true;
      this.isShowCostTypeInsurranceTransport = true;
      this.isDisabledAmount = true;
      this.isShowPoNumber = false;
      this.purchaseInvoiceData.showImportVAT = true;
      this.isShowTreeTable = false;
      this.costTypeInsurrance = false;
      this.isShowIsDeduct = false;
      this.headerItemsTable = this.headerItemsTableOrigin.filter(m => m); // tạo mảng mới không binding

      // Check Loại chi phí Giá hàng hóa/dịch vụ
      if (event === this.getCostTypeName(this.listCostType, '1')) {
        this.isShowTreeTable = true;
        this.isShowCostTypeGoodsService = false;
        this.purchaseInvoiceData.poCode = null;
        this.showBtnSyncErp = false;
      }

      // Check loại chi phí vận tải, bảo hiểm
      if (event === this.getCostTypeName(this.listCostType, '2') || event === this.getCostTypeName(this.listCostType, '3')) {
        this.isShowCostTypeInsurranceTransport = false;
        this.showBtnSyncErp = false;
        this.isCostTypeForShipment = true;
        this.headerItemsTable = this.headerItemsTableCostShipmentOrigin.filter(m => m);
      }

      // Check loại chi phí thuế NK, thuế VAT NK
      if (event === this.getCostTypeName(this.listCostType, '8') || event === this.getCostTypeName(this.listCostType, '9')) {
        this.isCostTypeForShipment = true;
        this.headerItemsTable = this.headerItemsTableCostShipmentOrigin.filter(m => m);
      }

      // Check default hóa đơn bảo hiểm mặc định loại tiền là VND
      if ((event === this.getCostTypeName(this.listCostType, '2'))) {
        // defalt Loại tiền là VND
        this.purchaseInvoiceData.currency = 'VND';
        this.purchaseInvoiceData.currencyDto = this.toDto('code', this.purchaseInvoiceData.currency);
        this.costTypeInsurrance = true;
      }

      // Check Loại chi phí Credit note
      if ((event === this.getCostTypeName(this.listCostType, '4')) ||
        (event === this.getCostTypeName(this.listCostType, '5')) ||
        (event === this.getCostTypeName(this.listCostType, '6'))) {
        this.isCostTypeCreditNote = true;
        this.headerItemsTable = this.headerItemsTableCreditNoteOrigin.filter(m => m); // tạo mảng mới không binding
      }

      // Check Loại chi phí Credit
      if ((event === this.getCostTypeName(this.listCostType, '4')) ||
        (event === this.getCostTypeName(this.listCostType, '5')) ||
        (event === this.getCostTypeName(this.listCostType, '6')) ||
        (event === this.getCostTypeName(this.listCostType, '11'))) {
        this.isCostTypeCredit = true;
        this.isShowPoNumber = true;
      }

      // Check Loại chi phí Credit Note, chi phí khác
      if ((event === this.getCostTypeName(this.listCostType, '4')) ||
        (event === this.getCostTypeName(this.listCostType, '5')) ||
        (event === this.getCostTypeName(this.listCostType, '6')) ||
        (event === this.getCostTypeName(this.listCostType, '7')) ||
        (event === this.getCostTypeName(this.listCostType, '12'))) {
        this.isShowIsDeduct = true;
      }

      // Check Loại chi phí khác & thuế
      if ((event === this.getCostTypeName(this.listCostType, '7')) ||
        (event === this.getCostTypeName(this.listCostType, '8')) ||
        (event === this.getCostTypeName(this.listCostType, '9')) ||
        (event === this.getCostTypeName(this.listCostType, '10')) ||
        (event === this.getCostTypeName(this.listCostType, '12'))) {
        this.isShowPoNumber = true;
      }

      // Check ẩn tính thuế cho Loại chi phí Thuế nhà thầu, Credit hãng thuế nhà thầu
      if ((event === this.getCostTypeName(this.listCostType, '10')) ||
        (event === this.getCostTypeName(this.listCostType, '11'))) {
        this.purchaseInvoiceData.showImportVAT = false;
      }
      // thuế NK
      if (event === this.getCostTypeName(this.listCostType, '8')) {
        this.purchaseInvoiceData.invoiceType = InvoiceTypes.OtherInvoice;
        this.purchaseInvoiceData.isDisableInvoiceType = true;
        this.purchaseInvoiceData.showImportVAT = false;
        this.purchaseInvoiceData.seriNo = null;
        this.purchaseInvoiceData.symbol = null;
      } else {
        this.purchaseInvoiceData.isDisableInvoiceType = false;
      }
      // Loại chi phí là Thuế VAT NK thì binding Loại hóa đơn là "Purchase invoice",
      // Loại hóa đơn trên bảng kê thuế = Hàng hoá, dịch vụ nhập khẩu(02)
      if (event === this.getCostTypeName(this.listCostType, '9')) {
        this.purchaseInvoiceData.invoiceType = InvoiceTypes.PurchaseInvoice;
        this.purchaseInvoiceData.invoiceTypeOnList = this.getInvoiceTypeOnListName(this.listInvoiceTypeOnList, '02');
        this.purchaseInvoiceData.showImportVAT = false;
        this.purchaseInvoiceData.seriNo = null;
        this.purchaseInvoiceData.symbol = null;
        // loại chi phí là Thuế VAT NK thì binding control tax trên line hàng default là IPVAT 10%-HHNK
        this.purchaseInvoiceData.taxId = '12';
      } else {
        this.purchaseInvoiceData.taxId = 'null';
      }
      // Check nếu là loại chi phí vận tải, bảo hiểm, thuế thì ẩn đi
      if ((event === this.getCostTypeName(this.listCostType, '2'))
        || (event === this.getCostTypeName(this.listCostType, '3'))
        || (event === this.getCostTypeName(this.listCostType, '8'))
        || (event === this.getCostTypeName(this.listCostType, '9'))
        || (event === this.getCostTypeName(this.listCostType, '10'))) {
        this.purchaseInvoiceData.isStoring = null;
      }

      // Khác giá hàng hoá dịch vụ thì cho phép nhập tổng tiền
      if (this.dataSource.items && event !== this.getCostTypeName(this.listCostType, '1') && this.dataSource.items.length === 0) {
        this.isDisabledAmount = false;
      }
      this.purchaseInvoiceDto(this.purchaseInvoiceData);
    }
  }

  public getCostTypeName(source: any[], code: string): string {
    const item = source.filter(x => x.code === code)[0];
    return item ? item.name : null;
  }

  public getInvoiceTypeOnListName(source: any[], flexValue: string): string {
    const item = source.filter(x => x.flexValue === flexValue)[0];
    return item ? item.description : null;
  }

  public changeInvoiceTypeOnList(event: any): void {
    if (event) {
      this.purchaseInvoiceData.invoiceTypeOnList = event.description;
      if (event.flexValue !== '08') {
        this.purchaseInvoiceData.taxType = null;
      } else {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.dataSource.items.length; i++) {
          const item = this.dataSource.items[i];
          item.data.tax = 'IP-KHONG CHIU THUE';
          if (item.children && item.children.length > 0) {
            // tslint:disable-next-line:prefer-for-of
            for (let j = 0; j < item.children.length; j++) {
              const children = item.children[j];
              children.data.tax = 'IP-KHONG CHIU THUE';
            }
          }
        }
      }
    }
  }

  public focusOutCheckExists(): void {
    const request = new PurchaseInvoiceRequestPayload();
    request.code = this.purchaseInvoiceData.code ? this.purchaseInvoiceData.code : null;
    request.seriNo = this.purchaseInvoiceData.seriNo ? this.purchaseInvoiceData.seriNo : null;
    request.symbol = this.purchaseInvoiceData.symbol ? this.purchaseInvoiceData.symbol : null;
    request.vendorId = this.purchaseInvoiceData.vendorId ? this.purchaseInvoiceData.vendorId : null;
    request.piId = this.currentPiId ? this.currentPiId : null;
    if (this.purchaseInvoiceData.vendorId) {
      // NCC trên hóa đơn phải trùng với PO
      if (this.purchaseInvoiceData.checkVaidateVendorId
        && this.purchaseInvoiceData.checkVaidateVendorId !== this.purchaseInvoiceData.vendorId
        && this.purchaseInvoiceData.costType === this.getCostTypeName(this.listCostType, '1')) {
        this.form.form.controls[`vendorId`].setErrors({ INVALID_SUPPLIER_PO_HD: true });
      } else {
        this.form.form.controls[`vendorId`].setErrors(null);
      }
      this.purchaseInvoiceService.checkInvoiceExist(request).subscribe(m => {
        if (m) {
          if (this.form.form.controls[`code`] && this.form.form.controls[`code`].value) {
            this.form.form.controls[`code`].setErrors({ ALREADY_EXISTS: true });
          }
          if (this.form.form.controls[`seriNo`] && this.form.form.controls[`seriNo`].value) {
            this.form.form.controls[`seriNo`].setErrors({ ALREADY_EXISTS: true });
          }
          if (this.form.form.controls[`symbol`] && this.form.form.controls[`symbol`].value) {
            this.form.form.controls[`symbol`].setErrors({ ALREADY_EXISTS: true });
          }
        } else {
          if (this.form.form.controls[`code`] && this.form.form.controls[`code`].value) {
            this.form.form.controls[`code`].setErrors(null);
          }
          if (this.form.form.controls[`seriNo`] && this.form.form.controls[`seriNo`].value) {
            this.form.form.controls[`seriNo`].setErrors(null);
          }
          if (this.form.form.controls[`symbol`] && this.form.form.controls[`symbol`].value) {
            this.form.form.controls[`symbol`].setErrors(null);
          }
        }
        this.cdr.detectChanges();
      });
    }
  }

  public onBtnAddItemClick(): void {
    this.isShowAddItemPI = false;
    this.cdr.detectChanges();
    this.isShowAddItemPI = true;
    this.dialogRefAddPiItem.config = {
      style: { width: '50vw' },
      baseZIndex: 10000,
      draggable: true,
      maximizable: true,
      btnTitle: 'COMMON.CRUD.ADD',
      title: 'Thêm mới hàng hoá'
    };
    this.dialogRefAddPiItem.show();
  }

  // Add item from PI
  public onLoadItemAddData(data: any): void {
    if (data) {
      if (data.ppIdCurrent) {
        data.piId = data.ppIdCurrent;
        this.hasEditRow = true;
      }
      if (!data.amount) {
        data.amount = data.quantity * data.price ? data.quantity * data.price : null;
      }
      if (this.dataSource.items && this.dataSource.items.length > 0) {
        this.dataSource.items = this.dataSource.items.concat(data);
        this.dataSource.paginatorTotal = this.dataSource.items.length;
      } else {
        this.dataSource.items.push(data);
        this.dataSource.paginatorTotal = this.dataSource.items.length;
      }
      this.getTotalItems();
    }
    this.cdr.detectChanges();
  }

  public onChangeInvoiceType(event: any): void {
    if (event && event.id) {
      this.purchaseInvoiceData.invoiceTypeOnList = null;
      this.purchaseInvoiceData.invoiceTypeOnListDto = null;
      this.purchaseInvoiceData.invoiceType = event.name;
      if (event.id === '1' || event.id === '2') {
        this.isShowInvoiceType = false;
        // reset khi loại hóa đơn khác Purchase Invoice
        this.purchaseInvoiceData.invoiceTypeOnList = null;
        this.purchaseInvoiceData.seriNo = null;
        this.purchaseInvoiceData.symbol = null;
      } else {
        // event.id === '3'
        this.purchaseInvoiceData.invoiceTypeOnList = this.getInvoiceTypeOnListName(this.listInvoiceTypeOnList, '01');
        this.purchaseInvoiceData.invoiceTypeOnListDto = this.toDto('description', this.purchaseInvoiceData.invoiceTypeOnList);
        this.isShowInvoiceType = true;


      }
    }
  }

  public onChangeLegal(event: any): void {
    if (event) {
      this.purchaseInvoiceData.ouCode = event.ouId;
    } else {
      this.purchaseInvoiceData.ouCode = null;
    }
    this.purchaseInvoiceData.siteId = null;
    this.purchaseInvoiceData.supplierSiteName = null;
    this.purchaseInvoiceData.supplierSiteNameDto = null;
    this.purchaseInvoiceData.subDepartmentId = null;
    this.purchaseInvoiceData.orgApplyNameDto = null;
    this.purchaseInvoiceData.projectCode = null;
    this.purchaseInvoiceData.projectCodeDto = null;
  }

  public onChangeOrgApply(event: any): void {
    if (event) {
      this.purchaseInvoiceData.subDepartmentId = event.subDepartmentId;
      this.purchaseInvoiceData.orgApplyName = event.name;
    } else {
      this.purchaseInvoiceData.subDepartmentId = null;
      this.purchaseInvoiceData.orgApplyName = null;
    }
  }

  public onChangeProjectCode(event: any): void {
    if (event) {
      this.purchaseInvoiceData.projectCode = event.code;
    } else {
      this.purchaseInvoiceData.projectCode = null;
    }
  }

  public onChangePoCode(event: any): void {
    this.purchaseInvoiceData.poCode = event ? event.code : '';
    if (event) {
      this.purchaseInvoiceData.projectCodeDto = this.toDto('code', event.projectCode);
      this.purchaseInvoiceData.ouNameDto = this.toDto('code', event.ouName);
      this.purchaseInvoiceData.orgApplyNameDto = this.toDto('name', event.orgApplyName);

      this.purchaseInvoiceData.projectCode = event.projectCode;
      this.purchaseInvoiceData.ouCode = event.ouCode;
      this.purchaseInvoiceData.ouName = event.ouName;
      this.purchaseInvoiceData.subDepartmentId = event.subDepartmentId;
      this.purchaseInvoiceData.orgApplyName = event.orgApplyName;
    }
  }

  public onChangeWaybillNumber(event: any): void {
    this.purchaseInvoiceData.waybillNumber = this.purchaseInvoiceData.waybillNumberDto ?
      this.purchaseInvoiceData.waybillNumberDto.waybillNumber : null;
    if (event && event.id) {
      const requestSI = new ShipmentItemRequestPayload();
      requestSI.shipmentId = event.id;
      this.shipmentItemService.select(requestSI).subscribe(res => {
        if (res) {
          const requestPo: any = {};
          res.find(x => requestPo.id = requestPo.id ? requestPo.id : x.poId);
          this.purchaseOrderService.selectById(requestPo.id).subscribe(m => {
            if (m) {
              this.purchaseInvoiceData.projectCode = m.projectCode;
            }
          });
        }
      });
    }
  }

  public onChangePaymentTerm(event: any): void {
    if (event) {
      this.purchaseInvoiceData.paymentTerm = event.name;
    } else {
      this.purchaseInvoiceData.paymentTerm = null;
    }
  }

  public syncSuccess(data: any): void {
    if (data) {
      this.purchaseInvoiceData = data;
      this.purchaseInvoiceDto(this.purchaseInvoiceData);
      if (this.isBuyInternalUse) {
        const tempData = {
          ...data,
          updatePoStatusToFinish: true
        };
        this.purchaseInvoiceService.merge(tempData).subscribe(m => {
          this.notificationService.showSuccess();
        });
      } else {
        this.notificationService.showSuccess();
      }
    }
    this.cdr.detectChanges();
  }

  public loadExchangeRateData(exchangeRateData: any): void {
    if (exchangeRateData) {
      this.form.form.markAsDirty();
      this.purchaseInvoiceData.erDateTax = exchangeRateData.date;
      this.purchaseInvoiceData.erTypeTax = exchangeRateData.type;
      this.purchaseInvoiceData.conversionRateTax = exchangeRateData.conversionRate;
    }
  }

  public onBtnRequestUpdateClick(): void {
    this.dialogRefRequestUpdOrg.show();
    this.dialogRefRequestUpdOrg.input = this.dataSource;
    this.dialogRefRequestUpdOrg.input.piId = this.currentPiId;
  }

  public suggestionImport(): void {
    if (!this.purchaseInvoiceData.isSuggestionImport) {
      const saveConfirmation = new SaveConfirmation();
      saveConfirmation.accept = () => {
        const data: any = {
          id: this.purchaseInvoiceData.id
        };
        this.purchaseInvoiceService.suggestionImport(data).subscribe(m => {
          if (m) {
            this.purchaseInvoiceData.isSuggestionImport = true;
            this.defaultInfoSaveNotification('Suggestion-import');
            this.cdr.detectChanges();
            this.notificationService.showSuccess();
          }
        });
      };
      this.notificationService.confirm(saveConfirmation);
    }
  }

  // Cảnh báo với loại hoá đơn Purchase invoice , loại tiền khác VND
  private checkCurrency(): void {
    if (this.purchaseInvoiceData.invoiceType === InvoiceTypes.PurchaseInvoice && this.purchaseInvoiceData.currency !== 'VND') {
      this.notificationService.showWarning('VALIDATION.PURCHASE_INVOICE.MSG_009');
    }
  }

  public onChangePeopleInvolved(data) {
    if (this.purchaseInvoiceData.peopleInvolvedDto) {
      const listUserName = this.purchaseInvoiceData.peopleInvolvedDto.map(({ userName }) => userName);
      this.purchaseInvoiceData.peopleInvolved = listUserName.join(',');
    }
  }

  public returnPi() {
    const confirmation = new CustomConfirmation('SYNC_ERP.CONFIRM_RETURN_MESSAGE');
    confirmation.accept = () => {
      const request: any = {
        piId: this.purchaseInvoiceData.id
      };
      this.syncErpService.returnPi(request).subscribe(m => {
        if (m) {
          this.initDataInvoice();
          this.notificationService.showSuccess();
          this.cdr.detectChanges();
        }
      });
    };
    this.notificationService.confirm(confirmation);
  }

  public viewLogPi() {
    const request: any = {
      piId: this.purchaseInvoiceData.id
    };
    this.syncErpService.viewLogPi(request).subscribe(m => {
      console.log(m);
    });
  }

}
