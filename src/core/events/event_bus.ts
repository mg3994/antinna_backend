export type EventHandler<T = any> = (event: T) => void | Promise<void>;

export class EventBus {
  private listeners: Map<string, EventHandler[]> = new Map();

  public subscribe<T = any>(eventName: string, handler: EventHandler<T>): void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName)!.push(handler);
  }

  public async publish<T = any>(eventName: string, eventData: T): Promise<void> {
    const handlers = this.listeners.get(eventName);
    if (!handlers || handlers.length === 0) return;

    const promises = handlers.map(async handler => {
      try {
        await handler(eventData);
      } catch (err) {
        console.error(`Error in event handler for event [${eventName}]:`, err);
      }
    });

    await Promise.all(promises);
  }
}
