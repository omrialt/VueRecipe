import express from "express";
const recipeRouter = express.Router();
import {
  getRecipes,
  getRecipeById,
  deleteRecipe,
  createRecipe,
  updateRecipe,
  createRecipeReview,
  getRecipesByCategory,
  addRecipeToFavorites,
  getSimilarRecipes,
  removeRecipeFromFavorites,
} from "../controllers/recipeControllers.js";
import { protect } from "../middlewares/authMiddleware.js";

recipeRouter.route("/").get(getRecipes).post(protect, createRecipe);
recipeRouter.route("/:id/reviews").post(protect, createRecipeReview);
recipeRouter.get("/category/:category", getRecipesByCategory);
recipeRouter.get("/similar/:category/:current", getSimilarRecipes);
recipeRouter.put("/favorites/add", protect, addRecipeToFavorites);
recipeRouter.put("/favorites/remove", protect, removeRecipeFromFavorites);

recipeRouter
  .route("/:id")
  .get(getRecipeById)
  .delete(protect, deleteRecipe)
  .put(protect, updateRecipe);

export default recipeRouter;
