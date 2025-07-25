import express from "express";
const app = express();
import owner from "../models/ownerModel.js";

const router = express.Router();

router.post("/create", async (req, res) => {
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

router.get("/admin", (req, res) => {
  const success = req.flash("success");
  const error = req.flash("error");
  res.render("createproducts.ejs",{success, error});
});





export default router;