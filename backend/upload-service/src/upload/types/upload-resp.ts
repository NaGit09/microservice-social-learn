import { Upload } from "../entities/upload.entity";

export class UploadResp {
    fileId: string;
    url: string;
    type: string;
    fileName: string;
    constructor(upload : Upload) {
        this.fileId = upload._id.toString();
        this.fileName = upload.originalName;
        this.url = upload.url;
        this.type = upload.type;
    }
}