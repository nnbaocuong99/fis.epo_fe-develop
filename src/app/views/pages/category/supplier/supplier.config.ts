export const HEADER = [
    { width: '150px', title: 'COMMON.NO' },
    { width: '100px', title: 'SUPPLIER.VENDOR_ID' },
    { width: '150px', title: 'SUPPLIER.TYPE' },
    { width: '150px', title: 'SUPPLIER.CODE' },
    { width: '150px', title: 'SUPPLIER.TAX_CODE' },
    { width: '150px', title: 'SUPPLIER.NAME' },
    { width: '150px', title: 'SUPPLIER.INVOICE_ADDRESS' },
    { width: '150px', title: 'SUPPLIER.TRADING_ADDRESS' },
    { width: '150px', title: 'SUPPLIER.CREATED_BY' },
    { width: '150px', title: 'SUPPLIER.STATUS' },
    { width: '150px', title: 'SUPPLIER.EVALUATE' },
    { width: '150px', title: 'SUPPLIER.SYNC_SOURCE' },
    { width: '150px', title: 'SUPPLIER.SYNC_AT' },
    { width: '50px', header: '', maxWidth: '50px', class: 'action' }
];

export const HEADER_PO = [
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
    { width: '50px', header: '', maxWidth: '50px', class: '' }
];

export const AREA_TYPE = [
    { value: 1, label: 'PURCHASE_ORDER.PURCHASE_IN_THE_COUNTRY' },
    { value: 2, label: 'PURCHASE_ORDER.PURCHASE_FOREIGN' },
    { value: 3, label: 'PURCHASE_ORDER.ENTER_BUSINESS' },
    { value: 4, label: 'PURCHASE_ORDER.NON_COMMERCIAL' }
];

export const TABS = [
    { value: 'all', label: 'SUPPLIER.TAB.ALL', count: 0, class: 'badge-secondary' },
    { value: 'epo', label: 'SUPPLIER.TAB.EPO', count: 0, class: 'badge-secondary' },
    { value: 'erp', label: 'SUPPLIER.TAB.ERP', count: 0, class: 'badge-secondary' }
];

export const TYPE = [
    { value: 1, label: 'SUPPLIER.SUPPLIER_TYPE.DISTRIBUTORS' },
    { value: 2, label: 'SUPPLIER.SUPPLIER_TYPE.AGENCY' },
    { value: 3, label: 'SUPPLIER.SUPPLIER_TYPE.SUBCONTRACTORS' }
];

export const STATUS = [
    { value: 1, label: 'SUPPLIER.STATUS_INFO.ACTIVE' },
    { value: 0, label: 'SUPPLIER.STATUS_INFO.INACTIVE' }
];

export const COMMISSION_POLICY = [
    { value: 1, label: 'COMMON.ANSWER.YES' },
    { value: 0, label: 'COMMON.ANSWER.NO' }
];

export const HEADER_BANK = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '120px', title: 'SUPPLIER.BANK_INFO.NAME', isRequired: true },
    { width: '120px', title: 'SUPPLIER.BANK_INFO.ACCOUNT_NUMBER', isRequired: true },
    { width: '120px', title: 'SUPPLIER.BANK_INFO.RECEIVER_NAME', isRequired: true },
    { width: '50px', title: 'SUPPLIER.BANK_INFO.DEFAULT' },
    { width: '50px', header: '', maxWidth: '50px', class: 'action' }
];

export const HEADER_GUARANTEE_CENTER = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '120px', title: 'Tên trung tâm bảo hành', isRequired: true },
    { width: '120px', title: 'SUPPLIER.GUARANTEE_CENTER_INFO.ADDRESS', isRequired: true },
    { width: '120px', title: 'SUPPLIER.GUARANTEE_CENTER_INFO.PHONE_NUMBER', isRequired: true },
    { width: '50px', header: '', maxWidth: '50px', class: 'action' }
];

export const HEADER_SALES = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '120px', title: 'SUPPLIER.SALES_INFO.POSITION', isRequired: true },
    { width: '120px', title: 'SUPPLIER.SALES_INFO.FULL_NAME', isRequired: true },
    { width: '120px', title: 'SUPPLIER.SALES_INFO.PHONE_NUMBER', isRequired: true },
    { width: '120px', title: 'SUPPLIER.SALES_INFO.EMAIL', isRequired: true },
    { width: '120px', title: 'SUPPLIER.SALES_INFO.NOTE' },
    { width: '50px', header: '', maxWidth: '50px', class: 'action' }
];
