import type { LikeReq } from "@/types/like.type";
import axiosInstance from "../axios.service";

export const LikeApi = (dto : LikeReq) : Promise<boolean> =>  {
    return axiosInstance.post('/likes', dto);
}
export const UnlikeApi = (dto: LikeReq): Promise<boolean> => {
    return axiosInstance.delete('/likes', {
        data : dto
    });
}