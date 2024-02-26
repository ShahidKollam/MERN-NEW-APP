import express from "express";
import { adminSignin, usersList } from "../controllers/admin.controller.js";

const router = express.Router(); 

router.post("/signin", adminSignin);
router.get('/users', usersList)


export default router;
