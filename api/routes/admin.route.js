import express from "express";
import {
  adminSignin,
  usersList,
  addUser,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/signin", adminSignin);
router.get("/users", usersList);
router.post("/addUser", addUser);

export default router;
