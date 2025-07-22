import mongoose, { model } from "mongoose";

const productSchema = mongoose.Schema({
    productName : String,
    email : String,
    price : Number,
    image : String,
    discount : {
        type : Number,
        default: 0
    },
    bgcolor : String,
    panelColor: String,
    textColor : String
});

const productModel = mongoose.model("product",productSchema);
export default productModel;
