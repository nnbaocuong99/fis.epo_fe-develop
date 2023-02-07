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
import { CurrencyService } from '../../../../../../../services/modules/category/currency/currency.service';
import { ItemRequestPayload } from '../../../../../../../services/modules/category/item/item.request.payload';
import { ItemService } from '../../../../../../../services/modules/category/item/item.service';
import {
    OrganizationRequestPayload
} from '../../../../../../../services/modules/category/organization-management/organization/organization.request.payload';
import {
    OrganizationService
} from '../../../../../../../services/modules/category/organization-management/organization/organization.service';
import { ProjectRequestPayload } from '../../../../../../../services/modules/category/project/project.request.payload';
import { ProjectService } from '../../../../../../../services/modules/category/project/project.service';
import { SubInventoryService } from '../../../../../../../services/modules/category/sub-inventory/sub-inventory.service';
import { SupplierService } from '../../../../../../../services/modules/category/supplier/supplier.service';
import { TaxCodeRequestPayload } from '../../../../../../../services/modules/category/tax-code/tax-code.request.payload';
import { TaxCodeService } from '../../../../../../../services/modules/category/tax-code/tax-code.service';
import { PurchaseInvoiceItemService } from '../../../../../../../services/modules/purchase-invoice-item/purchase-invoice-item.service';
import { PurchaseOrderRequestPayload } from '../../../../../../../services/modules/purchase-order/purchase-order.request-payload';
import { PurchaseOrderService } from '../../../../../../../services/modules/purchase-order/purchase-order.service';
import { DialogRef } from '../../../../../../partials/content/crud/dialog/dialog-ref.model';
import { ConfigListFactory } from '../../../../../../partials/control/config-list/config-list-control.service';
import * as configParent from '../../purchase-invoice-edit.config';

@Component({
    selector: 'app-purchase-invoice-item-add-dialog',
    templateUrl: './purchase-invoice-item-add-dialog.component.html',
    styleUrls: ['./purchase-invoice-item-add-dialog.component.scss']
})
export class PurchaseInvoiceItemAddDialogComponent extends BaseFormComponent implements OnInit {
    @ViewChild('form', { static: true }) form: NgForm;
    @Input() dialogRef: DialogRef;
    @Output() save: EventEmitter<any> = new EventEmitter();
    public formId: 'purchase-invoice-item-add-dialog';

    public purchaseInvoiceItemsData: any = {};
    private ppIdCurrent: string;
    public mainConfig = mainConfig.MAIN_CONFIG;
    public configListDataItemOrigin: any[];
    public configListDataDelivery: any[];
    public taxPayers = configParent.TAX_PAYER;
    public itemTypes = configParent.ITEM_TYPE;
    public headerItems = configParent.HEADER_ITEMS;
    public headerProject = configParent.HEADER_PROJECT;
    public headerPo = configParent.HEADER_PO;
    public headerTaxCode = configParent.HEADER_TAX_CODE;
    public headerOrg = configParent.HEADER_ORG;
    public columnSubInventory = configParent.SUB_INVENTORY;
    public projectRequestPayload = new ProjectRequestPayload();
    public itemRequestPayload = new ItemRequestPayload();
    public purchaseOrderRequestPayload = new PurchaseOrderRequestPayload();
    public taxCodeRequestPayload = new TaxCodeRequestPayload();
    public organizationRequestPayload = new OrganizationRequestPayload();

    constructor(
        public purchaseInvoiceItemService: PurchaseInvoiceItemService,
        public notification: NotificationService,
        public cd: ChangeDetectorRef,
        public supplierService: SupplierService,
        public currencyService: CurrencyService,
        public itemService: ItemService,
        public projectService: ProjectService,
        public purchaseOrderService: PurchaseOrderService,
        public organizationService: OrganizationService,
        public taxCodeService: TaxCodeService,
        public subInventoryService: SubInventoryService,
        private route: ActivatedRoute
    ) {
        super();
    }

    ngOnInit() {
        this.configListDataItemOrigin = ConfigListFactory.instant('COUNTRY').sort((a, b) => parseFloat(a.code) - parseFloat(b.code));
        this.configListDataDelivery = ConfigListFactory.instant('TRANSPORTATION_MODE');
        const routeSub = this.route.params.subscribe((params) => {
            if (params.id) {
                this.ppIdCurrent = params.id;
                this.purchaseInvoiceItemsData.ppIdCurrent = this.ppIdCurrent;
            }
        });
        this.subscriptions.push(routeSub);
    }

    public onChangeSubInventoryCode(subInventoryDto: any) {
        if (subInventoryDto) {
            this.purchaseInvoiceItemsData.subInventory = subInventoryDto.code;
            this.purchaseInvoiceItemsData.subInventoryName = subInventoryDto.name;
        }
    }

    public onBtnSaveClick(): void {
        if (this.purchaseInvoiceItemsData) {
            this.purchaseInvoiceItemsData.taxpayer = +this.purchaseInvoiceItemsData.taxpayer;
            this.save.emit(this.purchaseInvoiceItemsData);
            this.purchaseInvoiceItemsData = {};
            this.dialogRef.hide();
        }
    }

    public onBtnCancelClick(): void {
        this.dialogRef.hide();
    }

    public onChangeItemCode(itemsCodeDto: any) {
        if (itemsCodeDto) {
            this.purchaseInvoiceItemsData.itemId = itemsCodeDto.itemId;
            this.purchaseInvoiceItemsData.itemCode = itemsCodeDto.code;
            this.purchaseInvoiceItemsData.itemName = itemsCodeDto.name;
            this.purchaseInvoiceItemsData.unit = itemsCodeDto.unitCode;
            if (itemsCodeDto.inventoryItemFlag === 'Y') {
                this.purchaseInvoiceItemsData.itemType = 'HW';
            }
        }
    }

    public onChangePoCode(poDto: any): void {
        if (poDto) {
            this.purchaseInvoiceItemsData.code = poDto.code;
            this.purchaseInvoiceItemsData.poId = poDto.id;
            this.purchaseInvoiceItemsData.projectCodeDto = {
                code: poDto.projectCode
            };
            this.purchaseInvoiceItemsData.delivery = poDto.delivery;
            this.purchaseInvoiceItemsData.taxpayer = poDto.taxpayer;
            this.purchaseInvoiceItemsData.orgCodeDto = {
                code: poDto.orgCode
            };
        }
    }

    public onChangePrice(event: any): void {
        if (event && event < 0) {
            this.purchaseInvoiceItemsData.price = 0;
        }
    }

    public onChangeAmount(event: any): void {
        if (event && event < 0) {
            this.purchaseInvoiceItemsData.amount = 0;
        }
    }
}
