import mongoose, { model } from "mongoose";
import { type } from "os";

const userSchema = mongoose.Schema({
    fullName : String,
    email : String,
    password : String,
    cart : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        ],
    orders : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Order"
    }],
    contact : Number,
    picture : String
});

const User = mongoose.model("User",userSchema);
export default User;

