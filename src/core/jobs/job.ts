export interface Job {
  name: string;
  execute(): void;
}
// Note: standard GAS triggers and runs are strictly synchronous.
