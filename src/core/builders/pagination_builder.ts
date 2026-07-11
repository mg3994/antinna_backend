export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class PaginationBuilder {
  private page: number = 1;
  private limit: number = 20;
  private total: number = 0;

  public static create(): PaginationBuilder {
    return new PaginationBuilder();
  }

  public setPage(page: number): PaginationBuilder {
    this.page = page;
    return this;
  }

  public setLimit(limit: number): PaginationBuilder {
    this.limit = limit;
    return this;
  }

  public setTotal(total: number): PaginationBuilder {
    this.total = total;
    return this;
  }

  public build(): PaginationMeta {
    const totalPages = Math.ceil(this.total / this.limit) || 1;
    return {
      page: this.page,
      limit: this.limit,
      total: this.total,
      totalPages
    };
  }
}
