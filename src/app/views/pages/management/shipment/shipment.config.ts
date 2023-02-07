export const HEADER = [
    { width: '50px', title: 'COMMON.NO', field: 'indexNo' },
    { width: '150px', title: 'SHIPMENT.WAYBILL_NUMBER', field: 'waybillNumber' },
    { width: '100px', title: 'SHIPMENT.MASTER_BILL_NO', field: 'masterBillNo' },
    { width: '100px', title: 'SHIPMENT.BILL_OF_LADING_DATE', field: 'billOfLadingDate' },
    { width: '100px', title: 'SHIPMENT.EXPECTED_RETURN_DATE', field: 'expectedToDate' },
    { width: '100px', title: 'SHIPMENT.ACT_RES_DATE_COME', field: 'actualToDate' },
    { width: '100px', title: 'SHIPMENT.SUPPLIER', field: 'smSupplierName' },
    { width: '100px', title: 'SHIPMENT.SHIPMENT_STATUS', field: 'smStatus' },
    { width: '100px', title: 'SHIPMENT.PROFILE_STATUS', field: 'docStatus' },
    { width: '100px', title: 'SHIPMENT.STATUS_SYNC', field: 'syncStatus' },
    { width: '100px', title: 'SHIPMENT.SHIPMENT_CREATOR', field: 'creatorName' },
    { width: '50px', title: '', maxWidth: '50px', class: 'action', field: 'action' }
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
    { value: 5, label: 'Huỷ' },
    { value: 9, label: 'Lưu nháp' }
];

export const SYNC_ERP = [
    { value: null, label: 'Chưa đồng bộ ERP' },
    { value: undefined, label: 'Chưa đồng bộ ERP' },
    { value: 0, label: 'Chưa đồng bộ ERP' },
    { value: 1, label: 'Chưa đồng bộ ERP' },
    { value: 2, label: 'Đã đồng bộ ERP' },
    { value: 3, label: 'Đã đồng bộ ERP' }
];

export const ELIM_STATUS = [
    { value: null, label: 'Chưa phân bổ' },
    { value: undefined, label: 'Chưa phân bổ' },
    { value: 0, label: 'Chưa phân bổ' },
    { value: 1, label: 'Chưa phân bổ' },
    { value: 2, label: 'Đã phân bổ' },
    { value: 3, label: 'Đã phân bổ' }
];

export const IMPORT_FORM = [
    { value: 1, label: 'Nhập kinh doanh' },
    { value: 2, label: 'Phi mậu dịch' }
];

export const PROCESSING_STATUS = [
    { value: 1, label: 'Chưa hoàn thành' },
    { value: 2, label: 'Chờ xử lý' },
    { value: 3, label: 'Đã hoàn thành' },
];

export const COMPLAINT_TYPE = [
    { value: 1, label: 'Bảo hiểm' },
    { value: 2, label: 'Vận chuyển' },
    { value: 3, label: 'Nhà cung cấp' },
    { value: 4, label: 'Nội bộ' },
    { value: 5, label: 'Khác' }
];
