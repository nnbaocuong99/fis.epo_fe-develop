export const STATUS_TAX_INVOICE = [
    { value: 1, label: 'TAX_INVOICE.MAP_COM_YET' },
    { value: 2, label: 'TAX_INVOICE.MAPED_COM' },
    { value: 3, label: 'TAX_INVOICE.WAIT_PAYMENT' },
    { value: 4, label: 'TAX_INVOICE.COMPLETED_PAYMENT' }
];

export const PRIORITY_MAP = [
    { value: 1, label: 'Map theo Tax - Com' },
    { value: 2, label: 'Map theo giá trị PO' },
    { value: 3, label: 'Map theo số PO' },
    { value: 4, label: 'Map theo NCC' }
];

export const HEADER_TAX_INVOICE = [
    { width: '100px', title: 'TAX_INVOICE.SUPPLIER_NAME' },
    { width: '100px', title: 'TAX_INVOICE.PO_CODE' },
    { width: '100px', title: 'TAX_INVOICE.TAX_INVOICE_NUMBER' },
    { width: '100px', title: 'TAX_INVOICE.TAX_INVOICE_DATE' },
    { width: '100px', title: 'TAX_INVOICE.CURRENCY' },
    { width: '100px', title: 'TAX_INVOICE.TAX_INVOICE_VALUE' },
    { width: '100px', title: 'TAX_INVOICE.DUE_DATE' },
    { width: '100px', title: 'TAX_INVOICE.DUE_WEEK' },
    { width: '100px', title: 'TAX_INVOICE.STATUS' },
    { width: '100px', title: 'TAX_INVOICE.PAID_VALUE' },
    { width: '100px', title: 'TAX_INVOICE.UNPAID_VALUE' },
    { width: '100px', title: 'TAX_INVOICE.CREATE_BY' },
    { width: '100px', title: 'TAX_INVOICE.NOTE' },
];

export const HEADER_PURCHASE_INVOICE_PAYMENT = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'TAX_INVOICE.SUPPLIER_NAME' },
    { width: '100px', title: 'TAX_INVOICE.PO_CODE' },
    { width: '100px', title: 'TAX_INVOICE.INVOICE_NUMBER' },
    { width: '100px', title: 'TAX_INVOICE.INVOICE_DATE' },
    { width: '100px', title: 'TAX_INVOICE.CURRENCY' },
    { width: '100px', title: 'TAX_INVOICE.INVOICE_VAULE' },
    { width: '100px', title: 'TAX_INVOICE.DUE_DATE' },
    { width: '100px', title: 'TAX_INVOICE.DUE_WEEK' }
];
