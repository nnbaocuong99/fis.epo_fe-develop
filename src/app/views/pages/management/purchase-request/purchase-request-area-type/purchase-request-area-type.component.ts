import {
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild
} from '@angular/core';
import { forkJoin, merge } from 'rxjs';
import { PurchaseRequestItemService } from '../../../../../services/modules/purchase-request-item/purchase-request-item.service';
import * as config from './purchase-request-area-type.config';
import * as editConfig from '../purchase-request-edit/purchase-request-edit.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { PurchaseRequestService } from '../../../../../services/modules/purchase-request/purchase-request.service';
import { PurchaseRequestRequestPayload } from '../../../../../services/modules/purchase-request/purchase-request.request-payload';
import { Guid } from 'guid-typescript';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import {
    PurchaseRequestItemRequestPayload
} from '../../../../../services/modules/purchase-request-item/purchase-request-item.request-payload';
import { ActivatedRoute, Router } from '@angular/router';
import { SaveConfirmation } from '../../../../../services/common/confirmation/save-confirmation';
import { ToolbarModel } from '../../../../partials/content/toolbar/toolbar.model';
import { BaseListComponent } from '../../../../../core/_base/component';
import {
    OperatingUnitRequestPayload
} from '../../../../../services/modules/category/organization-management/operating-unit/operating-unit.request.payload';
import {
    OperatingUnitService
} from '../../../../../services/modules/category/organization-management/operating-unit/operating-unit.service';
import {
    OrganizationService
} from '../../../../../services/modules/category/organization-management/organization/organization.service';
import {
    OrganizationRequestPayload
} from '../../../../../services/modules/category/organization-management/organization/organization.request.payload';
import { DialogRef } from '../../../../partials/content/crud/dialog/dialog-ref.model';
import { CancelConfirmation } from '../../../../../services/common/confirmation';
import { ProjectService } from '../../../../../services/modules/category/project/project.service';
import { DepartmentService } from '../../../../../services/modules/category/department/department.service';
import { SupplierService } from '../../../../../services/modules/category/supplier/supplier.service';
import { CurrencyService } from '../../../../../services/modules/category/currency/currency.service';
import { NgForm } from '@angular/forms';
import { DepartmentRequestPayload } from '../../../../../services/modules/category/department/department.request.payload';
import { NotificationListService } from '../../../../../services/modules/notification-list/notification-list.service';
import { AppState } from '../../../../../core/reducers';
import { select, Store } from '@ngrx/store';
import { currentUser } from '../../../../../core/auth';
import { RoleService } from '../../../../../services/modules/role/role.service';
import { MatPaginator } from '@angular/material';
import { tap } from 'rxjs/internal/operators/tap';
import { UserService } from '../../../../../services/modules/user/user.service';
import { BrandService } from '../../../../../services/modules/category/brand/brand.service';

@Component({
    selector: 'app-purchase-request-area-type',
    templateUrl: './purchase-request-area-type.component.html',
    styleUrls: ['./purchase-request-area-type.component.scss']
})
export class PurchaseRequestAreaTypeComponent extends BaseListComponent implements OnInit {
    @ViewChild('form', { static: true }) form: NgForm;
    @ViewChild('formEdit', { static: true }) formEdit: NgForm;
    @ViewChild('formClassify', { static: true }) formClassify: NgForm;
    @ViewChild('paginator', { static: true }) paginator: MatPaginator;

    public toolbarModel: ToolbarModel;
    public key: string;
    public tabs = config.TABS;
    public cols = config.COLS;
    public saveCols = config.SAVE_COLS;
    public areaTypes = config.AREA_TYPE;
    public headerOperatingUnit = config.HEADER_OPERATING_UNIT;
    public headerOrg = config.HEADER_ORG;
    public statusPr = config.STATUS_PR;
    public headerDepartment = editConfig.HEADER_DEPARMENT;

