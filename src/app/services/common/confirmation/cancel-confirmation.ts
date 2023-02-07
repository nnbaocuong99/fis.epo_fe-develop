import { Confirmation } from 'primeng/api';

export class CancelConfirmation implements Confirmation {
    message?: string;
    icon?: string;
    header?: string;
    accept?: () => void;
    reject?: () => void;

    constructor(content?: string) {
        const msg = content ? 'COMMON_MSG.CONFIRM_CANCEL' : 'COMMON_MSG.CONFIRM_CANCEL_CHANGE';
        const title = 'COMMON_MSG.CONFIRM_TITLE';
        this.message = msg;
        this.header = title;
        this.icon = 'pi pi-exclamation-triangle';
    }
}
