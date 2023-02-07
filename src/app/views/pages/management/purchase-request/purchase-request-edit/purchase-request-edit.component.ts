import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PurchaseRequestItemRequestPayload
} from '../../../../../services/modules/purchase-request-item/purchase-request-item.request-payload';
import { PurchaseRequestService } from '../../../../../services/modules/purchase-request/purchase-request.service';
import { FormDynamicData } from '../../../../partials/content/crud/component/form-dynamic-data.model';
import * as parentConfig from '../purchase-request.config';
import * as config from './purchase-request-edit.config';
import * as configPurchasePlanEdit from '../../purchase-plan/purchase-plan-edit/purchase-plan-edit.config';
import {
  OperatingUnitService
} from '../../../../../services/modules/category/organization-management/operating-unit/operating-unit.service';
import { OrganizationService } from '../../../../../services/modules/category/organization-management/organization/organization.service';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { NgForm } from '@angular/forms';
import { DialogRef } from '../../../../partials/content/crud/dialog/dialog-ref.model';
import { forkJoin } from 'rxjs';
import { PurchaseRequestItemService } from '../../../../../services/modules/purchase-request-item/purchase-request-item.service';
import { DeleteConfirmation } from '../../../../../services/common/confirmation/delete-confirmation';
import * as mainConfig from '../../../../../core/_config/main.config';
import { MenuItem, TreeNode } from 'primeng/api';
import { DepartmentService } from '../../../../../services/modules/category/department/department.service';
import { PurchasePlanItemService } from '../../../../../services/modules/purchase-plan-item/purchase-plan-item.service';
import { PurchasePlanService } from '../../../../../services/modules/purchase-plan/purchase-plan.service';
import { UserService } from '../../../../../services/modules/user/user.service';
import { BaseFormComponent } from '../../../../../core/_base/component';
import { LayoutConfigService } from '../../../../../core/_base/layout';
import { ItemService } from '../../../../../services/modules/category/item/item.service';
import { CurrencyService } from '../../../../../services/modules/category/currency/currency.service';
import { CurrencyRequestPayload } from '../../../../../services/modules/category/currency/currency.request.payload';
import { SupplierRequestPayload } from '../../../../../services/modules/category/supplier/supplier.request.payload';
import { SupplierService } from '../../../../../services/modules/category/supplier/supplier.service';
import { BrandRequestPayload } from '../../../../../services/modules/category/brand/brand.request.payload';
import { BrandService } from '../../../../../services/modules/category/brand/brand.service';
import { BusinessProcessManagementComponent } from '../../../../partials/business-process-management/business-process-management.component';
import { SaveConfirmation } from '../../../../../services/common/confirmation/save-confirmation';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { currentUser } from '../../../../../core/auth';
import { OrgChartService } from '../../../../../services/modules/org-chart/org-chart.service';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomConfirmation } from '../../../../../services/common/confirmation/custom-confirmation';
import { ConfigListService } from '../../../../../services/modules/config-list/config-list.service';
@Component({
  selector: 'app-purchase-request-edit',
  templateUrl: './purchase-request-edit.component.html',
  styleUrls: ['./purchase-request-edit.component.scss']
})
export class PurchaseRequestEditComponent extends BaseFormComponent implements OnInit, AfterViewChecked {
  @ViewChild('form', { static: true }) form: NgForm;
  @ViewChild('formAssign', { static: true }) formAssign: NgForm;
  @ViewChild('bpm', { static: false }) bpm: BusinessProcessManagementComponent;

  public dialogRef: DialogRef = new DialogRef();
  public dialogRefUpdateItem: DialogRef = new DialogRef();
  public isShowPurchaseRequestEditItem = false;
  public isShowDialogUpdateItem = false;
  public formData: FormDynamicData;
  public formTitle = 'PURCHASE_REQUEST.HEADER_EDIT';
  public purchaseRequestData: any = {};
  public totalBom: any = [];
  public selectedPurchaseRequestItemRef: any = [];
  public prTypeTemp = parentConfig.PR_TYPE;
  public prContractInfo = parentConfig.PR_CONTRACT_INFO;
  public prStatus = parentConfig.PR_STATUS;
  public header: any;
  public mainConfig: any = mainConfig.MAIN_CONFIG;
  public headerOperatingUnit = config.HEADER_OPERATING_UNIT;
  public headerOrg = config.HEADER_ORG;
  public headerDepartment = config.HEADER_DEPARMENT;
  public headerItems = configPurchasePlanEdit.HEADER_ITEMS;
  public itemTypes = configPurchasePlanEdit.ITEM_TYPE;
  public headerCurrency = configPurchasePlanEdit.HEADER_CURRENCY;
  public headerSuppliers = configPurchasePlanEdit.HEADER_SUPPLIER;
  public headerUser = config.HEADER_USER;

