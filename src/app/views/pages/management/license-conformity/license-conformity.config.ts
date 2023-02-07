export const TABS = [
    { value: 0, label: 'LICENSE_CONFORMITY.ALL' },
    { value: 1, label: 'LICENSE_CONFORMITY.ENERGY_EFFICIENCY' },
    { value: 2, label: 'LICENSE_CONFORMITY.CERTIFICATE_QUALITY' },
    { value: 3, label: 'LICENSE_CONFORMITY.CONFORMITY' }
];

export const HEADER = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'Số BL' },
    { width: '100px', title: 'Yêu cầu HSNL' },
    { width: '100px', title: 'Yêu cầu kiểm tra chất lượng' },
    { width: '100px', title: 'Yêu cầu hợp quy' },
];

export const HEADER_SUPPLIER = [
    { width: '50px', title: 'COMMON.NO' },
    // { width: '100px', title: 'SUPPLIER.VENDOR_ID', field: 'vendorId' },
    { width: '100px', title: 'SUPPLIER.CODE', field: 'code' },
    { width: '300px', title: 'SUPPLIER.NAME', field: 'name' },
    { width: '100px', title: 'SUPPLIER.TAX_CODE', field: 'taxCode' },
    // { width: '200px', title: 'SUPPLIER.SYNC_SOURCE', field: 'syncSource' },
    // { width: '200px', title: 'SUPPLIER.SYNC_AT', field: 'syncAt', hasFormatDate: true }
];

export const EXECUTION_STATUS = [
    { value: 1, label: 'Chưa thực hiện' },
    { value: 2, label: 'Đang thực hiện' },
    { value: 3, label: 'Hoàn thành' }
];

export const HEADER_ITEM = [
    { width: '50px', title: 'COMMON.NO', field: 'indexNo' },
    { width: '150px', title: 'Số PO/HD', field: 'code' },
    { width: '150px', title: 'Part number', field: 'partNo' },
    { width: '100px', title: 'Mã hàng hóa', field: 'itemCode' },
    { width: '200px', title: 'Item name', field: 'itemName' },
    { width: '80px', title: 'HSNL', field: 'hasEnergyEfficiency' },
    { width: '80px', title: 'KTCL', field: 'hasImportLicense' },
    { width: '80px', title: 'Hợp quy', field: 'isConformity' },
    { width: '100px', title: 'Loại HH/DV', field: 'itemType' },
    { width: '100px', title: 'Đơn vị', field: 'unit' },
    { width: '100px', title: 'Số lượng', field: 'quantity' },
    { width: '150px', title: 'Đơn giá', field: 'price' },
    { width: '150px', title: 'Thành tiền', field: 'intoMoney' },
    { width: '120px', title: 'Xuất xứ hàng hóa', field: 'itemOrigin' },
    { width: '100px', title: 'Hãng sản xuất', field: 'producerName' },
    { width: '200px', title: 'Diễn giải', field: 'note' },
];

export const HEADER_USER = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'BUYER.PERSON_ID', field: 'userId' },
    { width: '200px', title: 'BUYER.USER_NAME', field: 'userName' },
    { width: '300px', title: 'BUYER.LAST_NAME', field: 'fullName' },
    // { width: '200px', title: 'BUYER.SYNC_SOURCE', field: 'syncSource' },
    // { width: '200px', title: 'BUYER.SYNC_AT', field: 'syncAt', hasFormatDate: true }
];

export const HEADER_SHIPMENT_QUALITY = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '200px', title: 'Số đăng ký' },
    { width: '80px', title: 'Ngày đăng ký', isRequired: 'true' },
    { width: '80px', title: 'Ngày được cấp phép' },
    { width: '100px', title: 'Cán bộ thực hiện', isRequired: 'true' },
    { width: '100px', title: 'Trạng thái' },
    { width: '200px', title: 'Ghi chú' },
    { width: '100px', title: '', class: 'action' },
];

export const STATUS_REGISTERED = [
    { value: 1, label: 'Đang thực hiện' },
    { value: 2, label: 'Hoàn thành' }
];

export const SHIPMENT_STATUS = [
    { value: 1, label: 'Hàng EXW chưa giao' },
    { value: 2, label: 'Hàng đang đi đường' },
    { value: 3, label: 'Hàng đã về kho, chờ nhập ORC' },
    { value: 4, label: 'Đã nhập kho' }
];

export const SHIPMENT_PROFILE_STATUS = [
    { value: 1, label: 'Đang gom hồ sơ' },
    { value: 2, label: 'Đang làm thủ tục nhận hàng' },
    { value: 3, label: 'Hoàn thành' }
];

export const HEADER_SHIPMENT = [
    { width: '50px', title: 'COMMON.NO' },
    { width: '100px', title: 'Số vận đơn', field: 'waybillNumber' },
    { width: '100px', title: 'Số vận đơn chủ', field: 'masterBillNo' },
    { width: '100px', title: 'Ngày vận đơn', field: 'billOfLadingDate', hasFormatDate: true },
    { width: '100px', title: 'Ngày dự kiến hàng về (ETA)', field: 'expectedToDate', hasFormatDate: true },
    { width: '100px', title: 'Ngày thực tế hàng về', field: 'actualToDate', hasFormatDate: true },
    { width: '100px', title: 'Nhà cung cấp', field: 'smSupplier' },
    { width: '100px', title: 'Trạng thái hàng', field: 'smStatus', dictionary: SHIPMENT_STATUS },
    { width: '100px', title: 'Trạng thái hồ sơ', field: 'docStatus', dictionary: SHIPMENT_PROFILE_STATUS },
    // { width: '100px', title: 'Trạng thái đồng bộ ORC', field: 'syncStatus', dictionary: SHIPMENT_STATUS_ERP },
    { width: '100px', title: 'Người tạo lô hàng', field: 'userName' },
    { width: '100px', title: 'Hàng Claim', field: 'claim' },
    { width: '100px', title: 'Mã dự án', field: 'projectCode' },
];

export const PO_STATUS = [
    { value: 1, label: 'Đã tạo' },
    { value: 2, label: 'Chờ phê duyệt' },
    { value: 3, label: 'Đã phê duyệt' },
    { value: 4, label: 'Từ chối phê duyệt' },
    { value: 5, label: 'Đang thực hiện' },
    { value: 6, label: 'Hoàn thành' },
    { value: 7, label: 'Hủy' }
];
