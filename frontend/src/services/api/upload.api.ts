import type { UploadMultileReq, UploadReq } from "@/types/upload.type";
import axiosInstance from "../axios.service";
import type { File } from "@/types/common/file";

export const uploadSingleFile = async (dto: UploadReq) : Promise<File>  =>{ 
    return axiosInstance.postForm('/upload/single', dto);
}
export const uploadMultipleFile = async (dto: UploadMultileReq): Promise<File[]> => {
    return axiosInstance.postForm('/upload/multiple', dto);
}