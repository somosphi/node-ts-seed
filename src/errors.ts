import Joi from '@hapi/joi';

export abstract class CodedError extends Error {
  code: string;
  statusCode: number;
  details?: Record<string, any>;

  constructor(
    code: string,
    message: string,
    statusCode: number,
    details?: Record<string, any>
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }

  toJSON() {
    return {
      message: this.message,
      code: this.code,
      details: this.details,
    };
  }
}

export class NotFound extends CodedError {
  constructor(code: string, message: string, details?: Record<string, any>) {
    super(code, message, 404, details);
  }
}

export class BadRequest extends CodedError {
  constructor(code: string, message: string, details?: Record<string, any>) {
    super(code, message, 400, details);
  }
}

export class NotFoundError extends NotFound {
  constructor() {
    super('NOT_FOUND', 'Page not found');
  }
}

export class ResourceNotFoundError extends NotFound {
  constructor() {
    super('RESOURCE_NOT_FOUND', 'Resource not found');
  }
}

export class ValidationError extends BadRequest {
  constructor(details: Joi.ValidationErrorItem[]) {
    super('VALIDATION_FAILED', 'Invalid request data', details);
  }
}
