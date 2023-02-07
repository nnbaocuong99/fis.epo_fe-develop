export const TABS = [
  { value: 2, label: 'BP', count: 1, class: 'badge-secondary' },
  { value: 3, label: 'XNK', count: 1, class: 'badge-secondary' },
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
  { width: '100px', title: 'PURCHASE_REQUEST.ITEM.GUARANTEE', field: 'guarantee', isRequired: 'true' },
  { width: '100px', title: 'PURCHASE_REQUEST.ITEM.DELIVERY_LOCATION', field: 'deliveryLocation' },
  { width: '100px', title: 'PURCHASE_REQUEST.ITEM.NOTE', field: 'note' },
  { width: '100px', title: 'PURCHASE_REQUEST.ORG_CODE', field: 'orgCode' },
  { width: '100px', title: 'Số PO/Hợp đồng', field: 'poCode' },
  { width: '100px', title: 'Trạng thái', field: 'classifyStatus' },
  { width: '100px', title: 'Ngày phân loại', field: 'classifyAt' },
  { width: '100px', title: 'Po man', field: 'poMan' },
];

export const AREA_TYPE = [
  { value: 1, label: 'BP' },
  { value: 2, label: 'XNK' }
];

export const STATUS_PR = [
  { value: undefined, label: 'COMMON.ALL' },
  { value: 1, label: 'PURCHASE_REQUEST.TAB.DRAFT' },
  { value: 2, label: 'PURCHASE_REQUEST.TAB.WAITING_APPROVAL' },
  { value: 3, label: 'PURCHASE_REQUEST.TAB.APPROVED' },
  { value: 4, label: 'PURCHASE_REQUEST.TAB.REJECT' },
  { value: 5, label: 'PURCHASE_REQUEST.TAB.CANCEL' },
  { value: 6, label: 'PURCHASE_REQUEST.TAB.PROCESSING' },
  { value: 7, label: 'PURCHASE_REQUEST.TAB.FINISH' }
];

export const HEADER_COMPANY = [
  { width: '50px', title: 'COMMON.NO' },
  // { width: '200px', title: 'COMPANY.COMPANY_ID', field: 'companyId' },
  { width: '200px', title: 'COMPANY.CODE', field: 'code' },
  { width: '200px', title: 'COMPANY.NAME', field: 'name' },
  // { width: '200px', title: 'COMPANY.SYNC_SOURCE', field: 'syncSource' },
  // { width: '200px', title: 'COMPANY.SYNC_AT', field: 'createdAt', hasFormatDate: true }
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
  { width: '100px', title: 'COMMON.NO' },
  // { width: '200px', title: 'OPERATING_UNIT.OU_ID', field: 'ouId' },
  { width: '200px', title: 'OPERATING_UNIT.CODE', field: 'code' },
  { width: '200px', title: 'OPERATING_UNIT.NAME', field: 'name' },
  { width: '200px', title: 'OPERATING_UNIT.ADDRESS', field: 'address' },
  // { width: '200px', title: 'OPERATING_UNIT.SYNC_SOURCE', field: 'syncSource' },
  // { width: '200px', title: 'OPERATING_UNIT.SYNC_AT', field: 'createdAt', hasFormatDate: true }
];
