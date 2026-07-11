export class Permissions {
  public static hasPermission(userRoles: string[], requiredRole: string): boolean {
    return userRoles.includes(requiredRole) || userRoles.includes('admin');
  }
}
