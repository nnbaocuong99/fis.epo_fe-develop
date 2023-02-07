export const TABS = [
    { value: 1, label: 'PURCHASE_ORDER.GOODS_LIST' },
    { value: 2, label: 'PURCHASE_ORDER.TRACK_PROGRESS' },
    { value: 3, label: 'PURCHASE_ORDER.TRACK_NUMBER_ITEMS' }
];

export const HEADER_ITEMS_PROGRESS = [
    { width: '100px', title: 'COMMON.NO', field: 'indexNo' },
    { width: '150px', title: 'PURCHASE_ORDER.ITEM.PART_NO', field: 'partNo' },
    { width: '130px', title: 'PURCHASE_ORDER.ITEM.ITEM_CODE', field: 'itemCode' },
    { width: '300px', title: 'PURCHASE_ORDER.ITEM.ITEM_NAME', field: 'itemName' },
    { width: '100px', title: 'PURCHASE_ORDER.ITEM.ITEM_TYPE', field: 'itemType' },
    { width: '200px', title: 'PURCHASE_ORDER.INVOICE_NO', field: 'piCode' },
    { width: '200px', title: 'SHIPMENT.WAYBILL_NUMBER', field: 'waybillNumber' },
    { width: '100px', title: 'PURCHASE_ORDER.ITEM.QUANTITY', field: 'quantity' },
    { width: '100px', title: 'PURCHASE_ORDER.ITEM.QUANTITY_INVOICE', field: 'quantity' },
    { width: '100px', title: 'PURCHASE_ORDER.ITEM.QUANTITY_REMAIN', field: 'quantityRemain' },
    { width: '150px', title: 'PURCHASE_ORDER.ITEM.UNIT_PRICE', field: 'price' },
    { width: '150px', title: 'PURCHASE_ORDER.ITEM.INTO_MONEY', field: 'intoMoney' },
    { width: '150px', title: 'PURCHASE_ORDER.ITEM.BRAND', field: 'producerName' },
    { width: '150px', title: 'PURCHASE_ORDER.ITEM.IMPORT_STATUS.TITLE', field: 'receiptItemId' },
];

export const HEADER_INTERNAL = [
    { width: '34px', title: '', field: 'checkBox' },
    { width: '50px', title: 'COMMON.NO', field: 'indexNo' },
    { width: '150px', title: 'PURCHASE_ORDER.PR_NO', field: 'prNo' },
    { width: '100px', title: 'PURCHASE_ORDER.ITEM.ITEM_CODE', field: 'itemCode' },
    { width: '100px', title: 'PURCHASE_ORDER.ITEM.PART_NO', field: 'partNo' },
    { width: '150px', title: 'PURCHASE_ORDER.ITEM.ITEM_NAME', field: 'itemName' },
    { width: '100px', title: 'PURCHASE_ORDER.ITEM.ITEM_TYPE', field: 'itemType' },
    { width: '100px', title: 'PURCHASE_ORDER.ITEM.UOM', field: 'unit' },
    { width: '100px', title: 'PURCHASE_ORDER.ITEM.QUANTITY', isRequired: 'true', field: 'quantity' },
    { width: '150px', title: 'PURCHASE_ORDER.ITEM.UNIT_PRICE', field: 'price' },
    { width: '150px', title: 'PURCHASE_ORDER.ITEM.INTO_MONEY', field: 'intoMoney' },
    { width: '200px', title: 'PURCHASE_ORDER.ITEM.EXPECTED_DATE', isRequired: 'true', field: 'expectedDate' },
    { width: '200px', title: 'PURCHASE_ORDER.ITEM.EXPECTED_RETURN_DATE', isRequired: 'true', field: 'responseDate' },
    { width: '200px', title: 'PURCHASE_ORDER.ITEM.TAX', isRequired: 'true', field: 'tax' },
    { width: '200px', title: 'PURCHASE_ORDER.ITEM.TAX_AMOUNT', field: 'taxAmount' },
    { width: '150px', title: 'PURCHASE_ORDER.ITEM.PRODUCER_NAME', isRequired: 'true', field: 'producerName' },
    { width: '120px', title: 'PURCHASE_ORDER.ITEM.GUARANTEE', isRequired: 'true', field: 'guarantee' },
    { width: '100px', title: 'PURCHASE_ORDER.ITEM.DELIVERY_LOCATION', field: 'deliveryLocation' },
    { width: '200px', title: 'PURCHASE_ORDER.ITEM.TERM_ACCOUNT', field: 'termAccount' },
    { width: '200px', title: 'PURCHASE_ORDER.ITEM.PROJECT_MILESTONE', field: 'projectMilestone' },
    { width: '150px', title: 'COMMON.NOTE', field: 'note' },
    { width: '150px', title: 'PURCHASE_ORDER.ITEM.PROGRESS_STATUS', field: 'progressStatus' },
    { width: '100px', title: '', class: 'action', field: 'action' }
];

