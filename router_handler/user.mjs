// 用户路由模块处理函数
import db from "../db/index.mjs";
import bcrypt from "bcryptjs";
import { userBodySchema } from "../schema/user.mjs";
import jwt from "jsonwebtoken";
import { expiredTime, secretKey } from "../config.mjs"; // 生成和验证token的密钥

// 注册处理函数
export const register = (req, res) => {
  const regSql = `SELECT * FROM users WHERE username = ?`;
  const regInsertSql = `INSERT INTO users SET ?`;
  const userInfo = req.body;
  // 1.进行规则校验
  const { error, result } = userBodySchema.validate(userInfo);
  if (error) {
    return res.cc(error.details[0].message);
  } else {
    db.query(regSql, userInfo.username, (err, result) => {
      // 执行sql语句
      if (err) {
        return res.send({ status: 1, message: err.message });
      }
      // 2.用户名已存在
      if (result.length > 0) {
        return res.cc("用户名已被占用，请更换其他用户名！");
      }
      // 3.用户名可用时，进行密码加密，写入对象到数据库
      userInfo.password = bcrypt.hashSync(userInfo.password, 10);
      db.query(regInsertSql, userInfo, (err, result) => {
        if (err) {
          return res.cc(err);
        }
        if (result.affectedRows !== 1) {
          return res.cc("注册用户失败，请重试！");
        }
        res.cc("注册成功！", 0);
      });
    });
  }
};

// 登录处理函数
export const login = (req, res) => {
  const loginSql = `SELECT * FROM users WHERE username = ?`;
  const userInfo = req.body;
  // 1.进行规则校验
  const { error, result } = userBodySchema.validate(userInfo);
  if (error) {
    return res.cc(error.details[0].message);
  } else {
    // 执行sql语句
    db.query(loginSql, userInfo.username, (err, sqlResult) => {
      if (err) {
        return res.cc(err);
      }
      // 当数据库里查不到该数据时
      if (sqlResult.length !== 1) {
        return res.cc("用户不存在！");
      }
      // 判断 传来的密码 是否与 数据库的密码 相同
      if (bcrypt.compareSync(userInfo.password, sqlResult[0].password)) {
        // 把查询到的用户信息中的 头像和 密码的值剔除掉
        const user = { ...sqlResult[0], password: "", user_pic: "" };
        // 生成token
        const token = jwt.sign(user, secretKey, {
          expiresIn: expiredTime,
        });
        return res.send({
          status: 0,
          message: "登录成功",
          token: `Bearer ${token}`,
        });
      } else {
        return res.cc("密码错误，登录失败");
      }
    });
  }
};
