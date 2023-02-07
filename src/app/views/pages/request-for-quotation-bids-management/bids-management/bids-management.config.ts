export const HEADER = [
  [
    { width: '70px', title: 'COMMON.NO', rowSpan: 2 },
    { width: '150px', title: 'Ngày mời thầu', rowSpan: 2 },
    { width: '150px', title: 'Tên gói thầu', rowSpan: 2 },
    { width: '150px', title: 'Hạn nộp hồ sơ thầu', rowSpan: 2 },
    { width: '300px', title: 'Đấu giá /Chào giá', colSpan: 2 },
    { width: '150px', title: 'Đơn vị mời thầu', rowSpan: 2 },
    { width: '150px', title: 'Trạng thái', rowSpan: 2 },
    { width: '70px', title: '', maxWidth: '50px', rowSpan: 2, class: 'action' },
  ],
  [
    { width: '150px', title: 'Bắt đầu' },
    { width: '150px', title: 'Kết thúc' },
  ]
];

export const BIDS_STATUS = [
  { value: undefined, label: 'Đã tạo, chưa mời thầu' },
  { value: null, label: 'Đã tạo, chưa mời thầu' },
  { value: 2, label: 'Đã mời thầu' },
  { value: 3, label: 'Đang đấu giá' },
  { value: 4, label: 'Đã kết thúc' }
];

export const BIDS_CAPACITY_PROFILE_REQUEST = [
  { width: '70px', title: 'COMMON.NO' },
  { width: '150px', title: 'Yêu cầu', isRequired: true },
  { width: '70px', title: '', class: 'action' }
];

export const BIDS_EVALUATION_CRITERIA = [
  { width: '70px', title: 'COMMON.NO' },
  { width: '150px', title: 'Tiêu chí đánh giá', isRequired: true },
  { width: '70px', title: '', class: 'action' }
];

export const SUPPLIER_PROFILE = [
  { width: '50px', title: 'COMMON.NO' },
  { width: '200px', title: 'Nhà cung cấp', isRequired: true },
  { width: '150px', title: 'Mã số thuế' },
  { width: '200px', title: 'Email', isRequired: true },
  { width: '200px', title: 'Mô tả' },
  { width: '150px', title: 'Điểm số' },
  { width: '120px', title: 'Yêu cầu báo giá' },
  { width: '120px', title: 'Đấu giá' },
  { width: '120px', title: 'Trúng thầu' },
  { width: '120px', title: 'Trạng thái' },
  { width: '70px', title: '', class: 'action' }
];

export const BIDS_TRADE_CONDITIONS = [
  { width: '70px', title: 'COMMON.NO' },
  { width: '150px', title: 'Điều kiện thương mại', isRequired: true },
  { width: '150px', title: 'Mô tả' },
  { width: '70px', title: '', maxWidth: '70px', class: 'action' }
];

export const BIDS_ITEM = [
  { width: '70px', title: 'COMMON.NO' },
  { width: '200px', title: 'Tên mặt hàng', isRequired: true },
  { width: '200px', title: 'Mô tả chi tiết' },
  { width: '150px', title: 'Số lượng', isRequired: true },
  { width: '150px', title: 'Đơn vị', isRequired: true },
  { width: '200px', title: 'Yêu cầu khác' },
  { width: '150px', title: 'Hạn báo giá', isRequired: true },
  { width: '70px', title: '', class: 'action' }
];

export const BIDS_ITEM_STATUS = [
  { value: 1, label: 'Mới' },
  { value: 2, label: 'Đã qua sử dụng' }
];

export const SUPPLIER_PROFILE_STATUS = [
  { value: undefined, label: 'Chưa xác nhận' },
  { value: null, label: 'Chưa xác nhận' },
  { value: 1, label: 'Từ chối tham gia' },
  { value: 2, label: 'Đã tham gia' },
  { value: 3, label: 'Đã nộp hồ sơ' },
  { value: 4, label: 'Đã gửi báo giá' }
];
