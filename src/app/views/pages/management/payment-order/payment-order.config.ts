export const TABS = [
  { value: 1, label: 'Thanh toán' },
  { value: 2, label: 'Thanh toán trả trước' },
  { value: 3, label: 'Tạm ứng' },
];

export const PAYMENT_TYPE = [
  { value: 'PAYMENT', label: 'Thanh toán' },
  { value: 'PREPAYMENT', label: 'Thanh toán trả trước' },
  { value: 'ADVANCEPAYMENT', label: 'Tạm ứng' },
];


export const HEADER = [
  { width: '50px', title: 'COMMON.NO', field: 'indexNo' },
  { width: '150px', title: 'Mã', field: 'epayCode' },
  { width: '100px', title: 'Đơn vị duyệt', field: 'organizationName' },
  { width: '100px', title: 'Người tạo', field: 'costType' },
  { width: '100px', title: 'Ngày đề nghị', field: 'submitDate' },
  { width: '150px', title: 'Loại đề nghị thanh toán', field: 'totalAmount' },
  { width: '150px', title: 'Mục đích', field: 'title' },
  { width: '150px', title: 'Thành tiền', field: 'totalActual' },
  { width: '100px', title: 'Trạng thái', field: 'status' },
  { width: '70px', title: '', class: 'action', field: 'action' }
];

export const PAYMENT_METHOD = [
  { value: 'BANK', label: 'Chuyển khoản' },
  { value: 'CASH', label: 'Tiền mặt' },
  { value: 'CONTRAENTRY', label: 'Đối trừ công nợ' },
];

export const BENEFICIARY_TYPE = [
  { value: 'SUPPLIER', label: 'Nhà cung cấp' },
  { value: 'PERSONAL', label: 'Cá nhân' }
];

export const STATUS = [
  { value: 1, label: 'Đã tạo (Chưa tạo ticket draft ePay)' },
  { value: 2, label: 'Đã tạo ticket draft trên ePay' },
  { value: 3, label: 'Đã Đồng bộ dữ liệu ePay' },
];
