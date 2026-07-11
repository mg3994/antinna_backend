export class RandomUtils {
  public static string(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  public static integer(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
