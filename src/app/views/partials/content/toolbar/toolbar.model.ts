export class ToolbarModel {
    add: ToolbarAdd;
    option: ToolbarOption;
    search: ToolbarSearch;

    constructor() {
        this.add = new ToolbarAdd();
        this.option = new ToolbarOption();
        this.search = new ToolbarSearch();
    }
}

export class ToolbarAdd {
    show = true;
    disabled = false;
    routerLink: any[] | string;
    click: () => void = () => { };
}

export class ToolbarExport {
    show = true;
    disabled = false;
    click: () => void = () => { };
}

export class ToolbarSave {
    show = true;
    disabled = false;
    click: () => void = () => { };
}

export class ToolbarImport {
    show = true;
    disabled = false;
    click: () => void = () => { };
}

export class ToolbarUpdate {
    show = true;
    disabled = false;
    click: () => void = () => { };
}

export class ToolbarCustomize {
    title = 'Customize';
    icons = 'kt-nav__link-icon flaticon2-file-1';
    show = true;
    disabled = false;
    click: () => void = () => { };
}

export class ToolbarClone {
    title = 'Clone';
    icons = 'kt-nav__link-icon pi pi-clone';
    show = false;
    disabled = false;
    click: () => void = () => { };
}
export class ToolbarAddSub {
    title = 'Thêm mới khác';
    show = true;
    disabled = false;
    click: () => void = () => { };
}

export class ToolbarOption {
    add = new ToolbarAddSub();
    export = new ToolbarExport();
    save = new ToolbarSave();
    import = new ToolbarImport();
    update = new ToolbarUpdate();
    customize = new ToolbarCustomize();
    clone = new ToolbarClone();
    show = true;
    disabled = false;
    click: () => void;
}

export class ToolbarSearch {
    show = true;
    disabled = false;
    click: () => void = () => { };
}


