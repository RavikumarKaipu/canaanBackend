import express from 'express';
import multer from 'multer';
import path from 'path';
import { getProfileById, saveProfile, updateProfileSection } from '../controllers/profileController.js';
const router = express.Router();
// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // make sure folder exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });
// Routes
router.post('/profile/save', upload.single('photo'), saveProfile);
router.put('/profile/update', updateProfileSection);
router.get('/profile/save/:id', getProfileById);
export default router;
//# sourceMappingURL=profileRoutes.js.map