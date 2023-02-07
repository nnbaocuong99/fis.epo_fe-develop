export const IMPORT_TYPE = [
    { value: 1, label: 'IMPORT_GOODS.BILL_OF_LADING' },
    { value: 2, label: 'IMPORT_GOODS.INVOICE' }
];

export const STATUS_IMPORT_GOODS = [
    { value: [null, undefined], label: 'IMPORT_GOODS.NOT_YET_GOODS_GOODS' },
    { value: 1, label: 'IMPORT_GOODS.WAIT_IMPORT_GOODS' },
    { value: 2, label: 'IMPORT_GOODS.IMPORTING_GOODS' },
    { value: 3, label: 'IMPORT_GOODS.COMPLETED' }
];

export const ELIMSTATUS_ELIM_STATUS = [
    { value: [null, undefined], label: 'IMPORT_GOODS.UNALLOCATED' },
    { value: 0, label: 'IMPORT_GOODS.UNALLOCATED' },
    { value: 1, label: 'IMPORT_GOODS.UNALLOCATED' },
    { value: 2, label: 'IMPORT_GOODS.ALREADY_ALLOCATED' },
    { value: 3, label: 'IMPORT_GOODS.ALREADY_ALLOCATED' }
];

export const STATUS_ELIMINATION = [
    { value: [null, undefined, 1], label: 'IMPORT_GOODS.UNALLOCATED' },
    { value: 2, label: 'IMPORT_GOODS.ALREADY_ALLOCATED' }
];

export const TABS = [
    { value: '', label: 'IMPORT_GOODS.TAB.ALL', count: 0, disabled: false, class: 'badge-secondary' },
    { value: '1', label: 'IMPORT_GOODS.TAB.WAITING_IMPORT_GOODS', count: 0, disabled: false, class: 'badge-secondary' },
    { value: '2', label: 'IMPORT_GOODS.TAB.PROCESSING', count: 0, disabled: false, class: 'badge-warning' },
    { value: '3', label: 'IMPORT_GOODS.TAB.FINISH', count: 0, disabled: false, class: 'badge-success' },
];

export const IMPORT_TABS = [
    { value: '1', label: 'IMPORT_GOODS.IMPORT_GOODS', count: 0, class: 'badge-secondary' },
    // { value: '2', label: 'Xuất nhập hợp quy, hiệu suất năng lượng', count: 0, class: 'badge-warning' },
    { value: '3', label: 'IMPORT_GOODS.ALLOCATION', count: 0, class: 'badge-success' },
];

export const COL_SHIPMENT = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '120px', title: 'IMPORT_GOODS.WAYBILL_NUMBER' },
    { width: '120px', title: 'IMPORT_GOODS.MASTER_BILL_NO' },
    { width: '120px', title: 'IMPORT_GOODS.BILL_OF_LADING_DATE' },
    { width: '120px', title: 'IMPORT_GOODS.DECLARATION_NUMBER' },
    { width: '120px', title: 'IMPORT_GOODS.DECLARATION_DATE' },
    { width: '120px', title: 'IMPORT_GOODS.SUPPLIER_NAME' },
    { width: '120px', title: 'IMPORT_GOODS.STATUS' },
    { width: '120px', title: 'IMPORT_GOODS.ELIM_STATUS' },
    { width: '120px', title: 'IMPORT_GOODS.CREATE_BY' },
];

export const COL_INVOICE = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '120px', title: 'IMPORT_GOODS.PI_CODE' },
    { width: '120px', title: 'IMPORT_GOODS.PO_CODE' },
    { width: '120px', title: 'IMPORT_GOODS.SUB_DEPARTMENT' },
    { width: '120px', title: 'IMPORT_GOODS.INVOICE_DATE' },
    { width: '120px', title: 'IMPORT_GOODS.SUPPLIER_NAME' },
    { width: '120px', title: 'IMPORT_GOODS.STATUS' },
    { width: '120px', title: 'IMPORT_GOODS.ELIM_STATUS' },
    { width: '120px', title: 'IMPORT_GOODS.CREATE_BY' },
];

