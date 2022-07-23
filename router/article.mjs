import express from "express";
import { newArticle } from "../router_handler/article.mjs";
import multer from "multer";
import path from "path";
const filePath = path.join("__dirname", "../uploads");
const upload = multer({ dest: filePath });
const router = express.Router();
router.post("/add", upload.single("cover_img"), newArticle);

export default router;
