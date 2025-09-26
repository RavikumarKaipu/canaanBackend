import { Request,Response } from "express"
import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';
dotenv.config();
const prisma = new PrismaClient();
import { transporter } from "../config/mailer.js";
import otpStore from "../utils/otpStore.js";
import bcrypt from 'bcryptjs';

//verify EMail
export const verifyEmail=async (req:Request,res:Response)=>{
    const {email}=req.body;
    if(!email) return res.status(400).json({error:'Email required'})

    try{
        const user=await prisma.user.findUnique({where:{email}});
        if(!user) return res.status(404).json({error:'Email Not Found'});

        res.json({message:'Email exists, You may request otp.'})
    }catch(err){
        res.status(500).json({error:'Error in verify email'})
    }

}

//Send OTP
export const sendOtp=async (req:Request,res:Response)=>{
    const {email}=req.body;
    if(!email) return res.status(400).json({error:'Email required'});
    const otp=Math.floor(100000+Math.random()*900000);
    const timestamp=Date.now();
    try{
         await transporter.sendMail({
        from: `"Canaan Pet Care" <${process.env.EMAIL}>`,
        to: email,
        subject: "Your Canaan Pet Care OTP Code",
        html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                  <div style="background-color: #114276ff; padding: 20px; text-align: center; color: #fff;">
                    <h1 style="margin: 0; font-size: 24px;">🐾 Canaan Pet Care</h1>
                    <p style="margin: 0; font-size: 14px;">Secure One-Time Password</p>
                  </div>
                  <div style="padding: 20px; color: #333;">
                    <p>Hello,</p>
                    <p>We received a request to reset your password at <strong>Canaan Pet Care</strong>.</p>
                    <p style="font-size: 16px;">Use the following OTP to complete your password reset:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                      <span style="display: inline-block; background: #114276ff; color: #fff; font-size: 24px; letter-spacing: 4px; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
                        ${otp}
                      </span>
                    </div>
                    
                    <p>This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
                    <p>If you didn’t request this, you can safely ignore this email.</p>
                  </div>
                  <div style="background-color: #f8f9fa; text-align: center; padding: 15px; font-size: 12px; color: #777;">
                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} Canaan Pet Care. All rights reserved.</p>
                  </div>
                </div>
              `,
        });

        otpStore.set(email,{otp,timestamp});
        res.json({message:'OTP sent successfully'});    

    }catch(err){
        res.status(500).json({ error: "Failed to send OTP",err });

    }

}



//verify-otp
export const verifyOtp=async (req:Request,res:Response)=>{
    const {email,otp:userOtp}=req.body;
    const stored=otpStore.get(email);

    if(!stored) return res.status(401).json({error:'No otp Requested'});

    const ageMins=(Date.now()-stored.timestamp)/60000;
    if(ageMins > 10){
        otpStore.delete(email);
        return res.status(400).json({error:'OTP expired'});

    }
    if(Number(userOtp)!==stored.otp){
        return res.status(400).json({error:'Invalid OTP '})
    }

    otpStore.delete(email);
    res.json({message:'OTP verified'});
}


// Step 4: Update Password
export const updatePassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword)
    return res.status(400).json({ error: "Missing email or password" });

  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    const user = await prisma.user.update({
      where: { email }, 
      data: { password: hashed },
    });

    if (!user) return res.status(404).json({ error: "Email not found" });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ error: "Password reset failed" });
  }
};
