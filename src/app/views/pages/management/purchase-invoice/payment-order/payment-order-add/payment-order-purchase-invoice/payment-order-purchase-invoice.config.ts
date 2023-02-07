export const HEADERS = [
  { width: '39px', header: '', field: 'checkBox' },
  { width: '50px', header: 'COMMON.NO', field: 'indexNo' },
  { width: '100px', header: 'PURCHASE_INVOICE.INVOICE_TYPE', field: 'invoiceType' },
  { width: '100px', header: 'PURCHASE_INVOICE.COST_TYPE', field: 'costType' },
  { width: '100px', header: 'PURCHASE_INVOICE.INVOICE_NUMBER', field: 'code' },
  { width: '100px', header: 'PURCHASE_INVOICE.INVOICE_DATE', field: 'date' },
  { width: '100px', header: 'PURCHASE_INVOICE.INVOICE_VAULE', field: 'totalAmount' },
  { width: '100px', header: 'Giá trị hóa đơn còn lại', field: 'totalRemain' },
  { width: '100px', header: 'PURCHASE_INVOICE.INVOICE_INTERPRETATION', field: 'invoiceDesc' },

  { width: '100px', header: 'PURCHASE_INVOICE.SUPPLIER', field: 'supplierName' },
  { width: '100px', header: 'PURCHASE_INVOICE.PO_CONTRACT_NUMBER', field: 'poCode' },
  { width: '100px', header: 'PURCHASE_INVOICE.INVOICE_STATUS', field: 'status' },
  { width: '100px', header: 'PURCHASE_INVOICE.ERP_SYNC_STATUS', field: 'syncStatus' },
];

export const STATUS_INVOICE = [
  { value: 1, label: 'Đã hủy' },
  { value: 2, label: 'Đang mở' },
  { value: 3, label: 'Chờ thanh toán' },
  { value: 4, label: 'Đang thanh toán' },
  { value: 5, label: 'Đã thanh toán' },
  { value: 9, label: 'Lưu nháp' }
];

export const STATUS_ERP = [
  { value: 1, label: 'Chưa đồng bộ ERP - Chưa nhập kho' },
  { value: 2, label: 'Đã đồng bộ ERP - Đã nhập kho' }
];

export const STATUS_TAX = [
  { value: 1, label: 'Chưa gửi AF' },
  { value: 2, label: 'AF tính thuế' },
  { value: 3, label: 'AF tạm tính' },
  { value: 3, label: 'Hoàn thành' }
];

export const ITEMS_TYPES = [
  { value: 1, label: 'HW' },
  { value: 2, label: 'SW' },
  { value: 3, label: 'SRV' },
];

export const HEADER_OPERATING_UNIT = [
  { width: '50px', title: 'COMMON.NO' },
  // { width: '200px', title: 'OPERATING_UNIT.OU_ID', field: 'ouId' },
  { width: '200px', title: 'OPERATING_UNIT.CODE', field: 'code' },
  { width: '200px', title: 'OPERATING_UNIT.NAME', field: 'name' },
  { width: '200px', title: 'OPERATING_UNIT.ADDRESS', field: 'address' },
  // { width: '200px', title: 'OPERATING_UNIT.SYNC_SOURCE', field: 'syncSource' },
  // { width: '200px', title: 'OPERATING_UNIT.SYNC_AT', field: 'createdAt', hasFormatDate: true }
];
