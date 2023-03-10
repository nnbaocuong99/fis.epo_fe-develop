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
    { width: '100px', header: 'S??? l?????ng t???o H??', field: 'quantity', isRequired: true },
    { width: '200px', header: 'S??? ti???n', field: 'price', isRequired: true },
    { width: '200px', header: 'Thu??? VAT', field: 'tax' },
    { width: '200px', header: 'Ti???n thu???', field: 'taxAmount' },
    { width: '200px', header: 'Di???n gi???i', field: 'note', isRequired: true },
    { width: '200px', header: 'Sub Inventory', field: 'subInventory' },
    { width: '200px', header: 'T??i kho???n ?????nh kho???n', field: 'termAccount' },
    { width: '200px', header: 'Project milestone', field: 'projectMilestone' }
];

export const HEADERS_ITEMS_TABLE_COST_SHIPMENT = [
    { width: '100px', header: 'COMMON.NO', field: 'indexNo' },
    { width: '100px', header: 'S??? l?????ng t???o H??', field: 'quantity', isRequired: true },
    { width: '200px', header: 'S??? ti???n', field: 'price', isRequired: true },
    { width: '200px', header: 'Thu??? VAT', field: 'tax' },
    { width: '200px', header: 'Ti???n thu???', field: 'taxAmount' },
    { width: '200px', header: 'Di???n gi???i', field: 'note', isRequired: true }
];

export const HEADERS_ITEMS_TABLE_CREDIT_NOTE = [
    { width: '100px', header: 'COMMON.NO', field: 'indexNo' },
    { width: '100px', header: 'S??? l?????ng t???o H??', field: 'quantity', isRequired: true },
    { width: '200px', header: 'S??? ti???n', field: 'price', isRequired: true },
    { width: '200px', header: 'Thu??? VAT', field: 'tax' },
    { width: '200px', header: 'Ti???n thu???', field: 'taxAmount' },
    { width: '200px', header: 'Di???n gi???i', field: 'note', isRequired: true },
    { width: '150px', header: 'PURCHASE_INVOICE.PROJECT_CODE', field: 'projectCode' },
    { width: '150px', header: 'PURCHASE_INVOICE.PO_CODE', field: 'poCode' },
    { width: '150px', header: 'PURCHASE_INVOICE.ITEM.ITEM_CODE', field: 'itemCode' },
    { width: '100px', header: 'PURCHASE_INVOICE.ITEM.PART_NO', field: 'partNo' },
    { width: '250px', header: 'PURCHASE_INVOICE.ITEM.ITEM_NAME', field: 'itemName' },
    { width: '100px', header: 'PURCHASE_INVOICE.ITEM.ITEM_TYPE', field: 'itemType' },
    { width: '100px', header: 'PURCHASE_INVOICE.ITEM.UOM', field: 'unit' },
    { width: '200px', header: 'Sub Inventory', field: 'subInventory' },
    { width: '200px', header: 'T??i kho???n ?????nh kho???n', field: 'termAccount' },
    { width: '200px', header: 'Project milestone', field: 'projectMilestone' }
];

export const STATUS_INVOICE = [
    { value: 1, label: '???? h???y' },
    { value: 2, label: '??ang m???' },
    { value: 3, label: 'Ch??? thanh to??n' },
    { value: 4, label: '??ang thanh to??n' },
    { value: 5, label: '???? thanh to??n' },
    { value: 9, label: 'L??u nh??p' }
];

export const STATUS_ERP = [
    { value: 1, label: 'Ch??a ?????ng b??? ERP - Ch??a nh???p kho', selected: true },
    { value: 2, label: '???? ?????ng b??? ERP - ???? nh???p kho' }
];

export const EXCHANGE_RATE = [
    { value: 1, label: 'B??n ra - Gi?? tr??? t??? gi?? - Ng??y t??? gi??' },
    { value: 2, label: 'Mua v??o - Gi?? tr??? t??? gi?? - Ng??y t??? gi??' },
    { value: 3, label: 'User - Gi?? tr??? t??? gi?? - Ng??y t??? gi??' },
];

export const INVOICE_TYPE_ON_LIST = [
    { value: 1, label: '01 - H??ng h??a, d???ch v??? mua trong n?????c' },
    { value: 2, label: '02 - H??ng h??a, d???ch v??? nh???p kh???u' },
    { value: 3, label: '03 - H??ng h??a, d???ch v??? kh??ng ch???u thu???' },
    { value: 4, label: '04 - H??a ????n thu??? nh?? th???u' },
    { value: 5, label: '05 - H??ng h??a, d???ch v??? kh??ng ph???i t???ng h???p tr??n t??? khai 01/GTGT' },
    { value: 6, label: '06 - H??a ????n b??n l??? (kh??ng ph???i H??TC)' },
    { value: 7, label: '07 - H??a ????n xu???t tr??? l???i nh?? cung c???p' },
    { value: 8, label: '08 - H??ng h??a, d???ch v??? kh??ng ???????c kh???u tr??? thu???' },
    { value: 9, label: '09 - H??ng h??a, d???ch v??? d??? ??n ?????u t??' }
];

