import { StringUtils } from '../utils/strings';

export class BackendSchemaExtractor {
  public static getFirst<T>(val: T | T[] | undefined): T | undefined {
    if (Array.isArray(val)) return val[0];
    return val;
  }

  public static getArray<T>(val: T | T[] | undefined): T[] {
    if (val === undefined || val === null) return [];
    if (Array.isArray(val)) return val;
    return [val];
  }

  /**
   * Extracts JSON-LD from raw HTML or text content.
   * Supports script tags as well as direct raw JSON strings (with or without script tags).
   */
  public static extractJsonLd<T = any>(input: string): T | null {
    if (!input) return null;

    try {
      // 1. Try to find content wrapped in script tags
      const scriptMatch = input.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
      const jsonContent = scriptMatch ? scriptMatch[1] : input;

      const decoded = StringUtils.decodeEntities(jsonContent);

      // Strip comments
      const cleaned = decoded
        .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1')
        .trim();

      try {
        return JSON.parse(cleaned) as T;
      } catch (e) {
        // Fallback: try finding first JSON object matching curly braces
        const objectMatch = cleaned.match(/\{[\s\S]*\}/);
        if (objectMatch) {
          try {
            return JSON.parse(objectMatch[0]) as T;
          } catch {}
        }
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  public static extractPrice(offer: any): { price: number; currency: string } {
    const off = Array.isArray(offer) ? offer[0] : offer;
    if (!off) return { price: 0, currency: 'INR' };

    const priceVal = this.getFirst(off.price) ||
                  this.getFirst(this.getArray(off.itemOffered)[0]?.offers?.price) ||
                  this.getFirst(this.getArray(off.offers)[0]?.price) || 0;

    const currencyVal = this.getFirst(off.priceCurrency) ||
                     this.getFirst(this.getArray(off.itemOffered)[0]?.offers?.priceCurrency) ||
                     this.getFirst(this.getArray(off.offers)[0]?.priceCurrency) || 'INR';

    return { price: Number(priceVal), currency: String(currencyVal) };
  }

  public static extractAvailability(offer: any): string {
    const off = Array.isArray(offer) ? offer[0] : offer;
    if (!off) return 'https://schema.org/InStock';

    const av = this.getFirst(off.availability) ||
               this.getFirst(this.getArray(off.itemOffered)[0]?.offers?.availability) ||
               this.getFirst(this.getArray(off.offers)[0]?.availability) || 'https://schema.org/InStock';

    return (av as any)?.['@id'] || String(av);
  }

  public static extractEligibleQuantity(data: any): { minValue: number | null; maxValue: number | null } {
    const obj = Array.isArray(data) ? data[0] : data;
    if (!obj) return { minValue: null, maxValue: null };

    const eq = this.getFirst(obj.eligibleQuantity) ||
               this.getFirst(this.getArray(obj.itemOffered)[0]?.offers?.eligibleQuantity) ||
               this.getFirst(this.getArray(obj.itemOffered)[0]?.eligibleQuantity) ||
               this.getFirst(this.getArray(obj.offers)[0]?.eligibleQuantity) ||
               this.getFirst(this.getArray(obj.offers)[0]?.itemOffered?.eligibleQuantity);

    if (!eq) return { minValue: null, maxValue: null };

    const min = this.getFirst(eq.minValue);
    const max = this.getFirst(eq.maxValue);

    return {
      minValue: (min !== undefined && min !== null) ? Number(min) : null,
      maxValue: (max !== undefined && max !== null) ? Number(max) : null
    };
  }

  public static extractInventoryLevel(data: any): number | null {
    const obj = Array.isArray(data) ? data[0] : data;
    if (!obj) return null;

    const il = this.getFirst(obj.inventoryLevel) ||
               this.getFirst(this.getArray(obj.itemOffered)[0]?.offers?.inventoryLevel) ||
               this.getFirst(this.getArray(obj.itemOffered)[0]?.inventoryLevel) ||
               this.getFirst(this.getArray(obj.offers)[0]?.inventoryLevel) ||
               this.getFirst(this.getArray(obj.offers)[0]?.itemOffered?.inventoryLevel);

    if (!il) return null;

    const val = typeof il === 'object' ? this.getFirst(il.value) : il;
    return (val !== undefined && val !== null) ? Number(val) : null;
  }

  public static findMatchingVariant(parent: any, selectedAttributes: Record<string, string>): any {
    if (!parent) return null;
    const variants = this.getArray(parent.hasVariant).length > 0 ? this.getArray(parent.hasVariant) : [parent];

    const match = variants.find((v: any) =>
      Object.entries(selectedAttributes).every(([k, val]) => String(this.getFirst(v[k])) === String(val))
    );

    return match || variants[0];
  }

  public static findAllServices(obj: any): any[] {
    const results: any[] = [];
    const stack = [obj];
    const seen = new Set();

    while (stack.length > 0) {
      const current = stack.pop();
      if (!current || typeof current !== 'object' || seen.has(current)) continue;
      seen.add(current);

      if (current.hasOfferCatalog) {
        const catalogs = this.getArray(current.hasOfferCatalog);
        catalogs.forEach(cat => {
          const elements = this.getArray(cat.itemListElement);
          results.push(...elements);
          stack.push(cat);
        });
      }

      if (current.addOn) {
        results.push(...this.getArray(current.addOn));
      }

      if (Array.isArray(current)) {
        stack.push(...current);
      } else {
        for (const [key, val] of Object.entries(current)) {
          if (key !== 'hasOfferCatalog' && key !== 'addOn' && val && typeof val === 'object') {
            stack.push(val);
          }
        }
      }
    }
    return results;
  }
}
