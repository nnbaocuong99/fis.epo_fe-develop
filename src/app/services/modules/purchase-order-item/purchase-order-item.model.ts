export class PurchaseOrderItemDto {
    note: string;
    isConformity?: boolean;
    hasImportLicense?: boolean;
    deliveryLocation: string;
    guarantee?: number;
    producerName: string;
    responseDate?: Date;
    price: string;
    unit: string;
    quantity: number;
    itemType: string;
    itemName: string;
    itemCode: string;
    partNo: string;
    poId: string;
    id: string;
    expectedDate: Date;
}
