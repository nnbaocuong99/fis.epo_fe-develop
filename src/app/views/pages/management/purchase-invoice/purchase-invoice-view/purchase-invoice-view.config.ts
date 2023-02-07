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
    { value: 4, label: 'Hoàn thành' }
];

export const EXCHANGE_RATE = [
    { value: 1, label: 'Bán ra - Giá trị tỷ giá - Ngày tỷ giá' },
    { value: 2, label: 'Mua vào - Giá trị tỷ giá - Ngày tỷ giá' },
    { value: 3, label: 'User - Giá trị tỷ giá - Ngày tỷ giá' },
];

export const HEADERS_ITEMS_ORTHER = [
    { width: '100px', header: 'COMMON.NO' },
    { width: '100px', header: 'Số lượng tạo HĐ' },
    { width: '100px', header: 'Số tiền' },
    { width: '200px', header: 'Thuế VAT' },
    { width: '100px', header: 'Diễn giải' },
    { width: '200px', header: 'Sub Inventory' },
    { width: '200px', header: 'Tài khoản định khoản' },
    { width: '200px', header: 'Project milestone' }
];

export const HEADERS_ITEMS_ORTHER_SPEC = [
    { width: '100px', header: 'COMMON.NO' },
    { width: '200px', header: 'Số lượng tạo HĐ' },
    { width: '200px', header: 'Số tiền' },
    { width: '200px', header: 'Thuế VAT' },
    { width: '200px', header: 'Diễn giải' },
];

export const STORE_ITEMS = [
    { value: null, label: 'Hàng không qua kho' },
    { value: undefined, label: 'Hàng không qua kho' },
    { value: 0, label: 'Hàng qua kho' },
    { value: 1, label: 'Hàng không qua kho' }
];

export const TAX_VAT = [
    { value: null, label: 'Thuế VAT không được khấu trừ' },
    { value: undefined, label: 'Thuế VAT không được khấu trừ' },
    { value: 0, label: 'Thuế VAT được khấu trừ' },
    { value: 1, label: 'Thuế VAT không được khấu trừ' }
];

export const VIEW_COMMON_INFO = [
    { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_NUMBER', field: 'code' },
    { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_NUMBER_TOTAL', field: 'codeTotal' },
    { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_TYPE', field: 'invoiceType' },
    { width: '100px', title: 'PURCHASE_INVOICE.COST_TYPE', field: 'costType' },
    { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_TYPE_ON_THE_LIST', field: 'invoiceTypeOnList' },
    { width: '300px', title: 'PURCHASE_INVOICE.TAX_TYPE_NO_DEDUCTION', field: 'taxType' },
    { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_SERIAL_NUMBER', field: 'seriNo' },
    { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_SAMPLE_SYMBOL', field: 'symbol' },
    { width: '100px', title: 'PURCHASE_INVOICE.ACCOUNTING_DATE', field: 'accountingDate', hasFormatDate: true },
    { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_DATE', field: 'date', hasFormatDate: true },
    { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_STATUS', field: 'status', dictionary: STATUS_INVOICE },
    { width: '100px', title: 'PURCHASE_INVOICE.ERP_SYNC_STATUS', field: 'syncStatus', dictionary: STATUS_ERP },
    { width: '100px', title: 'PURCHASE_INVOICE.SUPPLIER', field: 'supplierName' },
    { width: '100px', title: 'PURCHASE_INVOICE.TERMS_PAYMENT', field: 'paymentTerm' },
    { width: '100px', title: 'PURCHASE_INVOICE.SUPPLIER_TAX_CODE', field: 'supplierTax' },
    { width: '100px', title: 'PURCHASE_INVOICE.SUPPLIER_SITE', field: 'supplierSiteName' },
    { width: '100px', title: 'PURCHASE_INVOICE.CURRENCY', field: 'currency' },
    { width: '100px', title: 'PURCHASE_INVOICE.EXCHANGE_RATE', field: 'conversionRate' },
    // { width: '100px', title: 'Tổng thành tiền', field: 'totalAmount' },
    { width: '100px', title: 'PURCHASE_INVOICE.DERPARTMENT_RECEIVING_GOODS', field: 'receivingDeptName' },
    { width: '100px', title: 'PURCHASE_INVOICE.PO_CODE', field: 'poCode' },
    { width: '100px', title: 'PURCHASE_INVOICE.WAYBILL_NUMBER', field: 'waybillNumber' },
    // { width: '100px', title: 'PURCHASE_INVOICE.CREATOR', field: 'createdByInvoice' },
    { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_NUMBER_EXPORTED', field: 'invoiceExportedNo' },
    { width: '100px', title: 'PURCHASE_INVOICE.CONTRAST_WEEK', field: 'contrastWeek' },
    { width: '100px', title: 'PURCHASE_INVOICE.NEGATIVE_VALUE', field: 'contrastValue' },
    { width: '100px', title: 'PURCHASE_PLAN.PROJECT_CODE', field: 'projectCode' },
    { width: '100px', title: 'PURCHASE_ORDER.LEGAL', field: 'ouName' },
    { width: '100px', title: 'PURCHASE_INVOICE.ORG_APPLY', field: 'orgApplyName' },
    { width: '100px', title: 'PURCHASE_INVOICE.GOODS', field: 'isStoring', dictionary: STORE_ITEMS },
    { width: '100px', title: 'PURCHASE_INVOICE.PRODUCT_PRICE', field: 'isDeduct', dictionary: TAX_VAT },
    { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_INTERPRETATION', field: 'invoiceDesc' },
    { width: '100px', title: 'PURCHASE_INVOICE.NOTE', field: 'noteAf' },
    { width: '100px', title: 'PURCHASE_INVOICE.NOTE_OF_AF', field: 'noteOfAf' },
    { width: '100px', title: 'PURCHASE_INVOICE.CREATOR', field: 'creatorByName' },
    { width: '100px', title: 'PURCHASE_INVOICE.PEOPLE_INVOLVEL', field: 'peopleInvolved' },
];
