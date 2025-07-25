import express from 'express';
import isLoggedIn from '../middlewares/isLoggedIn.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import productModel from '../models/productModel.js';
import userModel from '../models/userModel.js';
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
    const user = req.user;

    const productIds = user.cart;

    const productsInCart = await productModel.find({ _id: { $in: productIds } });

    // Calculate total amount (₹20 platform fee per product)
    const totalPriceProduct = productsInCart.reduce((sum, item) => sum + item.price, 0);
    const totalWithPlatformFee = totalPriceProduct +20;

    res.render('cart.ejs', {
      products: productsInCart,
      total: totalWithPlatformFee, // ✅ Add this
    });

  } catch (error) {
    console.error("Cart loading error:", error);
    res.status(500).send('Error loading cart');
  }
});



router.get("/addToCart/:productId", isLoggedIn, async (req, res) => {
    try {

        // Check if req.user and req.user.email exist
        if (!req.user || !req.user.email) {
            req.flash("error", "User not logged in or session expired");
            return res.redirect("/shop");
        }

        // Find user from database
        const user = await userModel.findOne({ email: req.user.email });

        // Check if user exists
        if (!user) {
            req.flash("error", "User not found in the database");
            return res.redirect("/shop");
        }

        // Add product to cart
        user.cart.push(req.params.productId);
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