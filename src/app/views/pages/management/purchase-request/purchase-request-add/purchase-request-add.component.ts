import {
    Component,
    OnInit,
    ChangeDetectorRef,
    ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as config from './purchase-request-add.config';
import { PurchaseRequestService } from '../../../../../services/modules/purchase-request/purchase-request.service';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import * as mainConfig from '../../../../../core/_config/main.config';
import * as parentConfig from '../purchase-request.config';
import { FormDynamicData } from '../../../../partials/content/crud/component/form-dynamic-data.model';
import { NgForm } from '@angular/forms';
import { BaseListComponent } from '../../../../../core/_base/component/base-list.component';
import { PurchasePlanRequestPayload } from '../../../../../services/modules/purchase-plan/purchase-plan.request-payload';
import { PurchasePlanService } from '../../../../../services/modules/purchase-plan/purchase-plan.service';
import { Guid } from 'guid-typescript';
import { ConfirmDialog } from 'primeng/confirmdialog';
import {
    OperatingUnitService
} from '../../../../../services/modules/category/organization-management/operating-unit/operating-unit.service';
import { OrganizationService } from '../../../../../services/modules/category/organization-management/organization/organization.service';
import { DialogRef } from '../../../../partials/content/crud/dialog/dialog-ref.model';
import { PurchaseRequestItemService } from '../../../../../services/modules/purchase-request-item/purchase-request-item.service';
import { SaveConfirmation } from '../../../../../services/common/confirmation/save-confirmation';
import { CancelConfirmation } from '../../../../../services/common/confirmation/cancel-confirmation';
import { DepartmentService } from '../../../../../services/modules/category/department/department.service';
import { PurchaseRequestItemComponent } from './purchase-request-item/purchase-request-item.component';
import { ProjectService } from '../../../../../services/modules/category/project/project.service';
import * as _moment from 'moment';
import { UserService } from '../../../../../services/modules/user/user.service';
import { Location } from '@angular/common';
import { currentUser } from '../../../../../core/auth';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';

@Component({
    selector: 'app-purchase-request-add',
    templateUrl: './purchase-request-add.component.html',
    styleUrls: ['./purchase-request-add.component.scss'],
})

export class PurchaseRequestAddComponent extends BaseListComponent implements OnInit {
    @ViewChild('form', { static: true }) form: NgForm;
    @ViewChild('purchaseRequestItem', { static: true }) purchaseRequestItem: PurchaseRequestItemComponent;
    @ViewChild('purchaseRequestItem2', { static: true }) purchaseRequestItem2: PurchaseRequestItemComponent;
    @ViewChild('dlgConfirm', { static: true }) dlgConfirm: ConfirmDialog;

    public formData: FormDynamicData = new FormDynamicData();
    public purchaseRequestData: any = {
        prTypeTemp: null,
        prType: null,
    };
    public mainConfig: any = mainConfig.MAIN_CONFIG;
    public formTitle = 'PURCHASE_REQUEST.HEADER_CREATE';
    public tabs = config.TABS;
    public prTypeTemp = parentConfig.PR_TYPE;
    public prStatus = parentConfig.PR_STATUS;
    public ppStatus = parentConfig.PP_STATUS;
    public prContractInfo = parentConfig.PR_CONTRACT_INFO;
    public steps = config.STEPS;
    public step: number;
    public prContractStatus = parentConfig.PR_STATUS;
    public headerPurchasePlans = config.HEADER_PURCHASE_PLAN;
    public headerOrg = config.HEADER_ORG;
    public headerOperatingUnit = config.HEADER_OPERATING_UNIT;
    public headerDepartment = config.HEADER_DEPARMENT;
    public ppTabs = config.PP_TABS;
    public selectedPurchasePlan: any = {};
    public key: string;
    public dialogRef: DialogRef = new DialogRef();
    private purchaseRequestDataIdEdit: string;
    private codeDefault = 'xxxxx/xxxxxx/xxxxx';

    public allowViewPrice = false; // check có cả AM và PM thì PM không được xem giá

    constructor(
        public purchaseRequestService: PurchaseRequestService,
        public purchaseRequestItemService: PurchaseRequestItemService,
        public purchasePlanService: PurchasePlanService,
        public cd: ChangeDetectorRef,
        private notificationService: NotificationService,
        private router: Router,
        private location: Location,
        private route: ActivatedRoute,
        public operatingUnitService: OperatingUnitService,
        public departmentService: DepartmentService,
        public organizationService: OrganizationService,
        public projectService: ProjectService,
        public userService: UserService,
        private store: Store<AppState>
    ) {
        super();
        this.key = Guid.create().toString();
        this.formData = {
            formId: 'purchase-request-edit',
            icon: 'fal fa-shopping-cart',
            title: this.formTitle,
            service: this.purchaseRequestService,
            isCancel: true,
            hideHeader: true
        };
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
                    }
                }
            }
        });
    }

    ngOnInit() {
        this.request = new PurchasePlanRequestPayload();
        this.baseService = this.purchasePlanService;
        // Default tab đã tạo
        this.request.status = 0;
        this.request.createPr = 1;
        this.initDataPp();
        this.pagingData();
        const routeSub = this.route.params.subscribe((params) => {
            if (params.id) {
                this.router.navigate([`../edit/${params.id}`], { relativeTo: this.route });
            } else {
                this.convertDataWhenCreateFromPurchasePlan();
            }
        });
        this.subscriptions.push(routeSub);
    }

    private initDataPp(search?: boolean): void {
        let request = new PurchasePlanRequestPayload();
        request = search ? this.request : request;
        const countSub = this.purchasePlanService.countByStatus(request).subscribe(res => {
            if (res && res.length > 0) {
                for (const item of this.ppTabs) {
                    item.count = res.find(x => x.status === item.value) ?
                        res.find(x => x.status === item.value).count : 0;
                }
                this.initData();
            }
        });
        this.subscriptions.push(countSub);
    }

    public onBtnResetSearchClick() {
        const status = this.request.status;
        this.request = new PurchasePlanRequestPayload();
        this.request.status = status;
        const search = true;
        this.initDataPp(search);
    }

    public onBtnSearchClick(): void {
        const search = true;
        this.initDataPp(search);
    }

    private convertDataWhenCreateFromPurchasePlan(): void {
        this.purchaseRequestItem.selectedPurchasePlanItemsRes = JSON.parse(localStorage.getItem('selectedPurchasePlanItems'));
        localStorage.removeItem('selectedPurchasePlanItems');
        const ppId = JSON.parse(localStorage.getItem('ppId'));
        localStorage.removeItem('ppId');
        if (ppId) {
            const selectSub = this.purchasePlanService.selectById(ppId).subscribe(res => {
                this.selectedPurchasePlan = { ...res };
                this.purchaseRequestData = { ...res };
                this.purchaseRequestData.id = null;
                this.purchaseRequestData.prTypeTemp = null;
                this.purchaseRequestData.prType = null;
                this.cd.detectChanges();
            });
            this.subscriptions.push(selectSub);
            this.step = 2;
        } else {
            this.step = 1;
        }
    }

    public addTagFn(name: string) {
        return name;
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

    public onBtnCancelClick(): void {
        // this.redirectToParentPage();
        this.location.back();
    }

    public onBtnSaveClick(): void {
        const saveSub = this.purchaseRequestService
            .merge(this.purchaseRequestData)
            .subscribe((res) => {
                this.notificationService.showSuccess();
                this.form.form.markAsPristine();
                this.redirectToEditPage(res);
            });
        this.subscriptions.push(saveSub);
    }

    private redirectToEditPage(res): void {
        this.router.navigate([`../edit/${res.id}`], { relativeTo: this.route });
    }

    private redirectToParentPage(): void {
        this.router.navigate([`list`], { relativeTo: this.route.parent });
    }

    private checkExistsInArray(arr: any, item: any): boolean {
        for (const obj of arr) {
            if (item.id === obj.id) {
                return true;
            }
        }
        return false;
    }

    public getDataFromChildrenAndSave(data: any): void {
        const arrDataSave = [];
        if (data) {
            for (const parent of data) {
                if (!this.checkExistsInArray(arrDataSave, parent.data)) {
                    parent.data.isSubItem = false;
                    arrDataSave.push(parent.data);
                }
                if (parent.children) {
                    for (const children of parent.children) {
                        if (!this.checkExistsInArray(arrDataSave, children.data)) {
                            children.data.isSubItem = true;
                            arrDataSave.push(children.data);
                        }
                    }
                }
            }
        }

        if (!this.purchaseRequestData.prStatus) {
            this.purchaseRequestData.prStatus = 1;
        }
        this.purchaseRequestData.ppId = this.selectedPurchasePlan.id;
        if (this.purchaseRequestDataIdEdit) {
            this.purchaseRequestData.id = this.purchaseRequestDataIdEdit;
        }
        arrDataSave.map(x => {
            x.ppItemId = x.id;
            x.quantityRemain = x.quantity;
            x.status = 1;
            delete x.id;
        });
        this.purchaseRequestData.purchaseRequestItems  = arrDataSave;
        this.purchaseRequestService.merge(this.purchaseRequestData).subscribe(res => {
            if (res) {
                if (this.purchaseRequestDataIdEdit) {
                    const dataDeleteAndInsert: any = { prId: res.id, listPurchaseRequestItem: arrDataSave };
                    this.purchaseRequestItemService.deleteAllAndInsertByPrId(dataDeleteAndInsert).subscribe(m => {
                        this.purchaseRequestDataIdEdit = null;
                    });
                }
                this.notificationService.showSuccess();
                this.step = this.steps[2].value;

                this.redirectToEditPage(res);

                this.cd.detectChanges();
                setTimeout(() => {
                    this.form.form.markAsPristine();
                }, 0);
            }
        });
    }

    public onChangeStepClick(step: number): void {
        if (step > this.step) {
            // Chỉnh sửa yêu cầu mua hàng
            if (step === 2 && step === (this.step + 1)) {
                if (!this.selectedPurchasePlan || (this.selectedPurchasePlan && !this.selectedPurchasePlan.id)) {
                    this.notificationService.showWarning('VALIDATION.PURCHASE_REQUEST.MSG_001');
                    return;
                }
                if (this.selectedPurchasePlan &&
                    !((this.selectedPurchasePlan.status === 0 || this.selectedPurchasePlan.status === 5) ||
                        (this.selectedPurchasePlan.status === 1 && this.selectedPurchasePlan.quantityRemainTotal > 0))) {
                    this.notificationService.showWarning('VALIDATION.PURCHASE_REQUEST.MSG_002');
                    return;
                }
                if (this.selectedPurchasePlan && this.selectedPurchasePlan.id !== this.purchaseRequestData.ppId) {
                    this.purchasePlanService.selectById(this.selectedPurchasePlan.id).subscribe(res => {
                        if (res) {
                            this.purchaseRequestData = res;

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

                            this.checkRole();

                            this.purchaseRequestData.id = null;
                            if (!this.purchaseRequestData.prTypeTemp) {
                                this.purchaseRequestData.prTypeTemp = 1;
                            }
                            if (!this.purchaseRequestData.prType) {
                                this.purchaseRequestData.prType = 1;
                            }
                            this.purchaseRequestData.customerName = this.purchaseRequestData.customer;
                            this.purchaseRequestData.prNo = this.codeDefault;
                            this.form.form.markAsPristine();
                            this.step = step;
                            this.cd.detectChanges();
                        }
                    });
                } else {
                    this.notificationService.showMessage('VALIDATION.PURCHASE_REQUEST.MSG_003');
                }
            }

            // Chọn mặt hàng
            if (step === 3 && step === (this.step + 1)) {
                if (this.form) {
                    if (!this.validateForm(this.form, this.formData.formId)) {
                        return;
                    }
                    this.step = step;
                    // if (this.form.dirty) {
                    //     this.step = step;
                    //     this.purchaseRequestItem.loadNodes();
                    // } else {
                    //     this.step = step;
                    //     this.purchaseRequestItem.loadNodes();
                    // }
                }
            }

            // Hoàn thành
            if (step === 4 && step === (this.step + 1)) {
                if (this.purchaseRequestItem && this.purchaseRequestItem.selectedPurchasePlanItems) {
                    // bỏ treeSource để dễ check
                    const purchaseRequestItemsCheck = this.getListpurchaseRequestItem();
                    if (purchaseRequestItemsCheck.length === 0) {
                        this.notificationService.showError('COMMON_MSG.ITEM_EMPTY_WARNING');
                        return;
                    } else if (purchaseRequestItemsCheck.find(x => !x.producerName)) {
                        this.notificationService.showError('Vui lòng cập nhật hãng sản xuất');
                        return;
                    } else if (purchaseRequestItemsCheck.find(x => x.guarantee === null || x.guarantee === undefined)) {
                        this.notificationService.showError('Vui lòng cập nhật thời gian bảo hành');
                        return;
                    }
                    for (const item of purchaseRequestItemsCheck) {
                        const a = _moment(new Date(item.expectedDate), 'yyyy-MM-dd').toDate();
                        const b = _moment(new Date(), 'yyyy-MM-dd').toDate();
                        if (this.compareDate(a, b) < 0) {
                            this.notificationService.showError('Ngày YC giao hàng phải lớn hơn ngày hiện tại');
                            return;
                        }
                    }
                    if (purchaseRequestItemsCheck.find(x => x.producerName !== purchaseRequestItemsCheck[0].producerName)) {
                        this.purchaseRequestData.producerName = 'All';
                    } else {
                        this.purchaseRequestData.producerName = purchaseRequestItemsCheck[0].producerName;
                    }
                }
                if (this.form.form.dirty) {
                    const saveConfirmation = new SaveConfirmation();
                    saveConfirmation.accept = () => {
                        this.purchaseRequestItem.sendDataToParent();
                    };
                    this.notificationService.confirm(saveConfirmation);
                } else {
                    this.step = step;
                }
            }
        } else if (step < this.step) {
            if (step === 1 && step === (this.step - 1)) {
                if (this.form.form.dirty || this.purchaseRequestData.id) {
                    const cancelConfirmation = new CancelConfirmation();
                    cancelConfirmation.accept = () => {
                        this.purchaseRequestDataIdEdit = this.purchaseRequestData.id;
                        this.purchaseRequestData = {};
                        this.form.form.reset();
                        this.step = step;
                        setTimeout(() => {
                            this.form.form.markAsPristine();
                        }, 0);
                    };
                    this.notificationService.confirm(cancelConfirmation);
                } else {
                    this.step = step;
                }
            }
            if (step === 2 && step === (this.step - 1)) {
                this.step = step;
            }
            if (step === 3 && step === (this.step - 1)) {
                this.step = step;
                this.purchaseRequestItem.loadNodes();
            }
        }
    }

    public getListpurchaseRequestItem(): any {
        // Bỏ tree table
        const arrItemSave = [];
        for (let i = 0; i < this.purchaseRequestItem.selectedPurchasePlanItems.length; i++) {
            const item = this.purchaseRequestItem.selectedPurchasePlanItems[i];
            item.data.indexNo = (i + 1).toString();
            arrItemSave.push(item.data);
            if (item.children && item.children.length > 0) {
                for (let j = 0; j < item.children.length; j++) {
                    const children = item.children[j];
                    children.data.indexNo = (i + 1).toString() + '.' + (j + 1).toString();
                    arrItemSave.push(children.data);
                }
            }
        }
        return arrItemSave;
    }

    public onChangeSelectPrType(value: any) {
        this.prContractInfo = parentConfig.PR_CONTRACT_INFO;
        if (value) {
            if (+value === 1) {
                this.prContractInfo = this.prContractInfo.filter(m => m.value !== 3);
                this.purchaseRequestData.prType = this.prContractInfo[0].value;
            }
            if (+value === 2) {
                this.prContractInfo = this.prContractInfo.filter(m => m.value === 3);
                this.purchaseRequestData.prType = this.prContractInfo[0].value;
            }
            if (!this.purchaseRequestData.id && value === null) {
                this.purchaseRequestData.prType = null;
            }
        }
    }
    public onBtnViewDialog(rowData: any): void {
        this.dialogRef.input = rowData.id;
        this.dialogRef.show();
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

    public onTabSelectPpChange(event: any): void {
        this.request.status = event.nextId;
        this.initDataPp();
    }

    public compareDate(date1: Date, date2: Date): number {
        date1.setHours(0);
        date1.setMinutes(0);
        date1.setSeconds(0);
        date1.setMilliseconds(0);
        date2.setHours(0);
        date2.setMinutes(0);
        date2.setSeconds(0);
        date2.setMilliseconds(0);
        if (_moment(date1).isAfter(date2)) {
            return 1;
        }
        if (_moment(date1).isSame(date2)) {
            return 0;
        }
        if (_moment(date1).isBefore(date2)) {
            return -1;
        }
    }

    public onChangePeopleInvolved(data) {
        if (this.purchaseRequestData.peopleInvolvedDto) {
            const listUserName = this.purchaseRequestData.peopleInvolvedDto.map(({ userName }) => userName);
            this.purchaseRequestData.peopleInvolved = listUserName.join(',');
        }
    }
}
