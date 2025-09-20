import express from 'express';
import { sendOtp, updatePassword, verifyEmail, verifyOtp } from '../controllers/otpController.js';



const router=express.Router();

router.post('/verify-email',verifyEmail);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/update-password", updatePassword);

export default router;
