import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.json({ message: "Hai SHAHID" });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can update only your account"));
  }

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can delete only your account"));
  }

  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};

export const userData = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    console.log(user);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const adminEditUser = async (req, res, next) => {
  console.log(req.params);
  const user_id = req.params.id;
  let { username, email, password, profilePicture } = req.body;

  try {
    if (password) {
      password = bcryptjs.hashSync(password, 10);
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      {
        $set: {
          username: username,
          email: email,
          password: password,
          profilePicture: profilePicture,
        },
      },
      { new: true }
    );
    console.log(updatedUser);
      res.status(200).json(updatedUser)
  } catch (error) {
    next(error);
  }
};
