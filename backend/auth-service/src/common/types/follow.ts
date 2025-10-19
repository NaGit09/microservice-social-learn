import mongoose from 'mongoose';
import { Follow } from '../entities/follow';
export class FollowNotify {
  id : string;
  requestId : string;
  targetId : string;
  constructor(follow : Follow) {
    this.id = follow._id.toString();
    this.requestId = follow.requestId.toString();
    this.targetId = follow.targetId.toString();
  }
}