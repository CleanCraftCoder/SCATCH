import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
const isLoggedIn = async (req, res, next) => {
if (!req.cookies.token) {
    req.flash("error", "You are not logged in");
    return res.redirect("/login");
  }
  try {
    const decode = jwt.verify(req.cookies.token, process.env.JWT_KEY);
    let user = await userModel.findOne({ email : decode.email  });
    req.user = user;
    next();
  } catch (error) {
    req.flash("error", "Invalid token");
    return res.redirect("/");  
  }
};

export default isLoggedIn;
