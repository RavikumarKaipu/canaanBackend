import nodemailer from "nodemailer";
import dotenv from 'dotenv';

export const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASS
    }
})