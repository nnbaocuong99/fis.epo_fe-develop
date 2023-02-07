import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../../../../../core/_base/component';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { CurrencyService } from '../../../../../services/modules/category/currency/currency.service';
import { SupplierService } from '../../../../../services/modules/category/supplier/supplier.service';
import { PurchaseOrderService } from '../../../../../services/modules/purchase-order/purchase-order.service';
import { FormDynamicData } from '../../../../partials/content/crud/component/form-dynamic-data.model';
import * as config from '../purchase-order-add/purchase-order-add.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { NgForm } from '@angular/forms';
import { AppendixAddComponent } from '../appendix-add/appendix-add.component';
import { PurchaseOrderItemComponent } from '../purchase-order-add/purchase-order-item/purchase-order-item.component';
import { ProjectService } from '../../../../../services/modules/category/project/project.service';
import { SupplierSiteService } from '../../../../../services/modules/category/supplier-site/supplier-site.service';
import { PurchaseOrderRequestPayload } from '../../../../../services/modules/purchase-order/purchase-order.request-payload';
import { OrganizationService } from '../../../../../services/modules/category/organization-management/organization/organization.service';
import { DepartmentService } from '../../../../../services/modules/category/department/department.service';
import { PaymentTermService } from '../../../../../services/modules/category/payment-term/payment-term.service';
import {
    OperatingUnitService
} from '../../../../../services/modules/category/organization-management/operating-unit/operating-unit.service';
import { OrderProcessingStatusComponent } from './order-processing-status/order-processing-status.component';
import { UserService } from '../../../../../services/modules/user/user.service';
import * as configPoList from '../../purchase-order/purchase-order.config';
import { ChangeConfirmation, CustomConfirmation, SaveConfirmation } from '../../../../../services/common/confirmation';
import { BpmService } from '../../../../../services/modules/s-pro/bpm.service';
import { FileService } from '../../../../../services/modules/file/file.service';
import { forkJoin } from 'rxjs';
import { PurchaseOrderHistoryComponent } from '../purchase-order-history/purchase-order-history.component';
import { ContractService } from '../../../../../services/modules/contract/contract.service';
import { ConfigListService } from '../../../../../services/modules/config-list/config-list.service';
import { BusinessProcessManagementComponent } from '../../../../partials/business-process-management/business-process-management.component';
import { Location } from '@angular/common';
@Component({
    selector: 'app-purchase-order-edit',
    templateUrl: './purchase-order-edit.component.html',
    styleUrls: ['./purchase-order-edit.component.scss']
})
export class PurchaseOrderEditComponent extends BaseFormComponent implements OnInit {
    @ViewChild('form', { static: true }) form: NgForm;
    @ViewChild('purchaseOrderItem', { static: true }) purchaseOrderItem: PurchaseOrderItemComponent;
    @ViewChild('appendix', { static: true }) appendix: AppendixAddComponent;
    @ViewChild('orderProcessingStatus', { static: true }) orderProcessingStatus: OrderProcessingStatusComponent;
    @ViewChild('bpm', { static: false }) bpm: BusinessProcessManagementComponent;
    @ViewChild('purchaseOrderHistory', { static: false }) purchaseOrderHistory: PurchaseOrderHistoryComponent;
    public formData: FormDynamicData = new FormDynamicData();
    public purchaseOrderRequestPayload = new PurchaseOrderRequestPayload();
    public file: any;

