import mongoose, { model } from "mongoose";

const userSchema = mongoose.Schema({
    fullName : String,
    email : String,
    password : String,
    cart : {
        type : Array,
        default : []
    },
    isAdmin : Boolean,
    orders : {
        type : Array,
        default : []
    },
    contact : Number,
    picture : String
});

const userModel = mongoose.model("user",userSchema);
export default userModel;

