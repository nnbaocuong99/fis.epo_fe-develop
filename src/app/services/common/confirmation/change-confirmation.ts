import { Confirmation } from 'primeng/api';

export class ChangeConfirmation implements Confirmation {
    message?: string;
    icon?: string;
    header?: string;
    accept?: () => void;
    reject?: () => void;

    constructor(content?: string) {
        const msg = content ? content : 'COMMON_MSG.CONFIRM_SAVE';
        const title = 'COMMON_MSG.CONFIRM_TITLE';
        this.message = msg;
        this.header = title;
        this.icon = 'pi pi-exclamation-triangle';
    }
}
