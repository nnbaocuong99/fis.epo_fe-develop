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
    { width: '200px', title: 'Thời gian giao hàng', rowSpan: 2 },
    { width: '200px', title: 'Xuất xứ hàng hóa', rowSpan: 2 },
    { width: '200px', title: 'Tình trạng hàng hóa', rowSpan: 2 },
    { width: '200px', title: 'Thời hạn bảo hành (tháng)', rowSpan: 2 },
    { width: '200px', title: 'Điều kiện bảo hành', rowSpan: 2 },
    { width: '200px', title: 'Ghi chú', rowSpan: 2 },
    { width: '200px', title: 'Hạn báo giá', rowSpan: 2 },
    { width: '200px', title: 'Hạn báo giá (NCC gia hạn)', rowSpan: 2 },
    { width: '70px', title: 'Hết hàng', rowSpan: 2 },
  ],
  [
    { width: '150px', title: 'Đơn giá', isRequired: true },
    { width: '100px', title: 'Thành tiền (VND)' },
    { width: '200px', title: 'Tiền thuế' },
    { width: '100px', title: 'Tổng tiền (VND)' },
  ]
];

export const TRADE_CONDITIONS = [
  { width: '500px', title: 'Điều kiện thương mại' },
  { width: '500', title: 'Mô tả', isRequired: true },
  { width: '70px', title: '', maxWidth: '50px', class: 'action' },
];

export const HEADER_CURRENCY = [
  { width: '50px', title: 'COMMON.NO' },
  { width: '100px', title: 'CURRENCY.CODE', field: 'code' },
  { width: '300px', title: 'CURRENCY.NAME', field: 'name' },
];

export const GOODS_STATUS = [
  { value: 1, label: 'Hàng mới' },
  { value: 2, label: 'Hàng đã qua sử dụng' },
];
