import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
} from "../controllers/userController.js";
import { authenticate } from "../middlewares/auth.js";


const router = express.Router();
  
router.get("", getUsers);          // GET /api/users
router.get("/:id", getUserById);    // GET /api/users/:id
router.put("/:id", updateUser);     // PUT /api/users/:id
router.delete("/:id", deleteUser);  // DELETE /api/users/:id
router.put("/:id/role",authenticate,updateUserRole);// PUT /api/users/:id/role

export default router