    public productTypes = config.PRODUCT_TYPES;
    public poValue = config.PO_VALUE;
    public units = config.UNITS;
    public headerCategorys = config.HEADER_CATEGORY;
    public steps = config.STEPS;
    public areaTypes = config.AREA_TYPE_INTERNAL;
    public valueTypes = config.VALUE_TYPES;
    public taxPayers = config.TAX_PAYERS;
    public mainConfig = mainConfig.MAIN_CONFIG;
    public areaTypeInternal = config.AREA_TYPE_INTERNAL;
    public areaTypeExternal = config.AREA_TYPE_EXTERNAL;
    public headerSuppliers = config.HEADER_SUPPLIER;
    public headerSupplierSites = config.HEADER_SUPPLIER_SITE;
    public headerProject = config.HEADER_PROJECT;
    public headerPo = config.HEADER_PO;
    public headerOrg = config.HEADER_ORG;
    public headerOperatingUnit = config.HEADER_OPERATING_UNIT;
    public headerPaymentTerm = config.HEADER_PAYMENT_TERM;
    public headerDepartment = config.HEADER_DEPARMENT;
    public tabs = config.TABS_EDIT;
    public purchaseOrderData: any = {};
    public currentTab: number;
    public currentPoId: string;
    // Check ẩn thuế nhà thầu nều hình thức mua hàng là trong nước
    public isShowTaxpayer = true;
    // Có phải YCMH nội không?
    public isInternal = true;
    public configList: any[];
    public isShowNotice = false;
    public configListDataFreightTerm: any[];
    public configListDataDelivery: any[];
    public configListDataDeliveryLocationGoOut: any[];
    public configListDataDeliveryLocationComeIn: any[];
    public poStatus = configPoList.PO_STATUS;
    public isEdit = true;
    public purchaseOrderFolder: string;
    public vendorRateDto = {
        vendorRate: null,
        noteRate: null,
        id: null,
        qualityMismatch: null
    };
    public isShowDialogRate = false;
    public isSaveDraft = false;

