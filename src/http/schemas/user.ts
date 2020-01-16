import Joi from '@hapi/joi';

export const findUserSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required(),
  }),
});

export const createUserSchema = Joi.object({
  body: {
    name: Joi.string().required(),
    username: Joi.string().required(),
    emailAddress: Joi.string()
      .email()
      .required(),
  },
});
