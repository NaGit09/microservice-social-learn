import type { UploadMultileReq, UploadReq } from "@/types/upload.type";
import axiosInstance from "../axios.service";
import type { File } from "@/types/common/file";

export const uploadSingleFile = async (dto: UploadReq) : Promise<File>  =>{ 
    return axiosInstance.postForm('/upload/single', dto);
}

export async function uploadMultipleFile(dto: UploadMultileReq): Promise<File[]> {
    const formData = new FormData()
    formData.append('userId', dto.userId)

    for (const file of dto.files) {
        formData.append('files', file)
    }

    return await axiosInstance.post('/upload/multiple', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}