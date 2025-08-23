import mongoose, { model } from "mongoose";

const ownerSchema = mongoose.Schema({
    fullName : {
        type: String,
        required: true,
        trim : true,
        minLength : 3
    },
    email : String,
    password : String,
    products : {
        type : Array,
        default : []
    },
    contact : Number,
    picture : String,
    gstIn : String
});

const Owner = mongoose.model("Owner",ownerSchema);
export default Owner;
