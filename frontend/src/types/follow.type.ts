export interface IFollow {
    requestId: string;
    targetId: string;
}

export class FollowUserDto implements IFollow {
    requestId: string;
    targetId: string;
    status: string;

    constructor(requestId: string, targetId: string , status : string) {
        this.requestId = requestId;
        this.targetId = targetId;
        this.status = status;
    }
}

export class UnfollowUserDto implements IFollow {
    requestId: string;
    targetId: string;

    constructor(requestId: string, targetId: string) {
        this.requestId = requestId;
        this.targetId = targetId;
    }
}