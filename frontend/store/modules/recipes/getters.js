export default {
  recipesList(state) {
    return state.recipesList;
  },
  recipe(state) {
    return state.recipe;
  },
  similarList(state) {
    return state.similarRecipes;
  },
  categoryList(state) {
    return state.categoryList;
  },
  filteredList(state) {
    return state.filteredList;
  },
  user(state, getters, rootState, rootGetters) {
    return rootGetters["users/userLogin"];
  },
  newRecipeError(state) {
    return state.newRecipeError;
  },
  recipeDelete(state) {
    return state.recipeDelete;
  },
};
