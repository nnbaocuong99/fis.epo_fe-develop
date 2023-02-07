export const HEADER_BILL = [
    [
        { width: '3%', title: 'COMMON.NO', rowSpan: 2 },
        { width: '12%', title: 'Loại chứng từ', rowSpan: 1 },
        { width: '12%', title: 'Mã số thuế NCC (Enter để tìm)', rowSpan: 1 },
        { width: '14%', title: 'Tên hàng hóa/Dịch vụ', rowSpan: 2 },
        { width: '14%', title: 'Diễn giải hóa đơn', rowSpan: 2 },
        { width: '6%', title: 'Mẫu số', rowSpan: 1 },
        { width: '6%', title: 'Ký hiệu', rowSpan: 1 },
        { width: '8%', title: 'Loại tiền', rowSpan: 1 },
        { width: '7%', title: 'Nguyên tệ', rowSpan: 1 },
        { width: '10%', title: 'Thuế', rowSpan: 2 },
        { width: '8%', title: 'Nguyên tệ', rowSpan: 1 },
    ],
    [
        { width: '150px', title: 'Ngày chứng từ' },
        { width: '150px', title: 'Tên nhà cung cấp' },
        { width: '150px', title: 'Số hóa đơn', colSpan: 2 },
        { width: '150px', title: 'Tỷ giá' },
        { width: '150px', title: 'Thành tiền' },
        { width: '150px', title: 'Tổng tiền' },
    ]
];

export const HEADER_PAYMENT = [
    [
        { width: '12%', title: 'Đơn vị - Dự án - Khoản mục ngân sách', rowSpan: 2, colSpan: 2 },
        { width: '12%', title: 'Diễn giải chi tiết', rowSpan: 2, colSpan: 2 },
        { width: '14%', title: 'Chi hộ', colSpan: 2 },
        { width: '14%', title: 'Số lượng', rowSpan: 1 },
        { width: '6%', title: 'Nguyên tệ', rowSpan: 1 },
        { width: '10%', title: 'Thuế', rowSpan: 2 },
        { width: '8%', title: 'Nguyên tệ', rowSpan: 1 },
    ],
    [
        { width: '150px', title: 'TKKT', colSpan: 2 },
        { width: '150px', title: 'Đơn giá' },
        { width: '150px', title: 'Thành tiền' },
        { width: '150px', title: 'Tổng tiền' },
    ]
];

export const HEADER_SUPPLIER = [
    { width: '50px', title: 'COMMON.NO' },
    // { width: '100px', title: 'SUPPLIER.VENDOR_ID', field: 'vendorId' },
    { width: '100px', title: 'SUPPLIER.CODE', field: 'code' },
    { width: '300px', title: 'SUPPLIER.NAME', field: 'name' },
    { width: '100px', title: 'SUPPLIER.TAX_CODE', field: 'taxCode' },
    // { width: '200px', title: 'SUPPLIER.SYNC_SOURCE', field: 'syncSource' },
    // { width: '200px', title: 'SUPPLIER.SYNC_AT', field: 'syncAt', hasFormatDate: true }
];

export const HEADER_PURCHASE_INVOICE = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_TYPE', field: 'invoiceType' },
    { width: '100px', title: 'PURCHASE_INVOICE.COST_TYPE', field: 'costType' },
    { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_NUMBER', field: 'code' },
    { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_DATE', field: 'date', hasFormatDate: true },
    // { width: '100px', title: 'PURCHASE_INVOICE.TERMS_PAYMENT', field: 'paymentTerm' },
    // { width: '100px', title: 'PURCHASE_INVOICE.DUE_DATE', field: '', hasFormatDate: true },
    // { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_VAULE', field: '' },
    // { width: '100px', title: 'PURCHASE_INVOICE.ACTUAL_INVOICE_VALUE', field: '' },
    { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_INTERPRETATION', field: 'invoiceDesc' },
    // { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_STATUS', field: 'status' },
    // { width: '100px', title: 'PURCHASE_INVOICE.ERP_SYNC_STATUS', field: 'syncStatus' },
    { width: '100px', title: 'PURCHASE_INVOICE.SUPPLIER', field: 'supplierName' },
    // { width: '100px', title: 'PURCHASE_INVOICE.WAYBILL_NUMBER', field: 'waybillNumber' },
    // { width: '100px', title: 'PURCHASE_INVOICE.PO_CONTRACT_NUMBER', field: 'poCode' },
    // { width: '100px', title: 'PURCHASE_INVOICE.PAYMENT_SUGGESTIONS_DATE', field: '', hasFormatDate: true },
    // { width: '100px', title: 'PURCHASE_INVOICE.ACTUAL_PAYMENT_DATE', field: '', hasFormatDate: true },
];

export const HEADER_CURRENCY = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'CURRENCY.CODE', field: 'code' },
    { width: '300px', title: 'CURRENCY.NAME', field: 'name' },
];

