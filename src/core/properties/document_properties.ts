import { AppsScriptProperties, IProperties } from '../wrappers/properties';

export class DocumentProperties {
  private props: IProperties;

  constructor() {
    this.props = new AppsScriptProperties('document');
  }

  public get(key: string): string | null {
    return this.props.getProperty(key);
  }

  public set(key: string, value: string): void {
    this.props.setProperty(key, value);
  }

  public delete(key: string): void {
    this.props.deleteProperty(key);
  }

  public getAll(): Record<string, string> {
    return this.props.getProperties();
  }
}
