import { Stopwatch } from './stopwatch';

export class Profiler {
  private profiles: Record<string, Stopwatch> = {};

  public start(label: string): void {
    if (!this.profiles[label]) {
      this.profiles[label] = new Stopwatch();
    }
    this.profiles[label].start();
  }

  public stop(label: string): number {
    const sw = this.profiles[label];
    if (!sw) return 0;
    return sw.stop();
  }

  public getDuration(label: string): number {
    const sw = this.profiles[label];
    return sw ? sw.getElapsedMs() : 0;
  }
}
