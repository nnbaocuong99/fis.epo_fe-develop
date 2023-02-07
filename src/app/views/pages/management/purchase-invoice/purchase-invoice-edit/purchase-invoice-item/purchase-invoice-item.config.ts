export const TAX_PAYER = [
  { value: 1, label: 'PURCHASE_ORDER.TAXABLE_FIS' },
  { value: 2, label: 'PURCHASE_ORDER.TAXABLE_SUPPLIER' },
  { value: 3, label: 'PURCHASE_ORDER.BOTH_TAXABLE' }
];

export const HEADER_TAX_CODE = [
  { width: '50px', title: 'COMMON.NO', field: '' },
  { width: '100px', title: 'TAX_CODE.NAME', field: 'name' },
  { width: '100px', title: 'TAX_CODE.DESCRIPTION', field: 'description' }
];

export const VALIDATE_FIELD = [
  { field: 'price', validateValue: [null, undefined], message: 'Field "Price" is required' },
  { field: 'note', validateValue: [null, undefined, 0], message: 'Field "Note" is required' },
];
