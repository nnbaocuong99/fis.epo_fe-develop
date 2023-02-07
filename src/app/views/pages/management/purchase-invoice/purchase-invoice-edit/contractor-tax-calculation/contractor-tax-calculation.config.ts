export const HEADERS = [
  { width: '50px', header: 'COMMON.NO', field: 'indexNo' },
  { width: '100px', header: 'PURCHASE_INVOICE.PROJECT_CODE', field: 'projectCode' },
  { width: '70px', header: 'PURCHASE_INVOICE.ITEM.ITEM_CODE', field: 'itemCode' },
  { width: '120px', header: 'PURCHASE_INVOICE.ITEM.ITEM_NAME', field: 'itemName' },
  { width: '70px', header: 'PURCHASE_INVOICE.ITEM.FCT_TAX', field: 'taxpayer' },
  { width: '100px', header: 'PURCHASE_INVOICE.REVENUE_WITHOUT_TAX', field: 'revenueWithoutTax' },
  { width: '100px', header: 'PURCHASE_INVOICE.CORPORATE_INCOME_TAX_RATE', field: 'corporateTaxRate' },
  { width: '100px', header: 'PURCHASE_INVOICE.CORPORATE_INCOME_TAX', field: 'corporateTax' },
  { width: '100px', header: 'PURCHASE_INVOICE.REVENUE_WITH_CORPORATE_INCOME_TAX', field: 'revenueCorporateTax' },
  { width: '100px', header: 'PURCHASE_INVOICE.VAT_TAX_RATE', field: 'vatTaxRate' },
  { width: '100px', header: 'PURCHASE_INVOICE.VAT_TAX', field: 'vatTax' },
  { width: '100px', header: 'PURCHASE_INVOICE.REVENUE_SUBJECT_TO_VAT', class: '', field: 'revenueVatTax' }
];

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
