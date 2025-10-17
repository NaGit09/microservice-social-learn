import mongoose from 'mongoose';
export interface FollowNotifyDto {
  id: mongoose.Schema.Types.ObjectId;
  requestId: mongoose.Schema.Types.ObjectId;
  targetId: mongoose.Schema.Types.ObjectId;
}