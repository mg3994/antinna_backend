import { ApiError } from './api_error';
import { StatusCode } from '../constants/status_code';

export class SpreadsheetError extends ApiError {
  constructor(message: string = 'Spreadsheet Database Error', errorCode: string = 'SPREADSHEET_ERROR') {
    super(StatusCode.INTERNAL_SERVER_ERROR, message, errorCode);
    this.name = 'SpreadsheetError';
  }
}
