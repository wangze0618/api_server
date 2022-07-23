import express from "express";
import {
  getUserInfo,
  updateAvatar,
  updatePassword,
  updateUserInfo,
} from "../router_handler/userinfo.mjs";
const router = express.Router();

// 获取用户信息 get /my/userinfo
router.get("/userinfo", getUserInfo);

// 更新用户信息 post /my/userinfo
router.post("/userinfo", updateUserInfo);

// 更改密码
router.post("/updatepwd", updatePassword);

// 更新头像
router.post("/update/avatar", updateAvatar);

export default router;
