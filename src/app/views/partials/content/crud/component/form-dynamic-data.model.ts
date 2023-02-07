export class FormDynamicData {
    public title: string;
    public icon?: string;
    public isDelete?: boolean;
    public isCancel?: boolean;
    public hideHeader?: boolean;
    public isHideFooter?: boolean;
    public formId: string;
    public input?: any;
    public output?: any;
    public service: any;
    constructor() {
        this.input = {};
        this.output = {};
    }
}
