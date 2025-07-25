import express from "express";
const app = express();
import upload from "../config/multerConfig.js";
import productModel from "../models/productModel.js";

const router = express.Router();

router.post("/create",upload.single("image"),async (req, res) => {

  try {
    const {productName,email,price,discount,bgColor,panelColor,textColor}= req.body;
  const product = await productModel.create({
    productName,
    email,
    price,
    image: req.file.buffer,
    discount,
    bgColor,
    panelColor,
    textColor
  });
  req.flash("success", "Product created successfully");
  res.redirect("/owner/admin");
} catch (error) {
  // console.error("Error creating product:", error);
  req.flash("error", "Failed to create product");
  res.redirect("/owner/admin");
}

});

export default router;