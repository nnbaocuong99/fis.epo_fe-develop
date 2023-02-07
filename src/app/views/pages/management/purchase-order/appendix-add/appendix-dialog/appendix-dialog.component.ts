import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BaseFormComponent } from '../../../../../../core/_base/component/base-form.component';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { CurrencyService } from '../../../../../../services/modules/category/currency/currency.service';
import { DepartmentRequestPayload } from '../../../../../../services/modules/category/department/department.request.payload';
import { DepartmentService } from '../../../../../../services/modules/category/department/department.service';
import {
    OperatingUnitRequestPayload
} from '../../../../../../services/modules/category/organization-management/operating-unit/operating-unit.request.payload';
import {
    OperatingUnitService
} from '../../../../../../services/modules/category/organization-management/operating-unit/operating-unit.service';
import {
    OrganizationRequestPayload
} from '../../../../../../services/modules/category/organization-management/organization/organization.request.payload';
import { OrganizationService } from '../../../../../../services/modules/category/organization-management/organization/organization.service';
import { PaymentTermRequestPayload } from '../../../../../../services/modules/category/payment-term/payment-term.request.payload';
import { PaymentTermService } from '../../../../../../services/modules/category/payment-term/payment-term.service';
import { SupplierService } from '../../../../../../services/modules/category/supplier/supplier.service';
import { PurchaseOrderItemService } from '../../../../../../services/modules/purchase-order-item/purchase-order-item.service';
import { PurchaseOrderService } from '../../../../../../services/modules/purchase-order/purchase-order.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from '../../purchase-order-add/purchase-order-add.config';
import * as mainConfig from '../../../../../../core/_config/main.config';
import * as configPoList from '../../../purchase-order/purchase-order.config';
import { PurchaseOrderItemComponent } from '../../purchase-order-add/purchase-order-item/purchase-order-item.component';
import { SupplierRequestPayload } from '../../../../../../services/modules/category/supplier/supplier.request.payload';
import { SupplierSiteRequestPayload } from '../../../../../../services/modules/category/supplier-site/supplier-site.request.payload';
import { ProjectService } from '../../../../../../services/modules/category/project/project.service';
import { SupplierSiteService } from '../../../../../../services/modules/category/supplier-site/supplier-site.service';
import { ProjectRequestPayload } from '../../../../../../services/modules/category/project/project.request.payload';
import { PurchaseOrderRequestPayload } from '../../../../../../services/modules/purchase-order/purchase-order.request-payload';
import { ConfigListFactory } from '../../../../../partials/control/config-list/config-list-control.service';
import { ChangeConfirmation } from '../../../../../../services/common/confirmation/change-confirmation';
import { UserService } from '../../../../../../services/modules/user/user.service';
import { SaveConfirmation } from '../../../../../../services/common/confirmation/save-confirmation';