    public mainConfig: any;
    public dataSourceBase = {
        items: null,
        paginatorTotal: undefined,
    };
    public dataSource = {
        items: null,
        paginatorTotal: undefined,
    };
    public formTitle = 'PURCHASE_REQUEST.CLASSIFY_PURCHASE_REQUEST';
    public currentPage: any;
    public panelOpenState = false;
    public isShowDialogReject = false;
    public saveDetailDialogRef = new DialogRef();
    public dialogNotification = new DialogRef();
    public editDialogRef = new DialogRef();
    public operatingUnitRequestPayload = new OperatingUnitRequestPayload();
    public departmentRequestPayload = new DepartmentRequestPayload();
    public organizationRequestPayload = new OrganizationRequestPayload();
    public selectedPrItem: any;
    public listItemChange: any[] = [];
    public userNameLogin: any = {};
    public _selectedColumns: any[];
    public rejectNote: string;
    public idEditCurrent: string;
    public currentRowData: any = {};
    public isEditMode = false;
    public orgCodeData: any[];
    public legalData: any[];
    public activeIdTab: string;
    private listAreaTypeChangeBase: any[] = [];
    public purchaseRequestData: any = {};
    public nodeSelected: any;
    public notificationData: any[] = [];
    public selectedRejectPrItem: any;
    public roles = [];
    public tabDefault = '3';
    public ipoNumberBp: any;
    public ipoNumberXnk: any;
    public createdByNameDto: any;
    public hasEditRow = false;
    public isEditModeItem = false;
    public isShowbtnEdit = false;           // Check role Bp, SUPER_ADMIN mới được sửa

    constructor(
        public purchaseRequestItemService: PurchaseRequestItemService,
        public purchaseRequestService: PurchaseRequestService,
        private cdr: ChangeDetectorRef,
        private notification: NotificationService,
        public operatingUnitService: OperatingUnitService,
        public organizationService: OrganizationService,
        public projectService: ProjectService,
        public userService: UserService,
        public notificationListService: NotificationListService,
        public departmentService: DepartmentService,
        public supplierService: SupplierService,
        public currencyService: CurrencyService,
        public brandService: BrandService,
        public activatedRoute: ActivatedRoute,
        public roleService: RoleService,
        private router: Router,
        private store: Store<AppState>
    ) {
        super();
        this.store.pipe(select(currentUser)).subscribe(obj => {
            if (obj) {
                this.roles = obj.roles;
            }
            if (this.roles.some(m => m.includes('BP_') || m === 'SUPER_ADMIN')) {
                this.tabs = config.TABS;
                this.isShowbtnEdit = true;
            } else if (this.roles.some(m => m.includes('XNK_'))) {
                if (this.roles.some(m => m === 'XNK_MANAGER')) {
                    this.tabs = this.tabs.filter(m => m.value !== '4');
                } else {
                    this.tabs = this.tabs.filter(m => m.value === '2' || m.value === '5');
                    this.tabDefault = '2';
                }
            } else {
                this.tabs = [];
            }
        });
    }

    ngOnInit() {
        this.mainConfig = mainConfig.MAIN_CONFIG;
        this.configToolbar();
        this.baseService = this.purchaseRequestService;
        this.request = new PurchaseRequestItemRequestPayload();
        this.onFragmentChanged();
        this.getCountByTabs();
        this.getDataOrgCodeLegal();
        if (this.tabs.length > 0) {
            this.initData();
            this.pagingData();
        }
    }

    // get data orgCode, legal
    public getDataOrgCodeLegal() {
        const requestOrgCode = new OrganizationRequestPayload();
        const requestLegal = new OperatingUnitRequestPayload();
        const categorySub = forkJoin([
            this.organizationService.select(requestOrgCode),
            this.operatingUnitService.select(requestLegal),
        ]).subscribe((res) => {
            this.orgCodeData = res[0];
            this.legalData = res[1];
            this.cdr.detectChanges();
        });
        this.subscriptions.push(categorySub);
    }

    private configToolbar(): void {
        this.toolbarModel = new ToolbarModel();
        this.toolbarModel.add.disabled = true;
        this.toolbarModel.option.disabled = true;
    }

    public setFragmentToRoute(tabId: any): void {
        this.router.navigate([], {
            fragment: tabId
        });
        if (!tabId || tabId === 'all') {
            this.request.classifyType = null;
            this.activeIdTab = null;
        } else {
            this.request.classifyType = tabId;
            this.activeIdTab = tabId;
        }
        this.initData();
        // Set default
        this.isEditMode = false;
        this.listItemChange = [];
        this.selectedPrItem = null;
        this.rowGroupAreaType = null;
    }

    private onFragmentChanged(): void {
        this.activatedRoute.fragment.subscribe(fragment => {
            if (!fragment || !this.tabs.some(x => x.value === fragment)) {
                this.setFragmentToRoute(this.tabDefault);
            } else {
                if (fragment === 'all') {
                    this.request.classifyType = null;
                } else {
                    this.request.classifyType = fragment;
                }
                this.activeIdTab = fragment;
            }
        });
    }

