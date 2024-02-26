import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";


export const adminSignin = async (req, res, next) => {
    const { email, password } = req.body;
  
    try {
      const validAdmin = await User.findOne({ email, isAdmin: true });
      if (!validAdmin) return next(errorHandler(404, "Admin not found"));
  
      const validPassword = bcryptjs.compareSync(password, validAdmin.password);
      if (!validPassword) return next(errorHandler(401, "wrong credentials"));
  
      const token = jwt.sign({ id: validAdmin.id }, process.env.JWT_SECRET);
      const { password: hashedPassword, ...rest } = validAdmin._doc;
  
      const expDate = new Date(Date.now() + 3600000);
  
      res
        .cookie("access_token", token, { httpOnly: true, expires: expDate })
        .status(200)
        .json(rest);
    } catch (error) {
      next(error);
    }
  };

  export const usersList = async(req,res,next)=>{
    try {
        
    } catch (error) {
        next(error)
    }
    const users = await User.find({isAdmin: false})
    console.log(users);
  }