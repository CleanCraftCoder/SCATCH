import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";


mongoose.connect(`${process.env.MONGO_URI}SCATCH`)
.then(() => {
    console.log("Database connected successfully");
})
.catch((error) => {
    console.error("Database connection failed");
    console.error(error);
});

export default mongoose.connection;