  private requestItem = new PurchaseRequestItemRequestPayload();
  public currencyRequestPayload = new CurrencyRequestPayload();
  public supplierRequestPayload = new SupplierRequestPayload();
  public dataSource = {
    items: null,
    paginatorTotal: undefined,
  };
  public prIdCurrent: string;
  public frozenCols: any[];
  public hasEditRow = false;
  public showDialogAssign = false;

  public selectedNode: any;
  public producerNameData: any[];
  public purchaseRequestItems = [];

  public allowViewPrice = false; // check có cả AM và PM thì PM không được xem giá
  public canEditOtherInformation = false; // AM, PM chỉ đc sửa giá. BP, XNK, AF, SUPPER_ADMIN có thể sửa các thông tin khác
  public file: any;

  public btnItems: MenuItem[] = [
    { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: () => this.configBeforeEdit(this.selectedNode) },
    { label: 'Xóa', icon: 'pi pi-fw pi-times', command: () => this.configBeforeDelete(this.selectedNode) }
  ];
  public isShowControl = false;
  public itemSrv: any = {};

  constructor(
    public purchaseRequestService: PurchaseRequestService,
    private purchaseRequestItemService: PurchaseRequestItemService,
    public operatingUnitService: OperatingUnitService,
    public organizationService: OrganizationService,
    public departmentService: DepartmentService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    public itemService: ItemService,
    public notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    public supplierService: SupplierService,
    public purchasePlanService: PurchasePlanService,
    public purchasePlanItemService: PurchasePlanItemService,
    public userService: UserService,
    public currencyService: CurrencyService,
    public brandService: BrandService,
    public configListService: ConfigListService,
    public layoutConfigService: LayoutConfigService,
    public orgChartService: OrgChartService,
    private store: Store<AppState>
  ) {
    super();
    this.formData = {
      formId: 'purchase-request-edit',
      icon: 'fal fa-shopping-cart',
      title: this.formTitle,
      service: this.purchaseRequestService,
      isCancel: true,
      isHideFooter: true
    };
  }

  ngOnInit() {
    // Xử lý frozenCols table. tránh binding 2 chiều
    const temp = JSON.stringify(config.HEADER);
    this.header = JSON.parse(temp);
    this.frozenCols = this.header.slice(0, 4);
    this.header.splice(0, 4);
    this.initData();
    this.getBrand();
    this.getDefaultConfig();
  }

  // Get default config
  public getDefaultConfig(): void {
    const requestItemSrv: any = { type: 'ITEM' };
    const temp = this.configListService.select(requestItemSrv).subscribe(res => {
      this.itemSrv = res[0];
      this.cdr.detectChanges();
    });
    this.subscriptions.push(temp);
  }

  public checkRole() {
    this.store.pipe(select(currentUser)).subscribe(obj => {
      if (obj) {
        const userName = obj.userName ? obj.userName.trim().toLocaleLowerCase() : '';
        const amAccount = this.purchaseRequestData.amAccount ? this.purchaseRequestData.amAccount.trim().toLocaleLowerCase() : '';
        const pmAccount = this.purchaseRequestData.pmAccount ? this.purchaseRequestData.pmAccount.trim().toLocaleLowerCase() : '';
        if (`,${pmAccount},`.includes(`,${userName},`)) {
          this.allowViewPrice = false;
        }
        if (`,${amAccount},`.includes(`,${userName},`)) {
          this.allowViewPrice = true;
        }
        if (obj.roles && obj.roles.length > 0) {
          if (obj.roles.some(m => m.includes('BP_') || m.includes('XNK_') || m.includes('AF_') || m === 'SUPER_ADMIN')) {
            this.allowViewPrice = true;
            this.canEditOtherInformation = true;
          }
        }
      }
    });
    if (document.domain === 'localhost' || document.domain === 'uat-fisepo.paas.xplat.fpt.com.vn') {
      this.isShowControl = true;
    }
  }

