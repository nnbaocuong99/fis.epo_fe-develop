export const HEADER_ITEM = [
    { width: '100px', title: 'COMMON.NO', field: 'indexNo' },
    { width: '150px', title: 'PURCHASE_PLAN.ITEM.ITEM_CODE', field: 'itemCode' },
    { width: '150px', title: 'PURCHASE_PLAN.ITEM.PART_NO', field: 'partNo' },
    { width: '250px', title: 'PURCHASE_PLAN.ITEM.ITEM_NAME', field: 'itemName', isRequired: 'true' },
    { width: '100px', title: 'PURCHASE_PLAN.ITEM.ITEM_TYPE', field: 'itemType' },
    { width: '100px', title: 'PURCHASE_PLAN.ITEM.UNIT', field: 'unit' },
    { width: '100px', title: 'PURCHASE_PLAN.ITEM.CURRENCY', field: 'currency', isRequired: 'true' },
    { width: '100px', title: 'PURCHASE_PLAN.ITEM.QUANTITY', field: 'quantity', isRequired: 'true' },
    { width: '150px', title: 'PURCHASE_PLAN.ITEM.EXPECTED_PRICE', field: 'expectedPrice', isRequired: 'true' },
    { width: '150px', title: 'PURCHASE_PLAN.ITEM.PRICE', field: 'intoMoney' },
    { width: '150px', title: 'PURCHASE_PLAN.ITEM.EXPECTED_DATE', field: 'expectedDate', isRequired: 'true' },
    { width: '200px', title: 'PURCHASE_PLAN.ITEM.SUPPLIER_NAME', field: 'supplierName' },
    { width: '150px', title: 'PURCHASE_PLAN.ITEM.PRODUCER_NAME', field: 'producerName' },
    { width: '100px', title: 'PURCHASE_PLAN.ITEM.GUARANTEE', field: 'guarantee', isRequired: 'true' },
    { width: '200px', title: 'PURCHASE_PLAN.ITEM.DELIVERY_LOCATION', field: 'deliveryLocation' },
    { width: '300px', title: 'PURCHASE_PLAN.ITEM.NOTE', field: 'note' },
    { width: '70px', title: '', class: 'action', field: 'action' }
];

export const HEADER = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'PURCHASE_PLAN.PROJECT_CODE', isRequired: 'true' },
    { width: '200px', title: 'PURCHASE_PLAN.CONTRACT_NO', isRequired: 'true' },
    { width: '100px', title: 'PURCHASE_PLAN.CONTRACT_TYPE' },
    { width: '100px', title: 'PURCHASE_PLAN.CONTRACT_DESCRIPTION', isRequired: 'true' },
    { width: '100px', title: 'PURCHASE_PLAN.CUSTOMER' },
    { width: '100px', title: 'PURCHASE_PLAN.AM_ACCOUNT' },
    { width: '100px', title: 'PURCHASE_PtLAN.BM_ACCOUNT' },
    { width: '100px', title: 'PURCHASE_PLAN.CEO_COO' },
    { width: '100px', title: 'PURCHASE_PLAN.SIGN_DATE' },
    { width: '100px', title: 'PURCHASE_PLAN.END_DATE' },
    { width: '100px', title: 'PURCHASE_PLAN.NOTE' }
];

export const HEADER_PROJECT = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'Mã dự án', field: 'code', isRequired: 'true' },
    { width: '400px', title: 'Tên dự án', field: 'name' },
    { width: '400px', title: 'Mô tả', field: 'description' },
];

export const HEADER_ITEMS = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'ITEM.CODE', field: 'code' },
    { width: '400px', title: 'ITEM.NAME', field: 'name' },
    { width: '50px', title: 'ITEM.UNIT_CODE', field: 'unitCode' },
    { width: '60px', title: 'ITEM.UNIT_NAME', field: 'unitName' },
];

export const HEADER_SUPPLIER = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'SUPPLIER.CODE', field: 'code' },
    { width: '300px', title: 'SUPPLIER.NAME', field: 'name' },
    { width: '100px', title: 'SUPPLIER.TAX_CODE', field: 'taxCode' },
];

export const HEADER_CURRENCY = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'CURRENCY.CODE', field: 'code' },
    { width: '300px', title: 'CURRENCY.NAME', field: 'name' },
];

export const ITEM_TYPE = [
    { value: 1, label: 'HW' },
    { value: 2, label: 'SW' },
    { value: 3, label: 'SRV' }
];

export const UNITS = [
    { value: 1, label: 'CAI' },
    { value: 2, label: 'CHC' },
    { value: 3, label: 'Bo' }
];

export const HEADER_CUSTOMER = [
    { width: '50px', title: 'COMMON.NO', field: '' },
    { width: '100px', title: 'CUSTOMER.CODE', field: 'code' },
    { width: '100px', title: 'CUSTOMER.NAME', field: 'name' },
    { width: '100px', title: 'CUSTOMER.TAX_CODE', field: 'taxCode' },
    { width: '150px', title: 'CUSTOMER.ADDRESS', field: 'address' }
];
