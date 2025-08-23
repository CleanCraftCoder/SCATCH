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
import appRouter from "./routes/app.js";
import flash from "connect-flash";
import expressSession from "express-session";

const PORT = process.env.PORT || 3000
const app = express();


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use(expressSession({
    resave : false,
    saveUninitialized : false,
    secret : process.env.EXPRESS_SESSION_SECRET,
}));
app.use(flash());


app.use("/", appRouter); //start with appRouter
app.use("/owner",ownerRouter)
app.use("/users",userRouter);
app.use("/product",productRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

