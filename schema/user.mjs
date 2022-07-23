import Joi from "joi";

// 校验 req.body注册的数据
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

// 校验用户更新基本信息 不包括密码和头像
export const userUpdateBody = Joi.object({
  // 这里的id不需要了，因为直接从token里面获取到id，原项目是前端ajax获取数据时会获取id
  // id: Joi.number().integer().min(1).required(),
  nickname: Joi.string().required(),
  email: Joi.string().email().required(),
});

// 更新密码操作
export const updatePasswordSchema = Joi.object({
  oldPwd: Joi.string()
    .pattern(/^[\S]{6,12}$/)
    .required(),
  // 新密码 不能和旧密码一样
  newPwd: Joi.string()
    .pattern(/^[\S]{6,12}$/)
    .not(Joi.ref("oldPwd")),
});

// 校验图片
export const validatePostBase64 = Joi.object({
  // 校验图片是不是base64格式
  avatar: Joi.string().dataUri().required(),
});

// 校验新增分类字段
export const validateAddCates = Joi.object({
  name: Joi.string().required(),
  alias: Joi.string().alphanum().required(),
});

// 根据id删除文章 校验 req.params的id
export const articleId = Joi.object({
  id: Joi.number().integer().min(0).required(),
});

// 根据id 来更新文章分类
export const updateArticleCateById = Joi.object({
  id: Joi.number().integer().min(0).required(),
  name: Joi.string().required(),
  alias: Joi.string().alphanum().required(),
});

// 定义 标题、分类Id、内容、发布状态 的验证规则
export const validateAddArticle = Joi.object({
  title: Joi.string().required(),
  cate_id: Joi.number().integer().min(1).required(),
  content: Joi.string().allow("").required(),
  state: Joi.string().valid("已发布", "草稿").required(),
});
