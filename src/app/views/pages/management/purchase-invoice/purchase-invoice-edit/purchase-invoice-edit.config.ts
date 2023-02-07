export const TABS = [
    { value: 1, label: 'PURCHASE_INVOICE.INVOICE_INFORMATION' },
    { value: 2, label: 'PURCHASE_INVOICE.PAYMENT_INFO' },
    { value: 3, label: 'PURCHASE_INVOICE.PROFILE' }
];

export const TAB_DETAILS = [
    { value: 1, label: 'PURCHASE_INVOICE.DETAILS_OF_THE_GOODS' },
    { value: 2, label: 'PURCHASE_INVOICE.CONTRACTOR_TAX_INFORMATION' }
];

export const HEADERS_ITEMS_TREE_TABLE = [
    { width: '100px', header: 'COMMON.NO', field: 'indexNo' },
    { width: '150px', header: 'PURCHASE_INVOICE.PROJECT_CODE', field: 'projectCode' },
    { width: '150px', header: 'PURCHASE_INVOICE.PO_CODE', field: 'poCode' },
    { width: '150px', header: 'PURCHASE_INVOICE.ITEM.ITEM_CODE', field: 'itemCode' },
    { width: '100px', header: 'PURCHASE_INVOICE.ITEM.PART_NO', field: 'partNo' },
    { width: '250px', header: 'PURCHASE_INVOICE.ITEM.ITEM_NAME', field: 'itemName' },
    { width: '100px', header: 'PURCHASE_INVOICE.ITEM.ITEM_TYPE', field: 'itemType' },
    // { width: '200px', header: 'PURCHASE_INVOICE.ITEM.NOTE', field: 'note' },
    { width: '100px', header: 'PURCHASE_INVOICE.ITEM.UOM', field: 'unit' },
    { width: '150px', header: 'PURCHASE_INVOICE.ITEM.QUANTITY', field: 'quantity' },
    { width: '150px', header: 'PURCHASE_INVOICE.ITEM.QUANTITY_STRORIED', field: 'quantitySuggest' },
    { width: '150px', header: 'PURCHASE_INVOICE.ITEM.PRICE', field: 'price' },
    { width: '150px', header: 'PURCHASE_INVOICE.ITEM.INTO_MONEY', field: 'intoMoney' },
    { width: '200px', header: 'PURCHASE_INVOICE.ITEM.ORINGIN', field: 'itemOrigin' },
    { width: '200px', header: 'PURCHASE_INVOICE.ITEM.MODE_TRANSPORTATION', field: 'delivery' },
    { width: '200px', header: 'PURCHASE_INVOICE.ITEM.TAX', field: 'tax' },
    { width: '200px', header: 'PURCHASE_INVOICE.ITEM.TAX_AMOUNT', field: 'taxAmount' },
    { width: '100px', header: 'PURCHASE_INVOICE.ITEM.FCT_TAX', field: 'taxpayer' },
    { width: '100px', header: 'PURCHASE_INVOICE.ITEM.ORG_CODE', field: 'orgCode' },
    { width: '200px', header: 'PURCHASE_INVOICE.ITEM.SUB_INVENTORY', field: 'subInventoryName' },
    { width: '200px', header: 'PURCHASE_INVOICE.ITEM.TERM_ACCOUNT', field: 'termAccount' },
    { width: '200px', header: 'PURCHASE_INVOICE.ITEM.PROJECT_MILESTONE', field: 'projectMilestone' },
    { width: '100px', title: '', class: 'action', field: 'action' }
];

export const HEADERS_ITEMS_TABLE = [
    { width: '100px', header: 'COMMON.NO', field: 'indexNo' },
    { width: '100px', header: 'Số lượng tạo HĐ', field: 'quantity', isRequired: true },
    { width: '200px', header: 'Số tiền', field: 'price', isRequired: true },
    { width: '200px', header: 'Thuế VAT', field: 'tax' },
    { width: '200px', header: 'Tiền thuế', field: 'taxAmount' },
    { width: '200px', header: 'Diễn giải', field: 'note', isRequired: true },
    { width: '200px', header: 'Sub Inventory', field: 'subInventory' },
    { width: '200px', header: 'Tài khoản định khoản', field: 'termAccount' },
    { width: '200px', header: 'Project milestone', field: 'projectMilestone' }
];

