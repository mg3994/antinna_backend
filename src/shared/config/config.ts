import { ScriptProperties } from '../../core/properties/script_properties';

export class AppConfig {
  private static props = new ScriptProperties();

  public static getFirebaseProjectId(): string {
    return this.props.get('FIREBASE_PROJECT_ID') || 'rotiride';
  }

  public static getBloggerBlogId(): string {
    return this.props.get('BLOGGER_BLOG_ID') || 'mock-blog-id';
  }

  public static getGstRate(): number {
    return Number(this.props.get('GST_RATE') || '0.18');
  }

  public static getAdminEmail(): string {
    return this.props.get('ADMIN_EMAIL') || 'admin@example.com';
  }

  public static getSpreadsheetId(): string {
    return this.props.get('SPREADSHEET_ID') || '';
  }
}