  private getBrand(): void {
    const requestBrand = new BrandRequestPayload();
    requestBrand.haspaging = false;
    const initSub = this.brandService.select(requestBrand).subscribe(res => {
      this.producerNameData = res;
      this.cdr.detectChanges();
    });
    this.subscriptions.push(initSub);
  }

  ngAfterViewChecked() {
    this.getScrollElement();
  }

  public initData(): void {
    const routeSub = this.route.params.subscribe((params) => {
      if (params.id) {
        this.requestItem.prId = params.id;
        this.prIdCurrent = params.id;
        this.purchaseRequestService.selectById(params.id).subscribe(res => {
          if (!res || !res.id) {
            this.router.navigate([`list`], { relativeTo: this.route.parent });
          }
          this.purchaseRequestData = res;
          this.checkRole();
          this.purchaseRequestData.amAccountItems = this.purchaseRequestData.amAccount ? this.purchaseRequestData.amAccount.split(',') : [];
          this.purchaseRequestData.pmAccountItems = this.purchaseRequestData.pmAccount ? this.purchaseRequestData.pmAccount.split(',') : [];
          if (this.purchaseRequestData.prType === 1 || this.purchaseRequestData.prType === 2) {
            this.purchaseRequestData.prTypeTemp = this.prTypeTemp[0].value;
          }
          if (this.purchaseRequestData.prType === 3) {
            this.purchaseRequestData.prTypeTemp = this.prTypeTemp[1].value;
          }
          this.initDataDto(this.purchaseRequestData);
          this.loadNodes();
          this.onChangeSelectPrType(this.purchaseRequestData.prTypeTemp);
          setTimeout(() => {
            this.form.form.markAsPristine();
          }, 200);
        });
      } else {
        this.purchaseRequestData = {};
        setTimeout(() => {
          this.form.form.markAsPristine();
        }, 0);
      }
    });
    this.subscriptions.push(routeSub);
  }

  private initDataDto(source: any): void {
    this.purchaseRequestData.legalDto = this.toDto('code', source.legalName);
    this.purchaseRequestData.orgApplyDto = this.toDto('name', source.orgApplyName);
    this.purchaseRequestData.orgCodeDto = this.toDto('code', source.orgCode);
    this.purchaseRequestData.assignUserDto = this.toDto('userName', source.assignUserName);

    if (this.purchaseRequestData.amAccount) {
      const arrAmAcount = this.purchaseRequestData.amAccount.split(',');
      this.purchaseRequestData.amAccountDto = [];
      for (const item of arrAmAcount) {
        this.purchaseRequestData.amAccountDto.push({ userName: item.trim() });
      }
    }

    if (this.purchaseRequestData.pmAccount) {
      const arrPmAcount = this.purchaseRequestData.pmAccount.split(',');
      this.purchaseRequestData.pmAccountDto = [];
      for (const item of arrPmAcount) {
        this.purchaseRequestData.pmAccountDto.push({ userName: item.trim() });
      }
    }

    const arrPeopleInvolved = this.purchaseRequestData.peopleInvolved ? this.purchaseRequestData.peopleInvolved.split(',') : [];
    this.purchaseRequestData.peopleInvolvedDto = [];
    arrPeopleInvolved.forEach(element => {
      this.purchaseRequestData.peopleInvolvedDto.push({ userName: element });
    });

  }

  private getDataService() {
    const totalBomSub = this.purchaseRequestItemService.selectTotalBom(this.requestItem).subscribe(res => {
      this.totalBom = res;
      this.cdr.detectChanges();
    });
    this.subscriptions.push(totalBomSub);
  }

  public onChangeSelectPrType(value: any) {
    this.prContractInfo = parentConfig.PR_CONTRACT_INFO;
    if (value) {
      if (+value === 1) {
        this.prContractInfo = this.prContractInfo.filter(m => m.value !== 3);
      }
      if (+value === 2) {
        this.prContractInfo = this.prContractInfo.filter(m => m.value === 3);
      }
      if (!this.purchaseRequestData.id) {
        this.purchaseRequestData.prType = null;
      }
    }
  }

