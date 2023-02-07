export const HEADERS = [
    { width: '70px', title: 'STT' },
    { width: '100px', title: 'Mã dự án', field: 'projectCode' },
    { width: '100px', title: 'Mã hàng', field: 'itemCode' },
    { width: '100px', title: 'Part number', field: 'partNo' },
    { width: '250px', title: 'Tên hàng hoá dịch vụ', field: 'itemName' },
    { width: '50px', title: 'Loại HH/DV', field: 'itemType' },
    { width: '50px', title: 'Đơn vị tính', field: 'unit' },
    { width: '50px', title: 'Số lượng', field: 'quantityRemain' },
    { width: '100px', title: 'Đơn giá', field: 'price' },
    { width: '100px', title: 'Giá trị chưa xuất HĐ' },
    { width: '100px', title: 'Diễn giải', field: 'note' }
];

export const PO_TYPES = [
    { value: 1, label: 'Mua hàng trong nước' },
    { value: 2, label: 'Mua hàng nước ngoài' },
    { value: 3, label: 'Nhập kinh doanh' },
    { value: 4, label: 'Phi mậu dịch' }
];

export const ITEMS_TYPES = [
    { value: 1, label: 'HW' },
    { value: 2, label: 'SW' },
    { value: 3, label: 'SRV' },
];

export const PO_STATUS = [
    { value: 1, label: 'Đang mở' },
    { value: 2, label: 'Hoàn thành' },
];
