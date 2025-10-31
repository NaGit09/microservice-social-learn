export interface UploadReq {
    file: File,
    userId : string,
}
export interface UploadMultileReq {
    files: File[],
    userId : string,
}