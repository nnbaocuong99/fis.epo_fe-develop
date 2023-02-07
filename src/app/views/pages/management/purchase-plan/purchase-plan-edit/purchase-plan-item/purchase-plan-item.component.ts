import {
    AfterViewChecked,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { PurchasePlanItemRequestPayload } from '../../../../../../services/modules/purchase-plan-item/purchase-plan-item.request-payload';
import { PurchasePlanItemService } from '../../../../../../services/modules/purchase-plan-item/purchase-plan-item.service';
import { DialogUploadFileComponent } from '../../../../../partials/control/upload-file/upload-file.component';
import * as config from '../purchase-plan-edit.config';
import * as mainConfig from '../../../../../../core/_config/main.config';
import { MenuItem, MessageService, TreeNode } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import { Guid } from 'guid-typescript';
import { DeleteConfirmation } from '../../../../../../services/common/confirmation/delete-confirmation';
import { NgForm } from '@angular/forms';
import { BaseFormComponent } from '../../../../../../core/_base/component/base-form.component';
import { FormDynamicData } from '../../../../../partials/content/crud/component/form-dynamic-data.model';
import { TreeTable } from 'primeng/treetable';
import { CustomConfirmation } from '../../../../../../services/common/confirmation';
import { LayoutConfigService } from '../../../../../../core/_base/layout';
import * as configPurchasePlanEdit from '../../../purchase-plan/purchase-plan-edit/purchase-plan-edit.config';
import { ItemService } from '../../../../../../services/modules/category/item/item.service';
import { ItemRequestPayload } from '../../../../../../services/modules/category/item/item.request.payload';
import { CurrencyService } from '../../../../../../services/modules/category/currency/currency.service';
import { ConfigListFactory } from '../../../../../partials/control/config-list/config-list-control.service';
import { SupplierRequestPayload } from '../../../../../../services/modules/category/supplier/supplier.request.payload';
import { SupplierService } from '../../../../../../services/modules/category/supplier/supplier.service';
import { CurrencyRequestPayload } from '../../../../../../services/modules/category/currency/currency.request.payload';
import { BrandService } from '../../../../../../services/modules/category/brand/brand.service';
import { BrandRequestPayload } from '../../../../../../services/modules/category/brand/brand.request.payload';
import { ConfigListService } from '../../../../../../services/modules/config-list/config-list.service';
import {
    PurchasePlanItemHistoryRequestPayload
} from '../../../../../../services/modules/purchase-plan-item-history/purchase-plan-item-history.request-payload';
import {
    PurchasePlanItemHistoryService
} from '../../../../../../services/modules/purchase-plan-item-history/purchase-plan-item-history.service';
@Component({
    selector: 'app-purchase-plan-item',
    templateUrl: './purchase-plan-item.component.html',
    styleUrls: ['./purchase-plan-item.component.scss'],
    providers: [DialogService, MessageService],
})
export class PurchasePlanItemComponent extends BaseFormComponent implements OnInit, AfterViewChecked {
    @ViewChild('treeTable', { static: true }) treeTable: TreeTable;
    @ViewChild(DialogUploadFileComponent, { static: false }) private importFile: DialogUploadFileComponent;
    @Output() importSuccess = new EventEmitter<any>(true);
    @Output() save = new EventEmitter<any>(true);
    @Input() editTable = true;
    @Input() isImport: any;
    @Input() form: NgForm;
    @Input() purchasePlanData: any = {};
    @Input() allowViewPrice = false;

    _purchasePlanHistory: any;
    get purchasePlanHistory(): any {
        return this._purchasePlanHistory;
    }
    @Input() set purchasePlanHistory(value: any) {
        this._purchasePlanHistory = value;
        if (this._purchasePlanHistory && this._purchasePlanHistory.id) {
            this.initData();
        }
    }

    public cols: any;
    public mainConfig: any;
    public request: any;
    public dataSource = {
        items: null,
        treeNodes: [],
        paginatorTotal: undefined,
    };
    public headerItems = configPurchasePlanEdit.HEADER_ITEMS;
    public itemTypes = configPurchasePlanEdit.ITEM_TYPE;
    public headerSuppliers = configPurchasePlanEdit.HEADER_SUPPLIER;
    public headerCurrency = configPurchasePlanEdit.HEADER_CURRENCY;

    public itemRequestPayload = new ItemRequestPayload();
    public supplierRequestPayload = new SupplierRequestPayload();
    public currencyRequestPayload = new CurrencyRequestPayload();
    public dialogRef: DialogRef = new DialogRef();
    public isShowDialogRef = false;
    public key: string;
    public totalBom: any = [];
    public selectedPurchasePlanItems: any = [];
    public frozenCols: any[];
    public checkCreatePurchaseRequest = false;
    public showCheckBox = false; // show checkbox item
    public selectedNode: any;
    public producerNameData: any[];
    public btnItems: MenuItem[] = [
        { label: 'Thêm vào', icon: 'fal fa-plus', command: () => this.onBtnAddClick(this.selectedNode.data) },
        { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: () => this.onBtnEditClick(this.selectedNode.data) },
        { label: 'Xóa', icon: 'pi pi-fw pi-times', command: () => this.configBeforeDelete(this.selectedNode) }
    ];
    public itemSrv: any = {};

    constructor(
        public purchasePlanItemService: PurchasePlanItemService,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef,
        private notification: NotificationService,
        public itemService: ItemService,
        public currencyService: CurrencyService,
        public purchasePlanItemHistoryService: PurchasePlanItemHistoryService,
        public supplierService: SupplierService,
        public configListService: ConfigListService,
        private router: Router,
        public brandService: BrandService,
        public layoutConfigService: LayoutConfigService
    ) {
        super();
        this.key = Guid.create().toString();
    }

    ngOnInit() {
        // Xử lý frozenCols table
        const temp = JSON.stringify(config.HEADER_ITEM);
        this.cols = JSON.parse(temp);
        this.frozenCols = this.cols.slice(0, 5);
        this.cols.splice(0, 5);

        this.request = new PurchasePlanItemRequestPayload();
        this.mainConfig = mainConfig.MAIN_CONFIG;

        const paramsSub = this.route.params.subscribe((params) => {
            if (params.id) {
                this.request.ppId = params.id;
            } else {
                this.request.ppId = '0';
            }
        });
        this.subscriptions.push(paramsSub);
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

    private getDataService() {
        const totalBomSub = this.purchasePlanItemService.selectTotalBom(this.request).subscribe(res => {
            this.totalBom = res;
            this.cdr.detectChanges();
        });
        this.subscriptions.push(totalBomSub);
    }

    public loadNodes(event: any): void {
        if (!this.purchasePlanHistory) {
            this.getDataService();

            if (!event) {
                this.dataSource.treeNodes = [...this.dataSource.treeNodes];
                this.cdr.detectChanges();
            }

            const purchasePlanItemSub = forkJoin([
                this.purchasePlanItemService.select(this.request),
                this.purchasePlanItemService.count(this.request)
            ]).subscribe((res) => {
                this.dataSource.paginatorTotal = res[1];
                this.itemSourceToListTreeNode(res[0]);
            });
            this.subscriptions.push(purchasePlanItemSub);
        }
    }

    private initData(): void {
        const request = new PurchasePlanItemHistoryRequestPayload();
        request.ppHistoryId = this.purchasePlanHistory.id;
        const initData = forkJoin([
            this.purchasePlanItemHistoryService.select(request),
            this.purchasePlanItemHistoryService.selectTotalBom(request)
        ]).subscribe(res => {
            if (res[0] && res[0].length > 0) {
                this.dataSource.paginatorTotal = res[0].length;
                this.itemSourceToListTreeNode(res[0]);
            }
            this.totalBom = res[1];
            this.cdr.detectChanges();
        });
        this.subscriptions.push(initData);
    }

    private itemSourceToListTreeNode(source: any[]): void {
        this.dataSource.items = source;
        this.dataSource.treeNodes = [];
        if (source.length > 0) {
            const response = source.sort((a, b) => parseFloat(a.indexNo) - parseFloat(b.indexNo));
            const parentItems = response.filter(x => !x.isSubItem);
            for (const parent of parentItems) {
                const node = {
                    data: { ...parent },
                    children: [],
                    expanded: false,
                    leaf: true
                };

                const childItems = source.filter(x => x.isSubItem && this.quote(x.indexNo).startsWith(this.quote(parent.indexNo)));
                for (const child of childItems) {
                    const childNode = {
                        data: { ...child },
                        leaf: true,
                    };

                    node.children.push(childNode);
                    node.leaf = false;
                }

                this.dataSource.treeNodes.push(node);
            }
        }
        this.dataSource.treeNodes = [...this.dataSource.treeNodes];
        if (!this.editTable) {
            this.dataSource.treeNodes.map(x => x.expanded = true);
        }
        this.cdr.detectChanges();
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

    private quote(source: string): string {
        return `.${source}.`;
    }

    public onBtnUploadClick(): void {
        const confirm = new CustomConfirmation('PURCHASE_PLAN.WARNING_IMPORT_ITEM');
        confirm.accept = () => {
            const files = this.importFile.tableFile.map((x) => x.file);
            this.purchasePlanItemService
                .import(files, this.request)
                .subscribe(
                    (res) => {
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
                        this.itemSourceToListTreeNode(res);
                        this.getTotalAmount();
                        this.form.form.markAsDirty();
                        this.cdr.detectChanges();
                    }
                );
        };
        this.notification.confirm(confirm);
    }

    public onBtnEditClick(rowData?: any, rowNode?: TreeNode): void {
        this.isShowDialogRef = false;
        this.cdr.detectChanges();
        // Origin item
        this.dialogRef.input.rowData = rowData;
        this.dialogRef.input.rowEditing = rowData;
        this.dialogRef.config = {
            style: { width: '62vw' },
            baseZIndex: 10000,
            draggable: true,
            maximizable: true,
            title: 'Sửa items',
            btnTitle: 'COMMON.CRUD.UPDATE'
        };
        this.isShowDialogRef = true;
        this.dialogRef.show();
        this.cdr.detectChanges();
    }

    public onBtnAddClick(rowData?: any): void {
        if (!this.purchasePlanData.contractId) {
            this.notification.showWarning('Vui lòng chọn hợp đồng đầu ra !');
            return;
        }
        this.isShowDialogRef = false;
        this.cdr.detectChanges();
        this.dialogRef.input.isAdd = true;
        this.dialogRef.input.rowEditing = {};
        this.getIndexNo(rowData);
        this.dialogRef.input.source = this.dataSource.items ? this.dataSource.items.map(x => x.indexNo) : [];
        this.dialogRef.config = {
            style: { width: '62vw' },
            baseZIndex: 10000,
            draggable: true,
            maximizable: true,
            title: 'Thêm items',
            btnTitle: 'COMMON.CRUD.ADD'
        };
        this.isShowDialogRef = true;
        this.dialogRef.show();
    }

    private getIndexNo(rowData: any): void {
        if (rowData) {
            const listChildren = this.dataSource.items.filter(x => x.indexNo.toString().split('.')[0]
                === rowData.indexNo && x.indexNo.toString().includes('.'));
            if (listChildren.length > 0) {
                this.dialogRef.input.rowEditing.indexNo = rowData.indexNo + '.'
                    + (+listChildren[listChildren.length - 1].indexNo.toString().split('.')[1] + 1);
            } else {
                this.dialogRef.input.rowEditing.indexNo = rowData.indexNo + '.1';
            }
        } else {
            if (this.dataSource.items.length > 0) {
                this.dialogRef.input.rowEditing.indexNo = +this.dataSource.items[this.dataSource.items.length - 1].indexNo + 1;
            } else {
                this.dialogRef.input.rowEditing.indexNo = 1;
            }
        }
    }

    public onSave(): any {
        if (!this.dialogRef.input.isAdd) {
            this.dialogRef.input.rowData = Object.assign(this.dialogRef.input.rowData, this.dialogRef.input.rowEditing);
            this.treeNodeToItemSource();
        } else {
            this.dialogRef.output.rowData = { ...this.dialogRef.input.rowEditing };
            this.dialogRef.output.rowData.quantityRemain = this.dialogRef.output.rowData.quantity;
            this.dataSource.items.push(this.dialogRef.output.rowData);
            this.itemSourceToListTreeNode(this.dataSource.items);
        }
        this.getTotalAmount();
        this.form.form.markAsDirty();
        this.cdr.detectChanges();
    }

    private getTotalAmount(): void {
        const listTotal = [];
        this.dataSource.items.forEach(element => {
            if (element.currency) {
                listTotal.push({
                    key: element.currency,
                    count: (element.expectedPrice ? element.expectedPrice : 0) * element.quantity
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

    public configBeforeDelete(selectedNode: any): void {
        const rowNode = {
            node: selectedNode,
            parent: selectedNode.parent
        };
        this.onBtnDeleteClick(rowNode);
    }

    public onBtnDeleteClick(rowNode: any): void {
        const confirmation = new DeleteConfirmation();
        confirmation.accept = () => {
            const parent = rowNode.parent;
            if (parent) {
                const index = parent.children
                    .findIndex(x => x.data.id === rowNode.node.data.id && x.data.indexNo === rowNode.node.data.indexNo);
                parent.children.splice(index, 1);
                if (parent.children.length === 0) {
                    parent.leaf = true;
                }
            } else {
                const index = this.dataSource.treeNodes
                    .findIndex(x => x.data.id === rowNode.node.data.id && x.data.indexNo === rowNode.node.data.indexNo);
                this.dataSource.treeNodes.splice(index, 1);
            }
            this.dataSource.treeNodes = [...this.dataSource.treeNodes];
            this.treeNodeToItemSource();
            this.getTotalAmount();
            this.form.form.markAsDirty();
            this.cdr.detectChanges();
        };
        this.notification.confirm(confirmation);
    }

    public validateShowImportFile(): void {
        if (!this.purchasePlanData.contractId) {
            this.notification.showWarning('Vui lòng chọn hợp đồng đầu ra !');
            return;
        }
        this.importFile.open();
    }

    public setCreatePurchaseRequest(value: boolean): void {
        this.checkCreatePurchaseRequest = value;
        this.showCheckBox = true;
    }

    public continueCreatePurchaseRequest(): void {
        if (this.selectedPurchasePlanItems.length === 0) {
            this.notification.showWarning('Vui lòng chọn thông tin hàng hóa');
        } else {
            this.router.navigate([`../../add`], { relativeTo: this.route });
            localStorage.setItem('selectedPurchasePlanItems', JSON.stringify(this.selectedPurchasePlanItems));
            localStorage.setItem('ppId', JSON.stringify(this.request.ppId));
        }
    }

    public getScrollElement(): void {
        this.layoutConfigService.scrollElement = document.getElementsByClassName('table-responsive')[0];
    }

    public onShowContextMenu() {
        const rowData = this.selectedNode.data;
        this.btnItems[0].visible = rowData.isSubItem ? false : true; // view match
        this.btnItems[2].visible = !this.purchasePlanData.id || (this.purchasePlanData.id && rowData.quantityRemain === rowData.quantity);
    }

    public clickTrTable(rowData: any): void {
        rowData.isShowEditRow = true;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.dataSource.treeNodes.length; i++) {
            const item = this.dataSource.treeNodes[i];
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

    public focusOutTable(): void {
        this.dataSource.treeNodes.map(item => {
            if (item.data.isShowEditRow) {
                item.data.isShowEditRow = false;
            }
            if (item.children && item.children.length > 0) {
                if (item.children.data.isShowEditRow) {
                    item.children.data.isShowEditRow = false;
                }
            }
        });
    }

    public onRowEditInit(): void {
        this.treeNodeToItemSource();
        this.getTotalAmount();
        this.form.form.markAsDirty();
        this.cdr.detectChanges();
    }

    public onChangeProductName(event: any, rowData: any): void {
        if (event) {
            rowData.producerId = event.id;
            rowData.producerName = event.acronymName;
        } else {
            rowData.producerId = null;
            rowData.producerName = null;
        }
        this.onRowEditInit();
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
            this.onRowEditInit();
        } else {
            rowData.itemId = null;
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
