import { AuthorInforResp } from "./post-resp";

export class LikeNotify {

    actorId: string;
    entitytitle: string;
    entityId: string;
    receiverId: string;

    constructor(userId: string, author: AuthorInforResp, targetId: string) {
        this.actorId = userId;
        this.entityId = targetId;
        this.entitytitle = author.caption;
        this.receiverId = author.authorId;
    }
}
