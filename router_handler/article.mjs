import db from "../db/index.mjs";
import { validateAddArticle } from "../schema/user.mjs";
import path from "path";
// 添加新文章
export const newArticle = (req, res) => {
  if (!req.file || !req.file.path) {
    return res.cc("请上传封面");
  }

  const article = {
    ...req.body,
    cover_img: path.join("/uploads", req.file.filename),
    pub_date: new Date(),
    author_id: req.auth.id,
  };
  const sql = `INSERT INTO articles SET ?`;
  const { error, result } = validateAddArticle.validate(req.body);
  if (error) {
    return res.cc(error.details[0].message);
  }
  db.query(sql, article, (err, sqlResult) => {
    if (err) {
      return res.cc(err);
    }
    if (sqlResult.affectedRows !== 1) {
      return res.cc("添加失败！");
    }
    console.log(article);
    return res.send({
      status: 0,
      message: "添加成功！",
    });
  });
};
