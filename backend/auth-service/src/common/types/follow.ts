import { Follow } from '../entities/follow';
export class FollowNotify {
  id : string;
  actorId : string;
  receiverId : string;
  constructor(follow : Follow) {
    this.id = follow._id.toString();
    this.actorId = follow.requestId.toString();
    this.receiverId = follow.targetId.toString();
  }
}