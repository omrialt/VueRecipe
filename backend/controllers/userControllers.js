import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { validateUser, validateAuth } from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import dotenv from "dotenv";

dotenv.config();

//action-authenticate user
//method-POST
//route-/api/users/login
//access-any

const authUser = asyncHandler(async (req, res) => {
  const { error } = validateAuth(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
      favorites: user.favorites,
    });
  } else {
    return res.status(401).json({ message: "Invalid email or password" });
  }
});
//action-create new user
//method-POST
//route-/api/users
//access-any
const registerUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "המשתמש כבר קיים במערכת !" });
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    return res.status(400).json({ message: "נתונים לא תקינים" });
  }
});

//action-get user profile
//method-GET
//route-/api/users/profile
//access-protect
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      favorites: user.favorites,
    });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
});

//action-update user profile
//method-PUT
//route-/api/users/profile
//access-protect
const updateUserProfile = asyncHandler(async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
});

//action-get all users profile
//method-GET
//route-/api/users
//access-protect,admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

//action-delete user by id
//method-DELETE
//route-/api/users/:id
//access-protect,admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json({ message: "user removed" });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

//action-get user profile by id
//method-GET
//route-/api/users/:id
//access-protect,admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    return res.status(404).json({ message: "User not found" });
  }
});
//action-update user profile by id
//method-PUT
//route-/api/users/:id
//access-protect,admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.isAdmin = req.body.isAdmin;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
});
export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
