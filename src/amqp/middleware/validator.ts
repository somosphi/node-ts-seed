import Joi from '@hapi/joi';
import { ValidationError } from '../../errors';

export const validatorMiddleware = (schema: Joi.Schema) => <T>(
  message: any
): T => {
  const validation = schema.validate(message, {
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: true,
  });

  if (validation.error) {
    throw new ValidationError(validation.error.details);
  }

  return validation.value as T;
};
