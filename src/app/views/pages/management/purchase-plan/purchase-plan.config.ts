export const HEADER = [
  { width: '30px', title: 'COMMON.NO', field: 'indexNo' },
  { width: '120px', title: 'PURCHASE_PLAN.CODE', field: 'code' },
  { width: '80px', title: 'PURCHASE_PLAN.PROJECT_CODE', field: 'projectCode' },
  { width: '160px', title: 'PURCHASE_PLAN.CONTRACT_NO', field: 'contractNo' },
  { width: '100px', title: 'PURCHASE_PLAN.CONTRACT_TYPE', field: 'contractType' },
  { width: '100px', title: 'PURCHASE_PLAN.CUSTOMER', field: 'customer' },
  { width: '100px', title: 'PURCHASE_PLAN.AM_ACCOUNT', field: 'amAccount' },
  { width: '100px', title: 'PURCHASE_PLAN.PM_ACCOUNT', field: 'pmAccount' },
  { width: '100px', title: 'PURCHASE_PLAN.BOM_DATE', field: 'createdAt' },
  { width: '100px', title: 'PURCHASE_PLAN.CREATOR', field: 'createdBy' },
  { width: '200px', title: 'PURCHASE_PLAN.NOTE', field: 'note' },
  { width: '150px', title: 'PURCHASE_PLAN.STATUS', field: 'status' },
  { width: '50px', title: '', class: 'action', field: 'action' }
];

export const PP_STATUS = [
  { value: 0, label: 'PURCHASE_PLAN.TAB.DRAFT' },
  { value: 1, label: 'PURCHASE_PLAN.TAB.PROCESSING' },
  { value: 2, label: 'PURCHASE_PLAN.TAB.FINISH' },
  { value: 3, label: 'PURCHASE_PLAN.TAB.CANCEL' },
  { value: 4, label: 'PURCHASE_PLAN.TAB.WAITING_APPROVAL' },
  { value: 5, label: 'PURCHASE_PLAN.TAB.APPROVED' },
  { value: 6, label: 'PURCHASE_PLAN.TAB.REJECT' }
];

export const TABS = [
  { value: '', label: 'PURCHASE_PLAN.TAB.ALL', count: 0, class: 'badge-secondary' },
  { value: '0', label: 'PURCHASE_PLAN.TAB.DRAFT', count: 0, class: 'badge-secondary' },
  { value: '1', label: 'PURCHASE_PLAN.TAB.PROCESSING', count: 0, class: 'badge-warning' },
  { value: '2', label: 'PURCHASE_PLAN.TAB.FINISH', count: 0, class: 'badge-success' },
  { value: '3', label: 'PURCHASE_PLAN.TAB.CANCEL', count: 0, class: 'badge-secondary' },
  { value: '4', label: 'PURCHASE_PLAN.TAB.WAITING_APPROVAL', count: 0, class: 'badge-secondary' },
  { value: '5', label: 'PURCHASE_PLAN.TAB.APPROVED', count: 0, class: 'badge-info' },
  { value: '6', label: 'PURCHASE_PLAN.TAB.REJECT', count: 0, class: 'badge-danger' }
];

export const PP_TYPE = [
  { value: 1, label: 'PURCHASE_PLAN.COMMERCE' },
  { value: 2, label: 'PURCHASE_PLAN.INTERNAL' },
  { value: 3, label: 'PURCHASE_PLAN.OTHER' }
];

export const HEADER_USER = [
  { width: '50px', title: 'COMMON.NO' },
  { width: '100px', title: 'BUYER.USER_NAME', field: 'userName' },
  { width: '300px', title: 'BUYER.LAST_NAME', field: 'fullName' }
];

export const PP_CONTRACT_INFO = [
  { value: 1, label: 'PURCHASE_PLAN.HAVE_CONTRACT' },
  { value: 2, label: 'PURCHASE_PLAN.BEFORE_CONTRACT' }
];

