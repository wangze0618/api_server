// 用户信息接口函数处理模块
import db from "../db/index.mjs";
import bcrypt from "bcryptjs";
import {
  updatePasswordSchema,
  userUpdateBody,
  validatePostBase64,
} from "../schema/user.mjs";
// 获取用户信息
export const getUserInfo = (req, res) => {
  const sql = `SELECT id,username,nickname,email,user_pic from users WHERE id =?`;
  db.query(sql, req.auth.id, (err, sqlResult) => {
    if (err) {
      return res.cc(err);
    }
    if (sqlResult.length !== 1) {
      return res.cc("获取用户信息失败！");
    }
    res.send({
      status: 0,
      message: "获取用户信息成功",
      data: sqlResult[0],
    });
  });
};

// 更新用户信息
export const updateUserInfo = (req, res) => {
  const sql = `UPDATE users SET ? WHERE id = ?`;
  const userInfo = req.body;
  const { error, result } = userUpdateBody.validate(userInfo);
  if (error) {
    return res.cc(error.details[0].message);
  }
  db.query(sql, [userInfo, req.auth.id], (err, sqlResult) => {
    if (err) {
      return res.cc(err);
    }
    if (sqlResult.affectedRows !== 1) {
      return res.cc("修改基本信息失败！");
    }
    res.send({
      status: 0,
      message: "更新基本信息成功",
    });
  });
};

// 更新用户密码
export const updatePassword = (req, res) => {
  const password = req.body;
  const id = req.auth.id;
  const sql = `SELECT password FROM users WHERE id = ?`;
  const updateSql = `UPDATE users SET password = ? WHERE id = ?`;
  // 校验密码
  const { error, result } = updatePasswordSchema.validate(password);
  if (error) {
    return res.cc(error.details[0].message);
  }
  db.query(sql, id, (error, sqlResult) => {
    if (error) {
      return res.cc(error.message);
    }
    // 如果传来的旧密码和数据库的旧密码一样
    if (bcrypt.compareSync(password.oldPwd, sqlResult[0].password)) {
      password.newPwd = bcrypt.hashSync(password.newPwd, 10);
      db.query(updateSql, [password.newPwd, id], (err, sqlResult) => {
        if (err) {
          return res.cc(err);
        }
        if (sqlResult.length !== 1) {
          return res.cc("用户不存在！");
        }
        if (sqlResult.affectedRows !== 1) {
          return res.cc("修改密码失败！");
        }
        res.send({
          status: 0,
          message: "更新密码成功！",
        });
      });
    } else {
      return res.cc("旧密码不对！");
    }
  });
};

// 更新头像
export const updateAvatar = (req, res) => {
  const sql = `UPDATE users SET user_pic = ? WHERE id  = ?`;
  // 踩了个坑，不要req.body.avatar -> req.body
  // Don't select spesifice Key
  // Just whole req.body to fetch it as an object
  // https://github.com/sideway/joi/issues/2444
  const { error, result } = validatePostBase64.validate(req.body);
  if (error) {
    return res.cc(error.details[0].message);
  }
  db.query(sql, [req.body.avatar, req.auth.id], (err, sqlResult) => {
    if (err) {
      return res.cc(err);
    }
    if (sqlResult.affectedRows !== 1) {
      return res.cc("更新头像失败！");
    }
    res.send({
      status: 0,
      message: "更新头像成功！",
    });
  });
};