  public goBack(): void {
    this.location.back();
    // this.router.navigate([`list`], { relativeTo: this.route.parent });
  }

  public onBtnSaveClick(): void {
    if (this.form) {
      if (!this.validateForm(this.form, this.formData.formId)) {
        this.notificationService.showMessage('VALIDATION.FORM_VALID');
        return;
      }
      if (this.form.dirty) {
        const saveConfirmation = new SaveConfirmation();
        saveConfirmation.accept = () => {

          if (this.hasEditRow) {
            this.purchaseRequestData.purchaseRequestItems = [];
            this.purchaseRequestData.purchaseRequestItems = this.purchaseRequestItems;
            for (const item of this.purchaseRequestData.purchaseRequestItems) {
              if (!item.expectedDate) {
                this.notificationService.showWarning('Vui lòng nhập ngày YC giao hàng');
                return;
              }
            }
          }

          const saveSub = this.purchaseRequestService.merge(this.purchaseRequestData).subscribe((res) => {
            this.notificationService.showSuccess();
            this.hasEditRow = false;
            this.form.form.markAsPristine();
            this.initData();
          });
          this.subscriptions.push(saveSub);

        };
        this.notificationService.confirm(saveConfirmation);
      } else {
        this.goBack();
      }
    } else {
      this.goBack();
    }
  }

  public loadNodes(event?: any): void {
    this.getDataService();
    this.dataSource.items = [];

    if (!event) {
      this.dataSource.items = [...this.dataSource.items];
      this.cdr.detectChanges();
    }
    this.requestItem.isSubItem = null;

    const purchaseRequestItemSub = forkJoin([
      this.purchaseRequestItemService.select(this.requestItem),
      this.purchaseRequestItemService.count(this.requestItem)
    ]).subscribe(res => {
      this.dataSource.paginatorTotal = res[1];
      const parentItems = res[0].filter(x => !x.isSubItem);
      for (const parent of parentItems) {
        const node: TreeNode = {
          data: { ...parent },
          children: [],
          expanded: true,
          leaf: true
        };
        const childItems = res[0].filter(x => x.isSubItem && this.quote(x.indexNo).startsWith(this.quote(parent.indexNo)));
        for (const child of childItems) {
          const childNode = {
            data: { ...child },
            leaf: true,
          };

          node.children.push(childNode);
          node.leaf = false;
        }

        this.dataSource.items.push(node);
      }
      this.dataSource.items = [...this.dataSource.items];
      this.dataSource.items.forEach(element => {
        element.data.quantityOrigin = element.data.quantity;
        element.data.currencyOrigin = element.data.currency;
        element.data.expectedDateOrigin = element.data.expectedDate;
        element.data.guaranteeOrigin = element.data.guarantee;
        element.children.forEach(e => {
          element.data.quantityOrigin = element.data.quantity;
          e.data.currencyOrigin = e.data.currency;
          e.data.expectedDateOrigin = e.data.expectedDate;
          e.data.guaranteeOrigin = e.data.guarantee;
        });
      });
      this.selectedPurchaseRequestItemRef = res[0];
      this.cdr.detectChanges();
    });
    this.subscriptions.push(purchaseRequestItemSub);
  }

  private quote(source: string): string {
    return `.${source}.`;
  }

  public onBtnAddItemClick(): void {
    this.isShowPurchaseRequestEditItem = false;
    this.cdr.detectChanges();
    this.isShowPurchaseRequestEditItem = true;
    this.dialogRef.input.ppId = this.purchaseRequestData.ppId;
    this.dialogRef.input.prId = this.prIdCurrent;
    this.dialogRef.input.isAdd = true;
    this.dialogRef.show();
    this.dialogRef.config = {
      style: { width: '72vw' },
      baseZIndex: 10000,
      draggable: true,
      maximizable: true,
      title: 'Danh sách item'
    };
  }

  public addTagFn(name: string) {
    return name;
  }

  // event khi thêm mới item thành công
  public addItemSuccess(): void {
    this.loadNodes();
  }

