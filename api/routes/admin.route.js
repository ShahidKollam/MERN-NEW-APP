import express from "express";
import {
  adminSignin,
  usersList,
  addUser,
  adminDeleteUser,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/signin", adminSignin);
router.get("/users", usersList);
router.post("/addUser", addUser);
router.delete("/delete/:id", adminDeleteUser)
export default router;
