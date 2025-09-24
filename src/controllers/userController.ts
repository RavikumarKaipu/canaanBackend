import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// Get all users with profile and pets
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
        pets: true,
      },
    });
    res.json(users);
  } catch (err) {
    console.error("getUsers error:", err); 
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Get single user by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
    if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "Invalid or missing user ID" });
    return;
  }

  
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { profile: true, pets: true },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// Update user info (profile fields)
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { fullName, phone, address } = req.body;

  try {
    const userProfile = await prisma.profile.update({
      where: { userId: Number(id) },
      data: {
        fullName,
        phone,
        address,
      },
    });

    res.json({ message: "User updated", profile: userProfile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Delete user (cascades to profile and pets)
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