@Component({
    selector: 'app-appendix-dialog',
    templateUrl: './appendix-dialog.component.html',
    styleUrls: ['./appendix-dialog.component.scss']
})
export class AppendixDialogComponent extends BaseFormComponent
    implements OnInit {
    @ViewChild('purchaseOrderItem', { static: false }) purchaseOrderItem: PurchaseOrderItemComponent;
    @ViewChild('form', { static: true }) form: NgForm;
    @Input() dialogRef: DialogRef;
    @Output() success: EventEmitter<any> = new EventEmitter();
    public productTypes = config.PRODUCT_TYPES;
    public poValue = config.PO_VALUE;
    public units = config.UNITS;
    public headerCategorys = config.HEADER_CATEGORY;
    public steps = config.STEPS;
    public areaTypes = config.AREA_TYPE_INTERNAL;
    public valueTypes = config.VALUE_TYPES;
    public taxPayers = config.TAX_PAYERS;
    public headerOrg = config.HEADER_ORG;
    public headerOperatingUnit = config.HEADER_OPERATING_UNIT;
    public headerDepartment = config.HEADER_DEPARMENT;
    public headerPaymentTerm = config.HEADER_PAYMENT_TERM;
    public poStatus = configPoList.PO_STATUS;
    public organizationRequestPayload = new OrganizationRequestPayload();
    public operatingUnitRequestPayload = new OperatingUnitRequestPayload();
    public departmentRequestPayload = new DepartmentRequestPayload();
    public paymentTermRequestPayload = new PaymentTermRequestPayload();
    public mainConfig = mainConfig.MAIN_CONFIG;
    public headerSuppliers = config.HEADER_SUPPLIER;
    public headerSupplierSites = config.HEADER_SUPPLIER_SITE;
    public supplierRequestPayload = new SupplierRequestPayload();
    public supplierSiteRequestPayload = new SupplierSiteRequestPayload();
    public headerProject = config.HEADER_PROJECT;
    public projectRequestPayload = new ProjectRequestPayload();
    // Check ẩn thuế nhà thầu nều hình thức mua hàng là trong nước
    public isShowTaxpayer = true;
    // Có phải YCMH nội không?
    public isInternal = true;
    public configListDataFreightTerm: any[];
    public configListDataDelivery: any[];
    public configListDataDeliveryLocationGoOut: any[];
    public configListDataDeliveryLocationComeIn: any[];
    public headerPo = config.HEADER_PO;
    public purchaseOrderRequestPayload = new PurchaseOrderRequestPayload();
    public areaTypeExternal = config.AREA_TYPE_EXTERNAL;
    public areaTypeInternal = config.AREA_TYPE_INTERNAL;
    public purchaseOrderData: any = {};

    constructor(
        public purchaseOrderService: PurchaseOrderService,
        public purchaseOrderItemService: PurchaseOrderItemService,
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
        public userService: UserService,
    ) {
        super();
    }

    ngOnInit() {
        this.dialogRef.input.rowData = {};
    }

    public initData(edit: boolean) {
        this.purchaseOrderData = this.dialogRef.input.rowData;

        this.organizationRequestPayload.ouId = this.purchaseOrderData.ouCode;
        this.departmentRequestPayload.ouId = this.purchaseOrderData.ouCode;
        this.supplierSiteRequestPayload.ouId = this.purchaseOrderData.ouCode;
        this.projectRequestPayload.ouId = this.purchaseOrderData.ouCode;

        if (this.purchaseOrderData.areaType === 3 || this.purchaseOrderData.areaType === 4) {
            this.areaTypes = this.areaTypeExternal;
            this.isShowTaxpayer = true;
            this.isInternal = false;
        } else {
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

        this.purchaseOrderItem.usePoIdInRoute = edit ? false : true;
        this.purchaseOrderItem.selectedPurchaseOrderitems = [];
        this.purchaseOrderItem.ngOnInit();
        this.purchaseOrderItem.loadNodes();

        if (edit) {
            setTimeout(() => {
                this.form.form.markAsPristine();
            }, 200);
        }
        this.cdr.detectChanges();
    }

    private initDataDto(): void {
        this.purchaseOrderData.supplierNameDto = this.toDto('name', this.purchaseOrderData.supplierName);
        this.purchaseOrderData.currencyDto = this.toDto('code', this.purchaseOrderData.currency);
        this.purchaseOrderData.supplierSiteNameDto = this.toDto('name', this.purchaseOrderData.supplierSiteName);
        this.purchaseOrderData.projectCodeDto = this.toDto('code', this.purchaseOrderData.projectCode);
        this.purchaseOrderData.ouNameDto = this.toDto('code', this.purchaseOrderData.ouName);
        this.purchaseOrderData.orgApplyNameDto = this.toDto('name', this.purchaseOrderData.orgApplyName);
        this.purchaseOrderData.paymentTermDto = this.toDto('name', this.purchaseOrderData.paymentTerm);
        this.purchaseOrderData.orgCodeDto = this.toDto('code', this.purchaseOrderData.orgCode);
        this.purchaseOrderData.referencePoCodeDto = this.toDto('code', this.purchaseOrderData.referencePoCode);
    }

    public editRow(): void {
        this.form.form.markAsDirty();
    }

    public onSuccess(data: any): any {
        if (data) {
            this.purchaseOrderData.totalAmount = data.totalWithTax;
            this.purchaseOrderData.isInternal = this.isInternal;
        }
    }

    private checkExistsInArray(arr: any, item: any): boolean {
        for (const obj of arr) {
            if (item.id === obj.id) {
                return true;
            }
        }
        return false;
    }

    public getListItemSaveInsert(poId: string): any {
        const arrItemSave = [];
        const arrPoItemId = [];
        for (const item of this.purchaseOrderItem.selectedPurchaseOrderitems) {
            if (!this.checkExistsInArray(arrItemSave, item.data)) {
                arrPoItemId.push(item.data.id);
                item.data.poId = poId;
                item.data.quantityRemain = 0;
                item.data.quantityWrongOther = 0;
                item.data.status = 1;
                delete item.data.id;
                arrItemSave.push(item.data);
            }
        }
        return { listItemSave: arrItemSave, listPoItemId: arrPoItemId };
    }

    public getListItemSaveUpdate() {
        let listPoi = [];
        for (const row of this.purchaseOrderItem.dataSource.treeNodes) {
            listPoi.push(row.data);
            if (row.children) {
                listPoi = listPoi.concat(row.children.map(x => x.data));
            }
        }
        return listPoi;
    }

    public onBtnSaveClick(): void {
        if (this.form) {
            if (!this.validateForm(this.form, 'id-form-appendix')) {
                this.notification.showMessage('VALIDATION.FORM_VALID');
                return;
            }
            if (this.form.dirty) {
                const saveConfirmation = new SaveConfirmation();
                saveConfirmation.accept = () => {
                    if (!this.dialogRef.input.id) {
                        delete this.purchaseOrderData.id; // thêm mới thì xóa id
                        this.purchaseOrderData.status = 1;
                        this.purchaseOrderData.sproTicketId = null;
                    }
                    this.purchaseOrderService
                        .merge(this.purchaseOrderData)
                        .subscribe((res) => {
                            if (!this.dialogRef.input.id && this.purchaseOrderItem.selectedPurchaseOrderitems.length > 0) {
                                const listItemSave = this.getListItemSaveInsert(res.id);
                                this.purchaseOrderItemService.bulkMergeAppendix(listItemSave).subscribe(m => {
                                    this.notification.showSuccess();
                                    this.dialogRef.hide();
                                    this.success.emit(res);
                                });
                            } else {
                                this.purchaseOrderItemService.bulkMerge(this.getListItemSaveUpdate()).subscribe(m => {
                                    this.notification.showSuccess();
                                    this.dialogRef.hide();
                                    this.success.emit(res);
                                });
                            }
                        });
                };
                this.notification.confirm(saveConfirmation);
            } else {
                this.dialogRef.hide();
            }
        } else {
            this.dialogRef.hide();
        }
    }

    public onBtnCancelClick(): void {
        this.success.emit();
        this.dialogRef.hide();
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

    public onChangeLegal(event: any): void {
        if (event) {
            this.purchaseOrderData.ouCode = event.ouId;
            this.purchaseOrderData.ouName = event.code;
            this.organizationRequestPayload.ouId = event.ouId;
            this.departmentRequestPayload.ouId = event.ouId;
            this.supplierSiteRequestPayload.ouId = event.ouId;
            this.purchaseOrderData.siteId = null;
            this.purchaseOrderData.supplierSiteNameDto = null;
            this.purchaseOrderData.projectCode = null;
            this.purchaseOrderData.projectCodeDto = null;
            this.organizationRequestPayload.ouId = this.purchaseOrderData.ouCode;
            this.departmentRequestPayload.ouId = this.purchaseOrderData.ouCode;
            this.supplierSiteRequestPayload.ouId = this.purchaseOrderData.ouCode;
            this.projectRequestPayload.ouId = this.purchaseOrderData.ouCode;
        }
    }

    public onChangeSupplierName(): void {
        if (this.purchaseOrderData.supplierNameDto) {
            this.purchaseOrderData.vendorId = this.purchaseOrderData.supplierNameDto.vendorId;
            this.supplierSiteRequestPayload.vendorId = this.purchaseOrderData.supplierNameDto.vendorId;
            this.purchaseOrderData.siteId = null;
            this.purchaseOrderData.supplierSiteNameDto = null;
        }
    }

    public onModelChangeSupplier(): void {
        this.supplierSiteRequestPayload.vendorId = this.purchaseOrderData.vendorId;
    }

    public onChangeSupplierSite(): void {
        this.purchaseOrderData.siteId = this.purchaseOrderData.supplierSiteNameDto
            ? this.purchaseOrderData.supplierSiteNameDto.siteId : null;
    }

    public onChangeOrgApply(event: any): void {
        if (event) {
            this.purchaseOrderData.subDepartmentId = event.subDepartmentId;
            this.purchaseOrderData.orgApplyName = event.name;
        }
    }

    public onChangeProjectCode(event: any) {
        if (event) {
            this.purchaseOrderData.projectCode = event.code;
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

    public onChangeReferPo(event: any): void {
        if (event) {
            this.purchaseOrderData.referencePoId = event.id;
            this.purchaseOrderData.referencePoCode = event.code;
        } else {
            this.purchaseOrderData.referencePoId = null;
            this.purchaseOrderData.referencePoCode = null;
        }
    }

    public onChangePeopleInvolved(data) {
        if (this.purchaseOrderData.peopleInvolvedDto) {
            const listUserName = this.purchaseOrderData.peopleInvolvedDto.map(({ userName }) => userName);
            this.purchaseOrderData.peopleInvolved = listUserName.join(',');
        }
    }

    public valueTypeChange(event: any): void {
        if (event) {
            this.form.form.markAsDirty();
            this.purchaseOrderData.valueType = event.value;
        }
    }

    public onSuccessInitFile(file: any) {
        if (file) {
            this.purchaseOrderData.attachmentId = file.id;
            this.purchaseOrderData.attachmentName = file.name;
        }
    }
}
