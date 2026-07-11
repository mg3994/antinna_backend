export class SignatureHelper {
  /**
   * Computes an RS256 signature using a private key.
   */
  public static signRsaSha256(data: string, privateKeyPem: string): string {
    const signatureBytes = Utilities.computeRsaSha256Signature(data, privateKeyPem, Utilities.Charset.UTF_8);
    return Utilities.base64EncodeWebSafe(signatureBytes);
  }
}
