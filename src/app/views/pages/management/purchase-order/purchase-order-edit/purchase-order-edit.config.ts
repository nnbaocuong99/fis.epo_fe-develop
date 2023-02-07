export const ORDER_PROCESSING_STATUS = [
  { width: '50px', title: 'COMMON.NO' },
  { width: '100px', title: 'Item code' },
  { width: '100px', title: 'Part number' },
  { width: '100px', title: 'Item name' },
  { width: '100px', title: 'Số lượng' },
  { width: '100px', title: 'UOM' },
  { width: '100px', title: 'LHDD' },
  { width: '100px', title: 'Số lượng đã nhập kho' },
  { width: '100px', title: 'Số lượng còn lại' },
  { width: '100px', title: 'Số lượng sai khác' },
  { width: '50px', header: '', maxWidth: '50px', class: 'action' }
];

export const HEADER_PAYMENT = [
  { width: '50px', title: 'COMMON.NO' },
  { width: '100px', title: 'PAYMENT.PAYMENT_METHODS' },
  { width: '100px', title: 'PAYMENT.PAYMENT_MILESTONE', isRequired: 'true' },
  { width: '100px', title: 'PAYMENT.TERMS_PAYMENT', isRequired: 'true' },
  { width: '100px', title: 'PAYMENT.PAYMENT_DATE' },
  { width: '100px', title: 'PAYMENT.RATIO' },
  { width: '100px', title: 'PAYMENT.AMOUNT_MONEY' },
  { width: '100px', title: 'PAYMENT.DESCRIPTION' },
  { width: '100px', title: 'PAYMENT.PI_CODE' },
  { width: '50px', header: '', maxWidth: '50px', class: 'action' }
];

export const PAYMENT_METHODS = [
  { value: 1, label: 'PAYMENT.CASH' },
  { value: 2, label: 'PAYMENT.TRANSFER' }
];

export const HEADER_PAYMENT_TERM = [
  { width: '100px', title: 'COMMON.NO' },
  { width: '200px', title: 'PAYMENT_TERM.NAME', field: 'name' },
  { width: '200px', title: 'PAYMENT_TERM.DESCRIPTION', field: 'description' },
  { width: '200px', title: 'PAYMENT_TERM.CREATE_AT', field: 'createdAt', hasFormatDate: true }
];
