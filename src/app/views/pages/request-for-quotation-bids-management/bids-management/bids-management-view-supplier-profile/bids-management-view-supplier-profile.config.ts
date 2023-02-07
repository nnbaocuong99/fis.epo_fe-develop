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
    { width: '150px', title: 'Mô tả', isRequired: true },
    { width: '150px', title: 'File đính kèm' },
    { width: '70px', title: '', class: 'action' }
];

export const SUPPLIER_PROFILE_VIEW_ALL = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '150px', title: 'Nhà cung cấp' },
    { width: '150px', title: 'Mã số thuế' },
    { width: '150px', title: 'Điểm số' },
    { width: '150px', title: 'Trạng thái' }
];

export const BIDS_TRADE_CONDITIONS = [
    { width: '70px', title: 'COMMON.NO' },
    { width: '150px', title: 'Điều kiện thương mại', isRequired: true },
    { width: '150px', title: 'Mô tả', isRequired: true },
    { width: '70px', title: '', maxWidth: '70px', class: 'action' }
];

export const BIDS_ITEM = [
    { width: '70px', title: 'COMMON.NO' },
    { width: '200px', title: 'Tên mặt hàng', isRequired: true },
    { width: '200px', title: 'Mô tả chi tiết' },
    { width: '150px', title: 'Số lượng' },
    { width: '150px', title: 'Đơn giá', isRequired: true },
    { width: '150px', title: 'Đơn vị' },
    { width: '150px', title: 'Loại tiền', isRequired: true },
    { width: '150px', title: 'Loại thuế' },
    { width: '150px', title: 'Tiền thuế' },
    { width: '150px', title: 'Tổng tiền nguyên tệ' },
    { width: '150px', title: 'Thành tiền' },
    { width: '150px', title: 'Thời gian giao hàng' },
    { width: '150px', title: 'Xuất xứ hàng hóa' },
    { width: '150px', title: 'Tình trạng hàng hóa' },
    { width: '150px', title: 'Thời gian bảo hành' },
    { width: '150px', title: 'Điều kiện bảo hành' },
    { width: '150px', title: 'Yêu cầu khác' },
    { width: '200px', title: 'Ghi chú' },
    { width: '150px', title: 'Hạn báo giá' },
    { width: '100px', title: 'hết hàng' },
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
