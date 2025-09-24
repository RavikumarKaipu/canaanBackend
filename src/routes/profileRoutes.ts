import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { getProfileById, saveProfile, updateProfileSection } from "../controllers/profileController.js";

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Upload endpoint
router.post("/upload", upload.single("photo"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`, // URL to access the file
  });
});

// Profile routes
router.post("/profile/save", upload.single("photo"), saveProfile);
router.put("/profile/update", updateProfileSection);
router.get("/profile/save/:id", getProfileById);

export default router;
