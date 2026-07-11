export class ArrayList<T> {
  constructor(private items: T[] = []) {}

  public add(item: T): void {
    this.items.push(item);
  }

  public remove(predicate: (item: T) => boolean): void {
    this.items = this.items.filter(item => !predicate(item));
  }

  public find(predicate: (item: T) => boolean): T | null {
    return this.items.find(predicate) || null;
  }

  public filter(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }

  public toArray(): T[] {
    return [...this.items];
  }

  public size(): number {
    return this.items.length;
  }
}
