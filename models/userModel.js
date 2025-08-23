import mongoose, { model } from "mongoose";
import { type } from "os";

const userSchema = mongoose.Schema({
    fullName : String,
    email : String,
    password : String,
    cart : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product"
            }
        ],
    orders : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "order"
    }],
    contact : Number,
    picture : String
});

const userModel = mongoose.model("user",userSchema);
export default userModel;

