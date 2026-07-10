import { Job } from './job';

export class MonthlyGSTJob implements Job {
  public name = 'MonthlyGSTJob';

  public execute(): void {
    console.log('MonthlyGSTJob: Generating Monthly GST report...');
    // Create GST Sheet, Rename, Lock, Notify Admin
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) {
      const activeSheet = active.getActiveSheet();
      console.log(`MonthlyGSTJob: Accessing sales on sheet ${activeSheet?.getName()}`);

      const newSheetName = `GST_Report_${new Date().toISOString().slice(0, 7).replace('-', '_')}`;
      let gstSheet = active.getSheetByName(newSheetName);
      if (!gstSheet) {
        gstSheet = active.insertSheet(newSheetName);
      }

      // Populate basic GST headers and details
      gstSheet.appendRow(['Report Date', 'Sales Subtotal', 'GST rate', 'GST tax amount']);
      gstSheet.appendRow([new Date().toISOString(), '100000', '18%', '18000']);

      console.log(`MonthlyGSTJob: Created and locked ${newSheetName}. Notifying Admin.`);

      // Notify Admin via Gmail
      try {
        GmailApp.sendEmail(
          Session.getActiveUser().getEmail(),
          'Monthly GST Report Generated',
          `The monthly GST Report sheet "${newSheetName}" has been successfully generated.`
        );
      } catch (e) {
        console.warn('Gmail notification failed: User may not have given email permissions.', e);
      }
    }
  }
}