  public configBeforeEdit(selectedNode: any): void {
    const rowNode = {
      node: selectedNode,
      parent: selectedNode.parent
    };
    const rowData = selectedNode.data;
    this.onBtnEditClick(rowData, rowNode);
  }

  public onBtnEditClick(rowData?: any, rowNode?: TreeNode): void {
    if (rowData) {
      const strRowData = JSON.stringify(rowData);
      const objRowData = JSON.parse(strRowData);
      objRowData.currencyDto = {
        code: objRowData.currency
      };
      if (objRowData.itemCode) {
        objRowData.itemCodeDto = {
          code: objRowData.itemCode
        };
      }
      if (objRowData.supplierName) {
        objRowData.supplierNameDto = {
          name: objRowData.supplierName
        };
      }
      if (objRowData.producerName) {
        objRowData.producerNameDto = {
          name: objRowData.producerName
        };
      }

      // Gửi dữ liệu sang control exchange-rate
      objRowData.exchangeRateData = {
        date: objRowData.exchangeRateDate,
        type: objRowData.exchangeRateType,
        conversionRate: objRowData.conversionRate
      };

      const params = {
        id: objRowData.id,
        rowData: objRowData,
        rowNode
      };
      this.isShowDialogUpdateItem = true;
      this.dialogRefUpdateItem.input = params;
      this.dialogRefUpdateItem.show();
      this.cdr.detectChanges();
    } else {
      this.isShowDialogUpdateItem = true;
      this.dialogRefUpdateItem.input = {};
      this.dialogRefUpdateItem.show();
    }
  }

  public onSuccess(rowNode: any): any {
    if (rowNode) {
      if (!rowNode.parent) {
        this.loadNodes(null);
      } else {
        this.onLoadItemsInNode(rowNode.parent);
      }
      this.cdr.detectChanges();
    }
  }

  private onLoadItemsInNode(parentNode: any) {
    this.getDataService();
    // xoa du lieu cu
    parentNode.children = [];
    // tao request moi
    const request = new PurchaseRequestItemRequestPayload();
    request.prId = this.requestItem.prId;
    request.isSubItem = true;
    request.subIndexNo = parentNode.data.indexNo;
    // call api lay du lieu
    const purchaseRequestItemSub = this.purchaseRequestItemService.select(request).subscribe(res => {
      for (const element of res) {
        const node = {
          data: {
            ...element
          }
        };
        parentNode.children.push(node);
      }
      this.dataSource.items = [...this.dataSource.items];
      this.cdr.detectChanges();
    });
    this.subscriptions.push(purchaseRequestItemSub);
  }

  public configBeforeDelete(selectedNode: any): void {
    const rowNode = {
      node: selectedNode,
      parent: selectedNode.parent
    };
    const rowData = selectedNode.data;
    this.onBtnDeleteClick(rowData, rowNode);
  }

  public onBtnDeleteClick(rowData?: any, rowNode?: TreeNode): void {
    const confirmation = new DeleteConfirmation();
    confirmation.accept = () => {
      this.purchaseRequestItemService
        .delete(rowData.id)
        .subscribe((res) => {
          if (!rowNode.parent) {
            this.loadNodes(null);
          } else {
            this.onLoadItemsInNode(rowNode.parent);
          }
          this.cdr.detectChanges();
          this.notificationService.showSuccess();
        });
    };
    this.notificationService.confirm(confirmation);
  }

  public onChangeLegal(data: any) {
    if (data && data.ouId) {
      this.purchaseRequestData.legal = data.ouId;
    } else {
      this.purchaseRequestData.legal = null;
    }
    this.purchaseRequestData.subDepartmentId = null;
    this.purchaseRequestData.orgApplyDto = null;
    this.purchaseRequestData.orgCode = null;
    this.purchaseRequestData.orgCodeDto = null;
  }

  public onChangeOrgApply(data: any) {
    if (data && data.subDepartmentId) {
      this.purchaseRequestData.subDepartmentId = data.subDepartmentId;
    } else {
      this.purchaseRequestData.subDepartmentId = null;
    }
  }

  public onChangeOrgCode(data: any) {
    if (data && data.code) {
      this.purchaseRequestData.orgCode = data.code;
    }
  }