export const HEADERS_ITEMS_TABLE_COST_SHIPMENT = [
    { width: '100px', header: 'COMMON.NO', field: 'indexNo' },
    { width: '100px', header: 'Số lượng tạo HĐ', field: 'quantity', isRequired: true },
    { width: '200px', header: 'Số tiền', field: 'price', isRequired: true },
    { width: '200px', header: 'Thuế VAT', field: 'tax' },
    { width: '200px', header: 'Tiền thuế', field: 'taxAmount' },
    { width: '200px', header: 'Diễn giải', field: 'note', isRequired: true }
];

export const HEADERS_ITEMS_TABLE_CREDIT_NOTE = [
    { width: '100px', header: 'COMMON.NO', field: 'indexNo' },
    { width: '100px', header: 'Số lượng tạo HĐ', field: 'quantity', isRequired: true },
    { width: '200px', header: 'Số tiền', field: 'price', isRequired: true },
    { width: '200px', header: 'Thuế VAT', field: 'tax' },
    { width: '200px', header: 'Tiền thuế', field: 'taxAmount' },
    { width: '200px', header: 'Diễn giải', field: 'note', isRequired: true },
    { width: '150px', header: 'PURCHASE_INVOICE.PROJECT_CODE', field: 'projectCode' },
    { width: '150px', header: 'PURCHASE_INVOICE.PO_CODE', field: 'poCode' },
    { width: '150px', header: 'PURCHASE_INVOICE.ITEM.ITEM_CODE', field: 'itemCode' },
    { width: '100px', header: 'PURCHASE_INVOICE.ITEM.PART_NO', field: 'partNo' },
    { width: '250px', header: 'PURCHASE_INVOICE.ITEM.ITEM_NAME', field: 'itemName' },
    { width: '100px', header: 'PURCHASE_INVOICE.ITEM.ITEM_TYPE', field: 'itemType' },
    { width: '100px', header: 'PURCHASE_INVOICE.ITEM.UOM', field: 'unit' },
    { width: '200px', header: 'Sub Inventory', field: 'subInventory' },
    { width: '200px', header: 'Tài khoản định khoản', field: 'termAccount' },
    { width: '200px', header: 'Project milestone', field: 'projectMilestone' }
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
    { value: 1, label: 'Chưa đồng bộ ERP - Chưa nhập kho', selected: true },
    { value: 2, label: 'Đã đồng bộ ERP - Đã nhập kho' }
];

export const EXCHANGE_RATE = [
    { value: 1, label: 'Bán ra - Giá trị tỷ giá - Ngày tỷ giá' },
    { value: 2, label: 'Mua vào - Giá trị tỷ giá - Ngày tỷ giá' },
    { value: 3, label: 'User - Giá trị tỷ giá - Ngày tỷ giá' },
];

export const INVOICE_TYPE_ON_LIST = [
    { value: 1, label: '01 - Hàng hóa, dịch vụ mua trong nước' },
    { value: 2, label: '02 - Hàng hóa, dịch vụ nhập khẩu' },
    { value: 3, label: '03 - Hàng hóa, dịch vụ không chịu thuế' },
    { value: 4, label: '04 - Hóa đơn thuế nhà thầu' },
    { value: 5, label: '05 - Hàng hóa, dịch vụ không phải tổng hợp trên tờ khai 01/GTGT' },
    { value: 6, label: '06 - Hóa đơn bán lẻ (không phải HĐTC)' },
    { value: 7, label: '07 - Hóa đơn xuất trả lại nhà cung cấp' },
    { value: 8, label: '08 - Hàng hóa, dịch vụ không được khấu trừ thuế' },
    { value: 9, label: '09 - Hàng hóa, dịch vụ dự án đầu tư' }
];

export const TAX_PAYER = [
    { value: 1, label: 'PURCHASE_ORDER.TAXABLE_FIS' },
    { value: 2, label: 'PURCHASE_ORDER.TAXABLE_SUPPLIER' },
    { value: 3, label: 'PURCHASE_ORDER.BOTH_TAXABLE' }
];

export const SUPPLIER_SITE = [
    { value: 1, label: 'Ghi nợ' },
    { value: 2, label: 'Trả trước' },
    { value: 3, label: 'Trích trước' },
];

export const HEADER_SUPPLIER = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'SUPPLIER.CODE', field: 'code' },
    { width: '200px', title: 'SUPPLIER.NAME', field: 'name' },
    { width: '100px', title: 'SUPPLIER.TAX_CODE', field: 'taxCode' }
];

