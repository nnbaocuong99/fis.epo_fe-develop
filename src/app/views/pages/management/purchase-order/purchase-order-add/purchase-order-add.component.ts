
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import * as config from './purchase-order-add.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { FileInfo } from '../../../../../services/modules/file/file.request.payload';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from '../../../../../services/modules/category/supplier/supplier.service';
import { CurrencyService } from '../../../../../services/modules/category/currency/currency.service';
import { FormDynamicData } from '../../../../partials/content/crud/component/form-dynamic-data.model';
import { PurchaseOrderService } from '../../../../../services/modules/purchase-order/purchase-order.service';
import { NgForm } from '@angular/forms';
import { PurchaseOrderItemService } from '../../../../../services/modules/purchase-order-item/purchase-order-item.service';
import { BaseFormComponent } from '../../../../../core/_base/component/base-form.component';
import { SaveConfirmation } from '../../../../../services/common/confirmation/save-confirmation';
import { ProjectService } from '../../../../../services/modules/category/project/project.service';
import { SupplierSiteService } from '../../../../../services/modules/category/supplier-site/supplier-site.service';
import { PurchaseOrderRequestPayload } from '../../../../../services/modules/purchase-order/purchase-order.request-payload';
import { OrganizationService } from '../../../../../services/modules/category/organization-management/organization/organization.service';
import { PaymentTermService } from '../../../../../services/modules/category/payment-term/payment-term.service';
import { DepartmentService } from '../../../../../services/modules/category/department/department.service';
import { ConfigListService } from '../../../../../services/modules/config-list/config-list.service';
import { PurchaseRequestItemService } from '../../../../../services/modules/purchase-request-item/purchase-request-item.service';
import {
    OperatingUnitService
} from '../../../../../services/modules/category/organization-management/operating-unit/operating-unit.service';
import { forkJoin, Observable } from 'rxjs';
import { PurchaseOrderItemComponent } from './purchase-order-item/purchase-order-item.component';
import { ChangeConfirmation } from '../../../../../services/common/confirmation';
import { UserService } from '../../../../../services/modules/user/user.service';
import * as configPoList from '../../purchase-order/purchase-order.config';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { currentUser } from '../../../../../core/auth';
import { ContractService } from '../../../../../services/modules/contract/contract.service';
import { PurchaseRequestAreaTypeComponent } from './purchase-request-area-type/purchase-request-area-type.component';
import { Location } from '@angular/common';

export enum ItemsType {
    Laptop = 'Máy tính xách tay',
    screenPC = 'Màn hình máy tính',
}
@Component({
    selector: 'app-purchase-order-add',
    templateUrl: './purchase-order-add.component.html',
    styleUrls: ['./purchase-order-add.component.scss']
})
export class PurchaseOrderAddComponent extends BaseFormComponent implements OnInit {
    @ViewChild('purchaseOrderItem', { static: false }) purchaseOrderItem: PurchaseOrderItemComponent;
    @ViewChild('purchaseRequestAreaType', { static: false }) purchaseRequestAreaType: PurchaseRequestAreaTypeComponent;
    @ViewChild('form', { static: true }) form: NgForm;
    @ViewChild('formItems', { static: true }) formItems: NgForm;
    public formData: FormDynamicData = new FormDynamicData();
    public purchaseOrderRequestPayload = new PurchaseOrderRequestPayload();
    public mainConfig = mainConfig.MAIN_CONFIG;
    public tabs = config.TABS;
    public productTypes = config.PRODUCT_TYPES;
    public poValue = config.PO_VALUE;
    public units = config.UNITS;
    public headerCategorys = config.HEADER_CATEGORY;
    public steps = config.STEPS;
    public areaTypeInternal = config.AREA_TYPE_INTERNAL;
    public areaTypeExternal = config.AREA_TYPE_EXTERNAL;
    public valueTypes = config.VALUE_TYPES;
    public taxPayers = config.TAX_PAYERS;
    public headerSuppliers = config.HEADER_SUPPLIER;
    public headerSupplierSites = config.HEADER_SUPPLIER_SITE;
    public headerProject = config.HEADER_PROJECT;
    public areaTypes = config.AREA_TYPE_INTERNAL;
    public headerPo = config.HEADER_PO;
    public headerOperatingUnit = config.HEADER_OPERATING_UNIT;
    public headerOrg = config.HEADER_ORG;
    public headerDepartment = config.HEADER_DEPARMENT;
    public headerPaymentTerm = config.HEADER_PAYMENT_TERM;
    public step: number;
    public stepClone: number;
    public request: any;
    public currentTab: number;
    public purchaseOrderItemData: any = [];
    public isShowPurchaseOrderItem = false;
    // Check ẩn thuế nhà thầu nều hình thức mua hàng là trong nước
    public isShowTaxpayer = true;
    // Có phải YCMH nội không?
    public isInternal = true;
    public title = 'Tạo mới đơn hàng';
    private titleInternal = 'Tạo mới đơn hàng nội';
    private titleExternal = 'Tạo mới đơn hàng ngoại';

