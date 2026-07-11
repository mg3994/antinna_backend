export class ApiError extends Error {
  constructor(public statusCode: number, message: string, public errorCode: string = 'API_ERROR') {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