    public onBtnLoadNodeSearchClick(): void {
        this.initData();
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

    public initData(): void {
        if (this.paginator) {
            this.request.pageIndex = this.paginator.pageIndex;
            this.request.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
        }
        const purchaseRequestSub = forkJoin([
            this.purchaseRequestService.getPurchaseRequestByClassifyStatus(this.request),
            this.purchaseRequestService.countPurchaseRequestByClassifyStatus(this.request)
        ]).subscribe(res => {
            this.listAreaTypeChangeBase = [];
            this.dataSource.items = [];
            this.dataSource.paginatorTotal = res[1];
            res[0].forEach((element, index) => {
                const node = {
                    data: {
                        isPrRow: true,
                        ...element,
                        indexNo: index + 1,
                    },
                    leaf: false,
                };
                this.dataSource.items.push(node);
            });
            this.dataSource.items = [...this.dataSource.items];
            this.dataSourceBase = Object.assign(this.dataSourceBase, this.dataSource);
            this.cdr.detectChanges();
        });
        this.subscriptions.push(purchaseRequestSub);
    }

    public onNodeExpand(event: any): void {
        // Ẩn chức năng paging
        // this.getDataPaging(event);

        const node = event.node;
        // tao request moi
        const request = new PurchaseRequestItemRequestPayload();
        request.classifyType = this.request.classifyType;

        let itemSource: any[];
        // When node expand - xoa du lieu cu
        itemSource = node.children = [];

        request.prId = node.data.id;
        request.isSubItem = false;
        request.areaType = null;
        // Call api lay du lieu
        const purchaseRequestItemSub = this.purchaseRequestItemService.select(request).subscribe(res => {
            if (res && res.length > 0) {
                const response = res.sort((a, b) => parseFloat(a.indexNo) - parseFloat(b.indexNo));

                response.forEach((element, index) => {
                    this.getChangedAreaTypeValue(element);
                    const nodeData = {
                        data: {
                            isPrItemRow: true,
                            ...element,
                            // get thông tin chung để view
                            legalOrigin: node.data.legal,
                            orgApplyOrigin: node.data.subDepartmentId,
                            legalNameOrigin: node.data.legalName,
                            orgApplyNameOrigin: node.data.orgApplyName,
                            orgCodeOrigin: node.data.orgCode,
                            // indexNo: index + 1
                        }
                    };
                    itemSource.push(nodeData);
                });
            }

            this.dataSource.items = [...this.dataSource.items];
            this.selectedPrItem = itemSource[0];
            this.isEditModeItem = false;
            // Active edit mode
            if (!this.isEditMode) {
                this.isEditMode = true;
            }
            this.dataSourceBase = Object.assign(this.dataSourceBase, this.dataSource);
            this.cdr.detectChanges();

        });
        this.subscriptions.push(purchaseRequestItemSub);
    }

    public onNodeCollapse(event: any): void {
        const node = event.node;
        if (this.selectedPrItem && node.children.some(x => x.data.id === this.selectedPrItem.data.id)) {
            this.selectedPrItem = null;
            this.isEditMode = false;
        }
        this.isEditModeItem = false;
    }

    public onNodeSelect(): void {
        if (!this.isEditMode) {
            this.isEditMode = true;
        }
        this.isEditModeItem = false;
    }

    public getDataPaging(event: any, pageIndex?: number, pageSize?: number): void {
        const node = event.node;
        let itemSource: any[];

        const request = new PurchaseRequestItemRequestPayload();
        request.classifyType = this.request.classifyType;
        if (node.data.isPagingRow) {
            // When page is change
            if (!node.parent.children) {
                itemSource = node.parent.children = [];
            }
            itemSource = node.parent.children;
            for (let i = 0; i < itemSource.length;) {
                if (!itemSource[i].data.isPagingRow) {
                    itemSource.splice(i, 1);
                } else {
                    i++;
                }
            }
            request.prId = node.parent.data.id;
            this.selectedPrItem = null;
        } else {
            // When node expand
            itemSource = node.children = [];
            request.prId = node.data.id;
        }
        request.isSubItem = false;
        request.areaType = null;
        if (!pageIndex && !pageSize) {
            request.pageIndex = 0;
            request.pageSize = 10;
        } else {
            request.pageIndex = pageIndex;
            request.pageSize = pageSize;
        }

        // Call api lay du lieu
        const purchaseRequestItemSub = this.purchaseRequestItemService.select(request).subscribe(res => {
            const response = res.sort((a, b) => parseFloat(a.indexNo) - parseFloat(b.indexNo));
            if (itemSource.some(x => x.data.isPagingRow)) {
                for (let i = 0; i < response.length; i++) {
                    this.getChangedAreaTypeValue(response[i]);
                    const nodeData = {
                        data: {
                            isPrItemRow: true,
                            ...response[i],
                            // get thông tin chung để view
                            legalOrigin: node.parent.data.legal,
                            orgApplyOrigin: node.parent.data.subDepartmentId,
                            legalNameOrigin: node.parent.data.legalName,
                            orgApplyNameOrigin: node.parent.data.orgApplyName,
                            orgCodeOrigin: node.parent.data.orgCode,
                            // indexNo: i + 1
                        }
                    };
                    itemSource.splice(i, 0, nodeData);
                }
            } else {
                response.forEach((element, index) => {
                    this.getChangedAreaTypeValue(element);
                    const nodeData = {
                        data: {
                            isPrItemRow: true,
                            ...element,
                            // get thông tin chung để view
                            legalOrigin: node.data.legal,
                            orgApplyOrigin: node.data.subDepartmentId,
                            legalNameOrigin: node.data.legalName,
                            orgApplyNameOrigin: node.data.orgApplyName,
                            orgCodeOrigin: node.data.orgCode,
                            // indexNo: index + 1
                        }
                    };
                    itemSource.push(nodeData);
                });
            }

            // Paging row
            if (!pageIndex && !pageSize) {
                const nodePaging = {
                    data: { isPagingRow: true }
                };
                itemSource.push(nodePaging);
            }

            this.dataSource.items = [...this.dataSource.items];
            this.selectedPrItem = itemSource[0];

            // Active edit mode
            if (!this.isEditMode) {
                this.isEditMode = true;
            }
            this.dataSourceBase = Object.assign(this.dataSourceBase, this.dataSource);
            this.cdr.detectChanges();

        });
        this.subscriptions.push(purchaseRequestItemSub);
    }

    private getChangedAreaTypeValue(rowData: any): void {
        const index = this.listItemChange.findIndex(x => x.id === rowData.id);
        if (index > -1) {
            rowData.areaType = this.listItemChange[index].areaType;
            rowData.note = this.listItemChange[index].note;
            rowData.isChange = this.listItemChange[index].isChange;
            rowData.isAreaTypeChange = true;
        }
    }

    public onBtnPerformSaveClick(): void {
        if (this.dataSource.items) {
            if (this.listItemChange && this.listItemChange.length > 0) {
                if (this.formClassify) {
                    if (!this.validateForm(this.formClassify, 'classify-Dialog-Ref')) {
                        return;
                    }
                }
                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < this.listItemChange.length; i++) {
                    if (this.listItemChange[i].areaType === 1) {
                        this.listItemChange[i].ipoNumber = this.ipoNumberBp ? this.ipoNumberBp.trim() : null;
                    }
                    if (this.listItemChange[i].areaType === 4) {
                        this.listItemChange[i].ipoNumber = this.ipoNumberXnk ? this.ipoNumberXnk.trim() : null;
                    }
                }
                const saveConfirmation = new SaveConfirmation();
                saveConfirmation.accept = () => {
                    this.purchaseRequestItemService.bulkUpdate(this.listItemChange).subscribe(() => {
                        this.notification.showSuccess();
                        // Xử lý cho phần thông báo sau khi phân loại
                        this.defaultSaveNotification(this.listItemChange);
                        this.onBtnCancelClassifyClick(true);
                        this.getCountByTabs();
                        this.initData();
                        this.saveDetailDialogRef.hide();
                    });
                };
                this.notification.confirm(saveConfirmation);
            } else {
                this.router.navigate([]);
            }
        }
    }

