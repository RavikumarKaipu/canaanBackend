import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { updateUserRole } from "../controllers/adminController.js";

const router = express.Router();
  
router.get("", getUsers);          // GET /api/users
router.get("/:id", getUserById);    // GET /api/users/:id
router.put("/:id", updateUser);     // PUT /api/users/:id
router.delete("/:id", deleteUser);  // DELETE /api/users/:id
router.put("/:id/role", updateUserRole);

export default router
