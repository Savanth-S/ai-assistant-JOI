import express from "express";

import upload from "../middleware/uploadMiddleware.js";

import {
  uploadFile,
} from "../controllers/fileController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router =
  express.Router();

router.post(
  "/upload",
  protect,
  upload.single("file"),
  uploadFile
);

export default router;