    public purchaseOrderData: any = {
        areaType: null, supplierNameDto: { name: null }, supplierName: null,
        code: null, productType: null, valueType: null, createdAt: null,
        currencyDto: { name: null }, currency: null, subDepartmentId: null,
        orgCode: null, projectCode: null, hasCo: null, hasCq: null,
        taxpayer: null, rebateInfor: null, paymentTerm: null, ouCode: null
    };
    public configListDataFreightTerm: any[];
    public configListDataDelivery: any[];
    public configListDataDeliveryLocationGoOut: any[];
    public configListDataDeliveryLocationComeIn: any[];
    public selectedPurchaseRequestItem = [];
    public isSaveDraft = false;
    public currentUserName: any;
    public poMan: any;

    constructor(
        private cdr: ChangeDetectorRef,
        private notification: NotificationService,
        public supplierService: SupplierService,
        public currencyService: CurrencyService,
        public purchaseOrderService: PurchaseOrderService,
        public purchaseOrderItemService: PurchaseOrderItemService,
        public projectService: ProjectService,
        public supplierSiteService: SupplierSiteService,
        public operatingUnitService: OperatingUnitService,
        public organizationService: OrganizationService,
        private location: Location,
        public departmentService: DepartmentService,
        public paymentTermService: PaymentTermService,
        public configListService: ConfigListService,
        public purchaseRequestItemService: PurchaseRequestItemService,
        public userService: UserService,
        public contractService: ContractService,
        private store: Store<AppState>,
        private router: Router,
        private route: ActivatedRoute) {
        super();
        this.formData = {
            formId: 'purchase-order-edit',
            title: '',
            isCancel: true,
            service: this.purchaseOrderService,
            hideHeader: true
        };
        this.store.pipe(select(currentUser)).subscribe(obj => {
            if (obj) {
                this.currentUserName = obj.userName;
            }
        });
    }

