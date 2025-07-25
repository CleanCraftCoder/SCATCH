import express from "express";
import { registerUser, loginUser, logOutUser} from "../controllers/authController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("user Home Page");
});

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/logout", logOutUser);

export default router;