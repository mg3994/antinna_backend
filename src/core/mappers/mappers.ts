export interface IMapper<TSource, TTarget> {
  map(source: TSource): TTarget;
  mapMany(sourceArray: TSource[]): TTarget[];
}

export abstract class BaseMapper<TSource, TTarget> implements IMapper<TSource, TTarget> {
  public abstract map(source: TSource): TTarget;

  public mapMany(sourceArray: TSource[]): TTarget[] {
    return sourceArray.map(item => this.map(item));
  }
}
