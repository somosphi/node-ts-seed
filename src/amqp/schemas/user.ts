import joi from 'joi';

export const findUserSchema = joi.object({
  id: joi.string().required(),
});
