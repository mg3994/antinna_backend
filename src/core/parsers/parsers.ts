export class TextParser {
  /**
   * Helper to parse query-string style parameters manually.
   */
  public static parseQueryString(query: string): Record<string, string> {
    const params: Record<string, string> = {};
    if (!query) return params;

    const parts = query.replace(/^\?/, '').split('&');
    parts.forEach(part => {
      const [key, val] = part.split('=');
      if (key) {
        params[decodeURIComponent(key)] = decodeURIComponent(val || '');
      }
    });
    return params;
  }
}