export const HEADER_SUPPLIER_SITE = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'SUPPLIER_SITE.CODE', field: 'code' },
    { width: '200px', title: 'SUPPLIER_SITE.NAME', field: 'name' },
    { width: '300px', title: 'SUPPLIER_SITE.ADDRESS', field: 'address' }
];

export const STORE_ITEMS = [
    { value: 0, label: 'PURCHASE_INVOICE.IS_STORING' },
    { value: 1, label: 'PURCHASE_INVOICE.IS_NOT_STORING' }
];

export const TAX_VAT = [
    { value: 0, label: 'Thuế VAT được khấu trừ' },
    { value: 1, label: 'Thuế VAT không được khấu trừ' }
];

export const HEADER_EXCHANGE_RATE = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'EXCHANGE_RATE_CURRENCY.TYPE', field: 'type' },
    { width: '100px', title: 'EXCHANGE_RATE_CURRENCY.DATE', field: 'date', hasFormatDate: true },
    { width: '100px', title: 'EXCHANGE_RATE_CURRENCY.CONVERSION_RATE', field: 'conversionRate' }
];

export const SUB_INVENTORY = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'Mã', field: 'code' },
    { width: '200px', title: 'Tên', field: 'name' }
];

export const AREA_TYPE = [
    { value: 1, label: 'Mua hàng trong nước' },
    { value: 2, label: 'Mua hàng nước ngoài' },
    { value: 3, label: 'Nhập kinh doanh' },
    { value: 4, label: 'Phi mậu dịch' }
];

export const PRODUCT_TYPES = [
    { value: 1, label: 'HW' },
    { value: 2, label: 'SW' },
    { value: 3, label: 'Dịch vụ hãng' },
    { value: 4, label: 'Dịch vụ thầu' },
    { value: 5, label: 'Tích hợp' }
];

export const PR_STATUS = [
    { value: 1, label: 'Đã tạo' },
    { value: 2, label: 'Chờ phê duyệt' },
    { value: 3, label: 'Đã phê duyệt' },
    { value: 4, label: 'Từ chối phê duyệt' },
    { value: 5, label: 'Đang thực hiện' },
    { value: 6, label: 'Hoàn thành' },
    { value: 7, label: 'Hủy' }
];

export const HEADER_PO = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'PURCHASE_ORDER.PROJECT_CODE', field: 'projectCode' },
    { width: '100px', title: 'PURCHASE_ORDER.PR_NO', field: 'prNo' },
    { width: '100px', title: 'PURCHASE_ORDER.PO_HD_NO', field: 'code' },
    { width: '100px', title: 'PURCHASE_ORDER.PROVIDER', field: 'supplierName' },
    { width: '100px', title: 'PURCHASE_ORDER.UNIT_PRICE', field: '' },
    { width: '100px', title: 'PURCHASE_ORDER.ORG_APPLY', field: 'orgApply' },
    { width: '100px', title: 'PURCHASE_ORDER.FORMAT_PO', field: 'areaType', dictionary: AREA_TYPE },
    { width: '100px', title: 'PURCHASE_ORDER.PO_CONTRACT_TYPE', field: 'productType', dictionary: PRODUCT_TYPES },
    { width: '100px', title: 'PURCHASE_ORDER.STATUS_PO_HD', field: 'status', dictionary: PR_STATUS },
    { width: '100px', title: 'PURCHASE_ORDER.CREATE_AT', field: 'createdAt', hasFormatDate: true }
];

export const SHIPMENT_PROFILE_STATUS = [
    { value: 1, label: 'Đang gom hồ sơ' },
    { value: 2, label: 'Đang làm thủ tục nhận hàng' },
    { value: 3, label: 'Hoàn thành' }
];

export const SHIPMENT_STATUS = [
    { value: 1, label: 'Hàng EXW chưa giao' },
    { value: 2, label: 'Hàng đang đi đường' },
    { value: 3, label: 'Hàng đã về kho, chờ nhập ORC' },
    { value: 4, label: 'Đã nhập kho' }
];

export const SHIPMENT_STATUS_ERP = [
    { value: 1, label: 'Chưa đồng bộ' },
    { value: 2, label: 'Đã đồng bộ' }
];

