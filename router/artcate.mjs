import express from "express";
import {
  addCates,
  deletecate,
  getArticleCates,
  getCateById,
  updateCateById,
} from "../router_handler/artcate.mjs";

const router = express.Router();
// 获取文章分类列表
router.get("/cates", getArticleCates);

// 新增文章分类
router.post("/addCates", addCates);

// 根据id删除文章
router.get("/delete/:id", deletecate);

// 根据id获取文章分类数据
router.get("/cates/:id", getCateById);

// 根据id更新文章分类数据
router.post("/updatecate", updateCateById);

export default router;
