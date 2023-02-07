export const HEADERS = [
  { width: '50px', title: '', field: 'selected' },
  { width: '50px', title: 'COMMON.NO', field: 'indexNo' },
  { width: '150px', title: 'PURCHASE_INVOICE.INVOICE_NUMBER', field: 'code' },
  { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_TYPE', field: 'invoiceType' },
  { width: '100px', title: 'PURCHASE_INVOICE.COST_TYPE', field: 'costType' },
  { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_DATE', field: 'date' },
  { width: '150px', title: 'PURCHASE_INVOICE.INVOICE_VAULE', field: 'totalAmount' },
  { width: '150px', title: 'PURCHASE_INVOICE.ACTUAL_INVOICE_VALUE', field: 'totalActual' },
  { width: '150px', title: 'PURCHASE_INVOICE.INVOICE_INTERPRETATION', field: 'invoiceDesc' },
  { width: '100px', title: 'PURCHASE_INVOICE.INVOICE_STATUS', field: 'status' },
  { width: '100px', title: 'PURCHASE_INVOICE.ERP_SYNC_STATUS', field: 'syncStatus' },
  { width: '150px', title: 'PURCHASE_INVOICE.SUPPLIER', field: 'supplierName' },
  { width: '150px', title: 'PURCHASE_INVOICE.WAYBILL_NUMBER', field: 'waybillNumber' },
  { width: '100px', title: 'PURCHASE_INVOICE.ERP_INVOICE_ID', field: 'erpInvoiceId' },
  { width: '100px', title: 'PURCHASE_INVOICE.CREATOR', field: 'CreatorName' }
];

export const STEPS = [
  { value: 1, label: 'Danh sách hóa đơn', description: 'Chọn hóa đơn hàng hóa dịch vụ' },
  { value: 2, label: 'Thông tin hóa đơn', description: 'Chi tiết sản phẩm' },
  { value: 3, label: 'Xác nhận', description: 'Lưu và hoàn thành' }
];
