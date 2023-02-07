export const TABS = [
  { value: 1, label: 'PURCHASE_ORDER.TAB.ORDER_INFORMATION' },
  // { value: 2, label: 'PURCHASE_ORDER.TAB.PROFILE_CATEGORY' },
  // { value: 3, label: 'PURCHASE_ORDER.TAB.PO_STATUS' }
];

export const TABS_EDIT = [
  { value: 1, label: 'PURCHASE_ORDER.ORDER_INFORMATION' },
  { value: 2, label: 'PURCHASE_ORDER.PROFILE_APPENDIX' },
  { value: 3, label: 'PURCHASE_ORDER.PAYMENT_INFO' },
  { value: 4, label: 'PURCHASE_ORDER.ORDER_PROCESSING_STATUS' },
  // { value: 5, label: 'PURCHASE_ORDER.NOTIFICATION_SETTINGS' },
  { value: 6, label: 'PURCHASE_ORDER.VENDOR_RATING' }
];

export const AREA_TYPE_INTERNAL = [
  { value: 1, label: 'PURCHASE_ORDER.PURCHASE_IN_THE_COUNTRY' },
  { value: 2, label: 'PURCHASE_ORDER.PURCHASE_FOREIGN' }
];

export const AREA_TYPE_EXTERNAL = [
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

export const VALUE_TYPES = [
  { value: 1, label: 'PURCHASE_ORDER.PO' },
  { value: 2, label: 'PURCHASE_ORDER.CONTRACT' },
];

export const PO_VALUE = [
  { value: 1, label: 'PURCHASE_ORDER.PO_MILLION' },
  { value: 2, label: 'PURCHASE_ORDER.CONTRACT_MILLION' }
];

export const UNITS = [
  { value: 1, label: 'FIS FSB HN' },
  { value: 2, label: 'FIS BP HN' },
  { value: 3, label: 'FIS BNK HN' },
  { value: 4, label: 'FIS ERP HN' },
  { value: 5, label: 'Sub deparment' }
];

export const HEADER_CATEGORY = [
  { width: '100px', title: 'COMMON.NO' },
  { width: '200px', title: 'PURCHASE_ORDER.ATTACHMENT_NAME' },
  { width: '100px', title: 'Checklist required' },
  { width: '300px', title: 'PURCHASE_ORDER.ATTACHED_FILES' },
  { width: '100px', title: 'PURCHASE_ORDER.STATUS' },
  { width: '300px', title: 'PURCHASE_ORDER.NOTE' }
];

export const HEADER_STATUS = [
  { width: '100px', title: 'COMMON.NO' },
  { width: '100px', title: 'Danh sách Item' },
  { width: '100px', title: 'PO' },
  { width: '400px', title: 'Lô hàng đi được' },
  { width: '100px', title: 'Nhập kho' },
  { width: '100px', title: 'Ghi chú' }
];

export const STEPS = [
  { value: 1, label: 'PURCHASE_ORDER.LIST_OF_PURCHASE_REQUEST', description: 'PURCHASE_ORDER.PURCHASE_REQUEST_INTERNAL/EXTERNAL' },
  { value: 2, label: 'PURCHASE_ORDER.ORDER_INFORMATION', description: 'PURCHASE_ORDER.ORDER_DETAILS' },
  { value: 3, label: 'PURCHASE_ORDER.PRODUCT_INFORMATION', description: 'PURCHASE_ORDER.PRODUCT_DETAILS' },
  { value: 4, label: 'PURCHASE_ORDER.COMPLETED', description: 'PURCHASE_ORDER.PROCESSING_STATUS' },
];

export const TAX_PAYERS = [
  { value: 1, label: 'PURCHASE_ORDER.TAXABLE_FIS' },
  { value: 2, label: 'PURCHASE_ORDER.TAXABLE_SUPPLIER' },
  { value: 3, label: 'PURCHASE_ORDER.BOTH_TAXABLE' }
];

export const HEADER_SUPPLIER = [
  { width: '50px', title: 'COMMON.NO' },
  // { width: '100px', title: 'SUPPLIER.VENDOR_ID', field: 'vendorId' },
  { width: '100px', title: 'SUPPLIER.CODE', field: 'code' },
  { width: '300px', title: 'SUPPLIER.NAME', field: 'name' },
  { width: '100px', title: 'SUPPLIER.TAX_CODE', field: 'taxCode' },
  // { width: '200px', title: 'SUPPLIER.SYNC_SOURCE', field: 'syncSource' },
  // { width: '200px', title: 'SUPPLIER.SYNC_AT', field: 'syncAt', hasFormatDate: true }
];

export const HEADER_PROJECT = [
  { width: '50px', title: 'COMMON.NO' },
  { width: '200px', title: 'PROJECT.CODE', field: 'code', isRequired: 'true' },
  { width: '400px', title: 'PROJECT.NAME', field: 'name' },
  { width: '100px', title: 'PROJECT.STATUS', field: 'status', isRequired: 'true' },
  { width: '100px', title: 'PROJECT.DESCRIPTION', field: 'Description' },
];

export const HEADER_SUPPLIER_SITE = [
  { width: '50px', title: 'COMMON.NO' },
  // { width: '100px', title: 'SUPPLIER_SITE.VENDOR_ID', field: 'vendorId' },
  // { width: '100px', title: 'SUPPLIER_SITE.SITE_ID', field: 'siteId' },
  // { width: '100px', title: 'SUPPLIER_SITE.CODE', field: 'code' },
  { width: '200px', title: 'SUPPLIER_SITE.NAME', field: 'name' },
  { width: '300px', title: 'SUPPLIER_SITE.ADDRESS', field: 'address' },
  // { width: '200px', title: 'SUPPLIER_SITE.SYNC_SOURCE', field: 'syncSource' },
  // { width: '200px', title: 'SUPPLIER_SITE.SYNC_AT', field: 'syncAt', hasFormatDate: true }
];

export const HEADER_PO = [
  { width: '50px', title: 'COMMON.NO' },
  { width: '100px', title: 'PURCHASE_ORDER.PROJECT_CODE', field: 'projectCode' },
  { width: '100px', title: 'PURCHASE_ORDER.PR_NO' },
  { width: '100px', title: 'PURCHASE_ORDER.PO_HD_NO', field: 'code' },
  { width: '100px', title: 'PURCHASE_ORDER.PROVIDER', field: 'supplierName' },
  { width: '100px', title: 'PURCHASE_ORDER.UNIT_PRICE' },
  { width: '100px', title: 'PURCHASE_ORDER.ORG_APPLY', field: 'orgApply' },
  { width: '100px', title: 'PURCHASE_ORDER.FORMAT_PO', field: 'areaType' },
  { width: '100px', title: 'PURCHASE_ORDER.PO_CONTRACT_TYPE', field: 'productType' },
  { width: '100px', title: 'PURCHASE_ORDER.STATUS_PO_HD', field: 'status' },
  { width: '100px', title: 'PURCHASE_ORDER.CREATE_AT', field: 'createdAt', hasFormatDate: true }
];

export const HEADER_ORG = [
  { width: '50px', title: 'COMMON.NO' },
  // { width: '200px', title: 'ORGANIZATION.ORG_ID', field: 'orgId' },
  { width: '200px', title: 'ORGANIZATION.CODE', field: 'code' },
  { width: '200px', title: 'ORGANIZATION.NAME', field: 'name' },
  // { width: '200px', title: 'ORGANIZATION.SYNC_SOURCE', field: 'syncSource' },
  // { width: '200px', title: 'ORGANIZATION.SYNC_AT', field: 'createdAt', hasFormatDate: true }
];

export const HEADER_OPERATING_UNIT = [
  { width: '50px', title: 'COMMON.NO' },
  // { width: '200px', title: 'OPERATING_UNIT.OU_ID', field: 'ouId' },
  { width: '100px', title: 'OPERATING_UNIT.CODE', field: 'code' },
  { width: '200px', title: 'OPERATING_UNIT.NAME', field: 'name' },
  { width: '200px', title: 'OPERATING_UNIT.ADDRESS', field: 'address' },
  // { width: '200px', title: 'OPERATING_UNIT.SYNC_SOURCE', field: 'syncSource' },
  // { width: '200px', title: 'OPERATING_UNIT.SYNC_AT', field: 'createdAt', hasFormatDate: true }
];

export const HEADER_DEPARMENT = [
  { width: '50px', title: 'COMMON.NO' },
  // { width: '200px', title: 'DEPARTMENT.DEPARTMENT_ID', field: 'subDepartmentId' },
  { width: '200px', title: 'DEPARTMENT.CODE', field: 'code' },
  { width: '200px', title: 'DEPARTMENT.NAME', field: 'name' },
  // { width: '200px', title: 'DEPARTMENT.SYNC_SOURCE', field: 'syncSource' },
  // { width: '200px', title: 'DEPARTMENT.SYNC_AT', field: 'syncAt', hasFormatDate: true }
];

export const HEADER_PAYMENT_TERM = [
  { width: '50px', title: 'COMMON.NO' },
  { width: '200px', title: 'PAYMENT_TERM.NAME', field: 'name' },
  { width: '200px', title: 'PAYMENT_TERM.DESCRIPTION', field: 'description' },
  { width: '200px', title: 'PAYMENT_TERM.CREATE_AT', field: 'createdAt', hasFormatDate: true }
];
