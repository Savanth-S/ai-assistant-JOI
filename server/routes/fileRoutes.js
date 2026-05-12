import express from "express";

import multer from "multer";

import authMiddleware from "../middleware/authMiddleware.js";

const router =
  express.Router();

// MULTER STORAGE
const storage =
  multer.diskStorage({

    destination:
      (req, file, cb) => {

        cb(
          null,
          "uploads/"
        );
      },

    filename:
      (req, file, cb) => {

        cb(
          null,
          Date.now() +
          "-" +
          file.originalname
        );
      },
  });

const upload =
  multer({
    storage,
  });

// UPLOAD FILE
router.post(
  "/upload",

  authMiddleware,

  upload.single("file"),

  (req, res) => {

    try {

      res.json({
        message:
          "File uploaded successfully",

        file:
          req.file.filename,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server error",
      });
    }
  }
);

export default router;