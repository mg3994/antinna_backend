export type Pipe<T> = (context: T, next: () => void) => void;

export class Pipeline<T> {
  private pipes: Pipe<T>[] = [];

  public use(pipe: Pipe<T>): Pipeline<T> {
    this.pipes.push(pipe);
    return this;
  }

  public execute(context: T, onComplete: () => void): void {
    let index = 0;

    const next = () => {
      if (index < this.pipes.length) {
        const pipe = this.pipes[index++];
        pipe(context, next);
      } else {
        onComplete();
      }
    };

    next();
  }
}
