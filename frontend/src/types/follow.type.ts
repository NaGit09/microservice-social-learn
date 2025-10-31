export interface IFollow {
    requestId: string;
    targetId: string;
}

export class FollowUserDto implements IFollow {
    requestId: string;
    targetId: string;
    status: boolean;

    constructor(requestId: string, targetId: string , status : boolean) {
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