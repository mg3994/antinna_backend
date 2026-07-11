import { HttpRequest } from '../http/request';
import { BearerToken } from './bearer_token';
import { JwtHelper, DecodedJwt } from '../security/jwt';

export class AuthGuard {
  constructor(private firebaseProjectId?: string) {}

  public authenticate(req: HttpRequest): boolean {
    const token = BearerToken.extract(req);
    if (!token) return false;

    try {
      if (this.firebaseProjectId) {
        // Full Firebase Verification
        const isValid = JwtHelper.verifyFirebaseToken(token, this.firebaseProjectId);
        if (!isValid) return false;
      }

      // Store decoded user info on request parameters / properties for upstream access
      const decoded = JwtHelper.decode(token);
      (req as any).user = decoded.payload;
      return true;
    } catch {
      return false;
    }
  }
}
