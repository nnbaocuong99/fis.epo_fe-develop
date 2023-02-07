import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
    PurchaseOrderItemRequestPayload
} from '../../../../../../services/modules/purchase-order-item/purchase-order-item.request-payload';
import { PurchaseOrderItemService } from '../../../../../../services/modules/purchase-order-item/purchase-order-item.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from './purchase-order-item.config';
import * as mainConfig from '../../../../../../core/_config/main.config';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { DeleteConfirmation } from '../../../../../../services/common/confirmation/delete-confirmation';
import { FileInfo } from '../../../../../../services/modules/file/file.request.payload';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogUploadFileComponent } from '../../../../../partials/control/upload-file/upload-file.component';
import { forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PurchaseOrderItemViewMatchComponent } from './purchase-order-item-view-match/purchase-order-item-view-match.component';
import { NgForm } from '@angular/forms';
import { BaseFormComponent } from '../../../../../../core/_base/component/base-form.component';
import { MapItemCodeTreeComponent } from '../../../../../partials/control/map-item-code-tree/map-item-code-tree.component';
import * as _moment from 'moment';
import { TaxCodeService } from '../../../../../../services/modules/category/tax-code/tax-code.service';
import { Guid } from 'guid-typescript';
import {
    PurchaseRequestItemRequestPayload
} from '../../../../../../services/modules/purchase-request-item/purchase-request-item.request-payload';
import { PurchaseRequestItemService } from '../../../../../../services/modules/purchase-request-item/purchase-request-item.service';
import {
    PurchaseOrderItemBulkMatchRequestPayload
} from '../../../../../../services/modules/purchase-order-item/purchase-order-item-bulk-match.request-payload';
import { LayoutConfigService } from '../../../../../../core/_base/layout';
import { ItemService } from '../../../../../../services/modules/category/item/item.service';
import { ItemRequestPayload } from '../../../../../../services/modules/category/item/item.request.payload';
import { PurchaseInvoiceItemService } from '../../../../../../services/modules/purchase-invoice-item/purchase-invoice-item.service';
import {
    PurchaseInvoiceItemRequestPayload
} from '../../../../../../services/modules/purchase-invoice-item/purchase-invoice-item.request-payload';
import { TaxCodeRequestPayload } from '../../../../../../services/modules/category/tax-code/tax-code.request.payload';
import { MenuItem, TreeNode } from 'primeng/api';
import { MapTermAccountComponent } from '../../../../../partials/control/map-term-account/map-term-account.component';
import { BrandService } from '../../../../../../services/modules/category/brand/brand.service';
import { ConfigListService } from '../../../../../../services/modules/config-list/config-list.service';
import { BrandRequestPayload } from '../../../../../../services/modules/category/brand/brand.request.payload';
import { PurchaseRequestRequestPayload } from '../../../../../../services/modules/purchase-request/purchase-request.request-payload';
import { PurchaseRequestService } from '../../../../../../services/modules/purchase-request/purchase-request.service';

@Component({
    selector: 'app-purchase-order-item',
    templateUrl: './purchase-order-item.component.html',
    styleUrls: ['./purchase-order-item.component.scss']
})
export class PurchaseOrderItemComponent extends BaseFormComponent implements OnInit, AfterViewChecked {
    @ViewChild('importFile', { static: false }) importFile: DialogUploadFileComponent;
    @ViewChild('purchaseOrderItemViewMatch', { static: false }) purchaseOrderItemViewMatch: PurchaseOrderItemViewMatchComponent;
    @ViewChild('form', { static: true }) form: NgForm;
    @ViewChild('mapItemCodeTree', { static: false }) mapItemCodeTree: MapItemCodeTreeComponent;
    @ViewChild('mapTermAccount', { static: false }) mapTermAccount: MapTermAccountComponent;
    @Input() viewFromAppendix = false;
    @Input() selectedPurchaseRequestItem = [];
    @Input() noEdit = false;
    @Input() editTable = false;
    @Input() isShowContextMenu = true;
    @Input() usePoIdInRoute = true;
    @Output() success: EventEmitter<any> = new EventEmitter();
    @Output() editRow: EventEmitter<any> = new EventEmitter();
    @Output() successItem: EventEmitter<any> = new EventEmitter();

    _purchaseOrderData: any;
    get purchaseOrderData(): any {
        return this._purchaseOrderData;
    }
    @Input() set purchaseOrderData(value: any) {
        this._purchaseOrderData = value;
        if (this.purchaseOrderData) {
            this.configTablePurchaseOrder();
        }
    }

    _purchaseOrderItemData: any;
    get purchaseOrderItemData(): any {
        return this._purchaseOrderItemData;
    }
    @Input() set purchaseOrderItemData(value: any) {
        if (value) {
            this.dataSource.items = value;
            this.getTotal();
        } else {
            this.dataSource.items = [];
        }
    }

    public request = new PurchaseOrderItemRequestPayload();
    public taxCodeRequestPayload = new TaxCodeRequestPayload();
    public itemRequestPayload = new ItemRequestPayload();
    public dialogRefEdit: DialogRef = new DialogRef();
    public dialogRefMap: DialogRef = new DialogRef();
    public dialogRefMatch: DialogRef = new DialogRef();
    public dialogRefViewMatch: DialogRef = new DialogRef();
    public dialogRefChangeResData: DialogRef = new DialogRef();
    public dialogRefViewHistory: DialogRef = new DialogRef();
    public tabs = config.TABS;
    public activeIdTab: number = config.TABS[0].value;
    // header table tab 1 (Danh sách HH/DV)
    public headers: any[];
    public headerInternal = config.HEADER_INTERNAL;
    public headerExternal = config.HEADER_EXTERNAL;
    // header table  tab 2 (Theo dõi tiến độ)
    public headersProcess = config.HEADER_INTERNAL_PROCESS;
    // header table tab 3 (Theo dõi số lượng items)
    public headerItemsProgress = config.HEADER_ITEMS_PROGRESS;
    public headerItems = config.HEADER_ITEMS;
    public headerTaxCode = config.HEADER_TAX_CODE;
    public itemTypes = config.ITEM_TYPE;
    public arrProgressStatus = config.PROGRESS_STATUS;
    public headerBrand = config.HEADER_BRAND;