    public defaultSaveNotification(listItemChange: any): void {
        this.notificationData = [];
        // Thông báo đến AF, XNK
        const roleBp = 'BP_STAFF;BP_MANAGER';
        const roleXNK = 'XNK_DEPUTY_DOC;XNK_STAFF_DOC;XNK_DEPUTY_DECLARE;XNK_MANAGER;XNK_STAFF_DECLARE';
        const notiData = { status: 1, module: 'purchase-request' };


        const listDataTempBp = listItemChange.filter(x => x.areaType === 1);
        const listDataTempXNK = listItemChange.filter(x => x.areaType === 2);
        let notificationDataBp = {};
        if (listDataTempBp && listDataTempBp.length > 0) {
            const prNo = [];
            listDataTempBp.map(x => {
                this.dataSource.items.map(item => {
                    if (item.data.id === x.prId && !prNo.find(obj => obj.id === item.data.id)) {
                        prNo.push({ id: item.data.id, prNo: item.data.prNo });
                    }
                });
            });
            notificationDataBp = { ...notiData, role: roleBp, messageContent: JSON.stringify(prNo), description: 'Phân loại YCMH BP' };
            this.notificationData.push(notificationDataBp);
        }
        let notificationDataXNK = {};
        if (listDataTempXNK && listDataTempXNK.length > 0) {
            const prNo = [];
            listDataTempXNK.map(x => {
                this.dataSource.items.map(item => {
                    if (item.data.id === x.prId && !prNo.find(obj => obj.id === item.data.id)) {
                        prNo.push({ id: item.data.id, prNo: item.data.prNo });
                    }
                });
            });
            notificationDataXNK = { ...notiData, role: roleXNK, messageContent: JSON.stringify(prNo), description: 'Phân loại YCMH XNK' };
            this.notificationData.push(notificationDataXNK);
        }

        const saveSub = this.notificationListService.bulkInsert(this.notificationData).subscribe(() => { });
        this.subscriptions.push(saveSub);
    }