export const HEADER_EXTERNAL = [
    { width: '34px', title: '', field: 'checkBox' },
    { width: '50px', title: 'COMMON.NO', field: 'indexNo' },
    { width: '150px', title: 'PURCHASE_ORDER.PR_NO', field: 'prNo' },
    { width: '100px', title: 'PURCHASE_ORDER.ITEM.ITEM_CODE', field: 'itemCode' },
    { width: '100px', title: 'PURCHASE_ORDER.ITEM.PART_NO', field: 'partNo' },
    { width: '150px', title: 'PURCHASE_ORDER.ITEM.ITEM_NAME', field: 'itemName' },
    { width: '100px', title: 'PURCHASE_ORDER.ITEM.ITEM_TYPE', field: 'itemType' },
    { width: '100px', title: 'PURCHASE_ORDER.ITEM.UOM', field: 'unit' },
    { width: '100px', title: 'PURCHASE_ORDER.ITEM.QUANTITY', isRequired: 'true', field: 'quantity' },
    { width: '150px', title: 'PURCHASE_ORDER.ITEM.UNIT_PRICE', field: 'price' },
    { width: '150px', title: 'PURCHASE_ORDER.ITEM.INTO_MONEY', field: 'intoMoney' },
    { width: '200px', title: 'PURCHASE_ORDER.ITEM.EXPECTED_DATE', isRequired: 'true', field: 'expectedDate' },
    { width: '200px', title: 'PURCHASE_ORDER.ITEM.EXPECTED_RETURN_DATE', isRequired: 'true', field: 'responseDate' },
    { width: '150px', title: 'PURCHASE_ORDER.ITEM.PRODUCER_NAME', isRequired: 'true', field: 'producerName' },
    { width: '120px', title: 'PURCHASE_ORDER.ITEM.GUARANTEE', isRequired: 'true', field: 'guarantee' },
    { width: '100px', title: 'PURCHASE_ORDER.ITEM.IMPORT_LICENSE', field: 'hasImportLicense' },
    { width: '100px', title: 'PURCHASE_ORDER.ITEM.CONFORMITY', field: 'isConformity' },
    { width: '100px', title: 'PURCHASE_ORDER.ITEM.ENERGY_EFFICIENCY', field: 'hasEnergyEfficiency' },
    { width: '200px', title: 'PURCHASE_ORDER.ITEM.ORIGIN', field: 'itemOrigin' },
    { width: '200px', title: 'PURCHASE_ORDER.ITEM.TERM_ACCOUNT', field: 'termAccount' },
    { width: '200px', title: 'PURCHASE_ORDER.ITEM.PROJECT_MILESTONE', field: 'projectMilestone' },
    { width: '100px', title: 'COMMON.NOTE', field: 'note' },
    { width: '150px', title: 'PURCHASE_ORDER.ITEM.PROGRESS_STATUS', field: 'progressStatus' },
    { width: '100px', title: '', class: 'action', field: 'action' }
];

export const HEADER_INTERNAL_PROCESS = [
    { width: '80px', title: 'COMMON.NO' },
    { width: '280px', title: 'PURCHASE_ORDER.PR_NO' },
    { width: '130px', title: 'PURCHASE_ORDER.ITEM.ITEM_CODE' },
    { width: '150px', title: 'PURCHASE_ORDER.ITEM.PART_NO' },
    { width: '400px', title: 'PURCHASE_ORDER.ITEM.ITEM_NAME' },
    { width: '100px', title: 'PURCHASE_ORDER.ITEM.ITEM_TYPE' },
    { width: '100px', title: 'PURCHASE_ORDER.ITEM.EXPECTED_DATE' },
    { width: '100px', title: 'PURCHASE_ORDER.ITEM.EXPECTED_RETURN_DATE' },
    { width: '100px', title: 'PURCHASE_ORDER.ITEM.EXP_RES_DATE_LEAVE' },
    { width: '100px', title: 'PURCHASE_ORDER.ITEM.ACT_RES_DATE_LEAVE' },
    { width: '130px', title: 'PURCHASE_ORDER.ITEM.ACT_RES_DATE_COME' },
    { width: '130px', title: 'PURCHASE_ORDER.ITEM.STORAGE_DATE' }
];

