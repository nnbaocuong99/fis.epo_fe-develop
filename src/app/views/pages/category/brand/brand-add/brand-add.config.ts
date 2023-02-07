export const HEADER_BRAND_WARRANTY_CONTACT_PERSONS = [
    { width: '40px', title: 'COMMON.NO', field: 'indexNo' },
    { width: '100px', title: 'BRAND.CONTACT_PERSON', field: 'name' },
    { width: '100px', title: 'BRAND.PHONE_NUMBER', field: 'phoneNumber' },
    { width: '80px', title: 'BRAND.POSITION', field: 'position' },
    { width: '100px', title: 'BRAND.EMAIL', field: 'email' },
    // { width: '120px', title: 'BRAND.NOTE', field: 'note' },
    { width: '50px', header: '', maxWidth: '50px', class: 'action', field: 'action' }
];

export const HEADER_CONTACT = [
    { width: '40px', title: 'COMMON.NO', field: 'indexNo' },
    // { width: '100px', title: 'BRAND.BLOCK_PRODUCT_LINE', field: 'productLine' },
    { width: '100px', title: 'BRAND.NAME', field: 'name' },
    { width: '80px', title: 'BRAND.GENDER', field: 'gender' },
    { width: '100px', title: 'BRAND.POSITION_TITLE', field: 'positionTitle' },
    // { width: '100px', title: 'BRAND.JOB_TITLE', field: 'jobTitle' },
    { width: '100px', title: 'BRAND.PHONE', field: 'phoneNumber' },
    { width: '100px', title: 'BRAND.MAIL_ADDRESS', field: 'mail' },
    { width: '150px', title: 'BRAND.ADDRESS', field: 'address' },
    { width: '60px', title: 'BRAND.GEO', field: 'geo' },
    // { width: '120px', title: 'BRAND.PRODUCT_ROLE', field: 'productRole' },
    { width: '120px', title: 'BRAND.NOTE', field: 'note' },
    { width: '50px', header: '', maxWidth: '50px', class: 'action', field: 'action' }
];

export const TYPE_BRAND = [
    { value: 1, label: 'Nhà phân phối' },
    { value: 2, label: 'Bán lẻ' },
];

export const DEAL_REGISTRATION = [
    { value: 1, label: 'Có' },
    { value: 0, label: 'Không' },
];

export const BACKDATE = [
    { value: 1, label: 'Có' },
    { value: 0, label: 'Không' },
];

export const GENDER = [
    { value: 1, label: 'Male' },
    { value: 2, label: 'Female' },
];

export const VALIDATE_FIELD = [
    { field: 'name', validateValue: [null, undefined, 0], message: 'Field "Name" is required' },
];

export const INCENTIVE = [
    { value: 1, label: 'Có' },
    { value: 0, label: 'Không' },
];

export const MDF = [
    { value: 1, label: 'Có' },
    { value: 0, label: 'Không' },
];
