import { HttpRequest } from '../http/request';
import { HttpResponse } from '../http/response';
import { Middleware } from '../router/router';
import { Validator } from '../validation/validator';
import { StatusCode } from '../constants/status_code';

export type ValidationSchemaDef = (validator: Validator) => void;

export function createValidatorMiddleware(schemaDef: ValidationSchemaDef): Middleware {
  return (req: HttpRequest, res: HttpResponse, next: () => void): void => {
    const body = req.body.asJson() || {};
    const validator = Validator.make(body);

    // Configure validation rules
    schemaDef(validator);

    if (!validator.validate()) {
      res.status(StatusCode.UNPROCESSABLE_ENTITY).json({
        success: false,
        status: StatusCode.UNPROCESSABLE_ENTITY,
        message: 'Validation failed',
        error: 'VALIDATION_FAILED',
        validationErrors: validator.getErrors()
      });
      return;
    }

    next();
  };
}
