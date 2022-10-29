import mongoose from "mongoose";
import Joi from "joi";

const reviewsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
      minLength: 3,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
  },
  { timestamps: true }
);

const recipeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: Array,
      required: true,
    },
    description: {
      type: String,
      required: true,
      minLength: 3,
    },
    ingredients: {
      type: Array,
      required: true,
    },
    mealFor: {
      type: Number,
      required: true,
      default: 2,
    },
    steps: {
      type: Array,
      required: true,
      minLength: 20,
    },
    reviews: [reviewsSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    inFavorites: {
      type: Number,
      required: true,
      default: 0,
    },
    author: {
      type: String,
      required: true,
      default: "מנהל",
    },
    user: {
      type: String,
    },
  },

  { timestamps: true }
);

export function validateRecipe(recipe) {
  const schema = Joi.object({
    _id: Joi.string(),
    name: Joi.string().min(3).required(),
    image: Joi.string().required(),
    category: Joi.array().required(),
    steps: Joi.array().required(),
    ingredients: Joi.array().required(),
    description: Joi.string().required(),
    inFavorites: Joi.number().default(0),
    author: Joi.string(),
    user: Joi.any(),
    mealFor: Joi.number().required().default(2),
  });
  return schema.validate(recipe);
}
export function validateReview(review) {
  const schema = Joi.object({
    name: Joi.string().required(),
    comment: Joi.string().min(3).required(),
  });
  return schema.validate(review);
}

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;
