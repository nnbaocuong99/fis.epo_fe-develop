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
import { BaseFormComponent } from '../../../../../../core/_base/component/base-form.component';
import * as mainConfig from '../../../../../../core/_config/main.config';
import { SaveConfirmation } from '../../../../../../services/common/confirmation';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { BrandService } from '../../../../../../services/modules/category/brand/brand.service';
import { CurrencyService } from '../../../../../../services/modules/category/currency/currency.service';
import { ItemRequestPayload } from '../../../../../../services/modules/category/item/item.request.payload';
import { ItemService } from '../../../../../../services/modules/category/item/item.service';
import { SupplierRequestPayload } from '../../../../../../services/modules/category/supplier/supplier.request.payload';
import { SupplierService } from '../../../../../../services/modules/category/supplier/supplier.service';
import { ConfigListService } from '../../../../../../services/modules/config-list/config-list.service';
import { PurchasePlanItemService } from '../../../../../../services/modules/purchase-plan-item/purchase-plan-item.service';
import { PurchasePlanService } from '../../../../../../services/modules/purchase-plan/purchase-plan.service';
import { PurchaseRequestItemService } from '../../../../../../services/modules/purchase-request-item/purchase-request-item.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import { ConfigListFactory } from '../../../../../partials/control/config-list/config-list-control.service';
import * as configPurchasePlanEdit from '../../../purchase-plan/purchase-plan-edit/purchase-plan-edit.config';

@Component({
    selector: 'app-purchase-request-item-update-dialog',
    templateUrl: './purchase-request-item-update-dialog.component.html',
    styleUrls: ['./purchase-request-item-update-dialog.component.scss'],
})
export class PurchaseRequestItemUpdateDialogComponent extends BaseFormComponent implements OnInit {
    @ViewChild('form', { static: true }) form: NgForm;
    @Input() dialogRef: DialogRef;
    @Input() allowViewPrice = false;
    @Input() canEditOtherInformation = false;

    @Output() success: EventEmitter<any> = new EventEmitter();

    public formId: 'purchase-plan-item-dialog';
    public itemRequestPayload = new ItemRequestPayload();
    public supplierRequestPayload = new SupplierRequestPayload();
    public headerSuppliers = configPurchasePlanEdit.HEADER_SUPPLIER;
    public headerItems = configPurchasePlanEdit.HEADER_ITEMS;
    public itemTypes = configPurchasePlanEdit.ITEM_TYPE;
    public units = configPurchasePlanEdit.UNITS;
    public ppIdCurrent: string;
    public mainConfig = mainConfig.MAIN_CONFIG;
    public itemSrv: any = {};

    constructor(
        public purchaseRequestItemService: PurchaseRequestItemService,
        public notification: NotificationService,
        public cd: ChangeDetectorRef,
        public supplierService: SupplierService,
        public currencyService: CurrencyService,
        public itemService: ItemService,
        private route: ActivatedRoute,
        public brandService: BrandService,
        public configListService: ConfigListService,
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
        if (!this.dialogRef.input.rowData.id) {
            this.dialogRef.input.rowData.ppId = this.dialogRef.input.rowNode.node.data.ppId;
        } else {
            this.dialogRef.input.rowData.ppId = this.ppIdCurrent;
        }
        const saveConfirmation = new SaveConfirmation();
        saveConfirmation.accept = () => {
            this.purchaseRequestItemService
                .merge(this.dialogRef.input.rowData)
                .subscribe(() => {
                    this.notification.showSuccess();
                    this.dialogRef.hide();
                    this.success.emit(this.dialogRef.input.rowNode);
                    this.cd.detectChanges();
                });
        };
        this.notification.confirm(saveConfirmation);

    }

    public onBtnCancelClick(): void {
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

    public onChangeExpectedPrice(event: any): void {
        if (event && event < 0) {
            this.dialogRef.input.rowData.expectedPrice = 0;
        }
    }

    public onChangePriceBP(event: any): void {
        if (event) {
            if (event < 0) {
                this.dialogRef.input.rowData.priceBp = 0;
                this.dialogRef.input.rowData.amount = null;
            } else {
                this.dialogRef.input.rowData.priceBp = event;
                this.dialogRef.input.rowData.amount = this.dialogRef.input.rowData.priceBp * this.dialogRef.input.rowData.quantity;
            }
        }
    }

    public onChangeProductName(producerNameDto: any): void {
        if (producerNameDto) {
            this.dialogRef.input.rowData.producerId = producerNameDto.id;
            this.dialogRef.input.rowData.producerName = producerNameDto.acronymName;
        }
    }

    public onChangeExchangeRate(exchangeRateDto: any, rowData: any): void {
        if (exchangeRateDto) {
            rowData.exchangeRateType = exchangeRateDto.type;
            rowData.exchangeRateDate = exchangeRateDto.date;
            rowData.conversionRate = exchangeRateDto.conversionRate;
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
