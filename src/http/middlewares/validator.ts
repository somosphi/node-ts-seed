import joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../errors';

export const validatorMiddleware = (schema: joi.Schema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const validation = joi.validate(req, schema, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: true,
    });

    if (validation.error) {
      return next(new ValidationError(validation.error.details));
    }

    Object.assign(req, validation.value);

    return next();
  };
