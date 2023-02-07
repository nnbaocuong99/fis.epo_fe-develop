export const HEADER = [
    { width: '50px', title: 'COMMON.NO', field: 'indexNo' },
    { width: '150px', title: 'PURCHASE_INVOICE.INVOICE_NUMBER', field: 'code' },
    { width: '150px', title: 'PURCHASE_INVOICE.INVOICE_NUMBER_TOTAL', field: 'codeTotal' },
    { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_TYPE', field: 'invoiceType' },
    { width: '100px', title: 'PURCHASE_INVOICE.COST_TYPE', field: 'costType' },
    { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_DATE', field: 'date' },
    // { width: '100px', title: 'PURCHASE_INVOICE.TERMS_PAYMENT', field: 'paymentTerms' },
    // { width: '100px', title: 'PURCHASE_INVOICE.DUE_DATE', field: 'dueDate' },
    { width: '150px', title: 'PURCHASE_INVOICE.INVOICE_VAULE', field: 'totalAmount' },
    { width: '150px', title: 'PURCHASE_INVOICE.ACTUAL_INVOICE_VALUE', field: 'totalActual' },
    { width: '150px', title: 'PURCHASE_INVOICE.INVOICE_INTERPRETATION', field: 'invoiceDesc' },
    { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_STATUS', field: 'status' },
    { width: '100px', title: 'PURCHASE_INVOICE.ERP_SYNC_STATUS', field: 'syncStatus' },
    { width: '150px', title: 'PURCHASE_INVOICE.SUPPLIER', field: 'supplierName' },
    { width: '150px', title: 'PURCHASE_INVOICE.WAYBILL_NUMBER', field: 'waybillNumber' },
    // { width: '100px', title: 'PURCHASE_INVOICE.PO_CONTRACT_NUMBER', field: 'poCode' },
    // { width: '100px', title: 'PURCHASE_INVOICE.PAYMENT_SUGGESTIONS_DATE', field: 'paymentSuggestionDate' },
    { width: '100px', title: 'PURCHASE_INVOICE.ERP_INVOICE_ID', field: 'erpInvoiceId' },
    { width: '100px', title: 'PURCHASE_INVOICE.CREATOR', field: 'CreatorName' },
    { width: '100px', title: 'PURCHASE_INVOICE.SYNC_SOURCE', field: 'syncSource' },
    { width: '70px', title: '', class: 'action', field: 'action' }
];

export const STATUS_INVOICE = [
    { value: 1, label: 'Đã hủy' },
    { value: 2, label: 'Đang mở' },
    { value: 3, label: 'Chờ thanh toán' },
    { value: 4, label: 'Đang thanh toán' },
    { value: 5, label: 'Đã thanh toán' },
    { value: 9, label: 'Lưu nháp' }
];

export const CHECK_IMPORT_GOODS = [
    { value: null, label: 'Chưa đề nghị nhập hàng' },
    { value: undefined, label: 'Chưa đề nghị nhập hàng' },
    { value: 0, label: 'Chưa đề nghị nhập hàng' },
    { value: 1, label: 'Đã đẩy đề nghị nhập hàng' },
    { value: 2, label: 'Đã đẩy đề nghị nhập hàng' },
    { value: 3, label: 'Đã đẩy đề nghị nhập hàng' }
];

export const SYNC_ERP = [
    { value: 1, label: 'Chưa đồng bộ ERP' },
    { value: 2, label: 'Đã đồng bộ ERP' }
];

export const SYNC_ERP_LIST = [
    { value: null, label: 'Chưa đồng bộ ERP' },
    { value: undefined, label: 'Chưa đồng bộ ERP' },
    { value: 0, label: 'Chưa đồng bộ ERP' },
    { value: 1, label: 'Chưa đồng bộ ERP' },
    { value: 2, label: 'Đã đồng bộ ERP' },
    { value: 3, label: 'Đã đồng bộ ERP' }
];

export const ELIM_STATUS = [
    { value: null, label: 'Chưa phân bổ' },
    { value: undefined, label: 'Chưa phân bổ' },
    { value: 0, label: 'Chưa phân bổ' },
    { value: 1, label: 'Chưa phân bổ' },
    { value: 2, label: 'Đã phân bổ' },
    { value: 3, label: 'Đã phân bổ' }
];

export const STATUS_TAX = [
    { value: 1, label: 'Chưa gửi AF' },
    { value: 2, label: 'AF tính thuế' },
    { value: 3, label: 'AF tạm tính' },
    { value: 4, label: 'Hoàn thành' }
];
