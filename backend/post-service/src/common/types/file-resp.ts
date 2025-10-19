import { File } from "../entities/file.entity";

export class FileResp {
    id: string;
    fileName: string;
    fileType: string;
    url: string
    constructor(file: File) {
        this.id = file.fileId;
        this.fileName = file.fileName;
        this.fileType = file.type;
        this.url = file.url;
    }
}