export const COL_SHIPMENT_ITEM = [
    { width: '100px', header: 'COMMON.NO', field: 'indexNo' },
    { width: '150px', header: 'SHIPMENT.PROJECT_CODE', field: 'projectCode' },
    { width: '200px', header: 'SHIPMENT.PO_CODE', field: 'poCode' },
    { width: '100px', header: 'SHIPMENT.ITEM.ITEM_CODE', field: 'itemCode' },
    { width: '100px', header: 'SHIPMENT.ITEM.PART_NO', field: 'partNo' },
    { width: '300px', header: 'SHIPMENT.ITEM.ITEM_NAME', field: 'itemName' },
    { width: '100px', header: 'SHIPMENT.ITEM.ITEM_TYPE', field: 'itemType' },
    { width: '100px', header: 'SHIPMENT.ITEM.NOTE' },
    { width: '100px', header: 'SHIPMENT.ITEM.UOM', field: 'unit' },
    { width: '100px', header: 'SHIPMENT.ITEM.QUANTITY', field: 'quantity' },
    { width: '100px', header: 'SHIPMENT.ITEM.PRICE', field: 'price' },
    { width: '100px', header: 'SHIPMENT.ITEM.INTO_MONEY', field: 'intoMoney' },
    { width: '100px', header: 'SHIPMENT.ITEM.ORINGIN', field: 'oringin' },
    { width: '100px', header: 'SHIPMENT.ITEM.ORG_CODE', field: 'orgCode' },
    { width: '200px', header: 'IMPORT_GOODS.ITEM.SUB_INVENTORY', field: 'subInventory' },
    { width: '100px', header: 'PURCHASE_ORDER.ITEM.QUANTITY_WRONG_OTHER' },
    { width: '200px', header: 'IMPORT_GOODS.ITEM.NOTE' }
];

export const COL_INVOICE_ITEM = [
    { width: '100px', header: 'COMMON.NO', field: 'indexNo' },
    { width: '150px', header: 'PURCHASE_INVOICE.PROJECT_CODE', field: 'projectCode' },
    { width: '200px', header: 'PURCHASE_INVOICE.PO_CODE', field: 'poCode' },
    { width: '100px', header: 'PURCHASE_INVOICE.ITEM.ITEM_CODE', field: 'itemCode' },
    { width: '100px', header: 'PURCHASE_INVOICE.ITEM.PART_NO', field: 'partNo' },
    { width: '300px', header: 'PURCHASE_INVOICE.ITEM.ITEM_NAME', field: 'itemName' },
    { width: '100px', header: 'PURCHASE_INVOICE.ITEM.ITEM_TYPE', field: 'itemType' },
    { width: '100px', header: 'PURCHASE_INVOICE.ITEM.QUANTITY', field: 'quantity' },
    { width: '100px', header: 'PURCHASE_INVOICE.ITEM.UOM', field: 'unit' },
    { width: '100px', header: 'PURCHASE_INVOICE.ITEM.PRICE', field: 'price' },
    { width: '100px', header: 'PURCHASE_INVOICE.ITEM.INTO_MONEY', field: 'intoMoney' },
    { width: '100px', header: 'PURCHASE_ORDER.ITEM.EXPECTED_RETURN_DATE', field: 'expectedDate' },
    { width: '100px', header: 'PURCHASE_INVOICE.ITEM.ORG_CODE', field: 'orgCode' },
    { width: '200px', header: 'PURCHASE_INVOICE.ITEM.SUB_INVENTORY', field: 'subInventory' },
    { width: '200px', header: 'PURCHASE_INVOICE.ITEM.TERM_ACCOUNT', field: 'termAccount' }
];

export const COL_SYNC_STATUS = [
    [
        { width: '80px', header: 'COMMON.NO', rowSpan: 2 },
        { width: '120px', header: 'IMPORT_GOODS.WAYBILL_NUMBER_INVOICE', rowSpan: 2 },
        { width: '400px', header: 'IMPORT_GOODS.IMPORT_GOODS', colSpan: 3 },
        { width: '400px', header: 'IMPORT_GOODS.ALLOCATION', colSpan: 3 }
    ],
    [
        { width: '100px', header: 'PURCHASE_ORDER.STATUS' },
        { width: '100px', header: 'IMPORT_GOODS.SYNC_DATE' },
        { width: '200px', header: 'IMPORT_GOODS.EXECUTOR' },
        { width: '100px', header: 'PURCHASE_ORDER.STATUS' },
        { width: '100px', header: 'IMPORT_GOODS.SYNC_DATE' },
        { width: '200px', header: 'IMPORT_GOODS.EXECUTOR' },
    ]
];

