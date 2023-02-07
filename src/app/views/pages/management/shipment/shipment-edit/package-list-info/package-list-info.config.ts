export const HEADERS_PACKAGE_LIST = [
  { width: '50px', header: 'COMMON.NO' },
  { width: '150px', header: 'Loại đóng gói', isRequired: 'true' },
  { width: '100px', header: 'Số kiện' },
  // { width: '100px', header: 'Số lượng' },
  { width: '100px', header: 'Gross weight (kg)', isRequired: 'true' },
  { width: '100px', header: 'Chargeable weight (kg)', isRequired: 'true' },
  { width: '100px', header: 'Số m3' },
  { width: '100px', header: 'Ghi chú' }
];

export const VALIDATE_FIELD = [
  { field: 'type', validateValue: [null, undefined], message: 'Field packing type is required' },
  // { field: 'itemQuantity', validateValue: [null, undefined, 0], message: 'Field item quantity is required' },
  // { field: 'weight', validateValue: [null, undefined, 0], message: 'Field số m3 is required' },
  { field: 'volume', validateValue: [null, undefined, 0], message: 'Field ChargeableWeight (kg) is required' },
  { field: 'grossWeight', validateValue: [null, undefined, 0], message: 'Field GrossWeight (kg) is required' },
  // { field: 'packageQuantity', validateValue: [null, undefined, 0], message: 'Field packageQuantity is required' }
];
