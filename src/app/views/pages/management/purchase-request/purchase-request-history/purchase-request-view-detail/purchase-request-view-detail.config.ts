export const PR_STATUS = [
  { value: 1, label: 'PURCHASE_REQUEST.TAB.DRAFT' },
  { value: 2, label: 'PURCHASE_REQUEST.TAB.WAITING_APPROVAL' },
  { value: 3, label: 'PURCHASE_REQUEST.TAB.APPROVED' },
  { value: 4, label: 'PURCHASE_REQUEST.TAB.REJECT' },
  { value: 5, label: 'PURCHASE_REQUEST.TAB.PROCESSING' },
  { value: 6, label: 'PURCHASE_REQUEST.TAB.FINISH' },
  { value: 7, label: 'PURCHASE_REQUEST.TAB.CANCEL' }
];

export const PR_CONTRACT_INFO = [
  { value: 1, label: 'PURCHASE_REQUEST.CONTRACT_OUTPUT_REGISTERED' },
  { value: 2, label: 'PURCHASE_REQUEST.CONTRACT_PRE_ORDER' },
  { value: 3, label: 'PURCHASE_REQUEST.PURCHASE_APPROVAL' }
];

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
  // { width: '100px', title: '', maxWidth: '100px', class: 'action', field: 'action' }
];

export const HEADER_PURCHASE_REQUEST_CLASSIFY_HISTORY = [
  { width: '50px', title: 'COMMON.NO', field: 'indexNo' },
  { width: '200px', title: 'Loại thực hiện' },
  { width: '200px', title: 'Ghi chú' },
  { width: '200px', title: 'Người thực hiện' },
  { width: '200px', title: 'Ngày thực hiện' },
];
