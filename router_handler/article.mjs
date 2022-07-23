import db from "../db/index.mjs";
import { validateAddCates } from "../schema/user.mjs";
// 获取文章分类列表处理函数
export const getArticleCates = (req, res) => {
  const sql = `SELECT * FROM article_cate WHERE is_delete = 0 ORDER BY id ASC `;
  db.query(sql, (err, sqlResult) => {
    if (err) {
      return res.cc(err);
    }
    res.send({
      status: 0,
      message: "获取文章分类列表成功！",
      data: sqlResult,
    });
  });
};

// 新增文章分类
export const addCates = (req, res) => {
  const sql = `SELECT * FROM article_cate WHERE name=? or alias=?`;
  const insertSql = `INSERT INTO article_cate SET ?`;
  const cate = req.body;
  const { error, result } = validateAddCates.validate(cate);
  if (error) {
    return res.cc(error.details[0].message);
  }
  db.query(sql, [req.body.name, req.body.alias], (err, sqlResult) => {
    if (err) {
      return res.cc(err);
    }
    // 判断 分类名称 和 分类别名 是否被占用
    if (sqlResult.length === 2) {
      return res.cc("分类名称与别名被占用，请更换后重试！");
    }
    // 分别判断 分类名称 和 分类别名 是否被占用
    if (sqlResult.length == 1 && sqlResult[0].name === req.body.name) {
      return res.cc("分类名称被占用，请更换后重试！");
    }
    if (sqlResult.length == 1 && sqlResult[0].alias === req.body.alias) {
      return res.cc("分类别名被占用，请更换后重试！");
    }
    db.query(insertSql, cate, (err, sqlResult) => {
      if (err) {
        return res.cc(err);
      }
      if (sqlResult.affectedRows !== 1) {
        return res.cc("新增文章分类失败！");
      }
      res.send({
        status: 0,
        message: "新增文章分类成功！",
      });
    });
  });
};
