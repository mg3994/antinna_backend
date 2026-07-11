import { validate, hydrate, deserialize, serialize } from '@antinna/schema-ld-types';

export class JsonHelper {
  public static parse<T = any>(jsonString: string): T {
    return JSON.parse(jsonString) as T;
  }

  public static stringify(obj: any, pretty = false): string {
    return pretty ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
  }

  /**
   * Validates if the object conforms to the expected Schema.org type using @antinna/schema-ld-types.
   */
  public static validateSchema<T>(obj: any, typeName: string): obj is T {
    try {
      return validate<T>(obj, typeName as any);
    } catch {
      return false;
    }
  }

  /**
   * Hydrates the missing @type properties in nested schema structures.
   */
  public static hydrateSchema<T>(obj: any, typeName: string): T {
    return hydrate(obj, typeName as any) as unknown as T;
  }

  /**
   * Deserializes and hydrates a raw JSON-LD string into a strongly-typed schema model.
   */
  public static deserializeSchema<T>(jsonLdString: string, typeName: string): T {
    return deserialize<T>(jsonLdString, typeName as any);
  }

  /**
   * Serializes a Schema object to standard JSON-LD with correct context.
   */
  public static serializeSchema(obj: any): string {
    return serialize(obj);
  }
}
