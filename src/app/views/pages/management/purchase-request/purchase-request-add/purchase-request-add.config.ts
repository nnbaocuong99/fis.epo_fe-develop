export const TABS = [
    { value: 1, label: 'PURCHASE_REQUEST.TAB.ITEM', count: 0, class: 'badge-secondary' },
    { value: 2, label: 'PURCHASE_REQUEST.TAB.ATTACHMENT', count: 0, class: 'badge-secondary' }
];

export const HEADER = [
    { width: '34px', title: '', field: 'checkBox' },
    { width: '70px', title: 'COMMON.NO', field: 'indexNo' },
    { width: '100px', title: 'PURCHASE_REQUEST.ITEM.ITEM_CODE', field: 'itemCode' },
    { width: '100px', title: 'PURCHASE_REQUEST.ITEM.PART_NO', field: 'partNo' },
    { width: '300px', title: 'PURCHASE_REQUEST.ITEM.NAME', field: 'itemName', isRequired: true },
    { width: '100px', title: 'PURCHASE_REQUEST.ITEM.TYPE', field: 'itemType' },
    { width: '100px', title: 'PURCHASE_REQUEST.ITEM.UOM', field: 'unit' },
    { width: '100px', title: 'PURCHASE_REQUEST.ITEM.CURRENCY', field: 'currency', isRequired: true },
    { width: '100px', title: 'PURCHASE_REQUEST.ITEM.QUANTITY', field: 'quantity', isRequired: true },
    { width: '200px', title: 'PURCHASE_REQUEST.ITEM.EXPECTED_PRICE', field: 'expectedPrice', isRequired: true },
    { width: '200px', title: 'PURCHASE_REQUEST.ITEM.INTO_MONEY', field: 'intoMoney' },
    { width: '150px', title: 'PURCHASE_REQUEST.ITEM.EXPECTED_DATE', field: 'expectedDate', isRequired: true },
    { width: '200px', title: 'PURCHASE_REQUEST.ITEM.SUPPLIER_NAME', field: 'supplierName' },
    { width: '150px', title: 'PURCHASE_REQUEST.ITEM.PRODUCER_NAME', field: 'producerName' },
    { width: '100px', title: 'PURCHASE_REQUEST.ITEM.GUARANTEE', field: 'guarantee', isRequired: true },
    { width: '200px', title: 'PURCHASE_REQUEST.ITEM.DELIVERY_LOCATION', field: 'deliveryLocation' },
    { width: '200px', title: 'PURCHASE_REQUEST.ITEM.NOTE', field: 'note' },
    { width: '70px', title: '', maxWidth: '100px', class: 'action', field: 'action' }
];

export const HEADER_ITEMS = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'ITEM.CODE', field: 'code' },
    { width: '400px', title: 'ITEM.NAME', field: 'name' },
    { width: '100px', title: 'ITEM.UNIT_CODE', field: 'unitCode' },
    { width: '100px', title: 'ITEM.UNIT_NAME', field: 'unitName' },
];

export const HEADER_SUPPLIER = [
    { width: '50px', title: 'COMMON.NO' },
    // { width: '100px', title: 'SUPPLIER.VENDOR_ID', field: 'vendorId' },
    { width: '100px', title: 'SUPPLIER.CODE', field: 'code' },
    { width: '300px', title: 'SUPPLIER.NAME', field: 'name' },
    { width: '100px', title: 'SUPPLIER.TAX_CODE', field: 'taxCode' },
];

export const ITEM_TYPE = [
    { value: 1, label: 'HW' },
    { value: 2, label: 'SW' },
    { value: 3, label: 'SRV' }
];

export const UNITS = [
    { value: 1, label: 'Cái' },
    { value: 2, label: 'Chiếc' },
    { value: 3, label: 'Bộ' }
];

export const PR_TYPE = [
    { value: 1, label: 'PURCHASE_REQUEST.COMMERCE' },
    { value: 2, label: 'PURCHASE_REQUEST.INTERNAL' },
    { value: 3, label: 'PURCHASE_REQUEST.OTHER' },
];

export const STEPS = [
    { value: 1, label: 'PURCHASE_REQUEST.SELECT_PURCHASE_REQUEST', description: 'PURCHASE_REQUEST.PURCHASE_REQUEST_LIST' },
    { value: 2, label: 'PURCHASE_REQUEST.EDIT_PURCHASE_REQUEST', description: 'PURCHASE_REQUEST.PURCHASE_REQUEST_INFO' },
    { value: 3, label: 'PURCHASE_REQUEST.CHOOSE_ITEM', description: 'PURCHASE_REQUEST.ITEM_INFO' },
    { value: 4, label: 'PURCHASE_REQUEST.COMPLETED', description: 'PURCHASE_REQUEST.STATUS_CREATE' },
];

// export const PR_CONTRACT_STATUS = [
//     { value: 1, label: 'Đã ký hợp đồng đầu ra' },
//     { value: 2, label: 'Đặt hàng trước hợp đồng' },
// ];

// export const PR_ORGS = [
//     { value: 1, label: 'Mã org1' },
//     { value: 2, label: 'Mã org2' },
// ];

export const HEADER_PURCHASE_PLAN = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '200px', title: 'PURCHASE_PLAN.CODE' },
    { width: '200px', title: 'PURCHASE_PLAN.PROJECT_CODE' },
    { width: '200px', title: 'PURCHASE_PLAN.CONTRACT_NO' },
    { width: '90px', title: 'PURCHASE_PLAN.CONTRACT_TYPE' },
    { width: '200px', title: 'PURCHASE_PLAN.CUSTOMER' },
    { width: '100px', title: 'PURCHASE_PLAN.AM_ACCOUNT' },
    { width: '100px', title: 'PURCHASE_PLAN.PM_ACCOUNT' },
    { width: '120px', title: 'PURCHASE_PLAN.BOM_DATE' },
    { width: '200px', title: 'PURCHASE_PLAN.NOTE' },
    { width: '100px', title: 'PURCHASE_PLAN.STATUS' }
];

export const HEADER_ORG = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '200px', title: 'ORGANIZATION.CODE', field: 'code' },
    { width: '200px', title: 'ORGANIZATION.NAME', field: 'name' }
];

export const HEADER_OPERATING_UNIT = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '200px', title: 'OPERATING_UNIT.CODE', field: 'code' },
    { width: '200px', title: 'OPERATING_UNIT.NAME', field: 'name' },
    { width: '200px', title: 'OPERATING_UNIT.ADDRESS', field: 'address' }
];

export const HEADER_DEPARMENT = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '200px', title: 'DEPARTMENT.CODE', field: 'code' },
    { width: '200px', title: 'DEPARTMENT.NAME', field: 'name' }
];

export const PP_TABS = [
    { value: '0', label: 'PURCHASE_PLAN.TAB.DRAFT', count: 0, class: 'badge-secondary' },
    { value: '5', label: 'PURCHASE_PLAN.TAB.APPROVED', count: 0, class: 'badge-success' },
    { value: '1', label: 'PURCHASE_PLAN.TAB.PROCESSING', count: 0, class: 'badge-warning' }
];
