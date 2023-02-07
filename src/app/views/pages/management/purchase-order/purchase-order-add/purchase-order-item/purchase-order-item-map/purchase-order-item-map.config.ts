export const HEADER_PR = [
  { width: '100px', title: 'COMMON.NO', field: 'indexNo' },
  { width: '120px', title: 'PURCHASE_REQUEST.ITEM.PART_NO', field: 'partNo' },
  { width: '120px', title: 'PURCHASE_REQUEST.ITEM.ITEM_CODE', field: 'itemCode' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.NAME', field: 'itemName' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.TYPE', field: 'itemType' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.UOM', field: 'unit' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.CURRENCY', field: 'currency', isRequired: 'true' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.QUANTITY', field: 'quantity', isRequired: 'true' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.QUANTITY_REMAIN', field: 'quantityRemain' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.EXPECTED_PRICE', field: 'expectedPrice', isRequired: 'true' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.INTO_MONEY', field: 'intoMoney' },
  { width: '200px', title: 'PURCHASE_REQUEST.ITEM.EXPECTED_DATE', field: 'expectedDate', isRequired: 'true' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.SUPPLIER_NAME', field: 'supplierName' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.PRODUCER_NAME', field: 'producerName' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.GUARANTEE', field: 'guarantee', isRequired: 'true' },
  { width: '150px', title: 'PURCHASE_REQUEST.ITEM.DELIVERY_LOCATION', field: 'deliveryLocation' },
  { width: '200px', title: 'PURCHASE_REQUEST.ITEM.NOTE', field: 'note' },
];

export const HEADER_PO_INTERNAL = [
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.PART_NO', field: 'partNo' },
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.ITEM_NAME', field: 'itemName' },
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.ITEM_TYPE', field: 'itemType' },
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.UOM', field: 'unit' },
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.QUANTITY', isRequired: 'true', field: 'quantity' },
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.UNIT_PRICE', field: 'price' },
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.INTO_MONEY' },
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.EXPECTED_RETURN_DATE', field: 'responseDate' },
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.TAX', field: 'tax' },
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.EXPECTED_DATE', field: 'expectedDate' },
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.PRODUCER_NAME', field: 'producerName' },
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.GUARANTEE', field: 'guarantee' },
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.DELIVERY_LOCATION', field: 'deliveryLocation' },
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.TERM_ACCOUNT', field: 'termAccount' },
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.PROJECT_MILESTONE', field: 'projectMilestone' },
  { width: '100px', title: 'COMMON.NOTE', field: 'note' }
];
export const HEADER_PO_EXTERNAL = [
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.PART_NO', field: 'partNo' },
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.ITEM_NAME', field: 'itemName' },
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.ITEM_TYPE', field: 'itemType' },
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.UOM', field: 'unit' },
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.QUANTITY', isRequired: 'true', field: 'quantity' },
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.UNIT_PRICE', field: 'price' },
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.INTO_MONEY' },
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.EXPECTED_RETURN_DATE', field: 'responseDate' },
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.IMPORT_LICENSE', field: 'hasImportLicense' },
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.CONFORMITY', field: 'isConformity' },
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.ENERGY_EFFICIENCY', field: 'hasEnergyEfficiency' },
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.ORIGIN', field: 'itemOrigin' },
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.TERM_ACCOUNT', field: 'termAccount' },
  { width: '100px', title: 'PURCHASE_ORDER.ITEM.PROJECT_MILESTONE', field: 'projectMilestone' },
  { width: '100px', title: 'COMMON.NOTE', field: 'note' }
];

export const ITEMS_TYPES = [
  { value: 1, label: 'HW' },
  { value: 2, label: 'SW' },
  { value: 3, label: 'SRV' },
];
