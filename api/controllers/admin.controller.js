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

export const usersList = async (req, res, next) => {
  try {
    const users = await User.find({ isAdmin: false });

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    //console.log(users);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const addUser = async (req, res, next) => {
  try {
    console.log(req.body);
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 8);

    const newUser = new User({ username, email, password: hashedPassword });
    const saveUser = await newUser.save();
    console.log(saveUser);

    res.status(201).json({ message: "New User created" });
  } catch (error) {
    console.log(error);
    if (error.code === 11000 && error.keyPattern ) {
      // If duplicate key error for the 'email' field, send custom error message
      // res.status(400).json({ success: false, message: "User with this email already exists" });
      return next(errorHandler(401, "User with this email already exists"));

    }
    next(error);
  }
};
