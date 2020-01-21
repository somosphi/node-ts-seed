import Joi from '@hapi/joi';

export const findUserSchema = Joi.object({
  id: Joi.string().required(),
});
