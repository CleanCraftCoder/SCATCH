import express from "express";
import { registerUser } from "../controllers/authController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("user Home Page");
});

router.post("/register", registerUser);

export default router;