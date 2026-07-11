import { IFile, AppsScriptFile } from './file';

export interface IDrive {
  getFileById(id: string): IFile;
  createFile(name: string, content: string, mimeType?: string): IFile;
}

export class AppsScriptDriveStorage implements IDrive {
  public getFileById(id: string): IFile {
    return new AppsScriptFile(DriveApp.getFileById(id));
  }

  public createFile(name: string, content: string, mimeType?: string): IFile {
    let file: GoogleAppsScript.Drive.File;
    if (mimeType) {
      file = DriveApp.createFile(name, content, mimeType);
    } else {
      file = DriveApp.createFile(name, content);
    }
    return new AppsScriptFile(file);
  }
}
