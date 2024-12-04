import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.join(__dirname, "../uploads/songs");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/songs");
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    cb(null, `--${file.originalname}`);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowTypes = ["audio/mpeg", "audio/wav", "audio/mp3"];
  if (allowTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type: Only audio files are allowed"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});
