// 用户路由模块
import express from "express";
import { register, login } from "../router_handler/user.mjs";
// 验证表单数据的中间件
// 验证规则对象
// import expressJoi from "express-joi-validator";
// import { userBodySchema } from "../schema/user.mjs";

const router = express.Router();

// 注册新用户
router.post("/register", register);

// 登录
router.post("/login", login);

export default router;
