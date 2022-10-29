import Recipe from "../models/recipesModel.js";
import User from "../models/userModel.js";
import { validateRecipe, validateReview } from "../models/recipesModel.js";
import asyncHandler from "express-async-handler";

//action-get all recipes by page
//method-GET
//route-/api/recipes
//access-any
const getRecipes = asyncHandler(async (req, res) => {
  const recipes = await Recipe.find();
  res.json(recipes);
});

//action-get recipe by id
//method-GET
//route-/api/recipes/:id
//access-any
const getRecipeById = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (recipe) {
    res.json(recipe);
  }
  if (!recipe) {
    return res.status(404).json({ message: "לא ניתן לטעון את המתכון המבוקש" });
  }
});

//action-delete recipe by id
//method-DELETE
//route-/api/recipes/:id
//access-protect
const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (recipe) {
    await recipe.remove();
    const newList = await Recipe.find();
    res.json({ recipe, newList });
  }
  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }
});
//action-create new recipe
//method-POST
//route-/api/recipes
//access-protect
const createRecipe = asyncHandler(async (req, res) => {
  const recipe = new Recipe(req.body);

  const createdRecipe = await recipe.save();
  res.status(201).json(createdRecipe);
});

//action-update recipe by id
//method-PUT
//route-/api/recipes/:id
//access-protect
const updateRecipe = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { error } = validateRecipe(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const {
    name,
    description,
    category,
    ingredients,
    mealFor,
    steps,
    user,
    image,
  } = req.body;
  const recipe = await Recipe.findById(req.params.id);
  console.log(recipe);
  if (recipe) {
    recipe.name = name;
    recipe.description = description;
    recipe.category = category;
    recipe.ingredients = ingredients;
    recipe.mealFor = mealFor;
    recipe.steps = steps;
    recipe.user = user;
    recipe.image = image;
    const updatedRecipe = await recipe.save();
    res.status(201).json(updatedRecipe);
  } else {
    return res.status(404).json({ message: "Recipe not found" });
  }
});
//action-add new review
//method-POST
//route-/api/recipe/:id/reviews
//access-protect
const createRecipeReview = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { error } = validateReview({
    name: req.user.name,
    comment: req.body.comment,
  });
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const { comment, name } = req.body;
  const recipe = await Recipe.findById(req.params.id);
  if (recipe) {
    const alreadyReview = recipe.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReview) {
      return res.status(400).json({ message: "Review already submitted" });
    }
    const review = {
      name,
      comment,
      user: req.user._id,
    };
    recipe.reviews.push(review);
    recipe.numReviews = recipe.reviews.length;
    await recipe.save();
    res.status(201).json({ recipe, review });
  } else {
    return res.status(400).json({ message: "Recipe not found" });
  }
});
//action-get similar recipes
//method-GET
//route-/api/recipes/category/:category
//access-any
const getRecipesByCategory = asyncHandler(async (req, res) => {
  const category = req.params.category;

  const recipeList = await Recipe.find({ category: category });

  if (!recipeList) {
    return res.json({ message: "לא נמצאו מתכונים דומים.." });
  }
  return res.json(recipeList);
});

//action-get similar recipes
//method-GET
//route-/api/recipes/similar/:category/:current
//access-any
const getSimilarRecipes = asyncHandler(async (req, res) => {
  const categoryArray = await req.params.category.split(",");
  const currentRecipe = await Recipe.findById(req.params.current);
  let similarRecipes = [];
  for (let i = 0; i < categoryArray.length; i++) {
    const recipeSimilarList = await Recipe.find({
      category: categoryArray[i],
      _id: { $nin: currentRecipe._id },
    });
    similarRecipes = similarRecipes.concat(recipeSimilarList);
  }

  if (!categoryArray || !similarRecipes.length) {
    return res.json({ message: "לא נמצאו מתכונים.." });
  } else {
    return await res.json(similarRecipes);
  }
});

//action-add favorite recipes
//method-PUT
//route-/api/recipes/favorites/add
//access-protect

const addRecipeToFavorites = asyncHandler(async (req, res) => {
  const { user, recipe, token } = req.body;
  console.log(user);
  const userLogin = await User.findById(user);
  const recipeId = await recipe._id;
  const recipeAlreadyInFavorites = await userLogin.favorites.find(
    (rec) => rec._id === recipeId
  );

  if (recipeAlreadyInFavorites) {
    return res.status(401).json({ message: "המתכון כבר נוסף למועדפים !" });
  }

  userLogin.favorites.push(recipe);
  await userLogin.save();

  const userToJson = await {
    _id: userLogin._id,
    name: userLogin.name,
    email: userLogin.email,
    isAdmin: userLogin.isAdmin,
    favorites: userLogin.favorites,
    token,
  };

  const recipeToUpdate = await Recipe.findById(recipeId);
  recipeToUpdate.inFavorites += 1;
  await recipeToUpdate.save();

  return await res.status(201).json(userToJson);
});
//action-remove favorite recipes
//method-PUT
//route-/api/recipes/favorites/remove
//access-protect

const removeRecipeFromFavorites = asyncHandler(async (req, res) => {
  const { user, recipe, token } = req.body;
  const userLogin = await User.findById(user);
  const recipeId = await recipe._id.toString();

  const recipeIndex = await userLogin.favorites.findIndex(
    (rec) => rec._id === recipeId
  );

  await userLogin.favorites.splice(recipeIndex, 1);

  await userLogin.save();

  const userToJson = await {
    _id: userLogin._id,
    name: userLogin.name,
    email: userLogin.email,
    isAdmin: userLogin.isAdmin,
    favorites: userLogin.favorites,
    token,
  };

  const recipeToUpdate = await Recipe.findById(recipeId);
  recipeToUpdate.inFavorites -= 1;
  await recipeToUpdate.save();

  return await res.status(201).json(userToJson);
});

export {
  getRecipes,
  getRecipeById,
  deleteRecipe,
  createRecipe,
  updateRecipe,
  createRecipeReview,
  getSimilarRecipes,
  getRecipesByCategory,
  addRecipeToFavorites,
  removeRecipeFromFavorites,
};
