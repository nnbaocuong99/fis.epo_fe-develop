export const PO_STATUS = [
    { value: 1, label: 'PURCHASE_ORDER.TAB.DRAFT' },
    { value: 2, label: 'PURCHASE_ORDER.TAB.WAITING_APPROVAL' },
    { value: 3, label: 'PURCHASE_ORDER.TAB.APPROVED' },
    { value: 4, label: 'PURCHASE_ORDER.TAB.REJECT' },
    { value: 5, label: 'PURCHASE_ORDER.TAB.PROCESSING' },
    { value: 6, label: 'PURCHASE_ORDER.TAB.FINISH' },
    { value: 7, label: 'PURCHASE_ORDER.TAB.CANCEL' },
    { value: 9, label: 'PURCHASE_ORDER.TAB.SAVE_DRAFT' }
];

export const TABS = [
    { value: '', label: 'PURCHASE_ORDER.TAB.ALL', count: 0, class: 'badge-secondary' },
    { value: '1', label: 'PURCHASE_ORDER.TAB.DRAFT', count: 0, class: 'badge-secondary' },
    { value: '2', label: 'PURCHASE_ORDER.TAB.WAITING_APPROVAL', count: 0, class: 'badge-secondary' },
    { value: '3', label: 'PURCHASE_ORDER.TAB.APPROVED', count: 0, class: 'badge-info' },
    { value: '4', label: 'PURCHASE_ORDER.TAB.REJECT', count: 0, class: 'badge-danger' },
    { value: '5', label: 'PURCHASE_ORDER.TAB.PROCESSING', count: 0, class: 'badge-warning' },
    { value: '6', label: 'PURCHASE_ORDER.TAB.FINISH', count: 0, class: 'badge-success' },
    { value: '7', label: 'PURCHASE_ORDER.TAB.CANCEL', count: 0, class: 'badge-secondary' },
    // { value: '9', label: 'PURCHASE_ORDER.TAB.SAVE_DRAFT', count: 0, class: 'badge-secondary' }
];

export const HEADER = [
    { width: '50px', title: 'COMMON.NO', field: 'indexNo' },
    { width: '150px', title: 'PURCHASE_ORDER.PROJECT_CODE', field: 'projectCode' },
    { width: '200px', title: 'PURCHASE_ORDER.PO_HD_NO', field: 'code' },
    { width: '100px', title: 'PURCHASE_ORDER.PROVIDER', field: 'supplierName' },
    { width: '100px', title: 'PURCHASE_ORDER.UNIT_PRICE', field: 'totalAmount' },
    { width: '100px', title: 'PURCHASE_ORDER.ORG_APPLY', field: 'orgApplyName' },
    { width: '100px', title: 'PURCHASE_ORDER.FORMAT_PO', field: 'areaType' },
    { width: '100px', title: 'PURCHASE_ORDER.PO_CONTRACT_TYPE', field: 'productType' },
    { width: '100px', title: 'PURCHASE_ORDER.STATUS_PO_HD', field: 'status' },
    { width: '100px', title: 'PURCHASE_ORDER.CREATE_AT', field: 'createdAt' },
    { width: '100px', title: 'PURCHASE_ORDER.CREATOR', field: 'createdBy' },
    { width: '100px', title: 'PURCHASE_ORDER.NOTE', field: 'note' },
    { width: '100px', title: 'PURCHASE_ORDER.IPO_NUMBER', field: 'allIpoNumber' },
    { width: '100px', title: 'PURCHASE_ORDER.SYNC_SOURCE', field: 'syncSource' },
    { width: '70px', title: '', maxWidth: '50px', class: 'action', field: 'action' },
];

export const AREA_TYPE = [
    { value: 1, label: 'PURCHASE_ORDER.PURCHASE_IN_THE_COUNTRY' },
    { value: 2, label: 'PURCHASE_ORDER.PURCHASE_FOREIGN' },
    { value: 3, label: 'PURCHASE_ORDER.ENTER_BUSINESS' },
    { value: 4, label: 'PURCHASE_ORDER.NON_COMMERCIAL' }
];

export const PRODUCT_TYPES = [
    { value: 1, label: 'HW' },
    { value: 2, label: 'SW' },
    { value: 3, label: 'PURCHASE_ORDER.SERVICE_CARRIER' },
    { value: 4, label: 'PURCHASE_ORDER.BIDDING_SERVICE' },
    { value: 5, label: 'PURCHASE_ORDER.INTEGRATED' }
];

export const TAX_PAYERS = [
    { value: 1, label: 'PURCHASE_ORDER.TAXABLE_FIS' },
    { value: 2, label: 'PURCHASE_ORDER.TAXABLE_SUPPLIER' },
    { value: 3, label: 'PURCHASE_ORDER.BOTH_TAXABLE' }
];

export const BUY_INTERNAL_USE = [
    { value: null, label: 'COMMON.ANSWER.NO' },
    { value: undefined, label: 'COMMON.ANSWER.NO' },
    { value: false, label: 'COMMON.ANSWER.NO' },
    { value: true, label: 'COMMON.ANSWER.YES' }
];

export const HEADER_USER = [
    { width: '50px', title: 'COMMON.NO' },
    // { width: '100px', title: 'BUYER.PERSON_ID', field: 'userId' },
    { width: '100px', title: 'BUYER.USER_NAME', field: 'userName' },
    { width: '300px', title: 'BUYER.LAST_NAME', field: 'fullName' },
    // { width: '200px', title: 'BUYER.SYNC_SOURCE', field: 'syncSource' },
    // { width: '200px', title: 'BUYER.SYNC_AT', field: 'syncAt', hasFormatDate: true }
];