    public resetAreaTypeChange(rowData: any, notDelete?: boolean): void {
        const item = this.listAreaTypeChangeBase.find(x => x.id === rowData.id);
        if (item) {
            rowData.areaType = item.areaType;
            rowData.isAreaTypeChange = item.isAreaTypeChange;
            rowData.isChange = item.isChange;
            rowData.isClassify = null;
            rowData.isBpReject = null;
            rowData.isXnkReject = null;
            // xóa trong danh sách lưu trạng thái item base
            const indexChangeBase = this.listAreaTypeChangeBase.findIndex(x => x.id === rowData.id);
            if (indexChangeBase > -1) {
                this.listAreaTypeChangeBase.splice(indexChangeBase, 1);
            }
            // xóa trong danh sách item thay đổi để lưu
            const indexChange = this.listItemChange.findIndex(x => x.id === rowData.id);
            if (indexChange > -1) {
                this.listItemChange.splice(indexChange, 1);
            }
            this.cdr.detectChanges();
        }
    }

    public areaTypeChange(rowData: any, event: any): void {
        if (rowData) {
            // add trước khi thay đổi giá trị
            this.addChangeItemBase(rowData);
            rowData.areaType = event.value;
            rowData.isChange = true;
            rowData.isAreaTypeChange = true;
            // Check khi phân loại XNK thì pháp nhân phải là Hà Nội
            if (rowData.areaType === 2 && rowData.legalOrigin !== '1139' && (!rowData.legal || rowData.legal !== '1139')
                && !rowData.isChanged) {
                this.notification.showWarning('Phân loại: XNK => Pháp nhân đang là là Hà Nội');
                // rowData.errorClassify = true;
                // this.resetAreaTypeChange(rowData, true);
                // return;
            }
            // Check khi phân loại XNK thì phải có thông tin orgCode
            if (rowData.areaType === 2 && !rowData.orgCodeOrigin && !rowData.orgCode && !rowData.isChanged) {
                this.notification.showWarning('Vui lòng thêm thông tin mã OrgCode để tiến hành phân loại');
                rowData.errorClassify = true;
                this.resetAreaTypeChange(rowData, true);
                return;
            }
            // Check khi phân loại XNK thì loại tiền phải khác VND
            if (rowData.areaType === 2 && rowData.currency === 'VND') {
                this.notification.showWarning('Vui lòng chọn loại tiền khác VND để phân loại: XNK');
                rowData.errorClassify = true;
                this.resetAreaTypeChange(rowData, true);
                return;
            }
            if (rowData.unclassified && rowData.areaType === 1) { // chưa phân loại mới đánh dấu là phân loại đối với phân loại BP
                rowData.isClassify = true;
            }
            const tempRowData = JSON.parse(JSON.stringify(rowData));
            if (tempRowData.areaType === 2) {
                // nếu phân loại XNK thì chuyển qua tab chờ xác nhận để trường phòng BP và xác nhận
                tempRowData.areaType = 4;
                // mới được đánh dấu là chờ xác nhận khi nhân viên BP phân loại XNK (Đang chờ trưởng phòng BP xác nhận)
                tempRowData.isWaitForConfirmation = true;
            }
            this.addChangeItem(tempRowData);
        }
    }

    public areaTypeChangeAllCurrentPR(rowNode: any, rowData: any, event: any): void {
        for (const item of rowNode.node.children) {
            this.areaTypeChange(item.data, event);
        }
    }

    public addChangeItem(rowData: any): void {
        if (rowData && rowData.id) {
            const item = this.listItemChange.find(x => x.id === rowData.id);
            if (item && item.id) {
                this.listItemChange = this.listItemChange.filter(m => m.id !== rowData.id);
                this.listItemChange.push(rowData);
            } else {
                this.listItemChange.push(rowData);
            }
        }
    }

    public addChangeItemBase(rowData: any): void {
        const item = this.listAreaTypeChangeBase.find(x => x.id === rowData.id);
        if (!item) {
            this.listAreaTypeChangeBase.push({ id: rowData.id, areaType: rowData.areaType });
        }
    }

