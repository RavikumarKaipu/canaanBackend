import express from "express";
import { authenticate, requireAdmin } from "../middlewares/auth.js";
import { getUsers, updateUserRole, deleteUser } from "../controllers/adminController.js";

const router = express.Router();

// All routes require admin
router.use(authenticate, requireAdmin);

router.get("/users", getUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

export default router;
