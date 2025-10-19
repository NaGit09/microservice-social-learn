import { Like } from "../entities/like.entity";
import { TargetType } from "../enums/targetType.enum";

export class LikeResp {
    targetId : string;
    targetType : TargetType;
    isSuccess: boolean;
    constructor(like: Like) {
        this.targetId= like.targetId;
        this.targetType = like.targetType;
        this.isSuccess = true;
    }
}