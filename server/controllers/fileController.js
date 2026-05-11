import readFileContent from "../utils/readFileContent.js";

export const uploadFile =
  async (
    req,
    res
  ) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          message:
            "No file uploaded",
        });
      }

      const content =
        await readFileContent(
          req.file.path
        );

      res.json({
        message:
          "File uploaded successfully",

        file: {
          filename:
            req.file.filename,

          originalname:
            req.file.originalname,

          path:
            req.file.path,

          content,
        },
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Upload failed",
      });
    }
  };