import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface JwtPayload {
  id: number;
  email: string;
  username:string
}

export const generateToken = (user: JwtPayload): string => {
  return jwt.sign(user, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
};
