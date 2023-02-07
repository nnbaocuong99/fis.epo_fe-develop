export class PurchaseInvoiceItemEntity {
    id: string;
    piId: string;
    poItemId: string;
    quantity: number | null;
    subInventory: string;
    createdBy: string;
    createdAt: Date | string | null;
    modifiedBy: string;
    modifiedAt: Date | string | null;
}