    public onBtnClassifyClick(): void {
        this.isEditMode = true;

        if (this.dataSource.items.length > 0 && this.dataSource.items.filter(x => x.data.expanded).length === 0) {
            this.dataSource.items.children = [];
            const node = {
                node: this.dataSource.items[0]
            };
            this.dataSource.items[0].expanded = true;
            this.getDataPaging(node);
        }
    }

    public onBtnSaveClassifyClick(): void {
        if (this.listItemChange.length > 0) {
            this.ipoNumberBp = null;
            this.ipoNumberXnk = null;
            this.updateRowGroupAreaType();
            this.saveDetailDialogRef.show();
        } else {
            this.notification.showMessage('COMMON_MSG.NO_CHANGE_DETECTED');
        }
    }

    public onBtnCancelClassifyClick(byPassConfimr?: boolean): void {
        if (this.listItemChange.length > 0 && !byPassConfimr) {
            const confirrmation = new CancelConfirmation();
            confirrmation.accept = () => {
                this.isEditMode = false;
                this.listItemChange = [];
                this.selectedPrItem = null;
                this.initData();
            };
            this.notification.confirm(confirrmation);
        } else {
            this.listItemChange = [];
            this.isEditMode = false;
            this.selectedPrItem = null;
            this.initData();
        }
    }

    public onChangeLegal(data: any) {
        if (data) {
            this.request.legal = data.ouId;
            this.request.legalName = data.code;
            const requestOrgCode = new OrganizationRequestPayload();
            requestOrgCode.ouId = data.ouId;
            this.organizationService.select(requestOrgCode).subscribe((res) => {
                this.orgCodeData = res;
                this.cdr.detectChanges();
            });
        } else {
            this.request.legal = null;
            this.request.legalName = null;
        }
    }

    public onBtnResetSearchClick() {
        this.request = new PurchaseRequestRequestPayload();
        if (this.activeIdTab === 'all') {
            this.request.classifyType = null;
        } else {
            this.request.classifyType = this.activeIdTab;
        }
        this.initData();
    }

    private getCountByTabs() {
        const requestTemp: any = new PurchaseRequestRequestPayload();
        this.purchaseRequestService.countItemsGroupByClassifyType(requestTemp).subscribe(m => {
            for (const tab of this.tabs) {
                tab.count = 0;
                for (const item of m) {
                    if (+tab.value === item.areaType) {
                        tab.count = item.count;
                    } else if (tab.value === '3' && !item.areaType) {
                        tab.count = item.count;
                    } else if (tab.value === 'all') {
                        tab.count = item.count;
                    }
                }
            }
            this.cdr.detectChanges();
        });
    }

    public onBtnEditClick(rowData: any, rowNode: any): void {
        this.editDialogRef.input.rowData = rowData;
        // tslint:disable-next-line:max-line-length
        this.purchaseRequestData.legalDto = rowData.legal ? this.toDto('code', rowData.legalName) : this.toDto('code', rowData.legalNameOrigin);
        // tslint:disable-next-line:max-line-length
        this.purchaseRequestData.orgApplyDto = rowData.orgApplyName ? this.toDto('name', rowData.orgApplyName) : this.toDto('name', rowData.orgApplyNameOrigin);
        // tslint:disable-next-line:max-line-length
        this.purchaseRequestData.orgCodeDto = rowData.orgCode ? this.toDto('code', rowData.orgCode) : this.toDto('code', rowData.orgCodeOrigin);

        this.organizationRequestPayload.ouId = rowData.legal ? rowData.legal : rowData.legalOrigin;
        this.departmentRequestPayload.ouId = rowData.legal ? rowData.legal : rowData.legalOrigin;
        this.nodeSelected = rowNode;
        this.cdr.detectChanges();
        this.editDialogRef.show();
    }

    public onChangeFormLegal(event: any): void {
        if (event && event.ouId) {
            // Lưu ouId, đọc code
            this.editDialogRef.input.rowData.legal = event.ouId;
            this.organizationRequestPayload.ouId = event.ouId;
            this.departmentRequestPayload.ouId = event.ouId;
            // reset giá trị
            this.purchaseRequestData.orgApplyDto = null;
            this.purchaseRequestData.orgCodeDto = null;
            this.editDialogRef.input.rowData.orgCode = null;
            this.editDialogRef.input.rowData.subDepartmentId = null;
        }
    }

    public onChangeOrgApply(event: any) {
        if (event && event.subDepartmentId) {
            this.editDialogRef.input.rowData.subDepartmentId = event.subDepartmentId;
        }
    }

