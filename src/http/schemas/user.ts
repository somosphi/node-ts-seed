import joi from 'joi';

export const findUserSchema = joi.object({
  params: joi.object({
    id: joi.string().required(),
  }),
});
