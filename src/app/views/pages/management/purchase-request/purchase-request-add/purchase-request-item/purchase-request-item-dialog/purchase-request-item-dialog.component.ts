import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../../../core/_base/component/base-form.component';
import * as mainConfig from '../../../../../../../core/_config/main.config';
import { NotificationService } from '../../../../../../../services/common/notification/notification.service';
import { BrandService } from '../../../../../../../services/modules/category/brand/brand.service';
import { CurrencyService } from '../../../../../../../services/modules/category/currency/currency.service';
import { ItemRequestPayload } from '../../../../../../../services/modules/category/item/item.request.payload';
import { ItemService } from '../../../../../../../services/modules/category/item/item.service';
import { SupplierRequestPayload } from '../../../../../../../services/modules/category/supplier/supplier.request.payload';
import { SupplierService } from '../../../../../../../services/modules/category/supplier/supplier.service';
import { ConfigListService } from '../../../../../../../services/modules/config-list/config-list.service';
import { PurchasePlanItemService } from '../../../../../../../services/modules/purchase-plan-item/purchase-plan-item.service';
import { PurchasePlanService } from '../../../../../../../services/modules/purchase-plan/purchase-plan.service';
import { DialogRef } from '../../../../../../partials/content/crud/dialog/dialog-ref.model';
import { ConfigListFactory } from '../../../../../../partials/control/config-list/config-list-control.service';
import * as config from '../../purchase-request-add.config';

@Component({
    selector: 'app-purchase-request-item-dialog',
    templateUrl: './purchase-request-item-dialog.component.html',
    styleUrls: ['./purchase-request-item-dialog.component.scss'],
})
export class PurchaseRequestItemDialogComponent extends BaseFormComponent implements OnInit {
    @ViewChild('form', { static: true }) form: NgForm;
    @Input() dialogRef: DialogRef;
    @Input() allowViewPrice = false;

    @Output() success: EventEmitter<any> = new EventEmitter();

    public formId: 'purchase-plan-item-dialog';
    public itemRequestPayload = new ItemRequestPayload();
    public supplierRequestPayload = new SupplierRequestPayload();
    public headerSuppliers = config.HEADER_SUPPLIER;
    public headerItems = config.HEADER_ITEMS;
    public itemTypes = config.ITEM_TYPE;
    public units = config.UNITS;
    public ppIdCurrent: string;
    public mainConfig = mainConfig.MAIN_CONFIG;
    public itemSrv: any = {};

    constructor(
        public notification: NotificationService,
        public cd: ChangeDetectorRef,
        public supplierService: SupplierService,
        public currencyService: CurrencyService,
        public itemService: ItemService,
        public configListService: ConfigListService,
        private route: ActivatedRoute,
        public brandService: BrandService,
        public purchasePlanService: PurchasePlanService,
        public purchasePlanItemService: PurchasePlanItemService
    ) {
        super();
    }

    ngOnInit() {
        if (!this.dialogRef.input.rowData) {
            this.dialogRef.input.rowData = {};
        }
        const routeSub = this.route.params.subscribe((params) => {
            if (params.id) {
                this.ppIdCurrent = params.id;
            }
        });
        this.subscriptions.push(routeSub);
        this.getDefaultConfig();
    }

    // Get default config
    public getDefaultConfig(): void {
        const requestItemSrv: any = { type: 'ITEM' };
        const temp = this.configListService.select(requestItemSrv).subscribe(res => {
            this.itemSrv = res[0];
            this.cd.detectChanges();
        });
        this.subscriptions.push(temp);
    }

    public onBtnSaveClick(): void {
        this.success.emit(this.dialogRef.input.rowData);
        this.dialogRef.hide();
        this.cd.detectChanges();
    }

    public onBtnCancelClick(): void {
        this.dialogRef.hide();
        this.success.emit();
    }

    public onChangeItemCode(data: any) {
        if (data) {
            this.dialogRef.input.rowData.itemId = data.itemId;
            this.dialogRef.input.rowData.itemCode = data.code;
            if (data.name) {
                this.dialogRef.input.rowData.itemName = data.name;
            }
            if (data.unitName) {
                this.dialogRef.input.rowData.unit = data.unitCode;
            }
            if (data.inventoryItemFlag === 'Y') {
                this.dialogRef.input.rowData.itemType = 'HW';
            }
        } else {
            this.dialogRef.input.rowData.itemId = null;
        }
    }

    public onChangeSupplier(supplierDto: any): void {
        if (supplierDto) {
            this.dialogRef.input.rowData.vendorId = supplierDto.vendorId;
            this.dialogRef.input.rowData.supplierName = supplierDto.name;
        }
    }

    public onChangeExpectedPrice(expectedPrice: number): void {
        if (expectedPrice && expectedPrice < 0) {
            this.dialogRef.input.rowData.expectedPrice = 0;
        }
    }

    public onChangeProductName(producerNameDto: any): void {
        if (producerNameDto) {
            this.dialogRef.input.rowData.producerId = producerNameDto.id;
            this.dialogRef.input.rowData.producerName = producerNameDto.acronymName;
        }
    }

    public ongChangeIsUpdateSrv(event: any): void {
        if (event) {
            this.dialogRef.input.rowData.isUpdateSrv = event.checked ? 1 : 0;
            if (event.checked) {
                this.dialogRef.input.rowData.itemCode = this.itemSrv.code;
                // this.dialogRef.input.rowData.itemName = this.itemSrv.name;
                this.dialogRef.input.rowData.unit = this.itemSrv.attr1;
                this.dialogRef.input.rowData.itemCodeDto = {
                    code: this.dialogRef.input.rowData.itemCode
                };
            }
        }
    }
}
