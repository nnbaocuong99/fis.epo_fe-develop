import { RequestPayload } from '../../common/http/request-payload.model';

export class FileRequestPayload extends RequestPayload {
    name: string;
    module: string;
    note: string;
    moduleStartsWith: string;
    newFile: any;
}

export class FileInfo {
    id?: string;
    name: string;
    size: number;
    path?: string;
    file?: File;
    delete?: boolean;
    constructor(file?: File) {
        if (file) {
            this.name = file.name;
            this.size = file.size;
            this.file = file;
        }
    }
}
