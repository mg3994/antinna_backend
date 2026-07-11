export class Stopwatch {
  private startTime: number = 0;
  private endTime: number = 0;
  private running: boolean = false;

  public start(): void {
    this.startTime = Date.now();
    this.running = true;
  }

  public stop(): number {
    if (this.running) {
      this.endTime = Date.now();
      this.running = false;
    }
    return this.getElapsedMs();
  }

  public getElapsedMs(): number {
    if (this.running) {
      return Date.now() - this.startTime;
    }
    return this.endTime - this.startTime;
  }
}
