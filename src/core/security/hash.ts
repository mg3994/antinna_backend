export class HashHelper {
  public static sha256(value: string): string {
    const rawDigest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8);
    return rawDigest.map(byte => {
      const hex = (byte & 0xff).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }
}
