export const DLG_CONFIG = {
    style: { width: '50vw' },
    baseZIndex: 10000,
    draggable: true,
    maximizable: true
};

export const TYPE = [
    { value: 1, label: 'FRONT END' },
    { value: 0, label: 'BACK END' },
];

export const FE_METHOD = [
    { value: 'MODULE', label: 'MODULE' },
    { value: 'MENU', label: 'FUNCTION' },
    { value: 'VIEW', label: 'VIEW' }
    
];

export const BE_METHOD = [
    { value: 'PUT', label: 'PUT' },
    { value: 'PUSH', label: 'PUSH' },
    { value: 'DELETE', label: 'DELETE' },
    { value: 'GET', label: 'GET' },
];

export const HEADER = [
    { width: '50px', field: 'method', title: 'OPERATION.METHOD' },
    { width: '50px', field: 'link', title: 'OPERATION.LINK' },
    { width: '50px', field: 'menuIcon', title: 'OPERATION.ICON' },
];