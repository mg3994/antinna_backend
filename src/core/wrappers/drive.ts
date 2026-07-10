export interface IDriveFileWrapper {
  getId(): string;
  getName(): string;
  getContentAsString(): string;
  setContent(content: string): void;
}

export interface IDriveWrapper {
  createFile(name: string, content: string, mimeType?: string): IDriveFileWrapper;
  getFileById(id: string): IDriveFileWrapper;
}

export class DriveFileWrapper implements IDriveFileWrapper {
  constructor(private file: GoogleAppsScript.Drive.File) {}

  public getId(): string {
    return this.file.getId();
  }

  public getName(): string {
    return this.file.getName();
  }

  public getContentAsString(): string {
    return this.file.getBlob().getDataAsString();
  }

  public setContent(content: string): void {
    this.file.setContent(content);
  }
}

export class AppsScriptDrive implements IDriveWrapper {
  public createFile(name: string, content: string, mimeType?: string): IDriveFileWrapper {
    let file: GoogleAppsScript.Drive.File;
    if (mimeType) {
      file = DriveApp.createFile(name, content, mimeType);
    } else {
      file = DriveApp.createFile(name, content);
    }
    return new DriveFileWrapper(file);
  }

  public getFileById(id: string): IDriveFileWrapper {
    return new DriveFileWrapper(DriveApp.getFileById(id));
  }
}
