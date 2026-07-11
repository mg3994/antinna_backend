import { IBlob, AppsScriptBlob } from './blob';

export interface IFile {
  getId(): string;
  getName(): string;
  getBlob(): IBlob;
  getUrl(): string;
}

export class AppsScriptFile implements IFile {
  constructor(private file: GoogleAppsScript.Drive.File) {}

  public getId(): string {
    return this.file.getId();
  }

  public getName(): string {
    return this.file.getName();
  }

  public getBlob(): IBlob {
    return new AppsScriptBlob(this.file.getBlob());
  }

  public getUrl(): string {
    return this.file.getUrl();
  }
}
