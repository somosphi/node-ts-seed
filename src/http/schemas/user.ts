import joi from 'joi';

export const findUserSchema = joi.object({
  params: joi.object({
    id: joi.string().required(),
  }),
});

export const createUserSchema = joi.object({
  body: {
    name: joi.string().required(),
    username: joi.string().required(),
    emailAddress: joi
      .string()
      .email()
      .required(),
  },
});
