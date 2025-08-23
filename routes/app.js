import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import isLoggedIn from '../middlewares/isLoggedIn.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import productModel from '../models/productModel.js';
import userModel from '../models/userModel.js';
import mongoose from 'mongoose';
import Razorpay from "razorpay";

const app = express();
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/",(req,res)=>{
    let error = req.flash("error");
    let success = req.flash("success");
    res.render("index.ejs",{error, success,loggedIn: false});
});


router.get("/shop",isLoggedIn,async (req,res)=>{
    const products = await productModel.find();
    let success = req.flash("success");
    let error = req.flash("error");
    res.render("shop.ejs",{products, success, error});
});


router.get('/cart', isLoggedIn, async (req, res) => {
  try {
    // Always fetch fresh user from DB and populate cart
    const user = await userModel.findById(req.user._id).populate("cart");

    const totalPriceProduct = user.cart.reduce((sum, item) => sum + item.price, 0);
    const totalWithPlatformFee = totalPriceProduct + 20;

    res.render('cart.ejs', {
      products: user.cart,   // populated product docs
      total: totalWithPlatformFee,
      RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error("Cart loading error:", error);
    res.status(500).send('Error loading cart');
  }
});


//checkout
router.post("/checkout", isLoggedIn, async (req, res) => {
  try {
    // Get fresh user and calculate total
    const user = await userModel.findById(req.user._id).populate("cart");
    const totalPriceProduct = user.cart.reduce((sum, item) => sum + item.price, 0);
    const totalWithPlatformFee = (totalPriceProduct + 20) * 100; // Razorpay expects paise

    // Create Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const options = {
      amount: totalWithPlatformFee,
      currency: "INR",
      receipt: "receipt_" + Date.now()
    };

    const order = await razorpay.orders.create(options);

    res.json(order); // frontend will use this order
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).send("Checkout error");
  }
});



//verify-payment
import crypto from "crypto";

router.post("/verify-payment", isLoggedIn, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
      // ✅ Success: Clear cart after payment
      await userModel.findByIdAndUpdate(req.user._id, { $set: { cart: [] } });

      return res.json({ status: "success" });
    } else {
      return res.status(400).json({ status: "failed", message: "Signature mismatch" });
    }
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});






router.get("/addToCart/:productId", isLoggedIn, async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      req.flash("error", "User not logged in or session expired");
      return res.redirect("/shop");
    }

    const user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      req.flash("error", "User not found in the database");
      return res.redirect("/shop");
    }

    // ✅ push product ObjectId
    user.cart.push(new mongoose.Types.ObjectId(req.params.productId));
    await user.save();

    req.flash("success", "Product added to cart successfully");
    res.redirect("/shop");
  } catch (err) {
    console.error("Error adding to cart:", err);
    req.flash("error", "Something went wrong while adding to cart");
    res.redirect("/shop");
  }
});






export default router;