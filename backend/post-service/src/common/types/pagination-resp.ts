export class Pagination {
    
    total: number;
    page: number;
    size: number;
    limit: number;
    totalPages: number;

    constructor(total: number, page: number, limit: number) {
        this.total = total;
        this.page = page;
        this.limit = limit;
        this.totalPages = Math.ceil(total / limit);
    }
}
