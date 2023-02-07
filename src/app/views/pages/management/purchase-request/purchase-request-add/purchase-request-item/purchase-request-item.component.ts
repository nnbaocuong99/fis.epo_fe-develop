import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import { forkJoin } from 'rxjs';
import { BaseComponent } from '../../../../../../core/_base/component/base-component';
import { PurchaseRequestItemService } from '../../../../../../services/modules/purchase-request-item/purchase-request-item.service';
import * as config from '../purchase-request-add.config';
import * as mainConfig from '../../../../../../core/_config/main.config';
import { MessageService, TreeNode } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { PurchasePlanItemService } from '../../../../../../services/modules/purchase-plan-item/purchase-plan-item.service';
import { PurchasePlanItemRequestPayload } from '../../../../../../services/modules/purchase-plan-item/purchase-plan-item.request-payload';
import { HttpService } from '../../../../../../services/common';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import { ConfigListFactory } from '../../../../../partials/control/config-list/config-list-control.service';
import { NgForm } from '@angular/forms';
import { BrandRequestPayload } from '../../../../../../services/modules/category/brand/brand.request.payload';
import { BrandService } from '../../../../../../services/modules/category/brand/brand.service';
import { SupplierRequestPayload } from '../../../../../../services/modules/category/supplier/supplier.request.payload';
import { SupplierService } from '../../../../../../services/modules/category/supplier/supplier.service';
import { ConfigListService } from '../../../../../../services/modules/config-list/config-list.service';
@Component({
    selector: 'app-purchase-request-item',
    templateUrl: './purchase-request-item.component.html',
    styleUrls: ['./purchase-request-item.component.scss'],
    providers: [DialogService, MessageService],
})
export class PurchaseRequestItemComponent extends BaseComponent implements OnInit {
    @ViewChild('form', { static: true }) form: NgForm;
    @Input() selectedPurchasePlan: any;
    @Input() purchaseRequestData: any = {};
    @Input() isNotShowTableCheckbox: boolean;
    @Input() isShowTableItem = false;
    @Input() allowViewPrice = false;

    @Output() sendData = new EventEmitter<any>(true);

    public dialogRefUpdateItems: DialogRef = new DialogRef();
    public supplierRequestPayload = new SupplierRequestPayload();
    public selectedPurchasePlanItems: any = [];
    public selectedPurchasePlanItemsRes: any = [];
    public cols: any;
    public mainConfig: any;
    public request: any = {};
    public dataSource = {
        items: null,
        paginatorTotal: undefined,
    };
    public headerSuppliers = config.HEADER_SUPPLIER;
    public generalService: HttpService<any>;
    public isShowCheckBoxHeader = true;
    public isShowDialogUpdateItem = false;
    public producerNameData: any[];
    public frozenCols: any[];
    public currentRow: any = {};
    public isShowControl = false;
    public itemSrv: any = {};

    constructor(
        public purchaseRequestItemService: PurchaseRequestItemService,
        public purchasePlanItemService: PurchasePlanItemService,
        private cdr: ChangeDetectorRef,
        public supplierService: SupplierService,
        public configListService: ConfigListService,
        public brandService: BrandService,
        public dialogService: DialogService
    ) {
        super();
    }