export const HEADER_PROJECT = [
  { width: '50px', title: 'COMMON.NO' },
  { width: '100px', title: 'PROJECT.PROJECT_ID', field: 'projectId', isRequired: 'true' },
  { width: '200px', title: 'PROJECT.CODE', field: 'code', isRequired: 'true' },
  { width: '400px', title: 'PROJECT.NAME', field: 'name' },
  { width: '100px', title: 'PROJECT.STATUS', field: 'status', isRequired: 'true' },
  { width: '100px', title: 'PROJECT.DESCRIPTION', field: 'Description' },
  { width: '100px', title: 'PROJECT.SYNC_SOURCE', field: 'SyncSource' },
  { width: '100px', title: 'PROJECT.SYNC_AT', field: 'SyncAt' }
];

export const HEADER_PR = [
  { width: '50px', title: 'COMMON.NO', field: 'indexNo' },
  { width: '150px', title: 'PURCHASE_REQUEST.CONTRACT_NO', field: 'contractNo' },
  { width: '150px', title: 'PURCHASE_REQUEST.PR_NO', field: 'prNo' },
  // { width: '100px', title: 'PURCHASE_REQUEST.ORG_APPLY', field: 'orgApplyName' },
  // { width: '50px', title: 'PURCHASE_REQUEST.ORG_CODE', field: 'orgCode' },
  // { width: '100px', title: 'PURCHASE_REQUEST.LEGAL', field: 'legalName' },
  { width: '100px', title: 'PURCHASE_REQUEST.CREATE_AT', field: 'createdAt' },
  { width: '100px', title: 'PURCHASE_REQUEST.CREATOR', field: 'createdBy' },
  // { width: '120px', title: 'PURCHASE_REQUEST.PROJECT_CODE', field: 'projectCode' },
  // { width: '100px', title: 'PURCHASE_REQUEST.PR_TYPE', field: 'prType' },
  // { width: '100px', title: 'PURCHASE_REQUEST.PR_CONTRACT_INFO', field: 'prContractInfo' },
  { width: '100px', title: 'PURCHASE_REQUEST.PR_STATUS', field: 'prStatus' },
  // { width: '50px', title: '', maxWidth: '50px', class: 'action', field: 'action' }
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

export const HEADER_PO = [
  { width: '50px', title: 'COMMON.NO', field: 'indexNo' },
  { width: '150px', title: 'PURCHASE_ORDER.PROJECT_CODE', field: 'projectCode' },
  { width: '200px', title: 'PURCHASE_ORDER.PO_HD_NO', field: 'code' },
  // { width: '100px', title: 'PURCHASE_ORDER.PROVIDER', field: 'supplierName' },
  // { width: '100px', title: 'PURCHASE_ORDER.UNIT_PRICE', field: 'totalAmount' },
  // { width: '100px', title: 'PURCHASE_ORDER.ORG_APPLY', field: 'orgApplyName' },
  { width: '100px', title: 'PURCHASE_ORDER.FORMAT_PO', field: 'areaType' },
  // { width: '100px', title: 'PURCHASE_ORDER.PO_CONTRACT_TYPE', field: 'productType' },
  { width: '100px', title: 'PURCHASE_ORDER.STATUS_PO_HD', field: 'status' },
  { width: '100px', title: 'PURCHASE_ORDER.CREATE_AT', field: 'createdAt' },
  { width: '100px', title: 'PURCHASE_ORDER.CREATOR', field: 'createdBy' },
  // { width: '100px', title: 'PURCHASE_ORDER.NOTE', field: 'note' },
  // { width: '100px', title: 'PURCHASE_ORDER.IPO_NUMBER', field: 'allIpoNumber' },
  // { width: '70px', title: '', maxWidth: '50px', class: 'action', field: 'action' },
];

export const PO_AREA_TYPE = [
  { value: 1, label: 'PURCHASE_ORDER.PURCHASE_IN_THE_COUNTRY' },
  { value: 2, label: 'PURCHASE_ORDER.PURCHASE_FOREIGN' },
  { value: 3, label: 'PURCHASE_ORDER.ENTER_BUSINESS' },
  { value: 4, label: 'PURCHASE_ORDER.NON_COMMERCIAL' }
];

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

export const HEADER_INVOICE = [
  { width: '50px', title: 'COMMON.NO', field: 'indexNo' },
  { width: '150px', title: 'PURCHASE_INVOICE.INVOICE_NUMBER', field: 'code' },
  { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_TYPE', field: 'invoiceType' },
  { width: '100px', title: 'PURCHASE_INVOICE.COST_TYPE', field: 'costType' },
  { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_DATE', field: 'date' },
  // { width: '100px', title: 'PURCHASE_INVOICE.TERMS_PAYMENT', field: 'paymentTerms' },
  // { width: '100px', title: 'PURCHASE_INVOICE.DUE_DATE', field: 'dueDate' },
  // { width: '150px', title: 'PURCHASE_INVOICE.INVOICE_VAULE', field: 'totalAmount' },
  // { width: '150px', title: 'PURCHASE_INVOICE.ACTUAL_INVOICE_VALUE', field: 'totalActual' },
  // { width: '150px', title: 'PURCHASE_INVOICE.INVOICE_INTERPRETATION', field: 'invoiceDesc' },
  // { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_STATUS', field: 'status' },
  // { width: '100px', title: 'PURCHASE_INVOICE.ERP_SYNC_STATUS', field: 'syncStatus' },
  // { width: '150px', title: 'PURCHASE_INVOICE.SUPPLIER', field: 'supplierName' },
  // { width: '150px', title: 'PURCHASE_INVOICE.WAYBILL_NUMBER', field: 'waybillNumber' },
  // { width: '100px', title: 'PURCHASE_INVOICE.PO_CONTRACT_NUMBER', field: 'poCode' },
  // { width: '100px', title: 'PURCHASE_INVOICE.PAYMENT_SUGGESTIONS_DATE', field: 'paymentSuggestionDate' },
  // { width: '100px', title: 'PURCHASE_INVOICE.ERP_INVOICE_ID', field: 'erpInvoiceId' },
  { width: '100px', title: 'PURCHASE_INVOICE.CREATOR', field: 'CreatorName' },
  // { width: '70px', title: '', class: 'action', field: 'action' }
];

export const HEADER_SHIPMENT = [
  { width: '50px', title: 'COMMON.NO', field: 'indexNo' },
  { width: '100px', title: 'SHIPMENT.WAYBILL_NUMBER', field: 'waybillNumber' },
  { width: '100px', title: 'SHIPMENT.MASTER_BILL_NO', field: 'masterBillNo' },
  { width: '100px', title: 'SHIPMENT.BILL_OF_LADING_DATE', field: 'billOfLadingDate' },
  // { width: '110px', title: 'SHIPMENT.EXPECTED_RETURN_DATE', field: 'expectedToDate' },
  // { width: '110px', title: 'SHIPMENT.ACT_RES_DATE_COME', field: 'actualToDate' },
  { width: '100px', title: 'SHIPMENT.SUPPLIER', field: 'smSupplierName' },
  { width: '100px', title: 'SHIPMENT.SHIPMENT_STATUS', field: 'smStatus' },
  // { width: '100px', title: 'SHIPMENT.PROFILE_STATUS', field: 'docStatus' },
  { width: '100px', title: 'SHIPMENT.STATUS_SYNC', field: 'syncStatus' },
  { width: '100px', title: 'SHIPMENT.SHIPMENT_CREATOR', field: 'creatorName' },
  // { width: '50px', title: '', maxWidth: '50px', class: 'action', field: 'action' }
];

export const SHIPMENT_STATUS = [
  { value: 1, label: 'Hàng EXW chưa giao' },
  { value: 2, label: 'Hàng đang đi đường' },
  { value: 3, label: 'Hàng đã về kho, chờ nhập ERP' },
  { value: 4, label: 'Đã nhập kho' },
  { value: 5, label: 'Huỷ' },
  { value: 9, label: 'Lưu nháp' }
];

export const SHIPMENT_SYNC_ERP = [
  { value: null, label: 'Chưa đồng bộ ERP' },
  { value: undefined, label: 'Chưa đồng bộ ERP' },
  { value: 0, label: 'Chưa đồng bộ ERP' },
  { value: 1, label: 'Chưa đồng bộ ERP' },
  { value: 2, label: 'Đã đồng bộ ERP' },
  { value: 3, label: 'Đã đồng bộ ERP' }
];
