export const HEADER = [
  [
    { width: '50px', title: 'COMMON.NO', rowSpan: 2 },
    { width: '500px', title: 'Yêu cầu báo giá FPT', colSpan: 3 },
    { width: '200px', title: 'Báo giá gửi FPT', colSpan: 2 },
    { width: '100px', title: 'Trạng thái', rowSpan: 2 },
    // { width: '70px', title: '', maxWidth: '50px', rowSpan: 2, class: '' },
    { width: '70px', title: '', maxWidth: '50px', rowSpan: 2, class: 'action' },
  ],
  [
    { width: '100px', title: 'Ngày gửi báo giá' },
    { width: '100px', title: 'Số báo giá' },
    { width: '200px', title: 'Mô tả yêu cầu báo giá' },
    { width: '100px', title: 'Ngày gửi báo giá' },
    { width: '100px', title: 'Số báo giá' },
  ]
];

export const QUOTATION_SUPPLIER = [
  { width: '50px', title: 'COMMON.NO', field: 'indexNo' },
  { width: '200px', title: 'Tên NCC', field: 'supplierId', isRequired: true },
  { width: '100px', title: 'Mã NCC ( mã số thuế)', field: 'code' },
  { width: '100px', title: 'Người báo giá', field: 'quotePeople' },
  { width: '200px', title: 'Email người báo giá', field: 'quotePeopleEmail', isRequired: true },
  { width: '100px', title: 'SDT người báo giá', field: 'phoneNumber' },
  { width: '100px', title: 'Trạng thái', field: 'status' },
  { width: '100px', title: 'Ghi chú', field: 'note' },
  { width: '70px', title: '', maxWidth: '50px', class: 'action', field: 'action' },
];

export const QUOTATION_ITEM = [
  { width: '50px', title: 'COMMON.NO' },
  { width: '100px', title: 'Nhóm sản phẩm' },
  { width: '100px', title: 'Chi tiết sản phẩm', isRequired: false },
  { width: '100px', title: 'Số lượng' },
  { width: '100px', title: 'Đơn vị' },
  { width: '100px', title: 'Yêu cầu khác' },
  { width: '100px', title: 'Hạn báo giá', isRequired: true },
  { width: '70px', title: '', maxWidth: '50px', class: 'action' },
];

export const QUOTATION_ITEM_ENTER_QUOTE = [
  [
    { width: '50px', title: 'COMMON.NO', rowSpan: 2 },
    { width: '200px', title: 'Nhóm sản phẩm', rowSpan: 2 },
    { width: '200px', title: 'Chi tiết sản phẩm', rowSpan: 2 },
    { width: '100px', title: 'Đơn vị tính', rowSpan: 2 },
    { width: '100px', title: 'Số lượng', rowSpan: 1 },
    { width: '100px', title: 'Tiện tệ', rowSpan: 2, isRequired: true },
    { width: '200px', title: 'Nguyên tệ', rowSpan: 1, isRequired: true },
    { width: '150px', title: 'Loại thuế', rowSpan: 1, isRequired: true },
    { width: '200px', title: 'Tổng nguyên tệ', rowSpan: 1 },
    { width: '200px', title: 'Yêu cầu khác', rowSpan: 2 },
    { width: '200px', title: 'Ghi chú', rowSpan: 2 },
    { width: '200px', title: 'Hạn báo giá', rowSpan: 2 },
    { width: '70px', title: 'Hết hàng', rowSpan: 2 },
  ],
  [
    { width: '150px', title: 'Đơn giá', isRequired: true },
    { width: '100px', title: 'Thành tiện (VND)' },
    { width: '200px', title: 'Tiền thuế' },
    { width: '100px', title: 'Tổng tiền (VND)' },
  ]
];

export const VALIDATE_FIELD = [
  { field: 'expirationDate', validateValue: [null, undefined, 0], message: 'Field "Hạn báo giá" is required' },
];

export const VALIDATE_FIELD_CONDITIONS_SUPPLIER = [
  { field: 'supplierId', validateValue: [null, undefined, 0], message: 'Field "Nhà cung cấp" is required' },
  { field: 'quotePeopleEmail', validateValue: [null, undefined, 0], message: 'Field "Email người báo giá" is required' },
];

export const STATUS_QUOTATION_SUPPILER = [
  { value: 1, label: 'Chưa xác nhận báo giá' },
  { value: 2, label: 'Từ chối báo giá' },
  { value: 3, label: 'Đồng ý báo giá - Chưa báo giá' },
  { value: 4, label: 'Đã báo giá' },
];

export const STATUS_QUOTATION = [
  { value: undefined, label: 'Mới' },
  { value: null, label: 'Mới' },
  { value: 1, label: 'Mới' },
  { value: 2, label: 'Đã gửi' },
];

export const HEADER_SUPPLIER = [
  { width: '50px', title: 'COMMON.NO' },
  // { width: '100px', title: 'SUPPLIER.VENDOR_ID', field: 'vendorId' },
  { width: '100px', title: 'SUPPLIER.CODE', field: 'code' },
  { width: '200px', title: 'SUPPLIER.NAME', field: 'name' },
  { width: '100px', title: 'SUPPLIER.TAX_CODE', field: 'taxCode' },
  // { width: '200px', title: 'SUPPLIER.SYNC_SOURCE', field: 'syncSource' },
  // { width: '200px', title: 'SUPPLIER.SYNC_AT', field: 'syncAt', hasFormatDate: true }
];

export const HEADER_OPERATING_UNIT = [
  { width: '50px', title: 'COMMON.NO' },
  // { width: '200px', title: 'OPERATING_UNIT.OU_ID', field: 'ouId' },
  { width: '100px', title: 'OPERATING_UNIT.CODE', field: 'code' },
  { width: '200px', title: 'OPERATING_UNIT.NAME', field: 'name' },
  { width: '200px', title: 'OPERATING_UNIT.ADDRESS', field: 'address' },
];

export const HEADER_DEPARMENT = [
  { width: '50px', title: 'COMMON.NO' },
  { width: '200px', title: 'DEPARTMENT.CODE', field: 'code' },
  { width: '200px', title: 'DEPARTMENT.NAME', field: 'name' },
];
