import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    console.log(req.body);
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    const saveUser = await newUser.save();
    console.log(saveUser);

    res.status(201).json({ message: "User created" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "wrong credentials"));

    const token = jwt.sign({ id: validUser.id }, process.env.JWT_SECRET);
    const { password: hashedPassword, ...rest } = validUser._doc;

    const expDate = new Date(Date.now() + 3600000);

    res
      .cookie("access_token", token, { httpOnly: true, expires: expDate })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const { email, photo, name } = req.body;
    console.log(req.body);

    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      const { password: hashedPassword, ...rest } = user._doc;

      const expDate = new Date(Date.now() + 3600000);
      res
        .cookie("access_token", token, { httpOnly: true, expires: expDate })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username:
          name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8),
        email: email,
        password: hashedPassword,
        profilePicture: photo,
      });
      const saveUser = await newUser.save();
      console.log(saveUser);

      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);
      const { password: hashedPassword2, ...rest } = newUser._doc;

      const expDate = new Date(Date.now() + 3600000);

      res
        .cookie("access_token", token, { httpOnly: true, expires: expDate })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