    public listPpHasFile = [];
    public listPrHasFile = [];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public purchaseOrderService: PurchaseOrderService,
        public notification: NotificationService,
        public cdr: ChangeDetectorRef,
        public supplierService: SupplierService,
        public currencyService: CurrencyService,
        public projectService: ProjectService,
        public supplierSiteService: SupplierSiteService,
        public operatingUnitService: OperatingUnitService,
        public organizationService: OrganizationService,
        public paymentTermService: PaymentTermService,
        public departmentService: DepartmentService,
        public contractService: ContractService,
        public userService: UserService,
        public configListService: ConfigListService,
        private bpmService: BpmService,
        private location: Location,
        public fileService: FileService
    ) {
        super();
        this.formData = {
            formId: 'purchase-order-edit',
            icon: 'fal fa-money-check-alt',
            title: 'PURCHASE_ORDER.TITLE_EDIT_INTERNAL',
            isCancel: true,
            service: this.purchaseOrderService,
            isHideFooter: true
        };
    }
    ngOnInit() {
        this.getConfigList();
        this.purchaseOrderRequestPayload.isFilterReferencePo = true;
        this.currentTab = this.tabs[0].value;
        const routeSub = this.route.params.subscribe(params => {
            if (params.id) {
                this.purchaseOrderRequestPayload.idFilterReferencePo = params.id;
                this.currentPoId = params.id;
                if (this.appendix) {
                    this.appendix.ngOnInit();
                }
                this.purchaseOrderItem.dataSource.treeNodes = [];
                this.purchaseOrderService.selectById(params.id).subscribe(res => {
                    if (res) {
                        this.purchaseOrderData = res;
                        // Đã lấy hết số lượng và chưa được đánh giá thì hiển thị dialog đánh giá
                        if (this.purchaseOrderData.quantityRemain === 0 && !this.purchaseOrderData.vendorRate) {
                            this.isShowDialogRate = true;
                        }
                    } else {
                        this.purchaseOrderData = {};
                        this.router.navigate([`list`], { relativeTo: this.route.parent });
                    }
                    if (this.purchaseOrderData.areaType === 3 || this.purchaseOrderData.areaType === 4) {
                        this.formData.title = 'PURCHASE_ORDER.TITLE_EDIT_EXTERNAL';
                        this.areaTypes = this.areaTypeExternal;
                        this.isShowTaxpayer = true;
                        this.isInternal = false;
                        // Folder attachment
                        this.purchaseOrderFolder = 'PurchaseOrderExternal';
                        if (this.tabs.length === 5) {
                            this.tabs.pop();
                        }
                    } else {
                        this.formData.title = 'PURCHASE_ORDER.TITLE_EDIT_INTERNAL';
                        // Folder attachment
                        this.purchaseOrderFolder = 'PurchaseOrderInternal';
                        if (this.purchaseOrderData.areaType === 1) {
                            this.isShowTaxpayer = false;
                        }
                        this.areaTypes = this.areaTypeInternal;
                        this.isInternal = true;
                    }
                    this.initDataDto();
                    this.purchaseOrderData.deliveryLocationGoOutTemp =
                        this.purchaseOrderData.deliveryLocationGoOut ? this.purchaseOrderData.deliveryLocationGoOut.split(',') : [];
                    this.purchaseOrderData.deliveryLocationComeInTemp =
                        this.purchaseOrderData.deliveryLocationComeIn ? this.purchaseOrderData.deliveryLocationComeIn.split(',') : [];
                    this.purchaseOrderItem.purchaseOrderData = { ...this.purchaseOrderData };
                    this.purchaseOrderItem.ngOnInit();
                    this.initObjectHasFile();
                    setTimeout(() => {
                        this.form.form.markAsPristine();
                    }, 200);
                    this.cdr.detectChanges();
                });
            } else {
                this.currentPoId = null;
                // Folder attachment
                this.purchaseOrderFolder = 'PurchaseOrder';
                this.purchaseOrderData = {};
            }
        });
        this.subscriptions.push(routeSub);
    }

    public getConfigList() {
        const requestBusinessTerm: any = { type: 'BUSINESS_TERM' };
        const requestTransportationMode: any = { type: 'TRANSPORTATION_MODE' };
        const requestBillFrom: any = { type: 'BILL_FROM' };
        const requestBillTo: any = { type: 'BILL_TO' };

        const requests = [
            this.configListService.select(requestBusinessTerm),
            this.configListService.select(requestTransportationMode),
            this.configListService.select(requestBillFrom),
            this.configListService.select(requestBillTo)
        ];
        const sub = forkJoin(requests).subscribe(res => {
            this.configListDataFreightTerm = res[0].sort(this.sortStringConfigList);
            this.configListDataDelivery = res[1].sort(this.sortStringConfigList);
            this.configListDataDeliveryLocationGoOut = res[2].sort(this.sortStringConfigList);
            this.configListDataDeliveryLocationComeIn = res[3].sort(this.sortStringConfigList);
            this.cdr.detectChanges();
        });

        this.subscriptions.push(sub);
    }

    sortStringConfigList(a, b) {
        const str1 = a.name ? a.name : '';
        const str2 = b.name ? b.name : '';
        if (str1 < str2) { return -1; }
        if (str1 > str2) { return 1; }
        return 0;
    }

    private initDataDto(): void {
        this.purchaseOrderData.supplierNameDto = this.toDto('name', this.purchaseOrderData.supplierName);
        this.purchaseOrderData.currencyDto = this.toDto('code', this.purchaseOrderData.currency);
        this.purchaseOrderData.supplierSiteNameDto = this.toDto('code', this.purchaseOrderData.supplierSiteName);
        this.purchaseOrderData.projectCodeDto = this.toDto('code', this.purchaseOrderData.projectCode);
        this.purchaseOrderData.ouNameDto = this.toDto('code', this.purchaseOrderData.ouName);
        this.purchaseOrderData.orgApplyNameDto = this.toDto('name', this.purchaseOrderData.orgApplyName);
        this.purchaseOrderData.paymentTermDto = this.toDto('name', this.purchaseOrderData.paymentTerm);
        this.purchaseOrderData.orgCodeDto = this.toDto('code', this.purchaseOrderData.orgCode);
        this.purchaseOrderData.referencePoCodeDto = this.toDto('code', this.purchaseOrderData.referencePoCode);

        const arrPeopleInvolved = this.purchaseOrderData.peopleInvolved ? this.purchaseOrderData.peopleInvolved.split(',') : [];
        this.purchaseOrderData.peopleInvolvedDto = [];
        arrPeopleInvolved.forEach(element => {
            this.purchaseOrderData.peopleInvolvedDto.push({ userName: element });
        });
    }

    private initObjectHasFile() {
        const requestPp: any = { poId: this.purchaseOrderData.id, fileModule: 'PP' };
        const requestPr: any = { poId: this.purchaseOrderData.id, fileModule: 'PR' };
        const initSub = forkJoin([
            this.fileService.selectObjectHasFileInModule(requestPp),
            this.fileService.selectObjectHasFileInModule(requestPr)
        ]).subscribe(res => {
            this.listPpHasFile = res[0];
            this.listPrHasFile = res[1];
        });
        this.subscriptions.push(initSub);
    }

    public setFragmentToRoute(event): void {
        if (event.nextId === 3) {
            if (!this.purchaseOrderData.totalAmount) {
                this.notification.showWarning('Không thể thêm thông tin thanh toán khi đơn hàng không có line hàng');
                return;
            }
        }
        this.currentTab = event.nextId;
        if (event.nextId === 4) {
            this.orderProcessingStatus.ngOnInit();
        }
        if (event.nextId === 1) {
            this.purchaseOrderItem.loadNodes();
        }
    }

    public onBtnUploadClick(): void {

    }

    private redirectToParentPage(): void {
        this.router.navigate([`list`], { relativeTo: this.route.parent });
    }

    public onBtnSaveAsDraft(): void {
        let poiRequest = [];
        // lấy item con để update
        for (const row of this.purchaseOrderItem.dataSource.treeNodes) {
            poiRequest.push(row.data);
            if (row.children) {
                poiRequest = poiRequest.concat(row.children.map(x => x.data));
            }
        }

        const requestSave = {
            purchaseOrder: this.purchaseOrderData,
            purchaseOrderItem: poiRequest,
            purchaseRequestItemMatch: this.purchaseOrderItem.purchaseRequestItemMatch.map(x => {
                x.matchedIdOrigin = x.matchedId;
                return x;
            }),
            idPoDeleted: this.purchaseOrderItem.purchaseOrderItemDeleted.filter(x => x.data.id)
                .map(x => {
                    return x.data.id;
                })
        };
        const saveConfirmation = new SaveConfirmation();
        saveConfirmation.accept = () => {
            const saveSub = this.purchaseOrderService.saveDraft(requestSave).subscribe(resSave => {
                if (resSave) {
                    this.notification.showSuccess();
                    this.purchaseOrderItem.ngOnInit();
                    this.form.form.markAsPristine();
                }
            });
            this.subscriptions.push(saveSub);
        };
        this.notification.confirm(saveConfirmation);
    }

    public onBtnSaveClick(): void {
        if (this.purchaseOrderItem) {
            if (!this.purchaseOrderItem.validateForm(this.purchaseOrderItem.form, 'purchase-order-item')) {
                return;
            }
            if (!this.checkPoSignDateBeforeSave()) {
                return;
            }
        }
        if (this.validateForm(this.form, this.formData.formId)) {
            let poiRequest = [];
            // lấy item con để update
            for (const row of this.purchaseOrderItem.dataSource.treeNodes) {
                poiRequest.push(row.data);
                if (row.children) {
                    poiRequest = poiRequest.concat(row.children.map(x => x.data));
                }
            }
            for (const item of poiRequest) {
                // check bắt buộc fill ngày dự kiến hàng về
                if (!item.expectedDate) {
                    this.notification.showError('Vui lòng cập nhật thông tin ngày yêu cầu giao hàng !!!');
                    return;
                }
                if (!item.responseDate) {
                    this.notification.showError('Vui lòng cập nhật thông tin ngày dự kiến hàng về !!!');
                    return;
                }
                if (!item.producerName) {
                    this.notification.showError('Vui lòng cập nhật thông tin hãng sản xuất !!!');
                    return;
                }
                if (item.guarantee === null || item.guarantee === undefined) {
                    this.notification.showError('Vui lòng cập nhật thông tin thời hạn bảo hành !!!');
                    return;
                }
            }

            if (!this.isFormDirty(this.form)) {
                this.redirectToParentPage();
            } else {
                const requestSave = {
                    purchaseOrder: this.purchaseOrderData,
                    purchaseOrderItem: poiRequest,
                    purchaseRequestItemMatch: this.purchaseOrderItem.purchaseRequestItemMatch.map(x => {
                        x.matchedIdOrigin = x.matchedId;
                        return x;
                    }),
                    idPoDeleted: this.purchaseOrderItem.purchaseOrderItemDeleted.filter(x => x.data.id)
                        .map(x => {
                            return x.data.id;
                        })
                };
                // Check thêm item từ PR
                for (const item of this.purchaseOrderItem.purchaseRequestDataTemp) {
                    requestSave.purchaseRequestItemMatch.push(item.data);
                    for (const children of item.children) {
                        requestSave.purchaseRequestItemMatch.push(children.data);
                    }
                }
                // chuyển trạng thái thành công khi được tích hàng đã về đủ
                if (requestSave.purchaseOrder.goodsPartial && requestSave.purchaseOrder.goodsArrivedFull) {
                    requestSave.purchaseOrder.status = 6;
                    for (const item of requestSave.purchaseOrderItem) {
                        item.status = 6;
                    }
                }
                const saveConfirmation = new SaveConfirmation();
                saveConfirmation.accept = () => {
                    const saveSub = this.purchaseOrderService.save(requestSave).subscribe(resSave => {
                        if (resSave) {
                            this.notification.showSuccess();
                            this.purchaseOrderItem.ngOnInit();
                            this.purchaseOrderItem.loadNodesItemsProgress();
                            this.form.form.markAsPristine();
                        }
                    });
                    this.subscriptions.push(saveSub);
                };
                this.notification.confirm(saveConfirmation);
            }
        }
    }

    public checkPoSignDateBeforeSave(): boolean {
        if (this.purchaseOrderData && this.purchaseOrderData.signDate) {
            let nowDate = new Date();
            nowDate = new Date(nowDate.toDateString());
            let signDate = new Date(this.purchaseOrderData.signDate);
            signDate = new Date(signDate.toDateString());
            if (nowDate && signDate && signDate > nowDate) {
                this.notification.showWarning('Ngày ký PO hợp đồng không được lớn hơn ngày hiện tại');
                return false;
            }
            return true;
        }
    }

    public onBtnCancelClick(): void {
        this.location.back();
        // this.redirectToParentPage();
    }

    public valueTypeChange(event: any): void {
        if (event) {
            this.form.form.markAsDirty();
            this.purchaseOrderData.valueType = event.value;
        }
    }

    public taxPayerChange(event: any): void {
        if (event) {
            this.form.form.markAsDirty();
            this.purchaseOrderData.taxpayer = event.value;
        }
    }

    public onChangeSupplierName(): void {
        if (this.purchaseOrderData.supplierNameDto) {
            this.purchaseOrderData.vendorId = this.purchaseOrderData.supplierNameDto.vendorId;
            this.purchaseOrderData.siteId = null;
            this.purchaseOrderData.supplierSiteNameDto = null;
            this.getSupplierSiteBySupplier();
        }
    }

    private getSupplierSiteBySupplier(): void {
        if (this.purchaseOrderData.vendorId && this.purchaseOrderData.ouCode && !this.purchaseOrderData.siteId) {
            const requestSupplierSite: any = {
                ouId: this.purchaseOrderData.ouCode,
                vendorId: this.purchaseOrderData.vendorId
            };
            this.supplierSiteService.select(requestSupplierSite).subscribe(resp => {
                if (resp && resp.length > 0) {
                    // TODO tìm site công nợ
                    const item = resp.find(x => x.code === 'CONG NO');
                    if (item) {
                        this.purchaseOrderData.siteId = item.siteId;
                        this.purchaseOrderData.supplierSiteName = item.name;
                        this.purchaseOrderData.supplierSiteNameDto = this.toDto('code', this.purchaseOrderData.supplierSiteName);
                        this.cdr.detectChanges();
                    }
                }
            });
        }
    }

    public onChangeLegal(event: any): void {
        if (event) {
            this.purchaseOrderData.ouCode = event.ouId;
            this.getSupplierSiteBySupplier();
        } else {
            this.purchaseOrderData.ouCode = null;
        }

        this.purchaseOrderData.orgCode = null;
        this.purchaseOrderData.orgCodeDto = null;

        this.purchaseOrderData.siteId = null;
        this.purchaseOrderData.supplierSiteNameDto = null;

        this.purchaseOrderData.subDepartmentId = null;
        this.purchaseOrderData.orgApplyNameDto = null;

        this.purchaseOrderData.projectCode = null;
        this.purchaseOrderData.projectCodeDto = null;
    }

    public onChangeProjectCode(event: any) {
        if (event) {
            this.purchaseOrderData.projectCode = event.code;
            this.contractService.syncContract(this.purchaseOrderData, event.code);
        }
    }

    public onChangeOrgApply(event: any): void {
        if (event) {
            this.purchaseOrderData.subDepartmentId = event.subDepartmentId;
            this.purchaseOrderData.orgApplyName = event.name;
            this.purchaseOrderData.orgApplyAcronym = event.acronym;
        }
    }

    public onChangeCurrency(event: any): void {
        if (event) {
            if (this.purchaseOrderData.currencyOrigin && event.code !== this.purchaseOrderData.currencyOrigin) {
                const changeConfirmation = new ChangeConfirmation('Bạn có chắc chắn thay đổi loại tiền');
                this.notification.showWarning('Loại tiền trên yêu cầu mua hàng: ' + this.purchaseOrderData.currencyOrigin);
                changeConfirmation.accept = () => {
                    this.purchaseOrderData.currency = event.code;
                };
                changeConfirmation.reject = () => {
                    this.purchaseOrderData.currency = this.purchaseOrderData.currency;
                    this.purchaseOrderData.currencyDto = this.toDto('code', this.purchaseOrderData.currency);
                    this.cdr.detectChanges();
                };
                this.notification.confirm(changeConfirmation);
            } else {
                this.purchaseOrderData.currency = event.code;
            }
        }
    }

    public onChangePaymentTerm(event: any): void {
        if (event) {
            this.purchaseOrderData.paymentTerm = event.name;
        }
    }

    public onChangeOrgCode(event: any): void {
        if (event) {
            this.purchaseOrderData.orgCode = event.code;
        } else {
            this.purchaseOrderData.orgCode = null;
        }
    }

    public onChangeSupplierSite(): void {
        this.purchaseOrderData.siteId = this.purchaseOrderData.supplierSiteNameDto
            ? this.purchaseOrderData.supplierSiteNameDto.siteId : null;
    }

    public onChangeReferPo(event: any): void {
        if (event) {
            this.purchaseOrderData.referencePoId = event.id;
            this.purchaseOrderData.referencePoCode = event.code;
        } else {
            this.purchaseOrderData.referencePoId = null;
            this.purchaseOrderData.referencePoCode = null;
        }
    }

    public onSuccess(data: any): any {
        if (data) {
            this.purchaseOrderData.totalAmount = data.totalWithTax;
            this.purchaseOrderData.isInternal = this.isInternal;
        }
    }

    public onChangeNotificationSettings(): void {
        this.isShowNotice = !this.isShowNotice;
    }

    public onBtnSaveNotiSettingClick(): void {

    }

    public editRow(): void {
        this.form.form.markAsDirty();
    }

    public onChangeAreaType(event: any): void {
        if (this.purchaseOrderItem) {
            this.purchaseOrderItem.configTablePurchaseOrder();
        }

        if (event && event.value === 1) {
            this.isShowTaxpayer = false;
        } else {
            this.isShowTaxpayer = true;
        }
    }

    public onSuccessInitFile(file: any) {
        if (file) {
            this.file = file;
        }
    }

    public onBtnRateVendorClick(): void {
        const confirmation = new CustomConfirmation('COMMON_MSG.SPRO_CONFIRM_RATE');
        confirmation.accept = () => {
            this.vendorRateDto.id = this.purchaseOrderData.id;
            const confirmCloseSub = this.purchaseOrderService.rateVendor(this.vendorRateDto).subscribe(res => {
                this.purchaseOrderData.vendorRate = this.vendorRateDto.vendorRate;
                this.purchaseOrderData.noteRate = this.vendorRateDto.noteRate;
                this.purchaseOrderData.qualityMismatch = this.vendorRateDto.qualityMismatch;
                this.notification.showSuccess('PURCHASE_ORDER.RATE_SUCCESS');
                this.isShowDialogRate = false;
                this.cdr.detectChanges();
            });
            this.subscriptions.push(confirmCloseSub);
        };
        this.notification.confirm(confirmation);
    }

    public onCancelDialogRateClick(): void {
        this.vendorRateDto.vendorRate = null;
        this.vendorRateDto.noteRate = null;
        this.vendorRateDto.qualityMismatch = null;
        this.isShowDialogRate = false;
        this.cdr.detectChanges();
    }

    public viewHistory(): void {
        this.purchaseOrderHistory.onBtnShowDialogListClick();
        this.cdr.detectChanges();
    }

    public onChangePeopleInvolved(data) {
        if (this.purchaseOrderData.peopleInvolvedDto) {
            const listUserName = this.purchaseOrderData.peopleInvolvedDto.map(({ userName }) => userName);
            this.purchaseOrderData.peopleInvolved = listUserName.join(',');
        }
    }

    public rounding(value: number): number {
        return (Math.round(value * 100) / 100);
    }

    public onChangeRatio() {
        if (this.purchaseOrderData.prepaymentRatio < 0) {
            this.purchaseOrderData.prepaymentRatio = 0;
        }
        if (this.purchaseOrderData.prepaymentRatio > 100) {
            this.purchaseOrderData.prepaymentRatio = 100;
        }
        if (this.purchaseOrderData.prepaymentRatio > 0 && this.purchaseOrderData.prepaymentRatio <= 100) {
            this.purchaseOrderData.prepaymentRatio = this.rounding(this.purchaseOrderData.prepaymentRatio);
        }
    }

    public createPrepaymentInvoice() {
        this.purchaseOrderData.totalAmount = this.purchaseOrderItem.purchaseOrderItemTotalAmounts.totalWithTax;
        this.router.navigate(['purchase-invoice/list/add'], {
            relativeTo: this.route.parent.parent,
            state: {
                purchaseOrderDataCreatePrepayment: this.purchaseOrderData
            }
        });
    }

    public onBtnCreateTicket(): void {
        if (!this.file) {
            this.notification.showWarning('Vui lòng đính kèm thông tin hợp đồng.');
            return;
        }
        if (this.form.dirty) {
            this.notification.showWarning('Vui lòng lưu trước khi thực hiện');
            return;
        }
        if (this.bpm) {
            this.purchaseOrderData.totalAmount = this.purchaseOrderItem.purchaseOrderItemTotalAmounts.totalWithTax;
            this.bpm.isShowCreateTicketTemplate = true;
        }
    }

    public createTicketSuccess(sproDraftTicketId: number): void {
        if (sproDraftTicketId) {
            this.purchaseOrderData.sproDraftTicketId = sproDraftTicketId;
            this.purchaseOrderData.sproTicketId = null;
        }
    }

    public updateStatus(status: number): void {
        this.purchaseOrderData.status = status;
        this.purchaseOrderService.merge(this.purchaseOrderData).subscribe();
    }

    public titleButtonCreateTicket(object: any) {
        let text = '';
        if (object.sproDraftTicketId) {
            text = 'Đã tạo bản nháp trên BA Online';
        } else {
            text = 'COMMON.SUBMIT_APPROVAL';
        }
        if (object.status === 4) {
            text = 'Đã bị từ chối phê duyệt, có thể gửi phê duyệt lại';
        }
        return text;
    }

}