    ngOnInit() {
        this.getConfigList();
        this.purchaseOrderRequestPayload.isFilterReferencePo = true;
        this.step = this.steps[0].value;
        this.currentTab = this.tabs[0].value;
        const routeSub = this.route.params.subscribe(params => {
            if (params.id) {
                this.step = 3;
                this.purchaseOrderService.selectById(params.id).subscribe(res => {
                    this.purchaseOrderData = res;
                    this.purchaseOrderData.deliveryLocationGoOutTemp =
                        this.purchaseOrderData.deliveryLocationGoOut ? this.purchaseOrderData.deliveryLocationGoOut.split(',') : [];
                    this.purchaseOrderData.deliveryLocationComeInTemp =
                        this.purchaseOrderData.deliveryLocationComeIn ? this.purchaseOrderData.deliveryLocationComeIn.split(',') : [];
                    this.cdr.detectChanges();
                });
            } else {
                this.purchaseOrderData = {};
                // Default ngày ký hợp đồng là ngày hiện tại
                this.purchaseOrderData.signDate = new Date();
            }
            setTimeout(() => {
                this.form.form.markAsPristine();
            }, 0);
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

    public setFragmentToRoute(event): void {
        this.currentTab = event.nextId;
    }

    public onBtnUploadClick(event: FileInfo[]): void {

    }

    public onChangePoContract(): void {
        let check = true;
        if (!this.form.valid && !this.form.disabled) {
            Object.keys(this.form.form.controls).forEach(key => {
                if (this.form.controls[key].invalid && key !== 'note') {
                    check = false;
                }
            });
        }
        if (!this.purchaseOrderData.note && check) {
            const suggestionsNote = [];
            if (this.purchaseOrderData.orgApplyAcronym) {
                suggestionsNote.push(this.purchaseOrderData.orgApplyAcronym);
            }
            if (this.poMan) {
                suggestionsNote.push(this.poMan);
            }
            if (this.purchaseOrderData.code) {
                suggestionsNote.push(this.purchaseOrderData.code);
            }
            if (this.purchaseOrderData.amAccount) {
                suggestionsNote.push(this.purchaseOrderData.amAccount);
            }
            if (this.purchaseOrderData.contractNo) {
                suggestionsNote.push(this.purchaseOrderData.contractNo);
            }
            this.purchaseOrderData.note = suggestionsNote.join('->');
            this.cdr.detectChanges();
        }
    }

    public bindingPrData(data: any): void {
        if (data) {
            const listParent = data.filter(x => x.parent);
            if (listParent.length > 0) {
                // distinct người phân loại để tạo ghi chú PO
                const arrTemp = [];
                const listPoMan = listParent.map(({ data }) => data.poMan);
                for (let i = 0; i < listParent.length; i++) {
                    if (!arrTemp.some(m => m === listPoMan[i])) {
                        arrTemp.push(listPoMan[i]);
                    }
                }
                this.poMan = arrTemp.join(',');
            }
            if (listParent[0].parent.data.prNo) {
                const pr = listParent[0].parent.data;
                this.purchaseOrderData.amAccount = pr.amAccount;
                this.purchaseOrderData.contractNo = pr.contractNo;
            }
            // YCMH nội: binding config hình thức mua hàng, default giá trị Mua hàng trong nước
            if (listParent[0].data.areaType === 1) {
                this.title = this.titleInternal;
                this.areaTypes = this.areaTypeInternal;
                this.purchaseOrderData.areaType = 1;
                this.isShowTaxpayer = false;
                this.isInternal = true;
                // YCMH ngoại: binding config hình thức mua hàng, default giá trị Mậu dịch
            } else {
                this.isInternal = false;
                this.title = this.titleExternal;
                this.isShowTaxpayer = true;
                this.areaTypes = this.areaTypeExternal;
                this.purchaseOrderData.areaType = 3;
            }

            this.purchaseOrderData.ouCode = listParent[0].data.legal ? listParent[0].data.legal : listParent[0].data.legalOrigin;
            // tslint:disable-next-line:max-line-length
            this.purchaseOrderData.ouName = listParent[0].data.legalName ? listParent[0].data.legalName : listParent[0].data.legalNameOrigin;
            if (this.purchaseOrderData.ouName) {
                this.purchaseOrderData.ouNameDto = {
                    code: this.purchaseOrderData.ouName
                };
            }

            if (listParent[0].data.vendorId) {
                this.purchaseOrderData.supplierNameDto = {
                    code: listParent[0].data.vendorId,
                    name: listParent[0].data.supplierName
                };
                this.purchaseOrderData.supplierName = listParent[0].data.supplierName;
                this.purchaseOrderData.vendorId = listParent[0].data.vendorId;
            }

            this.purchaseOrderData.currencyDto = {
                code: listParent[0].data.currency
            };
            this.purchaseOrderData.currency = listParent[0].data.currency;
            this.purchaseOrderData.currencyOrigin = listParent[0].data.currency;
            // tslint:disable-next-line:max-line-length
            this.purchaseOrderData.subDepartmentId = listParent[0].data.subDepartmentId ? listParent[0].data.subDepartmentId : listParent[0].data.subDepartmentIdOrigin;
            // tslint:disable-next-line:max-line-length
            this.purchaseOrderData.orgApplyName = listParent[0].data.orgApplyName ? listParent[0].data.orgApplyName : listParent[0].data.orgApplyNameOrigin;
            this.purchaseOrderData.orgApplyAcronym = listParent[0].data.orgApplyAcronym;
            if (this.purchaseOrderData.orgApplyName) {
                this.purchaseOrderData.orgApplyNameDto = {
                    name: this.purchaseOrderData.orgApplyName
                };
            }
            this.purchaseOrderData.orgCode = listParent[0].data.orgCode ? listParent[0].data.orgCode : listParent[0].data.orgCodeOrigin;
            if (this.purchaseOrderData.orgCode) {
                this.purchaseOrderData.orgCodeDto = {
                    code: this.purchaseOrderData.orgCode
                };
            }
            this.purchaseOrderData.projectCode = listParent[0].parent.data.projectCode;
            if (this.purchaseOrderData.projectCode) {
                this.purchaseOrderData.projectCodeDto = {
                    code: this.purchaseOrderData.projectCode
                };
            }

            this.purchaseOrderData.hasCo = listParent[0].parent.data.hasCo;
            this.purchaseOrderData.hasCq = listParent[0].parent.data.hasCq;

            this.purchaseOrderData.prId = listParent[0].parent.data.id;
            // map trường đơn giá bên request sang order
            for (const parent of data) {
                parent.data.price = parent.data.priceBp ? parent.data.priceBp : parent.data.expectedPrice;
                parent.data.itemNameOrigin = parent.data.itemName;
                parent.data.unitOrigin = parent.data.unit;
                for (const chil of parent.children) {
                    chil.data.price = chil.data.priceBp ? chil.data.priceBp : chil.data.expectedPrice;
                    chil.data.itemNameOrigin = chil.data.itemName;
                    chil.data.unitOrigin = chil.data.unit;
                }
            }

            this.purchaseOrderItemData = data.map(x => { x.data.prItemId = x.data.id; return x.data; });
            let purchaseOrderValue = 0;
            for (const item of this.purchaseOrderItemData) {
                purchaseOrderValue += (item.quantity ? item.quantity : 0) * (item.price ? item.price : 0);
            }

            // Phân loại hợp đòng
            if (purchaseOrderValue <= 100000000) {
                this.purchaseOrderData.valueType = this.valueTypes[0].value;
            } else {
                this.purchaseOrderData.valueType = this.valueTypes[1].value;
            }

            this.purchaseOrderData.taxpayer = listParent[0].data.taxpayer;
            this.selectedPurchaseRequestItem = data;

            this.getSupplierSiteBySupplier();
            this.step = 2;
        } else {
            // tạo PO không qua PR default setting
            this.isInternal = false;
            this.title = this.titleExternal;
            this.isShowTaxpayer = true;
            this.areaTypes = this.areaTypeExternal;
            this.purchaseOrderData.areaType = 3;
            this.step = 2;
        }
    }

    public editRow(dataSource: any): void {
        this.form.form.markAsDirty();
        this.purchaseOrderItemData.dataSource = dataSource;
    }

    public onSaveAsDraftPurchaseOrder(step: number): void {
        if (step === 3) {
            if (this.purchaseOrderItemData && this.purchaseOrderItemData.length > 0) {
                for (const obj of this.purchaseOrderItemData) {
                    if (obj.itemName.toString().toLowerCase().includes(ItemsType.Laptop.toLowerCase())
                        || obj.itemName.toString().toLowerCase().includes(ItemsType.screenPC.toLowerCase())) {
                        obj.hasEnergyEfficiency = true;
                    }
                }
            }
            // delete this.purchaseOrderData.id;
            const requestSave = {
                // Default trạng thái PO là Lưu nháp khi click btn lưu nháp
                purchaseOrder: { ...this.purchaseOrderData, status: 9 },
                // Default trạng thái PO Item là Đã tạo, active và số lượng còn lại
                purchaseOrderItem: this.getPoItemSave('saveDraft'),
                purchaseRequestItemMatch: []
            };

            const saveSub = this.purchaseOrderService.saveDraft(requestSave).subscribe(resSave => {
                if (resSave) {
                    this.form.form.markAsPristine();
                    this.notification.showSuccess();
                    this.purchaseOrderData.id = resSave.id;
                    this.isShowPurchaseOrderItem = true;
                    this.step = step;
                }
                this.router.navigate([`../view/${this.purchaseOrderData.id}`], { relativeTo: this.route });
                this.cdr.detectChanges();
            });
            this.subscriptions.push(saveSub);
        }
    }

    public onChangeStepClick(step: number, action?: string): void {
        // check chặn không cho back step 1 nếu đã đi đến step 3
        this.stepClone = ((this.step > this.stepClone) || !this.stepClone) ? this.step : this.stepClone;
        if ((this.step === 3 || this.stepClone === 3) && step === 1) {
            return;
        }

        // Check chặn trường hợp click nhảy qua 1 step
        if (step > this.step && (step - this.step) > 1) {
            return;
        }

        switch (step) {
            case 2:
                if (this.step < step) {
                    this.purchaseRequestAreaType.onBtnNextStepClick();
                } else {
                    this.step = step;
                }
                break;
            case 3:
                if (!action || !this.checkPoSignDate()) {
                    return;
                }
                this.step = step;
                if (this.purchaseOrderItemData && this.purchaseOrderItemData.length > 0) {
                    for (const obj of this.purchaseOrderItemData) {
                        if (obj.itemName.toString().toLowerCase().includes(ItemsType.Laptop.toLowerCase())
                            || obj.itemName.toString().toLowerCase().includes(ItemsType.screenPC.toLowerCase())) {
                            obj.hasEnergyEfficiency = true;
                        }
                    }
                }
                this.isShowPurchaseOrderItem = true;
                break;
            case 4:
                // Check lưu khi edit row
                if (this.purchaseOrderItem && this.purchaseOrderItem.dataSource) {
                    if (this.purchaseOrderItem.dataSource.items.length === 0) {
                        this.notification.showWarning('Vui lòng thêm item trước khi thực hiện');
                        return;
                    }
                    if (this.purchaseOrderItem) {
                        if (!this.purchaseOrderItem.validateForm(this.purchaseOrderItem.form, 'purchase-order-item')) {
                            return;
                        }
                    }
                    if (this.purchaseOrderItem.dataSource.items && this.purchaseOrderItem.dataSource.items.length > 0) {
                        for (const element of this.purchaseOrderItem.dataSource.items) {
                            if (element.responseDate && element.expectedDate) {
                                let responseDate = new Date(element.responseDate);
                                responseDate = new Date(responseDate.toDateString());
                                let expectedDate = new Date(element.expectedDate);
                                expectedDate = new Date(expectedDate.toDateString());
                                const temp = new Date(new Date(element.expectedDate).setDate(new Date(element.expectedDate).getDate() - 5));
                                if (responseDate && expectedDate && temp > responseDate) {
                                    this.notification.showWarning('VALIDATION.MSGRESPONSEDATEERROR');
                                    break;
                                }
                                if (responseDate && expectedDate && responseDate > expectedDate) {
                                    this.notification.showWarning('Ngày dự kiến hàng về lớn hơn ngày yêu cầu giao hàng');
                                    break;
                                }
                            }
                        }
                    }

                    // lấy item con để update
                    for (const row of this.purchaseOrderItem.dataSource.treeNodes) {
                        // check bắt buộc fill ngày dự kiên hàng về
                        if (!row.data.expectedDate) {
                            this.notification.showError('Vui lòng update thông tin ngày yêu cầu giao hàng !!!');
                            return;
                        }
                        if (!row.data.responseDate) {
                            this.notification.showError('Vui lòng update thông tin ngày dự kiến hàng về !!!');
                            return;
                        }
                        if (!row.data.producerName) {
                            this.notification.showError('Vui lòng update thông tin hãng sản xuất !!!');
                            return;
                        }
                        if (row.data.guarantee === null || row.data.guarantee === undefined) {
                            this.notification.showError('Vui lòng update thông tin thời hạn bảo hành !!!');
                            return;
                        }
                        if (row.children) {
                            for (const children of row.children) {
                                // check bắt buộc fill ngày dự kiên hàng về
                                if (!children.data.expectedDate) {
                                    this.notification.showError('Vui lòng cập nhật thông tin ngày yêu cầu giao hàng !!!');
                                    return;
                                }
                                if (!children.data.responseDate) {
                                    this.notification.showError('Vui lòng cập nhật thông tin ngày dự kiến hàng về !!!');
                                    return;
                                }
                                if (!children.data.producerName) {
                                    this.notification.showError('Vui lòng cập nhật thông tin hãng sản xuất !!!');
                                    return;
                                }
                                if (children.data.guarantee === null || children.data.guarantee === undefined) {
                                    this.notification.showError('Vui lòng cập nhật thông tin thời hạn bảo hành !!!');
                                    return;
                                }
                            }
                        }
                    }

                    // tslint:disable-next-line:max-line-length
                    if (this.form.dirty && this.purchaseOrderItem.dataSource.treeNodes && this.purchaseOrderItem.dataSource.treeNodes.length > 0) {
                        const saveConfirmation = new SaveConfirmation();
                        saveConfirmation.accept = () => {
                            this.processSave(step);
                        };
                        this.notification.confirm(saveConfirmation);
                    } else {
                        this.step = step;
                    }
                }
                break;
            default:
                this.step = step;
                break;
        }
    }

    public checkPoSignDate(): boolean {
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

    public getPoItemSave(saveDraft?: string): any {
        const arrItemSave = [];
        if (this.purchaseOrderItem && !saveDraft) {
            for (let i = 0; i < this.purchaseOrderItem.dataSource.treeNodes.length; i++) {
                const item = this.purchaseOrderItem.dataSource.treeNodes[i];
                item.data.indexNo = (i + 1).toString();
                item.data.isActive = true;
                item.data.quantityRemain = item.data.quantity;
                item.data.status = 1;
                item.data.prItemId = item.data.id;
                delete item.data.id;
                arrItemSave.push(item.data);

                if (item.children && item.children.length > 0) {
                    for (let j = 0; j < item.children.length; j++) {
                        const children = item.children[j];
                        children.data.indexNo = (i + 1).toString() + '.' + (j + 1).toString();
                        children.data.isActive = true;
                        children.data.quantityRemain = children.data.quantity;
                        children.data.status = 1;
                        children.data.prItemId = children.data.id;
                        delete children.data.id;
                        arrItemSave.push(children.data);
                    }
                }
            }
        } else if (saveDraft && this.purchaseOrderItemData && this.purchaseOrderItemData.length > 0) {
            for (const element of this.purchaseOrderItemData) {
                element.isActive = true;
                element.quantityRemain = element.quantity;
                element.status = 1;
                delete element.id;
                arrItemSave.push(element);
            }
        }
        return arrItemSave;
    }

    private processSave(step): void {
        delete this.purchaseOrderData.id;
        const requestSave = {
            // Default trạng thái PO là Đã tạo
            purchaseOrder: { ...this.purchaseOrderData, status: 1 },
            // Default trạng thái PO Item là Đã tạo, active và số lượng còn lại
            purchaseOrderItem: this.getPoItemSave(),
            purchaseRequestItemMatch: this.purchaseOrderItem.selectedPurchaseRequestItem.filter(x => x.data.id).map(x => {
                return x.data;
            })
        };

        const saveSub = this.purchaseOrderService.save(requestSave).subscribe(resSave => {
            if (resSave) {
                this.form.form.markAsPristine();
                this.notification.showSuccess();
                this.step = step;
                this.purchaseOrderData.id = resSave.id;
                this.isShowPurchaseOrderItem = true;
                // Lấy createdAt để bước 4 có để lưu (fix lỗi mất createdAt)
                this.purchaseOrderService.selectById(resSave.id).subscribe(m => {
                    this.purchaseOrderData = m;
                });
            }
            this.router.navigate([`../view/${this.purchaseOrderData.id}`], { relativeTo: this.route });
            this.cdr.detectChanges();
        });
        this.subscriptions.push(saveSub);
    }

    public back(): void {
        this.location.back();
        // this.router.navigate([`list`], { relativeTo: this.route.parent });
    }

    public valueTypeChange(event: any): void {
        this.purchaseOrderData.valueType = event.value;
    }

    public taxPayerChange(event: any): void {
        this.purchaseOrderData.taxpayer = event.value;
    }


    public onChangeSupplierName(): void {
        if (this.purchaseOrderData.supplierNameDto) {
            this.purchaseOrderData.vendorId = this.purchaseOrderData.supplierNameDto.vendorId;
            this.purchaseOrderData.siteId = null;
            this.purchaseOrderData.supplierSiteNameDto = null;
            this.getSupplierSiteBySupplier();
            this.onChangePoContract();
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

    public onChangeReferPo(event: any): void {
        if (event) {
            this.purchaseOrderData.referencePoId = event.id;
            this.purchaseOrderData.referencePoCode = event.code;
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

    public onChangeOrgApply(event: any): void {
        if (event) {
            this.purchaseOrderData.subDepartmentId = event.subDepartmentId;
            this.purchaseOrderData.orgApplyName = event.name;
            this.purchaseOrderData.orgApplyAcronym = event.acronym;
            this.onChangePoContract();
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
            this.onChangePoContract();
        }
    }

    public onChangePaymentTerm(event: any): void {
        if (event) {
            this.purchaseOrderData.paymentTerm = event.name;
            this.onChangePoContract();
        }
    }

    public onChangeOrgCode(event: any): void {
        if (event) {
            this.purchaseOrderData.orgCode = event.code;
            this.onChangePoContract();
        }
    }

    public onChangeSupplierSite(): void {
        this.purchaseOrderData.siteId = this.purchaseOrderData.supplierSiteNameDto
            ? this.purchaseOrderData.supplierSiteNameDto.siteId : null;
        this.onChangePoContract();
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
        this.onChangePoContract();
    }

    public onChangeProjectCode(event: any) {
        if (event) {
            this.purchaseOrderData.projectCode = event.code;
            this.contractService.syncContract(this.purchaseOrderData, event.code);
            this.onChangePoContract();
        }
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
}
