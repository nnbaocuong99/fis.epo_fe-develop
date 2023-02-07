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
import { SaveConfirmation } from '../../../../../../../services/common/confirmation';
import { NotificationService } from '../../../../../../../services/common/notification/notification.service';
import { BrandService } from '../../../../../../../services/modules/category/brand/brand.service';
import { CurrencyService } from '../../../../../../../services/modules/category/currency/currency.service';
import { ItemRequestPayload } from '../../../../../../../services/modules/category/item/item.request.payload';
import { ItemService } from '../../../../../../../services/modules/category/item/item.service';
import { SupplierService } from '../../../../../../../services/modules/category/supplier/supplier.service';
import { TaxCodeRequestPayload } from '../../../../../../../services/modules/category/tax-code/tax-code.request.payload';
import { TaxCodeService } from '../../../../../../../services/modules/category/tax-code/tax-code.service';
import { NotificationListService } from '../../../../../../../services/modules/notification-list/notification-list.service';
import { PurchaseOrderItemService } from '../../../../../../../services/modules/purchase-order-item/purchase-order-item.service';
import { DialogRef } from '../../../../../../partials/content/crud/dialog/dialog-ref.model';
import { ConfigListFactory } from '../../../../../../partials/control/config-list/config-list-control.service';
import * as config from '../purchase-order-item.config';

@Component({
    selector: 'app-purchase-order-item-edit',
    templateUrl: './purchase-order-item-edit.component.html',
    styleUrls: ['./purchase-order-item-edit.component.scss']
})
export class PurchaseOrderItemEditComponent extends BaseFormComponent implements OnInit {
    @ViewChild('form', { static: true }) form: NgForm;
    @Input() dialogRef: DialogRef;
    @Input() viewFromAppendix = false;
    @Input() purchaseOrderData: any;
    @Input() taxCodeData: any = [];
    @Output() success: EventEmitter<any> = new EventEmitter();
    @Output() changeResponseDate: EventEmitter<any> = new EventEmitter();

    public itemRequestPayload = new ItemRequestPayload();
    public taxCodeRequestPayload = new TaxCodeRequestPayload();
    public formId: 'purchase-order-item-edit';
    public itemTypes = config.ITEM_TYPE;
    public headerItems = config.HEADER_ITEMS;
    public mainConfig = mainConfig.MAIN_CONFIG;
    public headerTaxCode = config.HEADER_TAX_CODE;
    // public isInternal = true;
    public configListDataItemOrigin: any[];
    public itemSrv: any = {};
    public notificationData: any = {};
    private currentPoId: string;

    constructor(
        public purchaseOrderItemService: PurchaseOrderItemService,
        public notification: NotificationService,
        public cd: ChangeDetectorRef,
        public supplierService: SupplierService,
        public currencyService: CurrencyService,
        public taxCodeService: TaxCodeService,
        public notificationListService: NotificationListService,
        public itemService: ItemService,
        public brandService: BrandService,
        private route: ActivatedRoute
    ) {
        super();
    }
    ngOnInit() {
        const routeSub = this.route.params.subscribe(params => {
            if (params.id) {
                this.currentPoId = params.id;
            }
        });
        if (!this.dialogRef.input.rowData) {
            this.dialogRef.input.rowData = {};
            // Default loại hàng hoá là HW
            this.dialogRef.input.rowData.itemType = 'HW';
        }
        this.configListDataItemOrigin = ConfigListFactory.instant('COUNTRY').sort((a, b) => parseFloat(a.code) - parseFloat(b.code));
        this.itemSrv = ConfigListFactory.instant('ITEM')[0];
        // if (!this.dialogRef.input.isInternal) {
        //     this.isInternal = false;
        // }

        setTimeout(() => {
            this.iniDataDto(this.dialogRef.input.rowData);
        }, 0);
    }

    public iniDataDto(source: any): void {
        this.dialogRef.input.rowData.itemCodeDto = this.toDto('code', source.itemCode);
        this.dialogRef.input.rowData.taxDto = this.toDto('name', source.tax);
        this.dialogRef.input.rowData.producerNameDto = this.toDto('name', source.producerName);
    }

    public rounding(value: number): number {
        return (Math.round(value * 100) / 100);
    }

    public onBtnSaveClick(): void {
        if (this.dialogRef.input.updateType === 1) {
            this.validateBtnSave();

            // validate giá trị khi hợp nhất
            if (this.dialogRef.input.rowData.isMatch) {
                let amountSelectedPri = 0;
                if (this.dialogRef.input.selectedPurchaseOrderitems.length > 0) {
                    for (const item of this.dialogRef.input.selectedPurchaseOrderitems) {
                        amountSelectedPri += +(item.data.quantity * item.data.price).toFixed(2);
                    }
                }

                const amountSelectedPoi = this.rounding(this.dialogRef.input.rowData.quantity * this.dialogRef.input.rowData.price);
                if (amountSelectedPri !== amountSelectedPoi) {
                    this.notification.showWarning('Giá trị item không khớp với các item đã chọn');
                    return;
                }
            }

            this.dialogRef.input.rowData.itemNameOrigin = this.dialogRef.input.rowData.itemName;
            this.dialogRef.input.rowData.unitOrigin = this.dialogRef.input.rowData.unit;
            // Trường hợp thêm mới không có quantityRemain thì set bằng quantity
            if (this.dialogRef.input.rowData.quantityRemain === null || this.dialogRef.input.rowData.quantityRemain === undefined) {
                this.dialogRef.input.rowData.quantityRemain = this.dialogRef.input.rowData.quantity;
            }

            if (!this.dialogRef.input.rowData.indexNo.toString().includes('.') || this.dialogRef.input.rowData.isMatch) {
                this.dialogRef.input.rowData.isSubItem = false;
            } else {
                this.dialogRef.input.rowData.isSubItem = true;
            }
            if (this.viewFromAppendix) {
                this.success.emit(this.dialogRef.input.rowData);
                this.dialogRef.hide();
            } else {
                if (this.currentPoId && !this.dialogRef.input.rowData.isMatch) {
                    // không thực hiện match tại form edit
                    const saveConfirmation = new SaveConfirmation();
                    saveConfirmation.accept = () => this.performSave();
                    this.notification.confirm(saveConfirmation);
                } else {
                    this.dialogRef.hide();
                    this.success.emit(this.dialogRef.input.rowData);
                    this.cd.detectChanges();
                }
            }
        } else if (this.dialogRef.input.updateType === 2) {
            // Perform update item processing status
            const saveConfirmation = new SaveConfirmation();
            saveConfirmation.accept = () => this.updateProcessStatus();
            this.notification.confirm(saveConfirmation);
        }
    }