export const COL_ELIM_VIEW_INVOICE_S = [
    [
        { width: '100px', header: 'SHIPMENT.WAYBILL_NUMBER', rowSpan: 2 },
        { width: '100px', header: 'IMPORT_GOODS.INVOICE_GOODS_AND_SERVICES', rowSpan: 2 },
        { width: '100px', header: 'IMPORT_GOODS.IMPORT_TAX', rowSpan: 2 },
        { width: '100px', header: 'IMPORT_GOODS.IMPORT_VAT', rowSpan: 2 },
        { width: '300px', header: 'IMPORT_GOODS.FREEIGHT_COST', colSpan: 3 },
        { width: '100px', header: 'IMPORT_GOODS.INSURRANCE', rowSpan: 2 },
        { width: '200px', header: 'IMPORT_GOODS.NOTE', rowSpan: 2 }
    ],
    [
        { width: '100px', header: 'IMPORT_GOODS.ORIGINAL_CURRENCY_VALUE' },
        { width: '100px', header: 'EXCHANGE_RATE_CURRENCY.CONVERSION_RATE' },
        { width: '100px', header: 'IMPORT_GOODS.EXCHANGE_VALUE' }
    ]
];

export const COL_ELIM_VIEW_INVOICE_PI = [
    { width: '100px', header: 'PURCHASE_INVOICE.INVOICE_NUMBER', rowSpan: 2 },
    { width: '100px', header: 'PURCHASE_INVOICE.TOTAL_AMOUNT', rowSpan: 2 },
    { width: '200px', header: 'IMPORT_GOODS.NOTE', rowSpan: 2 }
];

export const COL_ELIM_INVENT_DETAIL_S = [
    { width: '100px', header: 'COMMON.NO', index: 0 },
    { width: '150px', header: 'IMPORT_GOODS.PO_CODE', index: 1 },
    { width: '100px', header: 'IMPORT_GOODS.ITEM.ITEM_CODE', index: 2 },
    { width: '300px', header: 'IMPORT_GOODS.ITEM.ITEM_NAME', index: 3 },
    { width: '100px', header: 'IMPORT_GOODS.ITEM.QUANTITY', index: 4 },
    { width: '200px', header: 'IMPORT_GOODS.ITEM.UNIT_PRICE', index: 5 },
    { width: '200px', header: 'IMPORT_GOODS.ITEM.TOTAL_CURRENCY_ORIGINAL', index: 6 },
    { width: '200px', header: 'IMPORT_GOODS.ITEM.TOTAL_EXCHANGE_TO_VND', index: 7 },
    { width: '200px', header: 'IMPORT_GOODS.IMPORT_TAX', index: 8 },
    { width: '200px', header: 'IMPORT_GOODS.ITEM.VAT_NOT_DEDUCTION', index: 9 },
    { width: '100px', header: 'IMPORT_GOODS.ITEM.RATIO', index: 10 },
    { width: '200px', header: 'IMPORT_GOODS.ITEM.FREIGHT', index: 11 },
    { width: '200px', header: 'IMPORT_GOODS.INSURRANCE', index: 12 },
    { width: '200px', header: 'IMPORT_GOODS.ITEM.FCT', index: 13 },
    { width: '200px', header: 'IMPORT_GOODS.ITEM.PRICES_INCLUDE_CHARGES', index: 14 },
    { width: '200px', header: 'IMPORT_GOODS.ITEM.TOTAL_PRICE_IMPORT_INVENTORY', index: 15 },
    { width: '200px', header: 'IMPORT_GOODS.ITEM.RESALE_UNIT_PRICE', index: 16 },
    { width: '200px', header: 'IMPORT_GOODS.ITEM.NOTE', index: 17 }
];

