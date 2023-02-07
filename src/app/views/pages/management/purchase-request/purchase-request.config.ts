export const HEADER = [
    { width: '50px', title: 'COMMON.NO', field: 'indexNo' },
    { width: '150px', title: 'PURCHASE_REQUEST.CONTRACT_NO', field: 'contractNo' },
    { width: '150px', title: 'PURCHASE_REQUEST.PR_NO', field: 'prNo' },
    { width: '100px', title: 'PURCHASE_REQUEST.ORG_APPLY', field: 'orgApplyName' },
    { width: '50px', title: 'PURCHASE_REQUEST.ORG_CODE', field: 'orgCode' },
    { width: '100px', title: 'PURCHASE_REQUEST.LEGAL', field: 'legalName' },
    { width: '100px', title: 'PURCHASE_REQUEST.CREATE_AT', field: 'createdAt' },
    { width: '100px', title: 'PURCHASE_REQUEST.CREATOR', field: 'createdBy' },
    { width: '120px', title: 'PURCHASE_REQUEST.PROJECT_CODE', field: 'projectCode' },
    { width: '100px', title: 'PURCHASE_REQUEST.PR_TYPE', field: 'prType' },
    { width: '100px', title: 'PURCHASE_REQUEST.PR_CONTRACT_INFO', field: 'prContractInfo' },
    { width: '100px', title: 'PURCHASE_REQUEST.PR_STATUS', field: 'prStatus' },
    { width: '50px', title: '', maxWidth: '50px', class: 'action', field: 'action' }
];

export const PR_STATUS = [
    { value: 1, label: 'PURCHASE_REQUEST.TAB.DRAFT' },
    { value: 2, label: 'PURCHASE_REQUEST.TAB.WAITING_APPROVAL' },
    { value: 3, label: 'PURCHASE_REQUEST.TAB.APPROVED' },
    { value: 4, label: 'PURCHASE_REQUEST.TAB.REJECT' },
    { value: 5, label: 'PURCHASE_REQUEST.TAB.PROCESSING' },
    { value: 6, label: 'PURCHASE_REQUEST.TAB.FINISH' },
    { value: 7, label: 'PURCHASE_REQUEST.TAB.CANCEL' }
];

export const TABS = [
    { value: '', label: 'PURCHASE_REQUEST.TAB.ALL', count: 0, class: 'badge-secondary' },
    { value: 1, label: 'PURCHASE_REQUEST.TAB.DRAFT', count: 0, class: 'badge-secondary' },
    { value: 2, label: 'PURCHASE_REQUEST.TAB.WAITING_APPROVAL', count: 0, class: 'badge-secondary' },
    { value: 3, label: 'PURCHASE_REQUEST.TAB.APPROVED', count: 0, class: 'badge-info' },
    { value: 4, label: 'PURCHASE_REQUEST.TAB.REJECT', count: 0, class: 'badge-danger' },
    { value: 5, label: 'PURCHASE_REQUEST.TAB.PROCESSING', count: 0, class: 'badge-warning' },
    { value: 6, label: 'PURCHASE_REQUEST.TAB.FINISH', count: 0, class: 'badge-success' },
    { value: 7, label: 'PURCHASE_REQUEST.TAB.CANCEL', count: 0, class: 'badge-secondary' }
];

export const PR_TYPE = [
    { value: 1, label: 'PURCHASE_REQUEST.CONTRACT_OUTPUT' },
    { value: 2, label: 'PURCHASE_REQUEST.INTERNAL_USE' }
];

export const PR_CONTRACT_INFO = [
    { value: 1, label: 'PURCHASE_REQUEST.CONTRACT_OUTPUT_REGISTERED' },
    { value: 2, label: 'PURCHASE_REQUEST.CONTRACT_PRE_ORDER' },
    { value: 3, label: 'PURCHASE_REQUEST.PURCHASE_APPROVAL' }
];

export const HEADER_ORG = [
    { width: '100px', title: 'COMMON.NO' },
    { width: '200px', title: 'ORGANIZATION.ORG_ID', field: 'orgId' },
    { width: '200px', title: 'ORGANIZATION.CODE', field: 'code' },
    { width: '200px', title: 'ORGANIZATION.NAME', field: 'name' },
    { width: '200px', title: 'ORGANIZATION.SYNC_SOURCE', field: 'syncSource' },
    { width: '200px', title: 'ORGANIZATION.SYNC_AT', field: 'createdAt', hasFormatDate: true }
];

export const HEADER_OPERATING_UNIT = [
    { width: '100px', title: 'COMMON.NO' },
    { width: '200px', title: 'OPERATING_UNIT.OU_ID', field: 'ouId' },
    { width: '200px', title: 'OPERATING_UNIT.CODE', field: 'code' },
    { width: '200px', title: 'OPERATING_UNIT.NAME', field: 'name' },
    { width: '200px', title: 'OPERATING_UNIT.ADDRESS', field: 'address' },
    { width: '200px', title: 'OPERATING_UNIT.SYNC_SOURCE', field: 'syncSource' },
    { width: '200px', title: 'OPERATING_UNIT.SYNC_AT', field: 'createdAt', hasFormatDate: true }
];

export const PP_STATUS = [
    { value: 0, label: 'PURCHASE_REQUEST.TAB.DRAFT' },
    { value: 1, label: 'PURCHASE_REQUEST.TAB.PROCESSING' }
];
