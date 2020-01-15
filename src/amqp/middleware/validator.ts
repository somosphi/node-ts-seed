import joi from 'joi';
import { ValidationError } from '../../errors';

export const validatorMiddleware = (schema: joi.Schema) => <T>(
  message: any
): T => {
  const validation = joi.validate(message, schema, {
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: true,
  });

  if (validation.error) {
    throw new ValidationError(validation.error.details);
  }

  return validation.value as T;
};
