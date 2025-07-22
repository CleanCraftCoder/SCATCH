import mongoose from "mongoose"
mongoose.connect("mongodb://127.0.0.1:27017/scatch")
.then(() => {
    console.log("Database connected successfully");
})
.catch((error) => {
    console.log("Database connection failed");
    console.error(error);
});

export default mongoose.connection;