import dotenv from "dotenv";
dotenv.config();
import express from "express";
import db from "./config/mongooseConnection.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";    
import ownerRouter from "./routes/ownerRouter.js";
import userRouter from "./routes/userRouter.js";    
import productRouter from "./routes/productRouter.js";


const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use("/owner",ownerRouter)
app.use("/user",userRouter);
app.use("/product",productRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

