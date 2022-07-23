import express from "express";
import { addCates, getArticleCates } from "../router_handler/article.mjs";

const router = express.Router();
// 获取文章分类列表
router.get("/cates", getArticleCates);

// 新增文章分类
router.post("/addCates", addCates);

export default router;