export const HEADER_SHIPMENT = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'Số vận đơn', field: 'waybillNumber' },
    { width: '100px', title: 'Số vận đơn chủ', field: 'masterBillNo' },
    { width: '100px', title: 'Ngày vận đơn', field: 'billOfLadingDate', hasFormatDate: true },
    { width: '100px', title: 'Ngày dự kiến hàng về (ETA)', field: 'expectedToDate', hasFormatDate: true },
    { width: '100px', title: 'Ngày thực tế hàng về', field: 'actualToDate', hasFormatDate: true },
    { width: '100px', title: 'Nhà cung cấp', field: 'smSupplier' },
    { width: '100px', title: 'Trạng thái hàng', field: 'smStatus', dictionary: SHIPMENT_STATUS },
    { width: '100px', title: 'Trạng thái hồ sơ', field: 'docStatus', dictionary: SHIPMENT_PROFILE_STATUS },
    // { width: '100px', title: 'Trạng thái đồng bộ ORC', field: 'syncStatus', dictionary: SHIPMENT_STATUS_ERP },
    { width: '100px', title: 'Người tạo lô hàng', field: 'userName' },
    { width: '100px', title: 'Hàng Claim', field: 'claim' },
    { width: '100px', title: 'Mã dự án', field: 'projectCode' },
];

export const HEADER_PURCHASE_INVOICE = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_TYPE', field: 'invoiceType' },
    { width: '100px', title: 'PURCHASE_INVOICE.COST_TYPE', field: 'costType' },
    { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_NUMBER', field: 'code' },
    { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_DATE', field: 'date', hasFormatDate: true },
    { width: '100px', title: 'PURCHASE_INVOICE.TERMS_PAYMENT', field: 'paymentTerm' },
    { width: '100px', title: 'PURCHASE_INVOICE.DUE_DATE', field: '', hasFormatDate: true },
    { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_VAULE', field: '' },
    { width: '100px', title: 'PURCHASE_INVOICE.ACTUAL_INVOICE_VALUE', field: '' },
    { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_INTERPRETATION', field: 'invoiceDesc' },
    { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_STATUS', field: 'status' },
    // { width: '100px', title: 'PURCHASE_INVOICE.ERP_SYNC_STATUS', field: 'syncStatus' },
    { width: '100px', title: 'PURCHASE_INVOICE.SUPPLIER', field: 'supplierName' },
    { width: '100px', title: 'PURCHASE_INVOICE.WAYBILL_NUMBER', field: 'waybillNumber' },
    { width: '100px', title: 'PURCHASE_INVOICE.PO_CONTRACT_NUMBER', field: 'poCode' },
    { width: '100px', title: 'PURCHASE_INVOICE.PAYMENT_SUGGESTIONS_DATE', field: '', hasFormatDate: true },
    { width: '100px', title: 'PURCHASE_INVOICE.ACTUAL_PAYMENT_DATE', field: '', hasFormatDate: true },
];

export const DERPARTMENT_RECEIVING_GOODS = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'ACCOUNT.ACCOUNT_ID', field: 'accountId' },
    { width: '100px', title: 'ACCOUNT.CODE', field: 'code' },
    { width: '300px', title: 'ACCOUNT.NAME', field: 'name' },
    { width: '200px', title: 'ACCOUNT.SYNC_SOURCE', field: 'syncSource' },
    { width: '200px', title: 'ACCOUNT.SYNC_AT', field: 'syncAt', hasFormatDate: true }
];

export const HEADER_PAYMENT = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'PAYMENT.PAYMENT_METHODS' },
    { width: '100px', title: 'PAYMENT.PAYMENT_MILESTONE', isRequired: true },
    { width: '100px', title: 'PAYMENT.TERMS_PAYMENT', isRequired: true },
    { width: '100px', title: 'PAYMENT.RATIO', isRequired: true },
    { width: '100px', title: 'PAYMENT.AMOUNT_MONEY' },
    { width: '100px', title: 'PAYMENT.DUE_DATE' },
    { width: '100px', title: 'PAYMENT.DUE_WEEK' },
    { width: '100px', title: 'PAYMENT.PAYMENT_SUGGESTIONS_DATE' },
    { width: '100px', title: 'PAYMENT.STATUS_PAYMENT' },
    { width: '100px', title: 'PAYMENT.ACTUAL_PAYMENT_VALUE' },
    { width: '100px', title: 'PAYMENT.ACTUAL_PAYMENT_DATE' },
    { width: '50px', header: '', maxWidth: '50px', class: 'action' }
];

export const HEADER_PROFILE = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'Loại chứng từ' },
    { width: '100px', title: 'Tên file' },
    { width: '100px', title: 'Loại file' },
    { width: '100px', title: 'Kích thước' },
    { width: '100px', title: 'Người upload' },
    { width: '100px', title: 'Ngày upload' },
    { width: '100px', title: 'Ghi chú' },
    { width: '50px', header: '', maxWidth: '50px', class: 'action' }
];

