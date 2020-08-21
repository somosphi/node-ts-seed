import Joi from '@hapi/joi';

export abstract class CodedError extends Error {
  code: string;

  statusCode: number;

  constructor(code: string, message: string, statusCode: number) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }

  toJSON() {
    return {
      message: this.message,
      code: this.code,
    };
  }
}

export abstract class DetailedCodedError extends CodedError {
  details: Record<string, any>;

  constructor(
    code: string,
    message: string,
    details: Record<string, any>,
    statusCode: number
  ) {
    super(code, message, statusCode);
    this.details = details;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      details: this.details,
    };
  }
}

export class NotFound extends CodedError {
  constructor(code: string, message: string) {
    super(code, message, 404);
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

export class ValidationError extends DetailedCodedError {
  constructor(details: Joi.ValidationErrorItem[]) {
    super('VALIDATION_FAILED', 'Invalid request data', details, 400);
  }
}
