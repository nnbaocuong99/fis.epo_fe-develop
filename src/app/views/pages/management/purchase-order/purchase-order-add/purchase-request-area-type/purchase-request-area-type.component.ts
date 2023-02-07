import {
    ChangeDetectorRef,
    Component,
    OnInit,
    Output,
    EventEmitter,
    ViewChild,
    Input
} from '@angular/core';
import { forkJoin } from 'rxjs';
import { BaseComponent } from '../../../../../../core/_base/component/base-component';
import { PurchaseRequestItemService } from '../../../../../../services/modules/purchase-request-item/purchase-request-item.service';
import * as config from './purchase-request-area-type.config';
import * as mainConfig from '../../../../../../core/_config/main.config';
import { PurchaseRequestService } from '../../../../../../services/modules/purchase-request/purchase-request.service';
import { PurchaseRequestRequestPayload } from '../../../../../../services/modules/purchase-request/purchase-request.request-payload';
import { Guid } from 'guid-typescript';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import {
    PurchaseRequestItemRequestPayload
} from '../../../../../../services/modules/purchase-request-item/purchase-request-item.request-payload';
import {
    OrganizationRequestPayload
} from '../../../../../../services/modules/category/organization-management/organization/organization.request.payload';
import { OrganizationService } from '../../../../../../services/modules/category/organization-management/organization/organization.service';
import {
    OperatingUnitRequestPayload
} from '../../../../../../services/modules/category/organization-management/operating-unit/operating-unit.request.payload';
import {
    OperatingUnitService
} from '../../../../../../services/modules/category/organization-management/operating-unit/operating-unit.service';
import { TreeNode } from 'primeng/api';
import { BrandService } from '../../../../../../services/modules/category/brand/brand.service';

