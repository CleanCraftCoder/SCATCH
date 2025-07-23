import express from "express";
const app = express();
import owner from "../models/ownerModel.js";

const router = express.Router();

router.get("/create", async (req, res) => {
  if(process.env.NODE_ENV === "development") {
    let owners = await owner.find();
    if(owners.length > 0) {
      return res.send("multiple owners found");
    } 
    let {name, email,password,gstIn,contact} = req.body;
    let createdOwner = await owner.create({
      name,
      email,
      password,
      gstIn,
      contact
    });
    res.send(createdOwner);
  } else {
    res.status(404).send("Not found");
  }
});

router.get("/", (req, res) => {
  // console.log(process.env.NODE_ENV);
  res.send("Owner Home Page");
});





export default router;