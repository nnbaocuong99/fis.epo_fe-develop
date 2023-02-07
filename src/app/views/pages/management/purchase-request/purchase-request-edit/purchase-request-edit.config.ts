export const HEADER = [
  { width: '100px', title: 'COMMON.NO', field: 'indexNo' },
  { width: '100px', title: 'PURCHASE_REQUEST.ITEM.ITEM_CODE', field: 'itemCode' },
  { width: '100px', title: 'PURCHASE_REQUEST.ITEM.PART_NO', field: 'partNo' },
  { width: '200px', title: 'PURCHASE_REQUEST.ITEM.NAME', field: 'itemName', isRequired: true },
  { width: '100px', title: 'PURCHASE_REQUEST.ITEM.TYPE', field: 'itemType' },
  { width: '100px', title: 'PURCHASE_REQUEST.ITEM.UOM', field: 'unit' },
  { width: '100px', title: 'PURCHASE_REQUEST.ITEM.CURRENCY', field: 'currency', isRequired: 'true' },
  { width: '100px', title: 'PURCHASE_REQUEST.ITEM.QUANTITY', field: 'quantity', isRequired: 'true' },
  { width: '200px', title: 'PURCHASE_REQUEST.ITEM.EXPECTED_PRICE', field: 'expectedPrice', isRequired: 'true' },
  { width: '200px', title: 'PURCHASE_REQUEST.ITEM.INTO_MONEY', field: 'intoMoney' },
  { width: '200px', title: 'PURCHASE_REQUEST.ITEM.EXPECTED_DATE', field: 'expectedDate', isRequired: 'true' },
  { width: '200px', title: 'PURCHASE_REQUEST.ITEM.SUPPLIER_NAME', field: 'supplierName' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.PRODUCER_NAME', field: 'producerName' },
  { width: '100px', title: 'PURCHASE_REQUEST.ITEM.GUARANTEE', field: 'guarantee', isRequired: 'true' },
  { width: '200px', title: 'PURCHASE_REQUEST.ITEM.DELIVERY_LOCATION', field: 'deliveryLocation' },
  { width: '300px', title: 'PURCHASE_REQUEST.ITEM.NOTE', field: 'note' },
  { width: '200px', title: 'PURCHASE_REQUEST.ITEM.EXCHANGE_RATE', field: 'conversionRate' },
  { width: '200px', title: 'PURCHASE_REQUEST.ITEM.PRICE_BP', field: 'priceBp' },
  { width: '200px', title: 'PURCHASE_REQUEST.ITEM.AMOUNT_BP', field: 'amountBp' },
  { width: '200px', title: 'PURCHASE_REQUEST.ITEM.EXPECTED_RETURN_DATE', field: 'responseDate' },
  { width: '100px', title: '', maxWidth: '100px', class: 'action', field: 'action' }
];

export const HEADER_OPERATING_UNIT = [
  { width: '50px', title: 'COMMON.NO' },
  { width: '100px', title: 'OPERATING_UNIT.CODE', field: 'code' },
  { width: '200px', title: 'OPERATING_UNIT.NAME', field: 'name' },
  { width: '200px', title: 'OPERATING_UNIT.ADDRESS', field: 'address' },
];

export const HEADER_ORG = [
  { width: '50px', title: 'COMMON.NO' },
  { width: '100px', title: 'ORGANIZATION.CODE', field: 'code' },
  { width: '200px', title: 'ORGANIZATION.NAME', field: 'name' },
];

export const HEADER_DEPARMENT = [
  { width: '50px', title: 'COMMON.NO' },
  { width: '200px', title: 'DEPARTMENT.CODE', field: 'code' },
  { width: '200px', title: 'DEPARTMENT.NAME', field: 'name' },
];

export const HEADER_USER = [
  { width: '50px', title: 'COMMON.NO' },
  { width: '100px', title: 'USER.USER_NAME', field: 'userName' },
  { width: '200px', title: 'USER.FULL_NAME', field: 'fullName' },
];
