import { SpreadsheetDatabase } from '../core/database/spreadsheet';
import { AppConfig } from '../shared/config/config';

interface CachedPost {
  id: string;
  title: string;
  published: string;
  updated: string;
  url: string;
  content: string;
}

export class BloggerCmsFeature {
  private db = new SpreadsheetDatabase();
  private cacheTable = this.db.getTable<CachedPost>('BloggerCache');

  public syncBlogPosts(): number {
    const blogId = AppConfig.getBloggerBlogId();
    if (!blogId || blogId === 'mock-blog-id') {
      console.log('BloggerCmsFeature: No custom Blogger Blog ID configured, skipping sync.');
      return 0;
    }

    const feedUrl = `https://www.blogger.com/feeds/${blogId}/posts/default?alt=json&max-results=50`;
    try {
      const response = UrlFetchApp.fetch(feedUrl, { muteHttpExceptions: true });
      if (response.getResponseCode() !== 200) {
        console.warn(`BloggerCmsFeature: Failed to fetch posts feed from Blogger API. Code: ${response.getResponseCode()}`);
        return 0;
      }

      const feedData = JSON.parse(response.getContentText());
      const entries = feedData.feed?.entry || [];
      let updatedCount = 0;

      entries.forEach((entry: any) => {
        const id = String(entry.id?.$t || '');
        const title = String(entry.title?.$t || '');
        const published = String(entry.published?.$t || '');
        const updated = String(entry.updated?.$t || '');
        const content = String(entry.content?.$t || '');

        const alternateLink = entry.link?.find((l: any) => l.rel === 'alternate')?.href || '';

        // Upsert post inside spreadsheet cache
        const exists = this.cacheTable.getAll().find(row => row.data.id === id);
        if (exists) {
          this.cacheTable.update(
            data => data.id === id,
            () => ({ id, title, published, updated, url: alternateLink, content })
          );
        } else {
          this.cacheTable.insert({ id, title, published, updated, url: alternateLink, content });
        }
        updatedCount++;
      });

      return updatedCount;
    } catch (e: any) {
      console.error('BloggerCmsFeature: Sync failed due to exception:', e.message || e);
      return 0;
    }
  }

  public getCachedPosts(): CachedPost[] {
    return this.cacheTable.getAll().map(row => row.data);
  }
}