    ngOnInit() {
        // Xử lý frozenCols table
        const temp = JSON.stringify(config.HEADER);
        this.cols = JSON.parse(temp);
        this.frozenCols = this.cols.slice(0, 5);
        this.cols.splice(0, 5);

        this.mainConfig = mainConfig.MAIN_CONFIG;
        this.request = new PurchasePlanItemRequestPayload();
        this.getBrand();
        if (document.domain === 'localhost' || document.domain === 'uat-fisepo.paas.xplat.fpt.com.vn') {
            this.isShowControl = true;
        }
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

    public loadNodes(event?: any): void {
        this.dataSource.items = [];
        if (!event) {
            this.dataSource.items = [...this.dataSource.items];
            this.cdr.detectChanges();
        }
        if (this.purchaseRequestData.id) {
            this.generalService = this.purchaseRequestItemService;
            this.request.prId = this.purchaseRequestData.id;
            this.request.ppId = null;
        } else {
            this.generalService = this.purchasePlanItemService;
            this.request.ppId = this.selectedPurchasePlan.id;
            this.request.prId = null;
        }
        this.request.isSubItem = null;
        this.request.subIndexNo = null;

        const purchasePlanItemSub = forkJoin([
            this.generalService.select(this.request),
            this.generalService.count(this.request)
        ]).subscribe(res => {
            this.dataSource.paginatorTotal = res[1];
            if (res[0].length > 0) {
                const response = res[0].sort((a, b) => parseFloat(a.indexNo) - parseFloat(b.indexNo));
                const parentItems = response.filter(x => !x.isSubItem);
                for (const parent of parentItems) {
                    const node: TreeNode = {
                        data: { ...parent },
                        children: [],
                        leaf: true,
                        expanded: true
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
                this.selectedPurchasePlanItems = this.dataSource.items.filter(x => x.data.status === 0);

                if (this.selectedPurchasePlanItemsRes) {
                    this.selectedPurchasePlanItems = [];
                    this.selectedPurchasePlanItemsRes.forEach(element => {
                        this.dataSource.items.forEach(e => {
                            if (e.data.id === element.data.id) {
                                e.children = (element.children && element.children.length > 0) ? [...element.children] : [];
                                this.selectedPurchasePlanItems.push({ ...e });
                            }
                        });
                    });
                } else {
                    // Check ẩn checkbox header table nếu có item đã được chọn.(pp trạng thái đang thực hiện)
                    if (this.selectedPurchasePlan && this.selectedPurchasePlan.status === 1) {
                        this.isShowCheckBoxHeader = false;
                    }
                }
            }
            this.dataSource.items = [...this.dataSource.items];
            this.dataSource.items.forEach(element => {
                element.data.quantityOrigin = element.data.quantity;
                element.data.currencyOrigin = element.data.currency;
                element.data.expectedDateOrigin = element.data.expectedDate;
                element.data.guaranteeOrigin = element.data.guarantee;
                element.data.deliveryLocationOrigin = element.data.deliveryLocation;
                element.children.forEach(e => {
                    element.data.quantityOrigin = element.data.quantity;
                    e.data.currencyOrigin = e.data.currency;
                    e.data.expectedDateOrigin = e.data.expectedDate;
                    e.data.guaranteeOrigin = e.data.guarantee;
                    e.data.deliveryLocationOrigin = element.data.deliveryLocation;
                });
            });
            this.cdr.detectChanges();
        });
        this.subscriptions.push(purchasePlanItemSub);
    }

    private quote(source: string): string {
        return `.${source}.`;
    }

    public sendDataToParent(): void {
        this.sendData.emit(this.selectedPurchasePlanItems);
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

            const params = {
                id: objRowData.id,
                rowData: objRowData,
                rowNode
            };
            this.isShowDialogUpdateItem = true;
            this.dialogRefUpdateItems.input = params;
            this.dialogRefUpdateItems.config.style = { width: '60%' };
            this.dialogRefUpdateItems.show();
            this.cdr.detectChanges();
        } else {
            this.isShowDialogUpdateItem = true;
            this.dialogRefUpdateItems.input = {};
            this.dialogRefUpdateItems.show();
        }
    }

    public onSuccess(rowData: any): any {
        const strRowData = JSON.stringify(rowData);
        const objRowData = JSON.parse(strRowData);
        if (rowData.isSubItem) {
            this.dataSource.items.map(x => {
                if (x.children && x.children.length > 0) {
                    const index = x.children.findIndex(chil => chil.data.id === rowData.id);
                    if (index > -1) {
                        x.children[index].data = objRowData;
                    }
                }
            });
        } else {
            this.dataSource.items.map(x => {
                if (x.data.id === rowData.id) {
                    x.data = objRowData;
                }
            });
        }
        this.dataSource.items = [...this.dataSource.items];
        this.cdr.detectChanges();
    }

    public onRowEditClick(rowData): void {
        if (this.currentRow) {
            if (this.currentRow.indexNo !== rowData.indexNo) {
                // check parent
                if (this.dataSource.items.find(x => x.data.indexNo === this.currentRow.indexNo)) {
                    this.dataSource.items.find(x => x.data.indexNo === this.currentRow.indexNo).data.isShow = false;
                } else {
                    // check children
                    this.dataSource.items.find(x => {
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

    public onChangeProductName(event: any, rowData: any): void {
        if (event) {
            rowData.producerId = event.id;
            rowData.producerName = event.acronymName;
        } else {
            rowData.producerId = null;
            rowData.producerName = null;
        }
    }

    public onChangeExpectedPrice(rowData: any): void {
        if (rowData.expectedPrice && rowData.expectedPrice < 0) {
            rowData.expectedPrice = 0;
        }
    }

    public onChangeSupplier(supplierNameDto: any, rowData: any) {
        if (supplierNameDto && rowData) {
            rowData.vendorId = supplierNameDto.vendorId;
            rowData.supplierName = supplierNameDto.name;
        }
    }

    public ongChangeIsUpdateSrv(rowData: any, event: any): void {
        rowData.isUpdateSrv = event.checked ? 1 : 0;
        if (event.checked) {
            rowData.itemCode = this.itemSrv.code;
            // rowData.itemName = this.itemSrv.name;
            rowData.unit = this.itemSrv.attr1;
            // rowData.note = rowData.itemNameOrigin;
        }
    }
}

