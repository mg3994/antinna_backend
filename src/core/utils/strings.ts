export class StringUtils {
  public static normalizeName(name: string): string {
    return (name || '').toLowerCase().trim().replace(/\s+/g, ' ');
  }

  public static decodeEntities(text: string): string {
    if (!text) return '';
    // A regex-based HTML entities decoder for Apps Script (no window/document DOM available in backend runtime)
    const entities: Record<string, string> = {
      'amp': '&',
      'apos': "'",
      'lt': '<',
      'gt': '>',
      'quot': '"',
      'nbsp': ' '
    };
    return text.replace(/&(#?[a-zA-Z0-9]+);/g, (match, entity) => {
      if (entity.startsWith('#')) {
        const code = entity.startsWith('#x')
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10);
        return isNaN(code) ? match : String.fromCharCode(code);
      }
      return entities[entity] || match;
    });
  }

  public static capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