export const STATUS_PAYMENT = [
    { value: 1, label: 'PURCHASE_INVOICE.WAIT_PAYMENT' },
    { value: 2, label: 'PURCHASE_INVOICE.ONGOING_PAYMENT' },
    { value: 3, label: 'PURCHASE_INVOICE.COMPLETED_PAYMENT' }
];

export const HEADER_USER = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'BUYER.USER_NAME', field: 'userName' },
    { width: '300px', title: 'BUYER.LAST_NAME', field: 'fullName' }
];

export const HEADER_PAYMENT_TERM = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '200px', title: 'PAYMENT_TERM.NAME', field: 'name' },
    { width: '200px', title: 'PAYMENT_TERM.DESCRIPTION', field: 'description' },
    { width: '200px', title: 'PAYMENT_TERM.CREATE_AT', field: 'createdAt', hasFormatDate: true }
];

export const HEADER_TAX_CODE = [
    { width: '50px', title: 'COMMON.NO', field: '' },
    { width: '100px', title: 'TAX_CODE.NAME', field: 'name' },
    { width: '100px', title: 'TAX_CODE.DESCRIPTION', field: 'description' }
];

export const HEADER_INVOICE_TYPE = [
    { width: '50px', title: 'COMMON.NO', field: '' },
    { width: '100px', title: 'TAX_CODE.NAME', field: 'name' },
    { width: '100px', title: 'TAX_CODE.DESCRIPTION', field: 'description' }
];

export const HEADER_INPUT_INVOICE_INFOMATION = [
    { width: '50px', title: 'COMMON.NO', field: '' },
    { width: '100px', title: 'INPUT_INVOICE_INFOMATION.VALUE', field: 'flexValue' },
    { width: '300px', title: 'INPUT_INVOICE_INFOMATION.DESCRIPTION', field: 'description' }
];

export const HEADER_TAX_TYPE_NOT_DEDUCTION = [
    { width: '50px', title: 'COMMON.NO', field: '' },
    { width: '100px', title: 'TAX_TYPE_NOT_DEDUCTION.VALUE', field: 'flexValue' },
    { width: '100px', title: 'TAX_TYPE_NOT_DEDUCTION.DESCRIPTION', field: 'description' }
];

export const HEADER_PROJECT = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '200px', title: 'PROJECT.CODE', field: 'code', isRequired: true },
    { width: '400px', title: 'PROJECT.NAME', field: 'name' },
    { width: '100px', title: 'PROJECT.STATUS', field: 'status', isRequired: true },
    { width: '100px', title: 'PROJECT.DESCRIPTION', field: 'Description' },
];

export const HEADER_ITEMS = [
    { width: '50px', title: 'COMMON.NO' },
    // { width: '100px', title: 'ITEM.ITEM_ID', field: 'itemId' },
    { width: '100px', title: 'ITEM.CODE', field: 'code' },
    { width: '400px', title: 'ITEM.NAME', field: 'name' },
    { width: '100px', title: 'ITEM.UNIT_CODE', field: 'unitCode' },
    { width: '100px', title: 'ITEM.UNIT_NAME', field: 'unitName' },
    // { width: '200px', title: 'ITEM.SYNC_SOURCE', field: 'syncSource' },
    // { width: '200px', title: 'ITEM.SYNC_AT', field: 'syncAt' }
];

export const ITEM_TYPE = [
    { value: 1, label: 'HW' },
    { value: 2, label: 'SW' },
    { value: 3, label: 'SRV' }
];

export const HEADER_ORG = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '200px', title: 'ORGANIZATION.ORG_ID', field: 'orgId' },
    { width: '200px', title: 'ORGANIZATION.CODE', field: 'code' },
    { width: '200px', title: 'ORGANIZATION.NAME', field: 'name' }
];

export const HEADER_DEPARMENT = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'DEPARTMENT.CODE', field: 'code' },
    { width: '200px', title: 'DEPARTMENT.NAME', field: 'name' }
];

export const HEADER_OPERATING_UNIT = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '200px', title: 'OPERATING_UNIT.CODE', field: 'code' },
    { width: '200px', title: 'OPERATING_UNIT.NAME', field: 'name' },
    { width: '200px', title: 'OPERATING_UNIT.ADDRESS', field: 'address' }
];
