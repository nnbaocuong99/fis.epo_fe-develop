export const HEADERS = [
    { width: '50px', header: 'COMMON.NO' },
    { width: '100px', header: 'PURCHASE_INVOICE.INVOICE_TYPE' },
    { width: '100px', header: 'PURCHASE_INVOICE.COST_TYPE' },
    { width: '100px', header: 'PURCHASE_INVOICE.INVOICE_NUMBER' },
    { width: '100px', header: 'PURCHASE_INVOICE.INVOICE_DATE' },
    // { width: '100px', header: 'PURCHASE_INVOICE.TERMS_PAYMENT' },
    // { width: '100px', header: 'PURCHASE_INVOICE.DUE_DATE' },
    { width: '100px', header: 'PURCHASE_INVOICE.INVOICE_VAULE' },
    { width: '100px', header: 'PURCHASE_INVOICE.ACTUAL_INVOICE_VALUE' },
    { width: '100px', header: 'PURCHASE_INVOICE.INVOICE_INTERPRETATION' },
    { width: '100px', header: 'PURCHASE_INVOICE.INVOICE_STATUS' },
    { width: '100px', header: 'PURCHASE_INVOICE.ERP_SYNC_STATUS' },
    { width: '100px', header: 'PURCHASE_INVOICE.SUPPLIER' },
    { width: '100px', header: 'PURCHASE_INVOICE.WAYBILL_NUMBER' },
    { width: '100px', header: 'PURCHASE_INVOICE.PO_CONTRACT_NUMBER' },
    // { width: '100px', header: 'PURCHASE_INVOICE.PAYMENT_SUGGESTIONS_DATE' },
    // { width: '100px', header: 'PURCHASE_INVOICE.ACTUAL_PAYMENT_DATE' }
];

export const STATUS_INVOICE = [
    { value: 1, label: 'Đã hủy' },
    { value: 2, label: 'Đang mở' },
    { value: 3, label: 'Chờ thanh toán' },
    { value: 4, label: 'Đang thanh toán' },
    { value: 5, label: 'Đã thanh toán' },
    { value: 9, label: 'Lưu nháp' }
];

export const STATUS_ERP = [
    { value: 1, label: 'Chưa đồng bộ ERP - Chưa nhập kho' },
    { value: 2, label: 'Đã đồng bộ ERP - Đã nhập kho' }
];

export const STATUS_TAX = [
    { value: 1, label: 'Chưa gửi AF' },
    { value: 2, label: 'AF tính thuế' },
    { value: 3, label: 'AF tạm tính' },
    { value: 3, label: 'Hoàn thành' }
];

export const ITEMS_TYPES = [
    { value: 1, label: 'HW' },
    { value: 2, label: 'SW' },
    { value: 3, label: 'SRV' },
];
