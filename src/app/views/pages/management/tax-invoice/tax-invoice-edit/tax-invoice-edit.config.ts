export const STATUS_TAX_INVOICE = [
    { value: 1, label: 'Chưa map COM' },
    { value: 2, label: 'Đã map COM' },
    { value: 3, label: 'Chờ thanh toán' },
    { value: 4, label: 'Đã thanh toán' }
];

export const HEADER_USER = [
    { width: '50px', title: 'COMMON.NO' },
    // { width: '100px', title: 'BUYER.PERSON_ID', field: 'userId' },
    { width: '100px', title: 'BUYER.USER_NAME', field: 'userName' },
    { width: '300px', title: 'BUYER.LAST_NAME', field: 'fullName' },
    // { width: '200px', title: 'BUYER.SYNC_SOURCE', field: 'syncSource' },
    // { width: '200px', title: 'BUYER.SYNC_AT', field: 'syncAt', hasFormatDate: true }
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
    { value: 0, label: 'PURCHASE_PLAN.TAB.DRAFT' },
    { value: 1, label: 'PURCHASE_PLAN.TAB.PROCESSING' },
    { value: 2, label: 'PURCHASE_PLAN.TAB.FINISH' },
    { value: 3, label: 'PURCHASE_PLAN.TAB.CANCEL' }
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

