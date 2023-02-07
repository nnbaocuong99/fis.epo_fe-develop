import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
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
import { PurchasePlanDto } from '../../../../../../../services/modules/purchase-plan/purchase-plan.model';
import { DialogRef } from '../../../../../../partials/content/crud/dialog/dialog-ref.model';
import { ConfigListFactory } from '../../../../../../partials/control/config-list/config-list-control.service';
import * as config from '../../purchase-plan-edit.config';

@Component({
    selector: 'app-purchase-plan-item-dialog',
    templateUrl: './purchase-plan-item-dialog.component.html',
    styleUrls: ['./purchase-plan-item-dialog.component.scss'],
})
export class PurchasePlanItemDialogComponent extends BaseFormComponent implements OnInit {
    @ViewChild('form', { static: true }) form: NgForm;
    @Input() dialogRef: DialogRef;
    @Input() allowViewPrice = false;
    @Output() save: EventEmitter<any> = new EventEmitter();

    public formId: 'purchase-plan-item-dialog';
    public itemRequestPayload = new ItemRequestPayload();
    public supplierRequestPayload = new SupplierRequestPayload();
    public headerSuppliers = config.HEADER_SUPPLIER;
    public headerItems = config.HEADER_ITEMS;
    public itemTypes = config.ITEM_TYPE;
    public units = config.UNITS;
    private ppIdCurrent: string;
    public mainConfig = mainConfig.MAIN_CONFIG;
    public itemSrv: any = {};

    constructor(
        public purchasePlanItemService: PurchasePlanItemService,
        public notification: NotificationService,
        public cd: ChangeDetectorRef,
        public supplierService: SupplierService,
        public currencyService: CurrencyService,
        public itemService: ItemService,
        public configListService: ConfigListService,
        public brandService: BrandService,
        private route: ActivatedRoute
    ) {
        super();
    }

    ngOnInit() {
        // this.dialogRef.input.rowEditing = new PurchasePlanItemDto();
        setTimeout(() => {
            this.dialogRef.input.rowEditing = new PurchasePlanDto(this.dialogRef.input.rowEditing);
        }, 0);
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
        if (this.dialogRef.input.rowEditing.indexNo.toString().includes('.')) {
            this.dialogRef.input.rowEditing.isSubItem = true;
        } else {
            this.dialogRef.input.rowEditing.isSubItem = false;
        }

        this.save.emit();
        this.dialogRef.input.rowEditing = {};
        this.dialogRef.input.isAdd = undefined;
        this.dialogRef.hide();
    }

    public onBtnCancelClick(): void {
        this.dialogRef.hide();
    }

    public onChangeItemCode(itemsCodeDto: any): void {
        if (itemsCodeDto && itemsCodeDto.itemId) {
            if (itemsCodeDto.itemId) {
                this.dialogRef.input.rowEditing.itemId = itemsCodeDto.itemId;
            }
            if (itemsCodeDto.code) {
                this.dialogRef.input.rowEditing.itemCode = itemsCodeDto.code;
            }
            if (itemsCodeDto.name) {
                this.dialogRef.input.rowEditing.itemName = itemsCodeDto.name;
            }
            if (itemsCodeDto.unitName) {
                this.dialogRef.input.rowEditing.unit = itemsCodeDto.unitCode;
            }
            if (itemsCodeDto.inventoryItemFlag === 'Y') {
                this.dialogRef.input.rowEditing.itemType = 'HW';
            }
        } else {
            this.dialogRef.input.rowEditing.itemId = null; // bắt điều kiện bên html
        }
    }

    public onChangeSupplier(supplierDto: any): void {
        if (supplierDto) {
            this.dialogRef.input.rowEditing.vendorId = supplierDto.vendorId;
            this.dialogRef.input.rowEditing.supplierName = supplierDto.name;
        }
    }

    public onChangeProductName(producerNameDto: any): void {
        if (producerNameDto) {
            this.dialogRef.input.rowEditing.producerId = producerNameDto.id;
            this.dialogRef.input.rowEditing.producerName = producerNameDto.acronymName;
        }
    }

    public onChangeIndexNo(indexNo: any): void {
        if (this.dialogRef.input.rowEditing && this.dialogRef.input.rowEditing.isSubItem === true) {
            this.dialogRef.input.rowEditing.indexNo = this.dialogRef.input.rowEditing.parentIndexNo + '.' + indexNo;
        }
    }

    public onChangeExpectedPrice(expectedPrice: number): void {
        if (expectedPrice && expectedPrice < 0) {
            this.dialogRef.input.rowEditing.expectedPrice = 0;
        }
    }

    public ongChangeIsUpdateSrv(event: any): void {
        if (event) {
            this.dialogRef.input.rowEditing.isUpdateSrv = event.checked ? 1 : 0;
            if (event.checked) {
                this.dialogRef.input.rowEditing.itemCode = this.itemSrv.code;
                // this.dialogRef.input.rowData.itemName = this.itemSrv.name;
                this.dialogRef.input.rowEditing.unit = this.itemSrv.attr1;
                this.dialogRef.input.rowEditing.itemCodeDto = {
                    code: this.dialogRef.input.rowEditing.itemCode
                };
            }
        }
    }
}
