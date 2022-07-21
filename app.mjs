import express from "express";
import cors from "cors";
import userRouter from "./router/user.mjs";
import Joi from "joi";
const port = 9900;

const app = express();
app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// [优化]封装res.send()
app.use((req, res, next) => {
  res.cc = (err, status = 1) => {
    return res.send({
      status, // 判断err是否是Error的实例，否则就返回
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

app.use("/api", userRouter);

// 全局错误中间件
app.use((err, req, res, next) => {
  if (err instanceof Joi.ValidationError) {
    return res.cc(err);
  }
  res.cc("未知错误");
});

app.listen(port, () => {
  console.log(`running at http://localhost:${port}`);
});