    public onChangeOrgCode(event: any) {
        if (event && event.code) {
            this.editDialogRef.input.rowData.orgCode = event.code;
        }
    }

    public onBtnEditItemsSaveClick(node): void {
        if (this.formEdit) {
            if (!this.validateForm(this.formEdit, 'edit-Dialog-Ref')) {
                return;
            }
            const confirmation = new SaveConfirmation();
            confirmation.accept = () => {
                const rowData = this.editDialogRef.input.rowData;
                const saveSub = this.purchaseRequestItemService.merge(rowData).subscribe((res) => {
                    if (res) {
                        this.notification.showSuccess();
                        this.editDialogRef.hide();
                        this.getDataPaging({ node: node.parent });
                        this.initData();
                        this.cdr.detectChanges();
                    }
                });
                this.subscriptions.push(saveSub);
            };
            this.notification.confirm(confirmation);
        }
    }

    // Reject one item classified
    public onBtnRejectClick(): void {
        this.selectedRejectPrItem.areaType = null;
        this.selectedRejectPrItem.isChange = true;
        if (this.selectedRejectPrItem.type === 'single') {
            if (!this.selectedRejectPrItem.unclassified) {
                if (this.activeIdTab === '1' || this.activeIdTab === '4') {
                    this.selectedRejectPrItem.isBpReject = true;
                    this.selectedRejectPrItem.rejectType = 'BP';
                }
                if (this.activeIdTab === '2' || this.activeIdTab === '5') {
                    this.selectedRejectPrItem.isXnkReject = true;
                    this.selectedRejectPrItem.rejectType = 'XNK';
                }
            }
            this.selectedRejectPrItem.isWaitForConfirmation = null; // bỏ trạng thái để không send mail trong BE
            this.selectedRejectPrItem.isWaitForApproval = null; // bỏ trạng thái để không send mail trong BE
            this.selectedRejectPrItem.hideBtnClickAreaType = true;
            this.addChangeItem(this.selectedRejectPrItem);
        }
        if (this.selectedRejectPrItem.type === 'all') {
            for (const item of this.selectedRejectPrItem.arrRejectItem) {
                item.areaType = null;
                item.isChange = true;
                item.rejectNote = this.selectedRejectPrItem.rejectNote;
                if (!item.unclassified) {
                    if (this.activeIdTab === '1' || this.activeIdTab === '4') {
                        item.isBpReject = true;
                        item.rejectType = 'BP';
                    }
                    if (this.activeIdTab === '2' || this.activeIdTab === '5') {
                        item.isXnkReject = true;
                        item.rejectType = 'XNK';
                    }
                }
                item.isWaitForConfirmation = null; // bỏ trạng thái để không send mail trong BE
                item.isWaitForApproval = null; // bỏ trạng thái để không send mail trong BE
                item.hideBtnClickAreaType = true;
                this.addChangeItem(item);
            }

        }
        this.isShowDialogReject = false;
    }

    // Cancel all change
    public onBtnCancelRejectClick(): void {
        if (this.selectedRejectPrItem) {
            this.selectedRejectPrItem.areaTypeChecked = null;
            this.selectedRejectPrItem = null;
            this.isShowDialogReject = false;
        }
    }

    public onClickRejectAreaType(rowData: any, type: string, rowNode?: any) {
        this.selectedRejectPrItem = rowData;
        if (type === 'single') {
            // TODO
        }
        if (type === 'all') {
            if (rowNode.node.children) {
                const temp = rowNode.node.children.map(({ data }) => data);
                this.selectedRejectPrItem.arrRejectItem = temp.filter(m => m.areaType && !m.unclassified && !m.classifyStatus);
            }
        }
        this.selectedRejectPrItem.type = type;
        this.selectedRejectPrItem.rejectNote = null;
        this.isShowDialogReject = true;
        this.cdr.detectChanges();
    }

