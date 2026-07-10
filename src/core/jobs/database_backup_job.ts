import { Job } from './job';

export class DatabaseBackupJob implements Job {
  public name = 'DatabaseBackupJob';

  public execute(): void {
    console.log('DatabaseBackupJob: Initiating automatic database backup...');
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) {
      const copyFile = DriveApp.getFileById(active.getId()).makeCopy(`Backup_${active.getName()}_${new Date().toISOString().slice(0, 10)}`);
      console.log(`DatabaseBackupJob: Created spreadsheet backup: ${copyFile.getName()} (${copyFile.getId()})`);
    }
  }
}
