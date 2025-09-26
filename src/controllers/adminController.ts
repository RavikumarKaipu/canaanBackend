import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// List all users
export const getUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    include: { profile: true, pets: true },
  });
  res.json(users);
};

// Update user role
export const updateUserRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["USER", "ADMIN", "STAFF"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: { role },
  });

  res.json({ message: "Role updated", user });
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id: Number(id) } });
  res.json({ message: "User deleted" });
};
