export const HEADER_BRAND_REVENUE = [
  { width: '40px', title: 'COMMON.NO', field: 'indexNo' },
  { width: '100px', title: 'Quý', field: 'quarterly', isRequired: 'quarterly' },
  { width: '100px', title: 'Doanh số quý', field: 'quarterlyRevenue', isRequired: 'quarterlyRevenue' },
  { width: '120px', title: 'BRAND.NOTE', field: 'note' },
  { width: '50px', header: '', maxWidth: '50px', class: 'action', field: 'action' }
];

export const BRAND_REVENUE_VALIDATE_FIELD = [
  { field: 'quarterly', validateValue: [null, undefined, 0], message: 'Field "Quý" is required' },
  { field: 'quarterlyRevenue', validateValue: [null, undefined, 0], message: 'Field "Doanh số quý" is required' },
];

export const QUARTERLY = [
  { value: 1, label: 'Quý 1' },
  { value: 2, label: 'Quý 2' },
  { value: 3, label: 'Quý 3' },
  { value: 4, label: 'Quý 4' }
];
