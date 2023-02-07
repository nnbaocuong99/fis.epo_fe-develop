export class BaseResponse {
    id?: string;
    constructor(model?: any) {
        if (model) {
            Object.assign(this, model);
        }
    }

    protected toDate(value: Date | string | null): Date | null {
        if (value) {
            const date = new Date(value);
            return isNaN(date.getTime()) ? null : date;
        } else {
            return null;
        }
    }

    public toDto(property: string, value: string): any {
        if (value) {
            const obj = {};
            obj[property] = value;
            return obj;
        } else {
            return null;
        }
    }
}
