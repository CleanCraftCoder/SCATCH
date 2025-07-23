import mongoose from "mongoose";
import debug from "debug";
import config from "config";

const dbgr = debug("development:mongooseConnection");

mongoose.connect(`${config.get("MONGODB_URI")}/SCATCH`)
.then(() => {
    dbgr("Database connected successfully");
})
.catch((error) => {
    dbgr("Database connection failed");
    dbgr(error);
});

export default mongoose.connection;