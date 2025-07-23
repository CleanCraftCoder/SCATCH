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
      //  res.send("User registered successfully"); //just for checking
    }
  })
  })
  } catch (error) {
    res.send(error.message);
  }
}

export { registerUser };