export const COL_ELIM_INVENT_DETAIL_PI = [
    { width: '100px', header: 'COMMON.NO', index: 0 },
    { width: '150px', header: 'IMPORT_GOODS.PO_CODE', index: 1 },
    { width: '100px', header: 'IMPORT_GOODS.PI_CODE', index: 2 },
    { width: '100px', header: 'IMPORT_GOODS.ITEM.ITEM_CODE', index: 3 },
    { width: '300px', header: 'IMPORT_GOODS.ITEM.ITEM_NAME', index: 4 },
    { width: '100px', header: 'IMPORT_GOODS.ITEM.QUANTITY', index: 5 },
    { width: '200px', header: 'IMPORT_GOODS.ITEM.UNIT_PRICE', index: 6 },
    { width: '200px', header: 'IMPORT_GOODS.ITEM.TOTAL_CURRENCY_ORIGINAL', index: 7 },
    { width: '200px', header: 'IMPORT_GOODS.ITEM.TOTAL_EXCHANGE_TO_VND', index: 8 },
    { width: '100px', header: 'IMPORT_GOODS.ITEM.RATIO', index: 9 },
    { width: '200px', header: 'IMPORT_GOODS.ITEM.FCT', index: 10 },
    { width: '200px', header: 'IMPORT_GOODS.ITEM.TOTAL_PRICE_IMPORT_INVENTORY', index: 11 },
    { width: '200px', header: 'IMPORT_GOODS.ITEM.RESALE_UNIT_PRICE', index: 12 },
    { width: '200px', header: 'IMPORT_GOODS.ITEM.NOTE', index: 13 }
];

export const COL_ELIM_INVENT_INFO = [
    { width: '200px', header: 'IMPORT_GOODS.ORIGINAL_CURRENCY_CHARGE' },
    { width: '200px', header: 'IMPORT_GOODS.EXCHANGE_RATE_FREIGHT' },
    { width: '200px', header: 'IMPORT_GOODS.REDEMPTION_FEE_VND' },
    { width: '200px', header: 'IMPORT_GOODS.INSURRANCE' },
    { width: '200px', header: 'IMPORT_GOODS.IMPORT_TAX' },
    { width: '200px', header: 'IMPORT_GOODS.IMPORT_VAT_2' },
    { width: '200px', header: 'IMPORT_GOODS.NOTE' }
];

export const ELIM_TYPE = {
    1: 'IMPORT_GOODS.VIEW_INVOICE',
    2: 'IMPORT_GOODS.MANUAL_INVENT',
    3: 'IMPORT_GOODS.MANUAL_AP'
};

export const HEADER_ALLOCATION_SHIPMENT = [
    { width: '50px', header: 'COMMON.NO' },
    { width: '100px', header: 'IMPORT_GOODS.TYPE' },
    { width: '100px', header: 'IMPORT_GOODS.ALLOCATION_DATE' },
    { width: '100px', header: 'PURCHASE_ORDER.STATUS' },
    { width: '100px', header: 'IMPORT_GOODS.ID_UPDATE_COST_ERP' },
    { width: '100px', header: '', class: 'action' }
];

export const ELIM_TYPE_LABEL = [
    { value: 1, label: 'IMPORT_GOODS.VIEW_INVOICE' },
    { value: 2, label: 'IMPORT_GOODS.MANUAL_INVENT' },
    { value: 3, label: 'IMPORT_GOODS.MANUAL_AP' }
];

export const ELIM_SYNC_STATUS = [
    { value: null, label: 'IMPORT_GOODS.NOT_YET_SYNC_ERP' },
    { value: undefined, label: 'IMPORT_GOODS.NOT_YET_SYNC_ERP' },
    { value: -1, label: 'IMPORT_GOODS.ERROR_SYNC_UPDATE_COST_ERP' },
    { value: 0, label: 'IMPORT_GOODS.NOT_YET_SYNC_ERP' },
    { value: 1, label: '' },
    { value: 2, label: 'IMPORT_GOODS.ALREADY_SYNC_ERP' },
    { value: 3, label: 'IMPORT_GOODS.ALREADY_SYNC_ERP' }
];