  public getScrollElement(): void {
    this.layoutConfigService.scrollElement = document.getElementsByClassName('table-responsive')[0];
  }

  public onChangeAmAccount(data) {
    if (data && data.length > 0) {
      data = data.filter(m => m.userName);
      this.purchaseRequestData.amAccount = '';
      for (let i = 0; i < data.length; i++) {
        if (i === data.length - 1) {
          this.purchaseRequestData.amAccount += (data[i].userName);
        } else {
          this.purchaseRequestData.amAccount += (data[i].userName + ',');
        }
      }
    } else {
      this.purchaseRequestData.amAccount = null;
    }
    this.checkRole();
  }

  public onChangePmAccount(data) {
    if (data && data.length > 0) {
      data = data.filter(m => m.userName);
      this.purchaseRequestData.pmAccount = '';
      for (let i = 0; i < data.length; i++) {
        if (i === data.length - 1) {
          this.purchaseRequestData.pmAccount += (data[i].userName);
        } else {
          this.purchaseRequestData.pmAccount += (data[i].userName + ',');
        }
      }
    } else {
      this.purchaseRequestData.pmAccount = null;
    }
    this.checkRole();
  }

  public onShowContextMenu() {
    this.btnItems[1].visible = this.purchaseRequestData.prStatus !== 5 && this.purchaseRequestData.prStatus !== 6;
  }

