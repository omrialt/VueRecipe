import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import users from "./data/users.js";
import recipes from "./data/recipes.js";
import User from "./models/userModel.js";
import Recipe from "./models/recipesModel.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Recipe.deleteMany();
    await User.deleteMany();

    const createdUser = await User.insertMany(users);

    const adminUser = createdUser[0]._id;

    const sampleRecipe = recipes.map((recipe) => {
      return { ...recipe, user: adminUser };
    });

    await Recipe.insertMany(sampleRecipe);

    console.log(`data imported!`.green.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Recipe.deleteMany();
    await User.deleteMany();

    console.log(`data destroyed!`.red.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
