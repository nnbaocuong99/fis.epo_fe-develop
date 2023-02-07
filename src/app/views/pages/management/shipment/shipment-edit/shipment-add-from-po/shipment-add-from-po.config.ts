export const HEADERS = [
    { width: '100px', title: 'STT' },
    { width: '100px', title: 'Mã dự án', field: 'projectCode' },
    { width: '150px', title: 'Số YCMH', field: 'prNo' },
    { width: '100px', title: 'Mã hàng', field: 'itemCode' },
    { width: '100px', title: 'Part number', field: 'partNo' },
    { width: '100px', title: 'Tên hàng hoá dịch vụ', field: 'itemName' },
    { width: '100px', title: 'Đơn vị tính', field: 'unit' },
    { width: '100px', title: 'Số lượng', field: 'quantity' },
    { width: '100px', title: 'Số lượng đã tạo HĐ', field: 'quantityCreate'},
    { width: '100px', title: 'Đơn giá', field: 'price' },
    { width: '100px', title: 'Thành tiền', field: 'totalAmount' }
];

export const PO_TYPES = [
    { value: 1, label: 'Mua hàng trong nước' },
    { value: 2, label: 'Mua hàng nước ngoài' },
    { value: 3, label: 'Nhập kinh doanh' },
    { value: 4, label: 'Phi mậu dịch' }
];

export const STATUS_ERP = [
    { value: 1, label: 'Tất cả' },
    { value: 2, label: 'Đang mở' },
    { value: 3, label: 'Hoàn thành' },
];

export const ITEMS_TYPES = [
    { value: 1, label: 'HW' },
    { value: 2, label: 'SW' },
    { value: 3, label: 'SRV' },
];

export const STATUS_PO = [
    { value: 1, label: 'Đang mở' },
    { value: 2, label: 'Hoàn thành' },
];
