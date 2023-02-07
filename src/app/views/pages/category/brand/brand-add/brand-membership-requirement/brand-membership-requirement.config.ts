export const HEADER_BRAND_MEMBERSHIP_REQUIREMENT = [
  { width: '40px', title: 'COMMON.NO', field: 'indexNo' },
  { width: '100px', title: 'Requirement', field: 'requirement', isRequired: 'requirement' },
  { width: '100px', title: 'Information', field: 'information' },
  { width: '100px', title: 'Bắt buộc / Không bắt buộc', field: 'isRequired' },
  { width: '120px', title: 'BRAND.NOTE', field: 'note' },
  { width: '50px', header: '', maxWidth: '50px', class: 'action', field: 'action' }
];

export const BRAND_MEMBERSHIP_REQUIREMENT_VALIDATE_FIELD = [
  { field: 'requirement', validateValue: [null, undefined, 0], message: 'Field "Requirement" is required' },
];
