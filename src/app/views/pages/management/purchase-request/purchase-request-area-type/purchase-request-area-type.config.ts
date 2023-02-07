export const TABS = [
  { value: '3', label: 'PURCHASE_REQUEST.TAB.UNCATEGORIZED', count: 0, class: 'badge-danger' },
  { value: '1', label: 'PURCHASE_REQUEST.TAB.INTERNAL_PURCHASE_REQUEST', count: 0, class: 'badge-success' },
  { value: '4', label: 'PURCHASE_REQUEST.TAB.WAIT_FOR_CONFIRMATION', count: 0, class: 'badge-danger' },
  { value: '5', label: 'PURCHASE_REQUEST.TAB.WAIT_FOR_APPROVAL', count: 0, class: 'badge-danger' },
  { value: '2', label: 'PURCHASE_REQUEST.TAB.FOREIGN_PURCHASE_REQUEST', count: 0, class: 'badge-warning' },
  { value: 'all', label: 'PURCHASE_REQUEST.TAB.ALL', count: 0, class: 'badge-secondary' }
];

export const COLS = [
  { width: '50px', title: 'COMMON.NO', field: 'indexNo' },
  { width: '150px', title: 'PURCHASE_REQUEST.CLASSIFY', field: 'areaType' },
  { width: '120px', title: 'COMMON.REJECT', field: 'reject' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.REJECT_NOTE', field: 'rejectNote' },
  { width: '100px', title: 'PURCHASE_REQUEST.ITEM.IPO_NUMBER', field: 'ipoNumber' },
  { width: '100px', title: 'PURCHASE_REQUEST.ITEM.ITEM_CODE', field: 'itemCode' },
  { width: '100px', title: 'PURCHASE_REQUEST.ITEM.PART_NO', field: 'partNo' },
  { width: '200px', title: 'PURCHASE_REQUEST.ITEM.NAME', field: 'itemName' },
  { width: '60px', title: 'PURCHASE_REQUEST.ITEM.CURRENCY', field: 'currency' },
  { width: '100px', title: 'PURCHASE_REQUEST.ITEM.SUPPLIER_NAME', field: 'supplierName' },
  { width: '100px', title: 'PURCHASE_REQUEST.ITEM.PRODUCER_NAME', field: 'producerName' },
  { width: '50px', title: '', maxWidth: '50px', class: 'action', field: 'action' }
];


export const SAVE_COLS = [
  { width: '80px', title: 'COMMON.NO', field: 'indexNo' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.AREA_TYPE', field: 'areaType' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.REJECT_NOTE', field: 'rejectNote' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.IPO_NUMBER', field: 'ipoNumber' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.ITEM_CODE', field: 'itemCode' },
  { width: '200px', title: 'PURCHASE_REQUEST.ITEM.PART_NO', field: 'partNo' },
  { width: '300px', title: 'PURCHASE_REQUEST.ITEM.NAME', field: 'itemName' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.TYPE', field: 'itemType' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.UOM', field: 'unit' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.CURRENCY', field: 'currency' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.QUANTITY', field: 'quantity', isRequired: 'true' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.EXPECTED_PRICE', field: 'expectedPrice' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.INTO_MONEY', field: 'intoMoney' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.EXPECTED_DATE', field: 'expectedDate', isRequired: 'true' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.EXPECTED_RETURN_DATE', field: 'responseDate' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.EXCHANGE_RATE', field: 'conversionRate' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.PRICE_BP', field: 'priceBp' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.AMOUNT_BP', field: 'intoMoneyBp' },
  { width: '300px', title: 'PURCHASE_REQUEST.ITEM.SUPPLIER_NAME', field: 'supplierName' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.PRODUCER_NAME', field: 'producerName' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.GUARANTEE', field: 'guarantee', isRequired: 'true' },
  { width: '300px', title: 'PURCHASE_REQUEST.ITEM.DELIVERY_LOCATION', field: 'deliveryLocation' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.NOTE', field: 'note' },
  { width: '150px', title: 'PURCHASE_REQUEST.ORG_CODE', field: 'orgCode' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.PO_CODE', field: 'poCode' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.CLASSIFY_STATUS', field: 'classifyStatus' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.CLASSIFY_DATE', field: 'classifyAt' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.PO_MAN', field: 'poMan' },
];

export const AREA_TYPE = [
  { value: 1, label: 'BP' },
  { value: 2, label: 'XNK' },
  { value: 4, label: 'XNK' },
  { value: 5, label: 'XNK' }
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

export const HEADER_ORG = [
  { width: '50px', title: 'COMMON.NO' },
  // { width: '100px', title: 'ORGANIZATION.ORG_ID', field: 'orgId' },
  { width: '100px', title: 'ORGANIZATION.CODE', field: 'code' },
  { width: '200px', title: 'ORGANIZATION.NAME', field: 'name' },
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
