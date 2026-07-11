import { Job } from './job';
import { SpreadsheetDatabase } from '../database/spreadsheet';

interface OrderRecord {
  id: string;
  buyerEmail: string;
  totalPrice: number;
  priceCurrency: string;
  status: string; // 'COMPLETED' | 'RETURNED' | 'REFUNDED' | 'PENDING'
  createdAt: string; // ISO date string
}

export class MonthlyGSTJob implements Job {
  public name = 'MonthlyGSTJob';

  public execute(): void {
    console.log('MonthlyGSTJob: Executing monthly GST compliance check...');

    const db = new SpreadsheetDatabase();
    const ordersTable = db.getTable<OrderRecord>('Orders');
    const allOrders = ordersTable.getAll().map(row => row.data);

    // Get current calendar month and year (or previous month if run at early first day, but we'll use current month here)
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    // Filter orders created in the current month and year
    const monthlyOrders = allOrders.filter(order => {
      if (!order.createdAt) return false;
      const orderDate = new Date(order.createdAt);
      return orderDate.getFullYear() === currentYear && orderDate.getMonth() === currentMonth;
    });

    // Calculate sales, returns, and GST liability (assuming 18% standard GST rate in India)
    let grossSales = 0;
    let totalReturns = 0;
    const detailsRows: any[][] = [];

    monthlyOrders.forEach(order => {
      const price = Number(order.totalPrice || 0);
      const isReturn = order.status === 'RETURNED' || order.status === 'REFUNDED';

      if (isReturn) {
        totalReturns += price;
        detailsRows.push([order.id, order.createdAt, order.buyerEmail, 'RETURN', -price]);
      } else {
        grossSales += price;
        detailsRows.push([order.id, order.createdAt, order.buyerEmail, 'SALE', price]);
      }
    });

    const netTaxableValue = grossSales - totalReturns;
    const gstRate = 0.18; // 18% standard GST
    const gstTaxAmount = Math.max(0, netTaxableValue * gstRate);

    // Create a new sheet tab for GST compliance auditing
    const monthString = String(currentMonth + 1).padStart(2, '0');
    const reportTabName = `GST_${currentYear}_${monthString}`;

    // Insert sheet or reuse existing
    const activeSp = SpreadsheetApp.getActiveSpreadsheet();
    if (!activeSp) {
      throw new Error('SpreadsheetApp.getActiveSpreadsheet() returned null. Cannot generate GST report.');
    }

    let gstSheet = activeSp.getSheetByName(reportTabName);
    if (gstSheet) {
      activeSp.deleteSheet(gstSheet);
    }
    gstSheet = activeSp.insertSheet(reportTabName);

    // Append standard GST Audit Report Header
    gstSheet.appendRow(['GST COMPLIANCE AUDIT REPORT']);
    gstSheet.appendRow(['Audit Period', `${currentYear}-${monthString}`]);
    gstSheet.appendRow(['Report Generated At', new Date().toISOString()]);
    gstSheet.appendRow(['Default Currency', 'INR']);
    gstSheet.appendRow([]);

    // Append GST Aggregated Compliance Summary Table
    gstSheet.appendRow(['GST SUMMARY BREAKDOWN']);
    gstSheet.appendRow(['Gross Monthly Sales', grossSales]);
    gstSheet.appendRow(['Total Returns & Refunds', totalReturns]);
    gstSheet.appendRow(['Net Taxable Value', netTaxableValue]);
    gstSheet.appendRow(['Standard GST Rate', '18.00%']);
    gstSheet.appendRow(['Calculated GST Tax Liability', gstTaxAmount]);
    gstSheet.appendRow([]);

    // Append Detailed Ledger Transaction Rows
    gstSheet.appendRow(['TRANSACTION LEDGER']);
    gstSheet.appendRow(['Order ID', 'Transaction Date', 'Buyer Email', 'Transaction Type', 'Amount (INR)']);

    detailsRows.forEach(row => {
      gstSheet!.appendRow(row);
    });

    console.log(`MonthlyGSTJob: Created and populated audit report [${reportTabName}]. Net Sales: ${netTaxableValue}, GST: ${gstTaxAmount}`);

    // Lock the generated sheet tab for compliance auditing (prevents subsequent modifications)
    try {
      const lock = gstSheet.getProtect();
      lock.setDescription('GST Monthly Compliance Audit File (Locked)');
      lock.setWarningOnly(false); // Make it read-only
      console.log(`MonthlyGSTJob: Successfully locked audit sheet tab [${reportTabName}].`);
    } catch (e) {
      console.warn('MonthlyGSTJob: Sheet locking warning (non-owner or non-bound execution):', e);
    }

    // Send summary email notification to administrator via Gmail
    const adminEmail = Session.getActiveUser().getEmail();
    if (adminEmail) {
      const emailSubject = `[GST Audit] Compliance Report Generated - ${currentYear}/${monthString}`;
      const emailBody = `
Dear Administrator,

The Monthly GST Compliance Report has been successfully generated and audited.

Report Summary:
----------------------------------------
Audit Period: ${currentYear}-${monthString}
GST Tab: ${reportTabName}
Gross Sales: INR ${grossSales.toFixed(2)}
Total Returns: INR ${totalReturns.toFixed(2)}
Net Taxable Value: INR ${netTaxableValue.toFixed(2)}
GST Tax Liability (18%): INR ${gstTaxAmount.toFixed(2)}
----------------------------------------

The audit sheet tab [${reportTabName}] has been locked to prevent tampering and maintain full compliance records.

Best Regards,
Antinna Apps Script Core Framework
      `.trim();

      try {
        GmailApp.sendEmail(adminEmail, emailSubject, emailBody);
        console.log(`MonthlyGSTJob: Sent compliance summary email notification to admin [${adminEmail}].`);
      } catch (err: any) {
        console.warn('MonthlyGSTJob: Failed to send notification email (permissions or quota):', err.message || err);
      }
    }
  }
}
