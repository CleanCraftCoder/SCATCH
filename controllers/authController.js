import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";

const registerUser = async (req, res) => {
  try {

    // Registration logic here
  const { fullName, email, password} = req.body;

   let user = await userModel.findOne({email: email});
   if(user){
        return res.status(400).send("User already exists");
   }
   
  bcrypt.genSalt(10, (er,salt)=>{
    bcrypt.hash(password,salt,async (err,hash)=>{
      if(err){ return res.send(err.message)
      }
      else{
        const user = await userModel.create({
        fullName,
        email,
        password: hash,
        });
    
       const token = generateToken(user);
       res.cookie("token",token);
       req.flash("success", "User registered successfully");
       res.redirect("/");
    }
  })
  })
  } catch (error) {
    res.send(error.message);
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/");
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        const token = generateToken(user);
        res.cookie("token", token);
        req.flash("success", "Logged in successfully");
        res.redirect("/shop");
      } else {
        req.flash("error", "Invalid credentials");
        res.redirect("/");
      }
    });
    
  } catch (error) {
    res.send(error.message);
  }
};

const logOutUser = (req, res) => {
  res.cookie("token", "");
  req.flash("error", "Logged out successfully");
  res.redirect("/");
};

export { registerUser, loginUser, logOutUser };