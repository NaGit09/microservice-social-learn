import { Notification } from "../entities/notification.entity";
import { Pagination } from "./pagination.type";

export interface NotificationPagination {
    data: Notification[],
    pagination : Pagination,
}