import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { transporter } from "../config/mailer.js";
import otpStore from "../utils/otpStore.js";
import bcrypt from 'bcryptjs';
//verify EMail
export const verifyEmail = async (req, res) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ error: 'Email required' });
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(404).json({ error: 'Email Not Found' });
        res.json({ message: 'Email exists, You may request otp.' });
    }
    catch (err) {
        res.status(500).json({ error: 'Error in verify email' });
    }
};
//Send OTP
export const sendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ error: 'Email required' });
    const otp = Math.floor(100000 + Math.random() * 900000);
    const timestamp = Date.now();
    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Password reset OTP",
            text: `your OTP is: ${otp}. It is valid for 10 minutes.`
        });
        otpStore.set(email, { otp, timestamp });
        res.json({ message: 'OTP sent successfully' });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to send OTP" });
    }
};
//verify-otp
export const verifyOtp = async (req, res) => {
    const { email, otp: userOtp } = req.body;
    const stored = otpStore.get(email);
    if (!stored)
        return res.status(401).json({ error: 'No otp Requested' });
    const ageMins = (Date.now() - stored.timestamp) / 60000;
    if (ageMins > 10) {
        otpStore.delete(email);
        return res.status(400).json({ error: 'OTP expired' });
    }
    if (Number(userOtp) !== stored.otp) {
        return res.status(400).json({ error: 'Invalid OTP ' });
    }
    otpStore.delete(email);
    res.json({ message: 'OTP verified' });
};
// Step 4: Update Password
export const updatePassword = async (req, res) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword)
        return res.status(400).json({ error: "Missing email or password" });
    try {
        const hashed = await bcrypt.hash(newPassword, 10);
        const user = await prisma.user.update({
            where: { email },
            data: { password: hashed },
        });
        if (!user)
            return res.status(404).json({ error: "Email not found" });
        res.json({ message: "Password updated successfully" });
    }
    catch (err) {
        res.status(400).json({ error: "Password reset failed" });
    }
};
//# sourceMappingURL=otpController.js.map