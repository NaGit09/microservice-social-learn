import { Conversation } from '../schema/conversation.entity';
import { Pagination } from './pagination-resp';

export class ConversationPagination {

  conversations: Conversation[];
    pagination: Pagination;
    
  constructor(conversations: Conversation[], pagination: Pagination) {
    this.conversations = conversations;
    this.pagination = pagination;
  }
}
