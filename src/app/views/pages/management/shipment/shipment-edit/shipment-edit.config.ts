export const HEADER_COST_BILL = [
  { width: '50px', header: 'COMMON.NO' },
  { width: '100px', header: 'PURCHASE_INVOICE.INVOICE_TYPE' },
  { width: '100px', header: 'PURCHASE_INVOICE.COST_TYPE' },
  { width: '120px', header: 'PURCHASE_INVOICE.INVOICE_NUMBER' },
  { width: '100px', header: 'PURCHASE_INVOICE.INVOICE_DATE' },
  { width: '80px', header: 'PURCHASE_INVOICE.CURRENCY' },
  { width: '100px', header: 'PURCHASE_INVOICE.INVOICE_VAULE' },
  { width: '100px', header: 'PURCHASE_INVOICE.ACTUAL_INVOICE_VALUE' },
  { width: '100px', header: 'PURCHASE_INVOICE.INVOICE_INTERPRETATION' },
  { width: '100px', header: 'PURCHASE_INVOICE.INVOICE_STATUS' },
  { width: '100px', header: 'PURCHASE_INVOICE.ERP_SYNC_STATUS' },
  { width: '100px', header: 'PURCHASE_INVOICE.PO_CONTRACT_NUMBER' },
  { width: '100px', header: 'PURCHASE_INVOICE.ERP_INVOICE_ID' },
  { width: '80px', header: '', class: 'action' }
];

export const HEADER_SYNC_ERP = [
  { width: '50px', title: 'COMMON.NO' },
  { width: '100px', title: 'Số PO' },
  { width: '100px', title: 'Số PO ERP' },
  { width: '100px', title: 'Diễn giải PO' },
  { width: '100px', title: 'Số Receipt' },
  { width: '100px', title: 'Ngày Receipt' },
  { width: '100px', title: 'Loại tiền' },
  { width: '100px', title: 'Tỷ giá (ORC)' },
  { width: '100px', title: 'Giá trị tỷ giá' },
];


export const STATUS_INVOICE = [
  { value: 1, label: 'Đã hủy' },
  { value: 2, label: 'Đang mở' },
  { value: 3, label: 'Chờ thanh toán' },
  { value: 4, label: 'Đang thanh toán' },
  { value: 5, label: 'Đã thanh toán' },
  { value: 9, label: 'Lưu nháp' }
];

export const SYNC_ERP = [
  { value: 1, label: 'Chưa đồng bộ ERP' },
  { value: 2, label: 'Đã đồng bộ ERP' }
];

export const ELIM_STATUS = [
  { value: null, label: 'Chưa phân bổ' },
  { value: undefined, label: 'Chưa phân bổ' },
  { value: 0, label: 'Chưa phân bổ' },
  { value: 1, label: 'Chưa phân bổ' },
  { value: 2, label: 'Đã phân bổ' },
  { value: 3, label: 'Đã phân bổ' }
];

export const TABS = [
  { value: 1, label: 'SHIPMENT.SHIPMENT_INFO' },
  { value: 2, label: 'SHIPMENT.LIST_EXPENSE_INVOICE' },
];

export const TAB_DETAILS = [
  { value: 1, label: 'SHIPMENT.COMMODITY_DETAILS_INFO' },
  { value: 2, label: 'SHIPMENT.SHIPMENT_PROFILE' },
  { value: 3, label: 'SHIPMENT.INFORMATION_SYNC_ERP' }
];

export const PROFILE_STATUS = [
  { value: 1, label: 'Đang gom hồ sơ' },
  { value: 2, label: 'Đang làm thủ tục nhận hàng' },
  { value: 3, label: 'Hoàn thành' }
];

export const SHIPMENT_STATUS = [
  { value: 1, label: 'Hàng EXW chưa giao' },
  { value: 2, label: 'Hàng đang đi đường' },
  { value: 3, label: 'Hàng đã về kho, chờ nhập ERP' },
  { value: 4, label: 'Đã nhập kho' },
  { value: 9, label: 'Lưu nháp' }
];

export const STATUS_ORC = [
  { value: 1, label: 'Chưa đồng bộ ORC' },
  { value: 2, label: 'Đã đồng bộ ORC' }
];

export const IMPORT_FORM = [
  { value: 1, label: 'Mậu dịch thông thường' },
  { value: 2, label: 'Tạm nhập tái xuất' },
  { value: 3, label: 'Chuyển khẩu nước ngoài' },
  { value: 4, label: 'Chuyển khẩu tại cửa khẩu' }
];

export const STORE_ITEMS = [
  { value: 0, label: 'SHIPMENT.IS_STORING' },
  { value: 1, label: 'SHIPMENT.IS_NOT_STORING' }
];

export const HEADER_SUPPLIER = [
  { width: '50px', title: 'COMMON.NO' },
  { width: '150px', title: 'SUPPLIER.CODE', field: 'code' },
  { width: '250px', title: 'SUPPLIER.NAME', field: 'name' },
  { width: '150px', title: 'SUPPLIER.TAX_CODE', field: 'taxCode' }
];

export const HEADER_CUSTOMS_BRANCH = [
  { width: '50px', title: 'COMMON.NO' },
  { width: '100px', title: 'MDT', field: 'mdt' },
  { width: '100px', title: 'CUSTOMS_BRANCH.CODE', field: 'code' },
  { width: '150px', title: 'CUSTOMS_BRANCH.NAME', field: 'name' },
  { width: '100px', title: 'CUSTOMS_BRANCH.TAX_CODE', field: 'taxCode' },
  { width: '100px', title: 'CUSTOMS_BRANCH.ACRONYM', field: 'acronym' }
];

export const HEADER_DEPARMENT = [
  { width: '50px', title: 'COMMON.NO' },
  { width: '200px', title: 'DEPARTMENT.CODE', field: 'code' },
  { width: '200px', title: 'DEPARTMENT.NAME', field: 'name' }
];

export const HEADER_USER = [
  { width: '50px', title: 'COMMON.NO' },
  { width: '200px', title: 'BUYER.USER_NAME', field: 'userName' },
  { width: '300px', title: 'BUYER.LAST_NAME', field: 'fullName' }
];
