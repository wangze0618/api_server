import express from "express";
import cors from "cors";
import userRouter from "./router/user.mjs";
import userInfoRouter from "./router/userinfo.mjs";
import articleCateRouter from "./router/article.mjs";
import Joi from "joi";
import { expressjwt } from "express-jwt";
import { secretKey } from "./config.mjs";
const port = 9900;

const app = express();
app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// [优化]封装res.send()报错
app.use((req, res, next) => {
  res.cc = (err, status = 1) => {
    return res.send({
      status, // 判断err是否是Error的实例，否则就返回
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

app.use(
  expressjwt({
    secret: secretKey,
    algorithms: ["HS256"],
  }).unless({
    path: [/^\/api\//], // /api路径的接口不需要token认证
  })
);

app.use("/api", userRouter);
app.use("/my", userInfoRouter);
app.use("/my/article", articleCateRouter);

// 全局错误中间件
app.use((err, req, res, next) => {
  // 捕获验证出错
  if (err instanceof Joi.ValidationError) {
    return res.cc(err);
  }
  // token认证失败的错误
  if (err.name === "UnauthorizedError") {
    return res.cc("身份认证失败");
  }
  return res.cc("未知错误");
});

app.listen(port, () => {
  console.log(`running at http://localhost:${port}`);
});