    public dataSource = {
        items: [],
        treeNodes: [],
        treeItemsProgressNodes: [],
        paginatorTotal: undefined,
    };
    public purchaseOrderItemTotalAmounts: any = [];
    public mainConfig = mainConfig.MAIN_CONFIG;
    public selectedPurchaseOrderitems: any = [];
    public countMatched = 0;
    public isShowEditItem = false;
    public totalWithTax = 0;
    public totalWithoutTax = 0;
    public totalAmountTax = 0;
    public currentPoId: string;
    public isInternal: boolean;
    public configListDataItemOrigin: any[];
    public isShowDialogReject = false;
    public selectedRow: any = {};
    public itemSrv: any = {};
    public chilrdrenData: any = {};
    public taxCodeData: any[];
    public purchaseRequestItemMatch = [];
    public purchaseOrderItemDeleted = [];
    private selectedPurchaseOrderitemsClone = [];
    public isShowMapItem = false;
    public isShowMatchItem = false;
    public isViewAll = 0;
    public isShowViewAll = false;
    public frozenCols: any[];
    public selectedNode: any;
    public btnItems: MenuItem[] = [];
    public btnItemNoteViewFromAppendix: MenuItem[] = [
        { label: 'Thêm vào', icon: 'pi pi-plus', command: () => this.onBtnAddItemClick(this.selectedNode.data), title: 'Add' },
        { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: () => this.onBtnEditClick(this.selectedNode.data, 1), title: 'Edit' },
        { label: 'Xóa', icon: 'pi pi-fw pi-times', command: () => this.onBtnDeleteClick(this.selectedNode.data), title: 'Delete' },
        {
            label: 'Xem thông tin hợp nhất', icon: 'pi pi-eye', command: () => this.onBtnViewMatch(this.selectedNode.data),
            title: 'ViewMatch'
        },
        { label: 'Từ chối', icon: 'pi pi-undo', command: () => this.onBtnShowDialogRejectClick(this.selectedNode.data), title: 'Reject' },
        {
            label: 'Xem lịch sử thay đổi', icon: 'pi pi-eye', command: () => this.onBtnViewHistoryChangeItemClick(this.selectedNode.data),
            title: 'ViewHistory'
        },
    ];

    public btnItemViewFromAppendix: MenuItem[] = [
        { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: () => this.onBtnEditClick(this.selectedNode.data, 1), title: 'Edit' },
        {
            label: 'Xem thông tin hợp nhất', icon: 'pi pi-eye', command: () => this.onBtnViewMatch(this.selectedNode.data),
            title: 'ViewMatch'
        },
        { label: 'Từ chối', icon: 'pi pi-undo', command: () => this.onBtnShowDialogRejectClick(this.selectedNode.data), title: 'Reject' },
    ];

    public currentRow: any = {};
    public producerNameData: any[];
    public isShowDialogAddItemFromPR = false;
    public loadingId: string;
    public cols = config.COLS;
    public requestPr: any = new PurchaseRequestRequestPayload();
    public requestItemPr = new PurchaseRequestItemRequestPayload();
    public selectedPurchaseRequest = [];
    public selectedPurchaseRequestTemp: any = [];
    public purchaseRequestData = {
        items: null,
        paginatorTotal: undefined,
    };
    public purchaseRequestDataTemp = [];
    private nodeDatas = [];

    constructor(
        public itemService: ItemService,
        public purchaseOrderItemService: PurchaseOrderItemService,
        public purchaseInvoiceItemService: PurchaseInvoiceItemService,
        private noticeService: NotificationService,
        private route: ActivatedRoute,
        public taxCodeService: TaxCodeService,
        private cdr: ChangeDetectorRef,
        public purchaseRequestService: PurchaseRequestService,
        private purchaseRequestItemService: PurchaseRequestItemService,
        public brandService: BrandService,
        public layoutConfigService: LayoutConfigService,
        public configListService: ConfigListService,
    ) {
        super();
    }

    ngOnInit() {
        this.getConfigList();
        const routeSub = this.route.params.subscribe(params => {
            if (!params.id) {
                // form thêm mới PO thì ẩn tab theo dõi tiến độ
                this.tabs = this.tabs.filter(m => m.value !== 2);
            }
            if (params.id && this.usePoIdInRoute) {
                this.request.poId = params.id;
                this.currentPoId = params.id;
            } else if (this.purchaseOrderData.id) {
                this.currentPoId = this.purchaseOrderData.id;
                this.request.poId = this.purchaseOrderData.id;
            }
        });
        this.subscriptions.push(routeSub);
    }

