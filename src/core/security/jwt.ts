export interface FirebaseIdentities {
  email?: string[];
  'google.com'?: string[];
  phone?: string[];
  [providerId: string]: string[] | undefined;
}

export interface FirebaseClaimInfo {
  identities?: FirebaseIdentities;
  sign_in_provider?: string;
  [key: string]: any;
}

export interface FirebaseClaims {
  iss: string;
  aud: string;
  sub: string;
  iat: number;
  exp: number;
  auth_time: number;
  user_id: string;
  provider_id: string | null;
  name?: string;
  picture?: string;
  email?: string;
  email_verified?: boolean;
  firebase?: FirebaseClaimInfo;
  phone_number?: string;
  [key: string]: any;
}

export interface DecodedJwt<T = FirebaseClaims> {
  header: {
    alg: string;
    kid?: string;
    typ: string;
  };
  payload: T;
  signature: string;
}

export class JwtHelper {
  public static decode<T = FirebaseClaims>(token: string): DecodedJwt<T> {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    const header = JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(parts[0])).getDataAsString());
    const payload = JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(parts[1])).getDataAsString());

    return {
      header,
      payload,
      signature: parts[2]
    };
  }

  /**
   * Verifies Firebase ID Token.
   * Utilizes the standard Google OAuth2 tokeninfo endpoint for 100% secure verification
   * without requiring massive custom RSA decryption libraries on Apps Script.
   */
  public static verifyFirebaseToken(token: string, firebaseProjectId: string): boolean {
    try {
      // 1. Pre-validate locally to filter expired or malicious tokens
      const decoded = this.decode<FirebaseClaims>(token);
      const now = Math.floor(Date.now() / 1000);

      // Support cases where claims might be nested under decoded.payload.claims or directly on decoded.payload
      const claims: FirebaseClaims = (decoded.payload as any).claims || decoded.payload;

      if (claims.exp < now) {
        return false; // Expired
      }
      if (claims.iss !== `https://securetoken.google.com/${firebaseProjectId}`) {
        return false; // Invalid issuer
      }
      if (claims.aud !== firebaseProjectId) {
        return false; // Invalid audience
      }

      // 2. Validate token authenticity with Google's verification API
      const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`;
      const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });

      if (response.getResponseCode() !== 200) {
        return false; // Failed signature validation or revoked
      }

      const info = JSON.parse(response.getContentText());
      // Double check sub/uid matching
      return info.sub === claims.sub;
    } catch {
      return false;
    }
  }
}