    public onClickAcceptAreaType(rowData: any, type: string, rowNode?: any) {
        if (rowData) {
            if (type === 'single') {
                if (this.activeIdTab === '4') {
                    // trạng thái chờ phê duyệt
                    rowData.areaType = 5;
                    // mới được trưởng phòng BP xác nhận phân loại XNK (Đang chờ trưởng phòng XNK phê duyệt)
                    rowData.isWaitForApproval = true;

                }
                if (this.activeIdTab === '5') {
                    // trạng thái phân loại XNK (mới được trưởng phòng XNK duyệt)
                    rowData.areaType = 2;
                    // đánh dấu mới được phân loại để send mail cho XNK
                    rowData.isClassify = true;
                    rowData.isPriXnkApproval = true;
                }
                rowData.isBpReject = null;
                rowData.isXnkReject = null;
                rowData.hideBtnClickAreaType = true;
                rowData.rejectType = null;
                rowData.rejectNote = null;
                this.addChangeItem(rowData);
            }
            if (type === 'all') {
                if (rowNode.node.children) {
                    const temp = rowNode.node.children.map(({ data }) => data);
                    for (const item of temp) {
                        if (this.activeIdTab === '4') {
                            // trạng thái chờ phê duyệt
                            item.areaType = 5;
                            // mới được trưởng phòng BP xác nhận phân loại XNK (Đang chờ trưởng phòng XNK phê duyệt)
                            item.isWaitForApproval = true;
                        }
                        if (this.activeIdTab === '5') {
                            // trạng thái phân loại XNK (mới được trưởng phòng XNK duyệt)
                            item.areaType = 2;
                            // đánh dấu mới được phân loại để send mail cho XNK
                            item.isClassify = true;
                            item.isPriXnkApproval = true;
                        }
                        item.isBpReject = null;
                        item.isXnkReject = null;
                        item.hideBtnClickAreaType = true;
                        item.rejectType = null;
                        item.rejectNote = null;
                        this.addChangeItem(item);
                    }
                }
            }
            this.cdr.detectChanges();
        }
    }

    // tslint:disable-next-line: member-ordering
    rowGroupAreaType: any;
    updateRowGroupAreaType() {
        this.listItemChange.sort(this.sortAreaType);
        this.rowGroupAreaType = {};
        if (this.listItemChange) {
            for (let i = 0; i < this.listItemChange.length; i++) {
                this.listItemChange[i].index = i;

                const rowData = this.listItemChange[i];
                const property = rowData.areaType;

                if (i === 0) {
                    this.rowGroupAreaType[property] = { index: 0, size: 1 };
                } else {
                    const previousRowData = this.listItemChange[i - 1];
                    const previousRowGroup = previousRowData.areaType;
                    if (property === previousRowGroup) {
                        this.rowGroupAreaType[property].size++;
                    } else {
                        this.rowGroupAreaType[property] = { index: i, size: 1 };
                    }
                }
            }
        }
    }

    sortAreaType(a, b) {
        const str1 = a.areaType ? a.areaType.toString() : '';
        const str2 = b.areaType ? b.areaType.toString() : '';
        if (str1 > str2) { return -1; }
        if (str1 < str2) { return 1; }
        return 0;
    }

    public onChangeProductName(producerNameDto: any): void {
        if (producerNameDto) {
            this.request.producerId = producerNameDto.id;
            this.request.producerName = producerNameDto.acronymName;
        }
    }

    public btnEditItemClick(): void {
        if (this.selectedPrItem && this.selectedPrItem.data && this.isShowbtnEdit) {
            this.isEditModeItem = true;
            this.cdr.detectChanges();
        }
    }

    public btnEditSaveClick(): void {
        if (this.hasEditRow && this.isShowbtnEdit) {
            const confirmation = new SaveConfirmation();
            confirmation.accept = () => {
                const requestSub = this.purchaseRequestItemService.selectById(this.selectedPrItem.data.id).subscribe(obj => {
                    if (obj) {
                        const rowData = obj;
                        rowData.responseDate = this.selectedPrItem.data.responseDate;
                        rowData.conversionRate = this.selectedPrItem.data.conversionRate;
                        rowData.priceBp = this.selectedPrItem.data.priceBp;
                        const saveSub = this.purchaseRequestItemService.merge(rowData).subscribe((res) => {
                            if (res) {
                                this.notification.showSuccess();
                                this.isEditModeItem = false;
                                this.cdr.detectChanges();
                            }
                        });
                        this.subscriptions.push(saveSub);
                    }
                });
                this.subscriptions.push(requestSub);
            };
            this.notification.confirm(confirmation);
        }
    }

    public btnCancelItemClick(): void {
        this.isEditModeItem = false;
        this.cdr.detectChanges();
    }

    public onRowEditInit() {
        this.hasEditRow = true;
        this.cdr.detectChanges();
    }

    public onChangeConversionRate(): void {
        if (this.selectedPrItem.data.conversionRate && this.selectedPrItem.data.conversionRate < 0) {
            this.selectedPrItem.data.conversionRate = 0;
        }
        this.onRowEditInit();
    }

    public onChangePriceBp(): void {
        if (this.selectedPrItem.data.priceBp && this.selectedPrItem.data.priceBp < 0) {
            this.selectedPrItem.data.priceBp = 0;
        }
        this.onRowEditInit();
    }

}