export const TAX_PAYER = [
    { value: 1, label: 'PURCHASE_ORDER.TAXABLE_FIS' },
    { value: 2, label: 'PURCHASE_ORDER.TAXABLE_SUPPLIER' },
    { value: 3, label: 'PURCHASE_ORDER.BOTH_TAXABLE' }
];

export const SUPPLIER_SITE = [
    { value: 1, label: 'Ghi n???' },
    { value: 2, label: 'Tr??? tr?????c' },
    { value: 3, label: 'Tr??ch tr?????c' },
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
    { value: 0, label: 'Thu??? VAT ???????c kh???u tr???' },
    { value: 1, label: 'Thu??? VAT kh??ng ???????c kh???u tr???' }
];

export const HEADER_EXCHANGE_RATE = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'EXCHANGE_RATE_CURRENCY.TYPE', field: 'type' },
    { width: '100px', title: 'EXCHANGE_RATE_CURRENCY.DATE', field: 'date', hasFormatDate: true },
    { width: '100px', title: 'EXCHANGE_RATE_CURRENCY.CONVERSION_RATE', field: 'conversionRate' }
];

export const SUB_INVENTORY = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'M??', field: 'code' },
    { width: '200px', title: 'T??n', field: 'name' }
];

export const AREA_TYPE = [
    { value: 1, label: 'Mua h??ng trong n?????c' },
    { value: 2, label: 'Mua h??ng n?????c ngo??i' },
    { value: 3, label: 'Nh???p kinh doanh' },
    { value: 4, label: 'Phi m???u d???ch' }
];

export const PRODUCT_TYPES = [
    { value: 1, label: 'HW' },
    { value: 2, label: 'SW' },
    { value: 3, label: 'D???ch v??? h??ng' },
    { value: 4, label: 'D???ch v??? th???u' },
    { value: 5, label: 'T??ch h???p' }
];

export const PR_STATUS = [
    { value: 1, label: '???? t???o' },
    { value: 2, label: 'Ch??? ph?? duy???t' },
    { value: 3, label: '???? ph?? duy???t' },
    { value: 4, label: 'T??? ch???i ph?? duy???t' },
    { value: 5, label: '??ang th???c hi???n' },
    { value: 6, label: 'Ho??n th??nh' },
    { value: 7, label: 'H???y' }
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
    { value: 1, label: '??ang gom h??? s??' },
    { value: 2, label: '??ang l??m th??? t???c nh???n h??ng' },
    { value: 3, label: 'Ho??n th??nh' }
];

export const SHIPMENT_STATUS = [
    { value: 1, label: 'H??ng EXW ch??a giao' },
    { value: 2, label: 'H??ng ??ang ??i ???????ng' },
    { value: 3, label: 'H??ng ???? v??? kho, ch??? nh???p ORC' },
    { value: 4, label: '???? nh???p kho' }
];

export const SHIPMENT_STATUS_ERP = [
    { value: 1, label: 'Ch??a ?????ng b???' },
    { value: 2, label: '???? ?????ng b???' }
];

export const HEADER_SHIPMENT = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'S??? v???n ????n', field: 'waybillNumber' },
    { width: '100px', title: 'S??? v???n ????n ch???', field: 'masterBillNo' },
    { width: '100px', title: 'Ng??y v???n ????n', field: 'billOfLadingDate', hasFormatDate: true },
    { width: '100px', title: 'Ng??y d??? ki???n h??ng v??? (ETA)', field: 'expectedToDate', hasFormatDate: true },
    { width: '100px', title: 'Ng??y th???c t??? h??ng v???', field: 'actualToDate', hasFormatDate: true },
    { width: '100px', title: 'Nh?? cung c???p', field: 'smSupplier' },
    { width: '100px', title: 'Tr???ng th??i h??ng', field: 'smStatus', dictionary: SHIPMENT_STATUS },
    { width: '100px', title: 'Tr???ng th??i h??? s??', field: 'docStatus', dictionary: SHIPMENT_PROFILE_STATUS },
    // { width: '100px', title: 'Tr???ng th??i ?????ng b??? ORC', field: 'syncStatus', dictionary: SHIPMENT_STATUS_ERP },
    { width: '100px', title: 'Ng?????i t???o l?? h??ng', field: 'userName' },
    { width: '100px', title: 'H??ng Claim', field: 'claim' },
    { width: '100px', title: 'M?? d??? ??n', field: 'projectCode' },
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
    { width: '100px', title: 'Lo???i ch???ng t???' },
    { width: '100px', title: 'T??n file' },
    { width: '100px', title: 'Lo???i file' },
    { width: '100px', title: 'K??ch th?????c' },
    { width: '100px', title: 'Ng?????i upload' },
    { width: '100px', title: 'Ng??y upload' },
    { width: '100px', title: 'Ghi ch??' },
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
