import fs from "fs";
import path from "path";

import * as pdfParse from "pdf-parse";
import mammoth from "mammoth";

const readFileContent =
  async (filePath) => {

    const ext =
      path.extname(
        filePath
      ).toLowerCase();

    // CODE / TEXT FILES
    if (
      [
        ".txt",
        ".js",
        ".jsx",
        ".ts",
        ".tsx",
        ".py",
        ".json",
        ".md",
        ".html",
        ".css",
      ].includes(ext)
    ) {

      return fs.readFileSync(
        filePath,
        "utf8"
      );
    }

    // PDF
    if (ext === ".pdf") {

      const dataBuffer =
        fs.readFileSync(
          filePath
        );

      const data =
        await pdfParse.default(
          dataBuffer
        );

      return data.text;
    }

    // DOCX
    if (ext === ".docx") {

      const result =
        await mammoth.extractRawText({
          path: filePath,
        });

      return result.value;
    }

    return "Unsupported file type.";
  };

export default readFileContent;