export const ITEM_TYPE = [
    { value: 1, label: 'HW' },
    { value: 2, label: 'SW' },
    { value: 3, label: 'SRV' }
];

export const HEADER_ITEMS = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'ITEM.CODE', field: 'code' },
    { width: '400px', title: 'ITEM.NAME', field: 'name' },
    { width: '100px', title: 'ITEM.UNIT_CODE', field: 'unitCode' },
    { width: '100px', title: 'ITEM.UNIT_NAME', field: 'unitName' }
];

export const HEADER_TAX_CODE = [
    { width: '50px', title: 'COMMON.NO', field: '' },
    { width: '100px', title: 'TAX_CODE.NAME', field: 'name' },
    { width: '100px', title: 'TAX_CODE.DESCRIPTION', field: 'description' }
];

export const DLG_EDIT_CONFIG = {
    style: { width: '62vw' },
    baseZIndex: 10000,
    draggable: true,
    maximizable: true,
    title: 'COMMON.EDIT',
    btnTitle: 'COMMON.CRUD.UPDATE'
};

export const PROGRESS_STATUS = [
    { value: 1, label: 'Đang tạo hóa đơn' },
    { value: 2, label: 'Đã tạo hóa đơn' },
    { value: 3, label: 'Đang tạo lô hàng' },
    { value: 4, label: 'Đã tạo lô hàng' },
    { value: 5, label: 'Đang đồng bộ' },
    { value: 6, label: 'Đã đồng bộ' },
];

export const HEADER_BRAND = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'BRAND.CODE', field: 'code' },
    { width: '100px', title: 'BRAND.NAME_BRAND', field: 'name' }
];

export const COLS = [
    { width: '100px', title: 'COMMON.NO', field: 'indexNo' },
    { width: '100px', title: 'PURCHASE_REQUEST.ITEM.ITEM_CODE', field: 'itemCode' },
    { width: '100px', title: 'PURCHASE_REQUEST.ITEM.PART_NO', field: 'partNo' },
    { width: '300px', title: 'PURCHASE_REQUEST.ITEM.NAME', field: 'itemName' },
    { width: '100px', title: 'PURCHASE_REQUEST.ITEM.TYPE', field: 'itemType' },
    { width: '100px', title: 'PURCHASE_REQUEST.ITEM.UOM', field: 'unit' },
    { width: '100px', title: 'PURCHASE_REQUEST.ITEM.CURRENCY', field: 'currency' },
    { width: '100px', title: 'PURCHASE_REQUEST.ITEM.QUANTITY', field: 'quantity', isRequired: 'true' },
    { width: '100px', title: 'PURCHASE_REQUEST.ITEM.EXPECTED_PRICE', field: 'expectedPrice' },
    { width: '100px', title: 'PURCHASE_REQUEST.ITEM.INTO_MONEY', field: 'intoMoney' },
    { width: '100px', title: 'PURCHASE_REQUEST.ITEM.EXPECTED_DATE', field: 'expectedDate', isRequired: 'true' },
    { width: '100px', title: 'PURCHASE_REQUEST.ITEM.EXPECTED_RETURN_DATE', field: 'responseDate' },
    { width: '100px', title: 'PURCHASE_REQUEST.ITEM.SUPPLIER_NAME', field: 'supplierName' },
    { width: '100px', title: 'PURCHASE_REQUEST.ITEM.PRODUCER_NAME', field: 'producerName' },
    { width: '120px', title: 'PURCHASE_REQUEST.ITEM.GUARANTEE', field: 'guarantee', isRequired: 'true' },
    { width: '100px', title: 'PURCHASE_REQUEST.ITEM.DELIVERY_LOCATION', field: 'deliveryLocation' },
    { width: '100px', title: 'PURCHASE_REQUEST.ITEM.NOTE', field: 'note' },
    { width: '100px', title: 'PURCHASE_REQUEST.ORG_CODE', field: 'orgCode' },
    { width: '100px', title: 'Số PO/Hợp đồng', field: 'poCode' },
    { width: '100px', title: 'Trạng thái', field: 'classifyStatus' },
    { width: '100px', title: 'Ngày phân loại', field: 'classifyAt' },
    { width: '100px', title: 'Po man', field: 'poMan' },
];
