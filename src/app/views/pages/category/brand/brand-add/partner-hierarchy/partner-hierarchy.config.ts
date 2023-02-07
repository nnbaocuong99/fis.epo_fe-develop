export const HEADER_BRAND_CORE_SOLUTIONS = [
  { width: '40px', title: 'COMMON.NO', field: 'indexNo' },
  { width: '100px', title: 'Core solutions', field: 'name', isRequired: 'true' },
  { width: '100px', title: 'Distributor', field: 'distributor' },
  { width: '120px', title: 'BRAND.NOTE', field: 'note' },
  { width: '50px', header: '', maxWidth: '50px', class: 'action', field: 'action' }
];

export const CORE_SOLUTIONS_VALIDATE_FIELD = [
  { field: 'name', validateValue: [null, undefined, 0], message: 'Field "Core Solutions" is required' },
];

export const HEADER_BRAND_HIERARCHY = [
  { width: '40px', title: 'COMMON.NO', field: 'indexNo' },
  { width: '100px', title: 'Vùng', field: 'pamerRegion', isRequired: 'true' },
  { width: '100px', title: 'Pamer', field: 'pamer' },
  { width: '120px', title: 'BRAND.NOTE', field: 'note' },
  { width: '50px', header: '', maxWidth: '50px', class: 'action', field: 'action' }
];

export const HIERARCHY_VALIDATE_FIELD = [
  { field: 'pamerRegion', validateValue: [null, undefined, 0], message: 'Field "Vùng" is required' },
];

export const HEADER_USER = [
  { width: '50px', title: 'COMMON.NO' },
  // { width: '100px', title: 'BUYER.PERSON_ID', field: 'userId' },
  { width: '100px', title: 'BUYER.USER_NAME', field: 'userName' },
  { width: '300px', title: 'BUYER.LAST_NAME', field: 'fullName' },
  // { width: '200px', title: 'BUYER.SYNC_SOURCE', field: 'syncSource' },
  // { width: '200px', title: 'BUYER.SYNC_AT', field: 'syncAt', hasFormatDate: true }
];


