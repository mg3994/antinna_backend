export interface IPlugin {
  name: string;
  initialize(context: any): void;
}

export class PluginEngine {
  private plugins: Map<string, IPlugin> = new Map();

  constructor(private context: any) {}

  public register(plugin: IPlugin): void {
    plugin.initialize(this.context);
    this.plugins.set(plugin.name, plugin);
  }

  public getPlugin(name: string): IPlugin | null {
    return this.plugins.get(name) || null;
  }
}