    public getConfigList() {
        const requestCountry: any = { type: 'COUNTRY' };
        const requestItemSrv: any = { type: 'ITEM' };

        const requestBrand = new BrandRequestPayload();
        requestBrand.haspaging = false;

        const requests = [
            this.configListService.select(requestCountry),
            this.configListService.select(requestItemSrv),
            this.taxCodeService.select(),
            this.brandService.select(requestBrand)
        ];
        const sub = forkJoin(requests).subscribe(res => {
            this.configListDataItemOrigin = res[0].sort(this.sortStringConfigList);
            this.itemSrv = res[1][0];
            if (res[2] && res[2].length > 0) {
                this.taxCodeData = res[2];
            }
            this.producerNameData = res[3];
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

    public onRowEditClick(rowData): void {
        if (this.currentRow) {
            if (this.currentRow.indexNo !== rowData.indexNo) {
                // check parent
                if (this.dataSource.treeNodes.find(x => x.data.indexNo === this.currentRow.indexNo)) {
                    this.dataSource.treeNodes.find(x => x.data.indexNo === this.currentRow.indexNo).data.isShow = false;
                } else {
                    // check children
                    this.dataSource.treeNodes.find(x => {
                        if (x.children && x.children.length > 0) {
                            x.children.find(chi => {
                                if (chi.data.indexNo === this.currentRow.indexNo && chi.data.isShow) {
                                    chi.data.isShow = false;
                                }
                            });
                        }
                        return x;
                    });
                }
            }
        }
        rowData.isShow = true;
        this.currentRow = JSON.parse(JSON.stringify(rowData));
        this.cdr.detectChanges();
    }

    public configTablePurchaseOrder(): void {
        if (this.purchaseOrderData.areaType === 1 || this.purchaseOrderData.areaType === 2) {
            this.isInternal = true;
            // Xử lý frozenCols table
            const temp = JSON.stringify(this.headerInternal);
            this.headers = JSON.parse(temp);
            this.frozenCols = this.headers.slice(0, 6);
            this.headers.splice(0, 6);
            // Nếu hình thức mua hàng là nước ngoài thì không yêu cầu bắt buộc nhập thuế ở line hàng
            if (this.purchaseOrderData.areaType === 2) {
                // YC 21/06/2021 - PO mua hàng nước ngoài của BP bỏ cột thuế VAT dưới line
                this.headers = this.headers.filter(m => m.field !== 'tax' && m.field !== 'taxAmount');
            }
            if (this.noEdit === true) {
                this.frozenCols.splice(0, 1);
            }
        } else {
            this.isInternal = false;
            // Xử lý frozenCols table
            const temp = JSON.stringify(this.headerExternal);
            this.headers = JSON.parse(temp);
            // Lấy 6 phần tử đầu tiên
            this.frozenCols = this.headers.slice(0, 6);
            // Xóa 6 phần tử đầu tiên
            this.headers.splice(0, 6);
            if (this.noEdit === true) {
                this.frozenCols.splice(0, 1);
            }
        }
    }

    ngAfterViewChecked() {
        this.getScrollElement();
    }

    public loadNodes(event?: any, listItem?: any): void {
        this.selectedPurchaseOrderitems = [];
        if (this.viewFromAppendix) {
            this.request.appendix = true;
        } else {
            this.request.appendix = false;
        }
        this.dataSource.items = [];
        if (listItem) {
            this.dataSource.paginatorTotal = listItem.length;
            this.itemSourceToListTreeNode(listItem, true);
            // Có item bị từ chối mới hiển thị checkbox xem tất cả
            if (this.dataSource.items.findIndex(x => !x.isActive) > -1) {
                this.isShowViewAll = true;
            }
            this.getTotal();
            this.countMatched = this.dataSource.treeNodes.filter(x => x.data.matchedId || x.data.prItemId).length;
            this.success.emit(this.purchaseOrderItemTotalAmounts);
            this.editRow.emit();
            this.cdr.detectChanges();
        } else {
            // Form sửa
            if (this.request.poId) {
                const requests = [
                    this.purchaseOrderItemService.select(this.request),
                    this.purchaseOrderItemService.count(this.request)];
                // this.purchaseOrderItemService.selectTotalAmountByTax(this.request)];
                const selectSub = forkJoin(requests).subscribe(
                    (response: any[]) => {
                        this.dataSource.paginatorTotal = response[1];
                        this.itemSourceToListTreeNode(response[0]);
                        // Có item bị từ chối mới hiển thị checkbox xem tất cả
                        if (this.dataSource.items.findIndex(x => !x.isActive) > -1) {
                            this.isShowViewAll = true;
                        }
                        this.getTotal();
                        this.countMatched = this.dataSource.treeNodes.filter(x => x.data.matchedId || x.data.prItemId).length;
                        this.success.emit(this.purchaseOrderItemTotalAmounts);
                        this.cdr.detectChanges();
                    });
                this.subscriptions.push(selectSub);
            } else {
                if (this.selectedPurchaseRequestItem.length > 0) {
                    this.dataSource.treeNodes = this.selectedPurchaseRequestItem.filter(x => !x.leaf);
                    this.dataSource.treeNodes.map((x, index) => {
                        x.data.indexNo = (index + 1);
                        if (x.children.length > 0) {
                            x.children.map((m, indexChildren) => {
                                m.data.isActive = true;
                                m.data.indexNo = (index + 1) + '.' + (indexChildren + 1);
                                return m;
                            });
                        }
                        x.data.prNo = x.parent ? x.parent.data.prNo : x.data.prNo;
                        x.data.isActive = true;
                        x.indexNo = index + 1;
                        x.data.quantity = x.data.quantityRemain;
                        return x;
                    });
                }
                this.treeNodeToItemSource();
                this.getTotal();
                this.countMatched = this.dataSource.treeNodes.filter(x => x.data.matchedId || x.data.prItemId).length;
                this.success.emit(this.purchaseOrderItemTotalAmounts);
                this.cdr.detectChanges();
            }
        }
    }

    public loadNodesItemsProgress(): void {
        this.dataSource.treeItemsProgressNodes = [];
        const requestPiItem = new PurchaseInvoiceItemRequestPayload();
        if (this.request.poId) {
            requestPiItem.poId = this.request.poId;
            const requests = [
                this.purchaseOrderItemService.select(this.request),
                this.purchaseInvoiceItemService.select(requestPiItem)
            ];
            const selectSub = forkJoin(requests).subscribe(
                (response: any[]) => {
                    if (response[0] && response[0].length > 0 && response[1] && response[1].length > 0) {
                        const parentItems = response[0].sort((a, b) => parseFloat(a.indexNo) - parseFloat(b.indexNo));
                        parentItems.forEach((parent, index) => {
                            const node = {
                                data: {
                                    ...parent,
                                    indexNo: (index + 1)
                                },
                                children: [],
                                expanded: false,
                                leaf: true,
                            };
                            const childItems = response[1];
                            let count = 0;
                            childItems.forEach((child, indexChild) => {
                                if (parent.id === child.poItemId) {
                                    count = count + 1;
                                    const childNode = {
                                        data: {
                                            ...child,
                                            indexNo: ((index + 1) + '.' + count)
                                        },
                                        leaf: true,
                                    };
                                    node.children.push(childNode);
                                    node.leaf = false;
                                }
                            });
                            this.dataSource.treeItemsProgressNodes.push(node);
                        });
                    }
                    this.dataSource.treeItemsProgressNodes = [...this.dataSource.treeItemsProgressNodes];
                    this.dataSource.treeItemsProgressNodes.map(x => {
                        if (x.children.length === 0) {
                            x.data.totalQuantityPi = 0;
                        } else {
                            x.children.map(obj => {
                                // Xử lý tính số lượng tạo hóa đơn trên item
                                if (obj && x.data.totalQuantityPi) {
                                    x.data.totalQuantityPi += +obj.data.quantity;
                                } else {
                                    x.data.totalQuantityPi = obj.data.quantity;
                                }
                                // Xử lý hiển thị số hóa đơn trên item PO
                                if (!x.data.piCode) {
                                    x.data.piCode = obj.data.piCode;
                                } else {
                                    if (x.data.piCode.toString().includes(obj.data.piCode)) {
                                        x.data.piCode = x.data.piCode + '\n' + obj.data.piCode;
                                    }
                                }
                                // Xử lý hiển thị số vận đơn trên item PO
                                const waybillNumber = obj.data.waybillNumber ? obj.data.waybillNumber : '';
                                if (!x.data.waybillNumber) {
                                    x.data.waybillNumber = waybillNumber;
                                } else {
                                    if (!x.data.waybillNumber.toString().includes(obj.data.waybillNumber)) {
                                        x.data.waybillNumber = x.data.waybillNumber + '\n' + waybillNumber;
                                    }
                                }
                            });
                        }
                    });
                    this.cdr.detectChanges();
                });
            this.subscriptions.push(selectSub);
        }
    }

    public onNodeExpand(rowNode: any): void {
        rowNode.node.data.selectColor = true;
    }

    private quote(source: string): string {
        return `${source}.`;
    }

    /**
     * Handle event when click button edit click
     * @param rowData: Row data editing
     * @param type: 1: Edit, update detail; 2: Update process status
     */
    public onBtnEditClick(rowData: any, type: number): void {
        this.isShowEditItem = false;
        this.cdr.detectChanges();

        // Process data by case
        this.processDataByCase(type);

        // Set row data
        this.dialogRefEdit.input.rowDataOrigin = rowData;
        rowData.currentPoId = this.currentPoId;
        this.dialogRefEdit.input.rowData = { ...rowData };

        // Show dialog edit
        this.isShowEditItem = true; // Unhide dialog
        this.dialogRefEdit.show(); // Then show
        this.cdr.detectChanges();
    }

    /**
     * Process data edit by case
     * @param type: 1: Edit, update detail; 2: Update process status
     */
    private processDataByCase(type: number): void {
        this.dialogRefEdit.input.updateType = type;
        this.dialogRefEdit.config = config.DLG_EDIT_CONFIG;

        if (type === 1) {
            // When edit
            this.dialogRefEdit.config.title = 'COMMON.EDIT';
        } else if (type === 2) {
            // When update process status
            this.dialogRefEdit.config.title = 'PURCHASE_ORDER.ITEM.UPDATE_PROCESS';
        }

        this.dialogRefEdit.input.purchaseOrderData = this.purchaseOrderData;
        if (this.purchaseOrderData && (this.purchaseOrderData.areaType === 1 || this.purchaseOrderData.areaType === 2)) {
            this.dialogRefEdit.input.isInternal = true;
        } else {
            this.dialogRefEdit.input.isInternal = false;
        }

        this.dialogRefEdit.input.add = false;
    }

    public onBtnDeleteClick(rowData: any): void {
        if (rowData.id) {
            const confirmation = new DeleteConfirmation();
            confirmation.accept = () => {
                this.purchaseOrderItemService.delete(rowData.id).subscribe(() => {
                    this.noticeService.showDeteleSuccess();
                    this.loadNodes();
                });
            };
            this.noticeService.confirm(confirmation);
        } else {
            const index = this.dataSource.items.findIndex(x => x.indexNo === rowData.indexNo);
            if (index > -1) {
                this.dataSource.items.splice(index, 1);
                this.itemSourceToListTreeNode(this.dataSource.items);
            }
        }
    }

    public onBtnAddItemClick(rowData?: any, isMatch?: boolean, rowDataSuggest?: any): void {
        this.isShowEditItem = false;
        this.dialogRefEdit.input.updateType = 1;
        this.dialogRefEdit.input.purchaseOrderData = this.purchaseOrderData;
        this.cdr.detectChanges();
        if (this.purchaseOrderData.areaType === 1 || this.purchaseOrderData.areaType === 2) {
            this.dialogRefEdit.input.isInternal = true;
        } else {
            this.dialogRefEdit.input.isInternal = false;
        }
        this.dialogRefEdit.input.add = true;
        if (this.purchaseOrderData) {
            this.dialogRefEdit.input.rowData = rowDataSuggest ? rowDataSuggest : {};
            this.dialogRefEdit.input.rowData.poId = this.purchaseOrderData ? this.currentPoId : null;
            this.dialogRefEdit.input.rowData.isActive = true;

            if (this.purchaseOrderData.rootPoId) {
                this.dialogRefEdit.input.rowData.rootPoId = this.purchaseOrderData.rootPoId;
            }
        }
        this.dialogRefEdit.input.selectedPurchaseOrderitems = this.selectedPurchaseOrderitems;

        // Trường hợp thêm item con lấy default theo item cha
        if (rowData) {
            this.dialogRefEdit.input.rowData.expectedDate = rowData.expectedDate;
            this.dialogRefEdit.input.rowData.responseDate = rowData.responseDate;
        } else {
            this.dialogRefEdit.input.rowData.status = 1;
        }
        this.getIndexNo(rowData);
        this.dialogRefEdit.config = {
            style: { width: '62vw' },
            baseZIndex: 10000,
            draggable: true,
            maximizable: true,
            title: isMatch ? 'Thông tin item hợp nhất' : 'Thêm item',
            btnTitle: 'COMMON.CRUD.ADD'
        };
        this.isShowEditItem = true;
        this.dialogRefEdit.show();
    }

    private getIndexNo(rowData): void {
        if (rowData) {
            let listChildren: any = {};
            this.dataSource.treeNodes.filter(x => {
                if (x.children && x.children.length > 0
                    && (x.data.indexNo.toString().split('.')[0] === rowData.indexNo)) {
                    listChildren = x.children;
                }
            });
            if (listChildren.length > 0) {
                this.dialogRefEdit.input.rowData.indexNo = rowData.indexNo + '.'
                    + (+listChildren[listChildren.length - 1].data.indexNo.toString().split('.')[1] + 1);
            } else {
                this.dialogRefEdit.input.rowData.indexNo = rowData.indexNo + '.1';
            }
        } else {
            if (this.dataSource.treeNodes.length > 0) {
                this.dialogRefEdit.input.rowData.indexNo =
                    +this.dataSource.treeNodes[this.dataSource.treeNodes.length - 1].data.indexNo + 1;
            } else {
                this.dialogRefEdit.input.rowData.indexNo = 1;
            }
        }
    }

    // event khi match thành công
    public onSuccess(): void {
        this.loadNodes();
    }

    public checkLicensedImport(): void {
        // if (this.request.poId) {
        this.importFile.open();
        // }
    }

    public onBtnUploadClick(event: FileInfo[]): void {
        // if (this.request.poId) {
        const files = event.map((x) => x.file);
        this.purchaseOrderItemService
            .import(files, this.request)
            .subscribe(
                (res: any) => {
                    this.importFile.close();
                    for (const item of res) {
                        if (item.producerName) {
                            this.producerNameData.map(x => {
                                if (x.acronymName === item.producerName) {
                                    item.producerId = x.id;
                                }
                            });
                        }
                    }
                    this.loadNodes(null, res);
                    // this.noticeService.showSuccess();
                    this.cdr.detectChanges();
                },
                (err: HttpErrorResponse) => {
                    this.noticeService.showError(err.error.toString().substring('Error on line'.length));
                }
            );
        // }
    }

    public onBtnMapItemClick(rowData: any) {
        const listPoParent = [];
        for (const item of this.selectedPurchaseOrderitems) {
            if (item.data && !item.data.isSubItem) {
                listPoParent.push(item.data);
            }
        }
        this.dialogRefMatch.input.isInternal = this.isInternal;
        if (listPoParent.filter(x => x.matchedId || x.prItemId).length > 0) {
            this.noticeService.showWarning('Một số item đã được map');
            return;
        }
        if (listPoParent.length < 1) {
            this.noticeService.showWarning('Phải chọn ít nhất một item để map');
            return;
        }

        this.dialogRefMap.input.rowData = rowData ? [rowData] : listPoParent;
        this.isShowMapItem = false;
        this.cdr.detectChanges();
        this.isShowMapItem = true;
        this.dialogRefMap.config = {
            style: { width: '92vw' },
            baseZIndex: 10000,
            draggable: true,
            maximizable: true,
            title: 'Map'
        };
        this.dialogRefMap.show();
    }

    public onBtnMatchItemClick(rowData: any) {
        const listPoParent = [];
        for (const item of this.selectedPurchaseOrderitems) {
            if (item.data && !item.data.isSubItem) {
                listPoParent.push(item.data);
            }
        }
        this.dialogRefMatch.input.isInternal = this.isInternal;
        if (listPoParent.filter(x => x.matchedId || x.prItemId).length > 0 && listPoParent[0].id && listPoParent.length === 1) {
            this.noticeService.showWarning('Một số item đã được hợp nhất');
            return;
        }
        if (listPoParent.filter(x => !x.prItemId && !x.matchedId).length > 0 && listPoParent.length !== 1) {
            this.noticeService.showWarning('Item không xuất phát từ YCMH không cho phép hợp nhất');
            return;
        }
        if (listPoParent.length < 1) {
            this.noticeService.showWarning('Phải chọn ít nhất một item để hợp nhất');
            return;
        }

        if (this.selectedPurchaseOrderitems.length > 1) {
            this.selectedPurchaseOrderitemsClone = Object.assign(this.selectedPurchaseOrderitemsClone, this.selectedPurchaseOrderitems);
            const rowDataClone: any = {};
            for (const element of this.selectedPurchaseOrderitems) {
                if (rowDataClone.responseDate && rowDataClone.expectedDate) {
                    break;
                }
                if (element.data && element.data.expectedDate) {
                    rowDataClone.expectedDate = element.data.expectedDate;
                }
                if (element.data && element.data.responseDate) {
                    rowDataClone.responseDate = element.data.responseDate;
                }
            }
            let amountSelected = 0;
            this.selectedPurchaseOrderitems.forEach(element => {
                amountSelected += element.data.quantity * element.data.price;
            });
            rowDataClone.price = this.rounding(amountSelected);
            rowDataClone.quantity = 1;
            rowDataClone.isMatch = true;

            this.onBtnAddItemClick(null, true, rowDataClone);
        } else {
            this.dialogRefMatch.input.rowData = rowData ? [rowData] : listPoParent;
            this.isShowMatchItem = false;
            this.cdr.detectChanges();
            this.isShowMatchItem = true;
            this.dialogRefMatch.config = {
                style: { width: '92vw' },
                baseZIndex: 10000,
                draggable: true,
                maximizable: true,
                title: 'Match'
            };
            this.dialogRefMatch.show();
        }
    }

    public rounding(value: number): number {
        return (Math.round(value * 100) / 100);
    }

    public onBtnCheckClick(): void {
        const selectMatchId = this.selectedPurchaseOrderitems.filter(x => x.matchedId);
        if (selectMatchId && selectMatchId.length > 0) {
            this.noticeService.showWarning('Item đã được matched');
            return;
        }
    }

    public onRowEditInit(data?: any): void {
        if (data && data.itemType !== 'SRV') {
            data.isUpdateSrv = false;
        }
        this.getTotal();
        this.editRow.emit(this.dataSource);
    }

    public checkBindingAllData(): boolean {
        let isBindingAll = true;
        for (const item of this.dataSource.treeNodes) {
            if (item.data.itemOrigin) {
                isBindingAll = false;
            }
            for (const chil of item.children) {
                if (chil.data.itemOrigin) {
                    isBindingAll = false;
                    break;
                }
            }
            if (isBindingAll === false) {
                break;
            }
        }
        return isBindingAll;
    }

    public onChangeItemOrigin(event: any, rowData: any): void {
        if (event) {
            if (this.checkBindingAllData()) {
                for (const item of this.dataSource.treeNodes) {
                    item.data.itemOrigin = event.name;
                    for (const chil of item.children) {
                        chil.data.itemOrigin = event.name;
                    }
                }
            } else {
                rowData.itemOrigin = event.name;
            }
        } else {
            rowData.itemOrigin = null;
        }
        this.onRowEditInit(rowData);
    }

    public onModelChangePrice(event: any, rowData: any): void {
        if (event) {
            rowData.price = event;
            this.calculateAmount(rowData);
            this.getTotal();
            this.onRowEditInit(rowData);
        }
    }

    public onBtnViewMatch(rowData: any): void {
        this.dialogRefViewMatch.input.rowData = [rowData];
        this.dialogRefViewMatch.config = {
            style: { width: '92vw' },
            baseZIndex: 10000,
            draggable: true,
            maximizable: true,
            title: 'View match'
        };
        this.purchaseOrderItemViewMatch.loadNodes();
        this.dialogRefViewMatch.show();
        this.cdr.detectChanges();
    }

    public onBtnViewHistoryChangeItemClick(rowData: any): void {
        this.dialogRefViewHistory.input.module = 'po/item/response_date/' + rowData.id;
        this.dialogRefViewHistory.show();
    }

    public ongChangeIsUpdateSrv(rowData: any, event: any): void {
        rowData.termAccount = null;
        rowData.projectMilestone = null;
        rowData.isUpdateSrv = event.checked ? 1 : 0;
        if (event.checked) {
            rowData.itemCode = this.itemSrv.code;
            // rowData.itemName = this.itemSrv.name;
            rowData.unit = this.itemSrv.attr1;
            // rowData.note = rowData.itemNameOrigin;
        }
        this.onRowEditInit();
    }

    public onBtnShowDialogRejectClick(rowData: any): void {
        this.isShowDialogReject = true;
        this.selectedRow = rowData;
    }

    public onBtnRejectClick() {
        this.selectedRow.isActive = false;
        this.purchaseOrderItemService.merge(this.selectedRow).subscribe(() => {
            this.noticeService.showSuccess();
            this.isShowDialogReject = false;
            this.loadNodes();
        });
    }

    public onChangeResponseDate(rowData: any): void {
        this.dataSource.treeNodes.map(x => {
            if (x && x.data.expectedDate && rowData.id === x.data.id) {
                this.checkResponseDate(x.data);
            }
            if (x && !x.data.responseDate && rowData.id !== x.data.id) {
                x.data.responseDate = rowData.responseDate;
            }
            if (x && x.children.length > 0) {
                x.children.map(m => {
                    if (m && m.data.expectedDate && rowData.id === m.data.id) {
                        this.checkResponseDate(m.data);
                    }
                    if (m && rowData.id !== m.data.id && !m.data.responseDate) {
                        m.data.responseDate = rowData.responseDate;
                    }

                });
            }
            return x;
        });
        this.onRowEditInit();
        if (!this.compareDate(rowData.responseDate, rowData.responseDateOriginal) && rowData.id && this.currentPoId) {
            this.dialogRefChangeResData.input = rowData;
            this.dialogRefChangeResData.show();
        }
        this.cdr.detectChanges();
    }

    private compareDate(source: string, target: string): boolean {
        const sDate = new Date(source);
        const tDate = new Date(target);
        return sDate.getFullYear() === tDate.getFullYear() &&
            sDate.getMonth() === tDate.getMonth() &&
            sDate.getDate() === tDate.getDate();
    }

    public checkResponseDate(rowData: any): void {
        if (rowData.responseDate && rowData.expectedDate) {
            let responseDate = new Date(rowData.responseDate);
            responseDate = new Date(responseDate.toDateString());
            let expectedDate = new Date(rowData.expectedDate);
            expectedDate = new Date(expectedDate.toDateString());
            const temp = new Date(new Date(rowData.expectedDate).setDate(new Date(rowData.expectedDate).getDate() - 5));
            if (responseDate && expectedDate && temp > responseDate) {
                this.noticeService.showWarning('VALIDATION.MSGRESPONSEDATEERROR');
            }
            if (responseDate && expectedDate && responseDate > expectedDate) {
                this.noticeService.showWarning('Ngày dự kiến hàng về lớn hơn ngày yêu cầu giao hàng');
            }
        }
    }

    public onMapItemFromErp(): void {
        this.mapItemCodeTree.dataSource.items = this.dataSource.treeNodes;
        this.mapItemCodeTree.onBtnShowDialogListClick();
        this.cdr.detectChanges();
    }

    public changeSourceItem(data: any) {
        this.loadNodes();
    }

    public onSuccessEditItem(rowData: any): void {
        this.calculateAmount(rowData);
        const strRowData = JSON.stringify(rowData);
        const objRowData = JSON.parse(strRowData);
        if (rowData.isMatch && !rowData.matchedId) {
            let guideId: any = Guid.create().toString();
            guideId = guideId.split('-').join('');

            if (this.selectedPurchaseOrderitemsClone.length > 1) {
                // Xoá line hàng không thêm từ pr
                this.selectedPurchaseOrderitemsClone.forEach(element => {
                    const index = this.dataSource.items.findIndex(x => x.id === element.data.id);
                    if (index > -1) {
                        this.dataSource.items.splice(index, 1);
                    }
                });
            }
            // Form thêm
            if (!this.purchaseOrderData.id) {
                this.processAfterMatchedForAdd(objRowData, guideId);
                // Form sửa
            } else {
                this.processAfterMatcheForEdit(objRowData, guideId);
            }
        } else {
            if (!this.dialogRefEdit.input.add) {
                this.dialogRefEdit.input.rowDataOrigin =
                    Object.assign(this.dialogRefEdit.input.rowDataOrigin, this.dialogRefEdit.input.rowData);
                this.treeNodeToItemSource();
            } else {
                this.treeNodeToItemSource();
                this.dialogRefEdit.output.rowData = { ...this.dialogRefEdit.input.rowData };
                this.dataSource.items.push({ ...this.dialogRefEdit.output.rowData });
                this.itemSourceToListTreeNode(this.dataSource.items);
            }
            this.selectedPurchaseOrderitems = [];
            this.editRow.emit();
            //   this.dataSource.items = [...this.dataSource.items];
            this.getTotal();
            this.cdr.detectChanges();
        }
    }

    private processAfterMatchedForAdd(objRowData: any, guideId: string) {
        let temp = [];
        this.selectedPurchaseOrderitems.forEach(element => {
            if (!element.data.matchedId) {
                element.data.matchedId = guideId;
                temp.push(element);
            } else {
                const list = this.selectedPurchaseRequestItem.filter(x => x.data.matchedId === element.data.matchedId);
                list.map(x => x.data.matchedId = guideId);
                temp = temp.concat(list);
            }
        });
        this.selectedPurchaseRequestItem.forEach(element => {
            temp.forEach(el => {
                if (el.data.id === element.data.id) {
                    element.data.matchedId = el.data.matchedId;
                }
            });
        });
        objRowData.matchedId = guideId;
        this.dataSource.items.push(objRowData);
        this.itemSourceToListTreeNode(this.dataSource.items);
        this.selectedPurchaseOrderitems = [];
        this.editRow.emit();
        //   this.dataSource.items = [...this.dataSource.items];
        this.getTotal();
        this.cdr.detectChanges();
    }

    private processAfterMatcheForEdit(objRowData: any, guideId: string) {
        const objJsons = JSON.stringify(this.selectedPurchaseOrderitems);
        const objs = JSON.parse(objJsons);
        this.purchaseOrderItemDeleted = objs;
        const request = new PurchaseRequestItemRequestPayload();
        this.purchaseRequestItemService.select(request).subscribe(res => {
            this.purchaseRequestItemMatch = [];
            this.selectedPurchaseOrderitems.forEach(element => {
                if (!element.data.matchedId) {
                    element.data.matchedId = guideId;
                    element.data.id = element.data.prItemId;
                    if (res.find(x => x.id === element.data.id)) {
                        element.data.prId = res.find(x => x.id === element.data.id).prId;
                    }

                    this.purchaseRequestItemMatch.push(element.data);
                } else {
                    const list = res.filter(x => x.matchedId === element.data.matchedId);
                    list.map(x => x.matchedId = guideId);
                    this.purchaseRequestItemMatch = this.purchaseRequestItemMatch.concat(list);
                }
            });
            objRowData.matchedId = guideId;
            const requestBulkMatch = new PurchaseOrderItemBulkMatchRequestPayload();
            requestBulkMatch.purchaseOrderItem = [objRowData];
            requestBulkMatch.purchaseRequestItem = this.purchaseRequestItemMatch.filter(x => x.id);
            requestBulkMatch.idPoDelete = this.purchaseOrderItemDeleted.map(x => x.data.id);

            this.purchaseOrderItemService.bulkMatched(requestBulkMatch).subscribe(resMatch => {
                this.loadNodes();
                this.selectedPurchaseOrderitems = [];
                this.editRow.emit();
                this.noticeService.showSuccess();
                this.cdr.detectChanges();
            });
        });
    }

    private treeNodeToItemSource(): void {
        this.dataSource.items = [];
        for (const parentNode of this.dataSource.treeNodes) {
            this.dataSource.items.push(parentNode.data);
            for (const childNode of parentNode.children) {
                this.dataSource.items.push(childNode.data);
            }
        }
    }

    private itemSourceToListTreeNode(source: any[], importFile?: boolean): void {
        source.map(x => {
            if (!x.responseDateOriginal) {
                x.responseDateOriginal = x.responseDate;
            }
            return x;
        });

        if (!importFile) {
            this.dataSource.treeNodes = [];
        } else {
            this.treeNodeToItemSource();
            for (const item of source) {
                this.dataSource.items.push(item); // push thêm item mới import vào dataSource item
            }
            source = this.dataSource.items; // làm thế này để item cũ ở trên đầu
            this.dataSource.treeNodes = [];
        }

        if (source.length > 0) {
            const response = source.sort((a, b) => parseFloat(a.indexNo) - parseFloat(b.indexNo));
            const parentItems = response.filter(x => !x.isSubItem);
            parentItems.forEach((parent, index) => {
                parent.quantityOrigin = parent.quantity;
                const node = {
                    data: {
                        ...parent,
                        indexNo: index + 1,
                        taxDto: { name: parent.tax },
                        currentPoId: this.currentPoId
                    },
                    children: [],
                    expanded: true,
                    leaf: true,
                };

                const childItems = source.filter(x => x.isSubItem && this.quote(x.indexNo).startsWith(this.quote(parent.indexNo)));

                childItems.forEach((child, indexChild) => {
                    child.quantityOrigin = child.quantity;
                    const childNode = {
                        data: {
                            ...child,
                            indexNo: (index + 1) + '.' + (indexChild + 1),
                            taxDto: { name: child.tax },
                            currentPoId: this.currentPoId
                        },
                        leaf: true,
                    };

                    node.children.push(childNode);
                    node.leaf = false;
                });

                this.dataSource.treeNodes.push(node);
            });
        }

        this.dataSource.treeNodes = [...this.dataSource.treeNodes];
        // reset lại itemsoure cho đúng với indexNo treeNode
        this.treeNodeToItemSource();
        this.cdr.detectChanges();
    }

    private getTotal(): void {
        if (this.currentPoId && this.dataSource && this.dataSource.treeNodes && this.dataSource.treeNodes.length > 0) {
            // Tổng tiền chưa bao gồm thuế
            let totalWithoutTax = 0;
            // Tổng tiền thuế
            let totalAmountTax = 0;

            for (const item of this.dataSource.treeNodes) {
                // Không tính những line hàng đã bị từ chối
                if (item.data.isActive) {
                    totalWithoutTax += this.rounding(+item.data.quantity * +item.data.price);
                    totalAmountTax += this.rounding(item.data.taxAmount ? +item.data.taxAmount : 0);
                    if (item.children && item.children.length > 0) {
                        item.children.map(chil => {
                            if (chil.data && chil.data.price) {
                                totalWithoutTax += this.rounding(+chil.data.quantity * +chil.data.price);
                                totalAmountTax += this.rounding(chil.data.taxAmount ? +chil.data.taxAmount : 0);
                            }
                        });
                    }
                }
            }
            // Tổng tiền chưa bao gồm thuế
            this.totalWithoutTax = totalWithoutTax;
            // Tổng tiền thuế
            this.totalAmountTax = totalAmountTax;
            // Tổng tiền bao gồm thuế
            this.totalWithTax = totalWithoutTax + totalAmountTax;
            this.purchaseOrderItemTotalAmounts.totalWithTax = this.totalWithTax;
            this.purchaseOrderItemTotalAmounts.totalWithoutTax = this.totalWithoutTax;
        } else {
            // Tổng tiền chưa bao gồm thuế
            this.totalWithoutTax = 0;
            // Tổng tiền thuế
            this.totalAmountTax = 0;
            this.totalWithTax = 0;
        }

    }

    public onTabChange(event: any): void {
        this.activeIdTab = event.nextId;
        if (this.activeIdTab === 3 && this.request && this.request.poId) {
            this.loadNodesItemsProgress();
        }
    }

    public getScrollElement(): void {
        this.layoutConfigService.scrollElement = document.getElementsByClassName('mat-table__wrapper')[0];
    }

    public onChangeItemCode(itemsCodeDto: any, rowData: any) {
        if (itemsCodeDto) {
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
            this.onRowEditInit();
        }
    }

    public onChangeTaxCode(event: any, rowData: any): void {
        if (event) {
            if (event.name) {
                rowData.tax = event.name;
                rowData.taxDto = {
                    name: rowData.tax
                };
            } else {
                rowData.tax = null;
                rowData.taxDto = null;
            }
            // Xử lý binding thuế VAT
            for (const item of this.dataSource.items) {
                if (!item.tax) {
                    item.tax = event.name;
                    item.taxDto = {
                        name: item.tax
                    };
                }
                this.calculateAmount(item);
            }
            this.itemSourceToListTreeNode(this.dataSource.items);
            this.getTotal();
            this.editRow.emit();
        }
    }

    public onChangeTaxAmount(rowData?: any) {
        if (rowData.taxAmount) {
            rowData.taxAmount = this.rounding(rowData.taxAmount);
            this.onRowEditInit(rowData);
        }
    }

    public calculateAmount(rowData) {
        if (rowData.tax) {
            const taxCode = this.taxCodeData.find(m => m.name === rowData.tax);
            rowData.taxValue = taxCode ? taxCode.taxValue : null;
        } else {
            rowData.taxValue = null;
        }
        if (rowData.quantity && rowData.price) {
            rowData.amount = rowData.quantity * rowData.price;
            if (rowData.taxValue) {
                rowData.taxAmount = this.rounding(rowData.amount * rowData.taxValue / 100);
            } else {
                rowData.taxAmount = null;
            }
        }
    }

    public onChangeQuantity(rowData): void {
        rowData.quantityRemain = rowData.quantityRemain - (rowData.quantityOrigin - rowData.quantity);
        this.calculateAmount(rowData);
        this.editRow.emit();
    }

    public onShowContextMenu() {
        const rowData = this.selectedNode.data;
        if (this.viewFromAppendix) {
            this.btnItems = this.btnItemViewFromAppendix;
        } else {
            this.btnItems = this.btnItemNoteViewFromAppendix;
        }
        if (this.btnItems.length > 0) {
            if (!this.viewFromAppendix) {
                this.btnItems[0].visible = rowData.isActive && !rowData.isSubItem && !rowData.receiptItemId ? true : false; // btn add to
                this.btnItems[1].visible = rowData.isActive && !rowData.receiptItemId ? true : false; // btn edit
                this.btnItems[2].visible = !rowData.receiptItemId ? true : false; // delete
                this.btnItems[3].visible = rowData.matchedId ? true : false; // view match
                this.btnItems[4].visible = (rowData.isActive || this.isInternal) && !rowData.receiptItemId ? true : false; // reject
            } else {
                this.btnItems[0].visible = rowData.isActive ? true : false; // edit
                this.btnItems[1].visible = rowData.matchedId ? true : false; // view match
                this.btnItems[2].visible = rowData.isActive ? true : false; // btn reject
            }
        }
    }

    public onMapTermAccount(): void {
        this.mapTermAccount.onBtnShowDialogListClick();
        this.cdr.detectChanges();
    }

    public changeMapTermAccount(data): void {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.dataSource.treeNodes.length; i++) {
            if (!this.dataSource.treeNodes[i].data.termAccount && this.dataSource.treeNodes[i].data.isUpdateSrv) {
                this.dataSource.treeNodes[i].data.termAccount = data;
            }
            if (this.dataSource.treeNodes[i].children && this.dataSource.treeNodes[i].children.length > 0) {
                // tslint:disable-next-line:prefer-for-of
                for (let j = 0; j < this.dataSource.treeNodes[i].children.length; j++) {
                    // tslint:disable-next-line:max-line-length
                    if (!this.dataSource.treeNodes[i].children[j].data.termAccount && this.dataSource.treeNodes[i].children[j].data.isUpdateSrv) {
                        this.dataSource.treeNodes[i].children[j].data.termAccount = data;
                    }
                }
            }
        }
        this.editRow.emit(this.dataSource);
    }

    public checkLicensedExport(): void {
        const request = new PurchaseOrderItemRequestPayload();
        request.poId = this.currentPoId;
        request.isInternal = this.isInternal;
        this.purchaseOrderItemService.exportAll(request).subscribe(() => {
            this.noticeService.showMessage('Export complete');
        });
    }

    public onChangeProductName(event: any, rowData: any): void {
        if (event) {
            if (this.checkBindingAllProduct()) {
                for (const item of this.dataSource.treeNodes) {
                    item.data.producerName = event.acronymName;
                    item.data.producerId = event.id;
                    for (const chil of item.children) {
                        chil.data.producerName = event.acronymName;
                        chil.data.producerId = event.id;
                    }
                }
            } else {
                rowData.producerName = event.acronymName;
                rowData.producerId = event.id;
            }
        } else {
            rowData.producerName = null;
            rowData.producerId = null;
        }
        this.editRow.emit();
        this.onRowEditInit(rowData);
    }

    public checkBindingAllProduct(): boolean {
        let isBindingAll = true;
        for (const item of this.dataSource.treeNodes) {
            if (item.data.producerId) {
                isBindingAll = false;
            }
            for (const chil of item.children) {
                if (chil.data.producerId) {
                    isBindingAll = false;
                    break;
                }
            }
            if (isBindingAll === false) {
                break;
            }
        }
        return isBindingAll;
    }

    public onBtnAddItemFromPurchaseResquest(): void {
        this.isShowDialogAddItemFromPR = false;
        this.purchaseRequestData.items = [];
        this.purchaseRequestDataTemp = [];
        this.selectedPurchaseRequest = [];
        this.cdr.detectChanges();
        this.loadNodesPr();
        this.isShowDialogAddItemFromPR = true;
    }

    public onBtnAddItemPrClick(): void {
        let index = this.dataSource.treeNodes.length;

        for (const item of this.purchaseRequestDataTemp) {
            if (!this.dataSource.treeNodes.find(x => x.data.prItemId === item.data.id)) {
                const node: TreeNode = {
                    // tslint:disable-next-line:max-line-length
                    data: { ...item.data },
                    children: item.children,
                    expanded: true,
                    leaf: true
                };
                node.data.indexNo = (index + 1).toString();
                node.data.isActive = true;
                node.data.quantityRemain = item.data.quantity;
                node.data.status = 1;
                node.data.prItemId = node.data.id;
                node.data.poId = this.purchaseOrderData.id;
                node.data.id = null;
                for (let j = 0; j < node.children.length; j++) {
                    const children = item.children[j];
                    children.data.indexNo = (index + 1).toString() + '.' + (j + 1).toString();
                    children.data.isActive = true;
                    children.data.quantityRemain = children.data.quantity;
                    children.data.status = 1;
                    children.data.prItemId = children.data.id;
                    children.data.poId = this.purchaseOrderData.id;
                    children.data.id = null;
                }
                index++;
                this.dataSource.treeNodes.push(node);
                this.cdr.detectChanges();
            }
        }
        this.treeNodeToItemSource();
        this.itemSourceToListTreeNode(this.dataSource.items);
        this.cdr.detectChanges();
        this.isShowDialogAddItemFromPR = false;
    }

    public loadNodesPr(event?: any): void {
        this.requestPr.areaType = this.isInternal ? 1 : 2;
        this.requestPr.pageIndex = event ? event.first / event.rows : 0;
        this.requestPr.pageSize = event ? event.rows : 10;
        this.requestPr.isViewAll = false;
        const purchaseRequestSub = forkJoin([
            this.purchaseRequestService.select(this.requestPr),
            this.purchaseRequestService.count(this.requestPr)
        ]).subscribe(res => {
            this.purchaseRequestData.items = [];
            this.purchaseRequestData.paginatorTotal = res[1];
            for (const element of res[0]) {
                const node = {
                    data: {
                        ...element,
                        isSelectNode: element.quantityRemainTotal > 0
                    },
                    leaf: false,
                };
                this.purchaseRequestData.items.push(node);
            }
            this.purchaseRequestData.items = [...this.purchaseRequestData.items];
            this.cdr.detectChanges();
        });
        this.subscriptions.push(purchaseRequestSub);
    }

    public onNodeExpandPr(event: any, rowData?: any): void {
        if (event.node.data.isSubItem === false) {
            return;
        }
        const node = event.node;
        this.loadingId = node.data.id;
        this.nodeDatas.push(node.data);
        node.children = [];
        this.requestItemPr.prId = node.data.id;
        const areaType = this.isInternal ? 1 : 2;

        // call api lay du lieu
        const purchaseRequestItemSub = this.purchaseRequestItemService.select(this.requestItemPr).subscribe(res => {
            if (res && res.length > 0) {
                const response = res.sort((a, b) => parseFloat(a.indexNo) - parseFloat(b.indexNo));

                const parentItems = response.filter(x => !x.isSubItem && x.areaType === areaType);
                parentItems.forEach((parent, index) => {
                    const nodeData: TreeNode = {
                        data: {
                            ...parent,
                            legalOrigin: node.data.legal,
                            prNo: node.data.prNo,
                            subDepartmentIdOrigin: node.data.subDepartmentId,
                            legalNameOrigin: node.data.legalName,
                            orgApplyNameOrigin: node.data.orgApplyName,
                            orgApplyAcronym: node.data.orgApplyAcronym,
                            orgCodeOrigin: node.data.orgCode,
                            projectCode: node.data.projectCode,
                            indexNo: index + 1
                        },
                        children: [],
                        // leaf: true
                    };

                    nodeData.data.price = nodeData.data.priceBp ? nodeData.data.priceBp : nodeData.data.expectedPrice;
                    nodeData.data.itemNameOrigin = nodeData.data.itemName;
                    nodeData.data.unitOrigin = nodeData.data.unit;

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
                this.purchaseRequestData.items = [...this.purchaseRequestData.items];
                this.cdr.detectChanges();
            }
        });
        this.subscriptions.push(purchaseRequestItemSub);

    }

    public nodeSelectPr(event?: any): void {
        if (event) {
            this.onNodeExpandPr(event, event.node.data);
            if (!this.checkInfoItemsSelect()) {
                this.purchaseRequestData.items = [];
                this.purchaseRequestDataTemp = [];
                this.selectedPurchaseRequest = [];
                this.cdr.detectChanges();
                this.loadNodesPr();
            }
        }
    }

    public nodeUnselectPr(event?: any): void {

    }

    public checkInfoItemsSelect(): boolean {
        this.purchaseRequestDataTemp = [];

        if (this.selectedPurchaseRequest.length > 0) {
            // Check xóa đi items đã bị disable checkbox (Chỉ lấy item còn số lượng)
            const selectedPurchaseRequestTemp = this.selectedPurchaseRequest.filter(x => x.data && x.data.quantityRemain > 0 && x.parent);
            // Lấy item cha và item con
            for (const element of selectedPurchaseRequestTemp) {
                if (!element.children || (element.children && element.parent)) {
                    // check trùng
                    if (!this.purchaseRequestDataTemp.find(x => x.data.id === element.data.id)) {
                        this.purchaseRequestDataTemp.push(element);
                    }
                }
            }
            // Chỉ check trùng vói item cha
            const prItemParentData = this.purchaseRequestDataTemp.filter(x => !x.data.isSubItem);
            if (prItemParentData.find(x => x.data) && !this.checkDupplicate(prItemParentData.map(x => x.data), 'supplierName')) {
                this.noticeService.showMessage('Item không cùng nhà cung cấp');
                return false;
            }
            if (prItemParentData.find(x => x.data) && !this.checkDupplicate(prItemParentData.map(x => x.data), 'currency')) {
                this.noticeService.showMessage('Item không cùng loại tiền tệ');
                return false;
            }
            if (prItemParentData.find(x => x.parent) && !this.checkDupplicate(prItemParentData.map(x => x.parent.data), 'orgApplyNameOrigin')) {
                this.noticeService.showMessage('Item không cùng đơn vị sử dụng');
                return false;
            }
            if (prItemParentData.find(x => x.parent) && !this.checkDupplicate(prItemParentData.map(x => x.parent.data), 'orgCodeOrigin')) {
                this.noticeService.showMessage('Item không cùng mã đơn vị');
                return false;
            }
            if (prItemParentData.find(x => x.parent) && !this.checkDupplicate(prItemParentData.map(x => x.parent.data), 'projectCode')) {
                this.noticeService.showMessage('Item không cùng mã dự án');
                return false;
            }
            if (prItemParentData.find(x => x.parent) && !this.checkDupplicate(prItemParentData.map(x => x.parent.data), 'legalOrigin')) {
                this.noticeService.showMessage('Item không cùng pháp nhân');
                return false;
            }

            // Check với thông tin trong PO
            for (const item of prItemParentData) {
                if (item.data.supplierName !== this.purchaseOrderData.supplierName) {
                    this.noticeService.showMessage('Item không cùng nhà cung cấp với PO');
                    return false;
                }
                if (item.data.currency !== this.purchaseOrderData.currency) {
                    this.noticeService.showMessage('Item không cùng loại tiền tệ với PO');
                    return false;
                }
                if (item.data.orgApplyNameOrigin !== this.purchaseOrderData.orgApplyName) {
                    this.noticeService.showMessage('Item không cùng đơn vị sử dụng với PO');
                    return false;
                }
                if (item.data.orgCodeOrigin !== this.purchaseOrderData.orgCode) {
                    this.noticeService.showMessage('Item không cùng mã đơn vị với PO');
                    return false;
                }
                if (item.data.projectCode !== this.purchaseOrderData.projectCode) {
                    this.noticeService.showMessage('Item không cùng mã dự án với PO');
                    return false;
                }
                if (item.data.legalOrigin !== this.purchaseOrderData.ouCode) {
                    this.noticeService.showMessage('Item không cùng pháp nhân với PO');
                    return false;
                }
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

}
