export type QueryOperator = 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains';

export interface QueryCriteria {
  field: string;
  operator: QueryOperator;
  value: any;
}

export class QueryBuilder<T> {
  private criterias: QueryCriteria[] = [];

  public where(field: string, operator: QueryOperator, value: any): QueryBuilder<T> {
    this.criterias.push({ field, operator, value });
    return this;
  }

  public matches(item: any): boolean {
    return this.criterias.every(crit => {
      const val = item[crit.field];
      switch (crit.operator) {
        case 'eq':
          return String(val) === String(crit.value);
        case 'neq':
          return String(val) !== String(crit.value);
        case 'gt':
          return Number(val) > Number(crit.value);
        case 'lt':
          return Number(val) < Number(crit.value);
        case 'gte':
          return Number(val) >= Number(crit.value);
        case 'lte':
          return Number(val) <= Number(crit.value);
        case 'contains':
          return String(val).toLowerCase().includes(String(crit.value).toLowerCase());
        default:
          return true;
      }
    });
  }
}
