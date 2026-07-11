export class HmacHelper {
  public static sha256(value: string, key: string): string {
    const signature = Utilities.computeHmacSha256Signature(value, key, Utilities.Charset.UTF_8);
    return signature.map(byte => {
      const hex = (byte & 0xff).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }
}
