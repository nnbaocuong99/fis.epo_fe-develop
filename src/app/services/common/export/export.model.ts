export class ExportModel {
    description: string;
    source: any[];
    columns: Column[];
}

export class Column {
    bindLabel: string;
    bindValue: string;
    dataType?: DataType;
    textStyles?: Format[];
}

export enum DataType {
    Text,
    Number,
    Date,
    DateTime
}

export enum Format {
    Bold,
    Italic,
    Underline
}
