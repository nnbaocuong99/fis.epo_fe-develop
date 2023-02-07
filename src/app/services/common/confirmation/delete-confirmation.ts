import { Confirmation } from 'primeng/api';

export class DeleteConfirmation implements Confirmation {
    message?: string;
    icon?: string;
    header?: string;
    accept?: () => void;
    reject?: () => void;

    constructor() {
        const msg = 'COMMON_MSG.CONFIRM_DELETE';
        const title = 'COMMON_MSG.CONFIRM_TITLE';
        this.message = msg;
        this.header = title;
        this.icon = 'pi pi-exclamation-triangle';
    }
}