    private validateBtnSave(): void {
        const responseDate = new Date(this.dialogRef.input.rowData.responseDate);
        const expectedDate = new Date(this.dialogRef.input.rowData.expectedDate);

        const temp = new Date(new Date(this.dialogRef.input.rowData.expectedDate)
            .setDate(new Date(this.dialogRef.input.rowData.expectedDate).getDate() - 5));

        // validate ngày dự kiến hàng về
        if (responseDate && temp && temp > responseDate) {
            this.notification.showWarning('VALIDATION.MSGRESPONSEDATEERROR');
        }

        if (responseDate && expectedDate && responseDate > expectedDate) {
            this.notification.showWarning('Ngày dự kiến hàng về lớn hơn ngày yêu cầu giao hàng');
        }
    }

    private performSave(): void {
        this.purchaseOrderItemService.merge(this.dialogRef.input.rowData).subscribe(res => {
            if (res) {
                res.responseDateOriginal = res.responseDate;
                this.dialogRef.input.rowData = res;
                this.dialogRef.hide();
                this.notification.showSuccess();
                this.success.emit(this.dialogRef.input.rowData);
                this.cd.detectChanges();
            }
        });
    }

    private updateProcessStatus(): void {
        this.purchaseOrderItemService.updateProcessStatus(this.dialogRef.input.rowData).subscribe(res => {
            if (res) {
                this.dialogRef.input.rowData = res;
                this.dialogRef.hide();
                this.notification.showSuccess();
                this.defaultInfoSaveNotification(this.dialogRef.input.rowData);
                this.success.emit(this.dialogRef.input.rowData);
                this.cd.detectChanges();
            }
        });
    }

    public defaultInfoSaveNotification(rowData: any): void {
        this.notificationData.status = 1;
        this.notificationData.module = 'purchase-order';
        const po = { id: rowData.poId, code: 'Số Po : ' + this.purchaseOrderData ? this.purchaseOrderData.code : '' };
        this.notificationData.messageContent = JSON.stringify(po);
        this.notificationData.description = 'Purchase-order:  Cập nhật tiến độ hàng';
        // Thông báo đến AF, XNK, AM, PM
        // tslint:disable-next-line:max-line-length
        this.notificationData.role = 'BP_STAFF;BP_MANAGER;XNK_DEPUTY_DOC;XNK_STAFF_DOC;XNK_DEPUTY_DECLARE;XNK_MANAGER;XNK_STAFF_DECLARE;AM;PM';

        const saveSub = this.notificationListService.merge(this.notificationData).subscribe(() => { });
        this.subscriptions.push(saveSub);
    }

    public onBtnCancelClick(): void {
        this.dialogRef.hide();
        // this.success.emit();
    }

    public onChangeItemCode(itemCodeDto: any): void {
        if (itemCodeDto && itemCodeDto.itemId) {
            this.dialogRef.input.rowData.itemId = itemCodeDto.itemId;
            this.dialogRef.input.rowData.itemCode = itemCodeDto.code;
            if (itemCodeDto.name) {
                this.dialogRef.input.rowData.itemName = itemCodeDto.name;
            }
            if (itemCodeDto.unitCode) {
                this.dialogRef.input.rowData.unit = itemCodeDto.unitCode;
            }
            if (itemCodeDto.inventoryItemFlag === 'Y') {
                this.dialogRef.input.rowData.itemType = 'HW';
            }
        } else {
            this.dialogRef.input.rowData.itemId = null; // bắt điều kiện bên html
        }
    }
    public onChangeTaxCode(event: any): void {
        if (event.name) {
            this.dialogRef.input.rowData.tax = event.name;
            this.dialogRef.input.rowData.taxDto = {
                name: this.dialogRef.input.rowData.tax
            };
        } else {
            this.dialogRef.input.rowData.tax = null;
            this.dialogRef.input.rowData.taxDto = null;
        }
        this.calculateAmount(this.dialogRef.input.rowData);
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

    public onChangePrice(price: number): void {
        if (price && price < 0) {
            this.dialogRef.input.rowData.price = 0;
            this.calculateAmount(this.dialogRef.input.rowData);
        }
    }

    public onChangeQuantity(rowData): void {
        rowData.quantityRemain = rowData.quantityRemain - (rowData.quantityOrigin - rowData.quantity);
        this.calculateAmount(rowData);
    }

    public onChangeProductName(producerNameDto: any): void {
        if (producerNameDto) {
            this.dialogRef.input.rowData.producerName = producerNameDto.acronymName;
            this.dialogRef.input.rowData.producerId = producerNameDto.id;
        }
    }

}