  public clickTrTable(rowData: any): void {
    rowData.isShowEditRow = true;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.dataSource.items.length; i++) {
      const item = this.dataSource.items[i];
      if (item.data.indexNo !== rowData.indexNo) {
        item.data.isShowEditRow = false;
      }
      if (item.children && item.children.length > 0) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < item.children.length; j++) {
          const children = item.children[j];
          if (children.data.indexNo !== rowData.indexNo) {
            children.data.isShowEditRow = false;
          }
        }
      }
    }
  }

  public onChangeItemCode(itemsCodeDto: any, rowData: any) {
    if (itemsCodeDto && itemsCodeDto.itemId && rowData) {
      if (itemsCodeDto.itemId) {
        rowData.itemId = itemsCodeDto.itemId;
      }
      if (itemsCodeDto.code) {
        rowData.itemCode = itemsCodeDto.code;
      }
      if (itemsCodeDto.name) {
        rowData.itemName = itemsCodeDto.name;
      }
      if (itemsCodeDto.unitCode) {
        rowData.unit = itemsCodeDto.unitCode;
      }
      if (itemsCodeDto.inventoryItemFlag === 'Y') {
        rowData.itemType = 'HW';
      }
    } else {
      rowData.itemId = null;
    }
  }

  public onRowEditInit() {
    this.treeNodeToItemSource();
    this.getTotalAmount();
    this.hasEditRow = true;
    this.form.form.markAsDirty();
    this.cdr.detectChanges();
  }

  private getTotalAmount(): void {
    const listTotal = [];
    this.purchaseRequestItems.forEach(element => {
      if (element.currency) {
        listTotal.push({
          key: element.currency,
          count: element.expectedPrice * element.quantity
        });
      }
    });
    const itemsGrouped = this.groupBy(listTotal, 'key');
    const keys = Object.keys(itemsGrouped);
    const rs = [];
    for (const k of keys) {
      let countKey = 0;
      for (const child of itemsGrouped[k]) {
        countKey += child.count;
      }
      rs.push({
        key: k,
        count: countKey
      });
    }
    this.totalBom = rs;
  }

  private groupBy(xs: any[], key: string) {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  private treeNodeToItemSource(): void {
    this.purchaseRequestItems = [];
    for (const parentNode of this.dataSource.items) {
      this.purchaseRequestItems.push(parentNode.data);
      for (const childNode of parentNode.children) {
        this.purchaseRequestItems.push(childNode.data);
      }
    }
  }

  public onChangeCurrency(currencyDto: any, rowData: any): void {
    if (currencyDto) {
      rowData.currency = currencyDto.code;
      this.onRowEditInit();
    }
  }

  public onChangeExpectedPrice(rowData: any): void {
    if (rowData.expectedPrice && rowData.expectedPrice < 0) {
      rowData.expectedPrice = 0;
    }
    this.onRowEditInit();
  }

  public onChangeSupplier(supplierNameDto: any, rowData: any) {
    if (supplierNameDto && rowData) {
      rowData.vendorId = supplierNameDto.vendorId;
      rowData.supplierName = supplierNameDto.name;
    }
    this.onRowEditInit();
  }

  public onChangeConversionRate(rowData: any): void {
    if (rowData.conversionRate && rowData.conversionRate < 0) {
      rowData.conversionRate = 0;
    }
    this.onRowEditInit();
  }

  public onChangePriceBp(rowData: any): void {
    if (rowData.priceBp && rowData.priceBp < 0) {
      rowData.priceBp = 0;
    }
    this.onRowEditInit();
  }

  public checkLicensedExport(): void {
    const request = new PurchaseRequestItemRequestPayload();
    request.prId = this.prIdCurrent;
    this.purchaseRequestItemService.exportAll(request).subscribe(() => {
      this.notificationService.showMessage('Export complete');
    });
  }

  public onChangeAssignUserId(event: any) {
    if (event && event.id) {
      this.purchaseRequestData.assignUserId = event.id;
      const requestOrgChart: any = { id: event.groupId };
      this.orgChartService.select(requestOrgChart).subscribe(m => {
        if (m && m.length > 0) {
          this.purchaseRequestData.assignGroupIdTemp = m[0].id;
          this.purchaseRequestData.assignGroupId = null;
          this.purchaseRequestData.assignGroupName = m[0].orgName;
          this.cdr.detectChanges();
        }
      });
    }
    if (!this.purchaseRequestData.assignUserDto) {
      this.purchaseRequestData.assignGroupIdTemp = null;
      this.purchaseRequestData.assignUserId = null;
      this.purchaseRequestData.assignGroupId = null;
      this.purchaseRequestData.assignGroupName = null;
    }
  }

  public onBtnAssign(): void {
    if (this.form.dirty) {
      this.notificationService.showWarning('Vui lòng lưu trước khi thực hiện');
      return;
    }
    this.onChangeAssignUserId(null);
    this.showDialogAssign = true;
  }

  public onConfirmAssignClick() {
    if (this.formAssign) {
      if (!this.validateForm(this.formAssign, 'form-assign')) {
        this.notificationService.showMessage('VALIDATION.FORM_VALID');
        return;
      }
      if (this.formAssign.dirty) {
        const saveConfirmation = new SaveConfirmation();
        saveConfirmation.accept = () => {
          if (this.purchaseRequestData.assignGroupIdTemp) {
            this.purchaseRequestData.assignGroupId = this.purchaseRequestData.assignGroupIdTemp;
          }
          const saveSub = this.purchaseRequestService.assign(this.purchaseRequestData).subscribe(res => {
            this.notificationService.showSuccess();
            this.showDialogAssign = false;
            this.formAssign.form.markAsPristine();
            this.cdr.detectChanges();
          }, (err: HttpErrorResponse) => {
            this.purchaseRequestData.assignGroupId = null;
          });
          this.subscriptions.push(saveSub);
        };
        this.notificationService.confirm(saveConfirmation);
      }
    }
  }

  public onCancelAssignClick() {
    this.showDialogAssign = false;
  }

  public onBtnCreateTicket(): void {
    if (!this.file) {
      this.notificationService.showWarning('Vui lòng đính kèm thông tin hợp đồng !');
      return;
    }
    if (this.form.dirty) {
      this.notificationService.showWarning('Vui lòng lưu trước khi thực hiện !');
      return;
    }
    let showWarning = false;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.dataSource.items.length; i++) {
      const item = this.dataSource.items[i];
      if (item.data.expectedPrice === null || item.data.expectedPrice === undefined) {
        this.notificationService.showWarning('Vui lòng cập nhật giá cho tất cả hàng hóa !');
        return;
      }
      if (item.data.expectedPrice === 0) {
        showWarning = true;
      }
      // if (!item.data.deliveryLocation) {
      //   this.notificationService.showWarning('Vui lòng cập nhật địa điểm nhận hàng !');
      //   return;
      // }
      if (item.children && item.children.length > 0) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < item.children.length; j++) {
          const children = item.children[j];
          if (children.data.expectedPrice === null || children.data.expectedPrice === undefined) {
            this.notificationService.showWarning('Vui lòng cập nhật giá cho tất cả hàng hóa !');
            return;
          }
          if (children.data.expectedPrice === 0) {
            showWarning = true;
          }
          // if (!children.data.deliveryLocation) {
          //   this.notificationService.showWarning('Vui lòng cập nhật địa điểm nhận hàng !');
          //   return;
          // }
        }
      }
    }
    if (this.bpm) {
      if (showWarning) {
        // tslint:disable-next-line:max-line-length
        const confirmation = new CustomConfirmation(`Một số mặt hàng đang có 'Đơn giá dự kiến' bằng 0, bạn có chắc muốn tiếp tục?`); confirmation.accept = () => {
          this.bpm.isShowCreateTicketTemplate = true;
          this.cdr.detectChanges();
        };
        this.notificationService.confirm(confirmation);
      } else {
        this.bpm.isShowCreateTicketTemplate = true;
        this.cdr.detectChanges();
      }
    }
  }

  public createTicketSuccess(sproDraftTicketId: number): void {
    if (sproDraftTicketId) {
      this.purchaseRequestData.sproDraftTicketId = sproDraftTicketId;
      this.purchaseRequestData.sproTicketId = null;
      // assign cho POman được chọn lúc tạo ticket
      // if (this.purchaseRequestData.assignUserIdTemp) {
      //   const dataAssignTemp: any = {
      //     ...this.purchaseRequestData,
      //     assignUserId: this.purchaseRequestData.assignUserIdTemp
      //   };
      //   this.purchaseRequestService.assign(dataAssignTemp).subscribe(m => {
      //     this.purchaseRequestData.assignUserId = this.purchaseRequestData.assignUserIdTemp;
      //   });
      // }
    }
  }

  public updateStatus(status: number): void {
    this.purchaseRequestData.prStatus = status;
    this.purchaseRequestService.merge(this.purchaseRequestData).subscribe();
  }

  public changeComboboxSpro(event: any): void {
    // -200 là id của POman của process phê duyệt YCMH trước 6 tuần
    // if (event && event.id === -200) {
    //   if (event.value) {
    //     const requestUser: any = { userName: event.value };
    //     this.userService.select(requestUser).subscribe(m => {
    //       if (m && m.length > 0) {
    //         this.purchaseRequestData.assignUserIdTemp = m[0].id;
    //       }
    //     });
    //   } else {
    //     this.purchaseRequestData.assignUserIdTemp = null;
    //   }
    // }
  }

  public changeProcessSpro(event: any): void {
    // this.purchaseRequestData.assignUserIdTemp = null;
  }

  public onChangeProductName(event: any, rowData: any): void {
    if (event) {
      rowData.producerId = event.id;
      rowData.producerName = event.acronymName;
    } else {
      rowData.producerId = null;
      rowData.producerName = null;
    }
  }

  public onChangePeopleInvolved(data) {
    if (this.purchaseRequestData.peopleInvolvedDto) {
      const listUserName = this.purchaseRequestData.peopleInvolvedDto.map(({ userName }) => userName);
      this.purchaseRequestData.peopleInvolved = listUserName.join(',');
    }
  }

  public onSuccessInitFile(file: any) {
    if (file) {
      this.file = file;
    }
  }

  public titleButtonCreateTicket(object: any) {
    let text = '';
    if (object.sproDraftTicketId) {
      text = 'Đã tạo bản nháp trên BA Online';
    } else {
      text = 'COMMON.SUBMIT_APPROVAL';
    }
    if (object.prStatus === 4) {
      text = 'Đã bị từ chối phê duyệt, có thể gửi phê duyệt lại';
    }
    return text;
  }

  public ongChangeIsUpdateSrv(rowData: any, event: any): void {
    rowData.isUpdateSrv = event.checked ? 1 : 0;
    if (event.checked) {
      rowData.itemCode = this.itemSrv.code;
      // rowData.itemName = this.itemSrv.name;
      rowData.unit = this.itemSrv.attr1;
      // rowData.note = rowData.itemNameOrigin;
    }
    this.onRowEditInit();
  }

}