@Component({
    selector: 'app-purchase-request-area-type',
    templateUrl: './purchase-request-area-type.component.html',
    styleUrls: ['./purchase-request-area-type.component.scss']
})
export class PurchaseRequestAreaTypeComponent
    extends BaseComponent
    implements OnInit {
    @Output() next: EventEmitter<any> = new EventEmitter();
    @ViewChild('tab', { static: false }) tab: any;
    public key: string;
    public tabs = config.TABS;
    public cols = config.COLS;
    public mainConfig: any;
    public requestPr: any = new PurchaseRequestRequestPayload();
    private requestItem = new PurchaseRequestItemRequestPayload();
    public operatingUnitRequestPayload = new OperatingUnitRequestPayload();
    public organizationRequestPayload = new OrganizationRequestPayload();
    public dataSource = {
        items: null,
        paginatorTotal: undefined,
    };
    private nodeDatas = [];
    public headerOperatingUnit = config.HEADER_OPERATING_UNIT;
    public headerOrg = config.HEADER_ORG;
    public statusPr = config.STATUS_PR;
    private currentTabId: number;
    public loadingId: string;
    public selectedPurchaseRequest = [];
    public selectedPurchaseRequestTemp: any = [];
    public purchaseRequestData: any = [];
    public isViewAll = false;

    constructor(
        public purchaseRequestItemService: PurchaseRequestItemService,
        public purchaseRequestService: PurchaseRequestService,
        private notificationService: NotificationService,
        public operatingUnitService: OperatingUnitService,
        public organizationService: OrganizationService,
        public brandService: BrandService,
        private cdr: ChangeDetectorRef
    ) {
        super();
        this.key = Guid.create().toString();
    }

    ngOnInit() {
        this.mainConfig = mainConfig.MAIN_CONFIG;
        this.requestPr.isViewAll = false;
    }

    public setFragmentToRoute(event: any): void {
        this.currentTabId = +event.nextId;
        this.selectedPurchaseRequest = [];
        this.loadNodes();
    }

    public onBtnLoadNodeSearchClick(): void {
        this.loadNodes();
    }

    public loadNodes(event?: any): void {
        this.requestPr.areaType = (this.currentTabId ? this.currentTabId : 2) - 1;
        this.requestPr.pageIndex = event ? event.first / event.rows : 0;
        this.requestPr.pageSize = event ? event.rows : 10;
        const purchaseRequestSub = forkJoin([
            this.purchaseRequestService.select(this.requestPr),
            this.purchaseRequestService.count(this.requestPr)
        ]).subscribe(res => {
            this.dataSource.items = [];
            this.dataSource.paginatorTotal = res[1];
            for (const element of res[0]) {
                const node = {
                    data: {
                        ...element,
                        isSelectNode: element.quantityRemainTotal > 0
                    },
                    leaf: false,
                };
                this.dataSource.items.push(node);
            }
            this.dataSource.items = [...this.dataSource.items];
            this.cdr.detectChanges();
        });
        this.subscriptions.push(purchaseRequestSub);
    }

    public onNodeExpand(event: any, rowData?: any): void {
        if (event.node.data.isSubItem === false) {
            return;
        }
        const node = event.node;
        this.loadingId = node.data.id;
        this.nodeDatas.push(node.data);
        node.children = [];
        this.requestItem.prId = node.data.id;
        this.currentTabId = this.currentTabId ? this.currentTabId : 2;

        // call api lay du lieu
        const purchaseRequestItemSub = this.purchaseRequestItemService.select(this.requestItem).subscribe(res => {
            if (res && res.length > 0) {
                const response = res.sort((a, b) => parseFloat(a.indexNo) - parseFloat(b.indexNo));

                const parentItems = response.filter(x => !x.isSubItem && x.areaType === this.currentTabId - 1);
                parentItems.forEach((parent, index) => {
                    const nodeData: TreeNode = {
                        data: {
                            ...parent,
                            legalOrigin: node.data.legal,
                            subDepartmentIdOrigin: node.data.subDepartmentId,
                            legalNameOrigin: node.data.legalName,
                            orgApplyNameOrigin: node.data.orgApplyName,
                            orgApplyAcronym: node.data.orgApplyAcronym,
                            orgCode: node.data.orgCode,
                            orgCodeOrigin: node.data.orgCode,
                            indexNo: index + 1
                        },
                        children: [],
                        // leaf: true
                    };
                    const childItems = response.filter(x => x.isSubItem && this.quote(x.indexNo).startsWith(this.quote(parent.indexNo)));
                    childItems.forEach((child, indexChild) => {
                        const childNode = {
                            data: {
                                ...child,
                                indexNo: (index + 1) + '.' + (indexChild + 1)
                            },
                            leaf: true,
                        };

                        nodeData.children.push(childNode);
                        nodeData.leaf = false;
                    });
                    node.children.push(nodeData);
                    // Khi click checkbox, thêm item vào list selected
                    if (rowData && !rowData.hasExpand) {
                        if (!this.selectedPurchaseRequest.some(x => x.data.id === nodeData.data.id)) {
                            this.selectedPurchaseRequest.push(nodeData);
                            if (nodeData.children) {
                                this.selectedPurchaseRequest = this.selectedPurchaseRequest.concat(nodeData.children);
                            }
                        }
                    }
                });
                if (rowData && !rowData.hasExpand) {
                    rowData.hasExpand = !rowData.hasExpand;
                }
                this.dataSource.items = [...this.dataSource.items];
                this.cdr.detectChanges();
            }
        });
        this.subscriptions.push(purchaseRequestItemSub);
    }

    private quote(source: string): string {
        return `.${source}.`;
    }

    public onBtnNextStepClick(): void {
        if (this.selectedPurchaseRequest.length > 0) {
            if (this.checkInfoItemsSelect()) {
                this.next.emit(this.purchaseRequestData);
            }
        }
        if (this.selectedPurchaseRequest.length === 0) {
            this.next.emit();
        }
    }

    public nodeSelect(event?: any): void {
        if (event) {
            this.onNodeExpand(event, event.node.data);
            this.checkInfoItemsSelect();
        }
    }

    public nodeUnselect(event?: any): void {

    }

    public checkInfoItemsSelect(): boolean {
        this.purchaseRequestData = [];

        if (this.selectedPurchaseRequest.length > 0) {
            // Check xóa đi items đã bị disable checkbox (Chỉ lấy item còn số lượng)
            const selectedPurchaseRequestTemp = this.selectedPurchaseRequest.filter(x => x.data && x.data.quantityRemain > 0 && x.parent);
            // Lấy item cha và item con
            for (const element of selectedPurchaseRequestTemp) {
                if (!element.children || (element.children && element.parent)) {
                    // check trùng
                    if (!this.purchaseRequestData.find(x => x.data.id === element.data.id)) {
                        this.purchaseRequestData.push(element);
                    }
                }
            }
            // Chỉ check trùng vói item cha
            const prItemParentData = this.purchaseRequestData.filter(x => !x.data.isSubItem);
            if (prItemParentData.find(x => x.data) && !this.checkDupplicate(prItemParentData.map(x => x.data), 'supplierName')) {
                this.notificationService.showMessage('Item không cùng nhà cung cấp');
                return false;
            }
            if (prItemParentData.find(x => x.data) && !this.checkDupplicate(prItemParentData.map(x => x.data), 'currency')) {
                this.notificationService.showMessage('Item không cùng loại tiền tệ');
                return false;
            }
            if (prItemParentData.find(x => x.parent) && !this.checkDupplicate(prItemParentData.map(x => x.parent.data), 'orgApply')) {
                this.notificationService.showMessage('Item không cùng đơn vị sử dụng');
                return false;
            }
            if (prItemParentData.find(x => x.parent) && !this.checkDupplicate(prItemParentData.map(x => x.parent.data), 'orgCode')) {
                this.notificationService.showMessage('Item không cùng mã đơn vị');
                return false;
            }
            if (prItemParentData.find(x => x.parent) && !this.checkDupplicate(prItemParentData.map(x => x.parent.data), 'projectCode')) {
                this.notificationService.showMessage('Item không cùng mã dự án');
                return false;
            }
            if (prItemParentData.find(x => x.parent) && !this.checkDupplicate(prItemParentData.map(x => x.parent.data), 'legal')) {
                this.notificationService.showMessage('Item không cùng pháp nhân');
                return false;
            }
            return true;
        } else {
            return false;
        }
    }

    // Check trùng các item được chọn phải cùng thông tin @attribute
    private checkDupplicate(arr: any, attribute: string): boolean {
        if (arr.length === 0) {
            return false;
        }
        // Chỉ check trùng với những line chưa được tạo purchase order
        arr = arr.filter(x => x.status === 1);
        for (const item of arr) {
            if (item[attribute] !== arr[0][attribute]) {
                return false;
            }
        }
        return true;
    }

    public onChangeLegal(data: any) {
        if (data) {
            this.requestPr.legal = data.ouId;
            this.requestPr.legalName = data.code;
            this.organizationRequestPayload.ouId = data.ouId;
        }
    }

    public onChangeCheckboxViewAll(event: any): void {
        this.isViewAll = event.checked;
        this.requestPr.isViewAll = event.checked;
        this.loadNodes();
    }

    public onChangeProductName(producerNameDto: any): void {
        if (producerNameDto) {
            this.requestPr.producerId = producerNameDto.id;
            this.requestPr.producerName = producerNameDto.acronymName;
        }
    }

}
