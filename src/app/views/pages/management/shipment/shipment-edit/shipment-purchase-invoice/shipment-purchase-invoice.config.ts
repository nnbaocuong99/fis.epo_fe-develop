export const HEADERS = [
    { width: '100px', title: 'STT', field: 'indexNo' },
    { width: '100px', title: 'Số PO', field: 'poCode' },
    { width: '100px', title: 'Mã hàng', field: 'itemCode' },
    { width: '100px', title: 'Part number', field: 'partNo' },
    { width: '300px', title: 'Tên hàng hoá dịch vụ', field: 'itemName' },
    { width: '100px', title: 'Loại HH/DV', field: 'itemType' },
    { width: '100px', title: 'Đơn vị tính', field: 'unit' },
    { width: '100px', title: 'Số lượng', field: 'quantityRemain' },
    { width: '100px', title: 'Đơn giá', field: 'price' },
    { width: '100px', title: 'Diễn giải', field: 'note' }
];
export const INVOICE_TYPE = [
    { value: 1, label: 'Prepayment Invoice - Hóa đơn trả trước' },
    { value: 2, label: 'Other Invoive - Hóa đơn phải trả khác' },
    { value: 3, label: 'Purchase Invoice - Hóa đơn tài chính' }
];

export const COST_TYPE = [
    { value: 1, label: 'Giá hàng hóa/dịch vụ' },
    { value: 2, label: 'Bảo hiểm' },
    { value: 3, label: 'Vận tải' },
    { value: 4, label: 'Credit note thưởng/rebate' },
    { value: 5, label: 'Credit note giảm giá' },
    { value: 6, label: 'Credit note trả lại hàng' },
    { value: 7, label: 'Khác' }
];

export const STATUS_INVOICE = [
    { value: 1, label: 'Đã hủy' },
    { value: 2, label: 'Đang mở' },
    { value: 3, label: 'Chờ thanh toán' },
    { value: 4, label: 'Đang thanh toán' },
    { value: 5, label: 'Đã thanh toán' },
    { value: 9, label: 'Lưu nháp'}
];

export const STATUS_ERP = [
    { value: 1, label: 'Tất cả' },
    { value: 2, label: 'Chưa đồng bộ ERP - Chưa nhập kho' },
    { value: 3, label: 'Đã đồng bộ ERP - Đã nhập kho' }
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
