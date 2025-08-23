import mongoose, { model } from "mongoose";

const productSchema = mongoose.Schema({
    productName : String,
    email : String,
    price : Number,
    image : Buffer,
    discount : {
        type : Number,
        default: 0
    },
    bgColor : String,
    panelColor: String,
    textColor : String
});

const Product = mongoose.model("Product",productSchema);
export default Product;
