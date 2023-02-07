export const TYPE_BRAND = [
    { value: 1, label: 'Nhà phân phối' },
    { value: 2, label: 'Bán lẻ' },
];

export const BACKDATE = [
    { value: 1, label: 'Có' },
    { value: 0, label: 'Không' },
];

export const VIEW_COMMON_INFO = [
    { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_NUMBER', field: 'code' },
    { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_TYPE', field: 'invoiceType' },
    { width: '100px', title: 'PURCHASE_INVOICE.COST_TYPE', field: 'costType' },
    { width: '100px', title: 'PURCHASE_INVOICE.ACCOUNTING_DATE', field: 'accountingDate', hasFormatDate: true },
    { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_DATE', field: 'date', hasFormatDate: true },
    { width: '100px', title: 'PURCHASE_INVOICE.GOODS', field: 'isStoring', dictionary: TYPE_BRAND },
    { width: '100px', title: 'PURCHASE_INVOICE.PRODUCT_PRICE', field: 'isDeduct', dictionary: BACKDATE },
    { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_INTERPRETATION', field: 'invoiceDesc' },
    { width: '100px', title: 'PURCHASE_INVOICE.NOTE', field: 'note' },
];

