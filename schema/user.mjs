import Joi from "joi";

// 校验 req.body的数据
export const userBodySchema = Joi.object({
  username: Joi.string().alphanum().min(1).max(12).required(),
  password: Joi.string()
    .pattern(/^[\S]{6,12}$/)
    .required(),
  repassword: Joi.ref("password"),
});

// 校验 req.query的数据
export const userQuerySchema = Joi.object({
  name: Joi.string().alphanum().min(3).required(),
  age: Joi.number().integer().min(1).max(100).required(),
});

// 校验 req.params的数据
export const userParamsSchema = Joi.object({
  id: Joi.number().integer().min(0).required(),
});
