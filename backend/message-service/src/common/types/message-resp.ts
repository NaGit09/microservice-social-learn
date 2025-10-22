import { Message } from '../schema/message.entity';
import { Pagination } from './pagination-resp';

export class MessagePagination {
  messages: Message[];
  pagination: Pagination;
  constructor(messages: Message[], pagination: Pagination) {
    this.messages = messages;
    this.pagination = pagination;
  }
}
