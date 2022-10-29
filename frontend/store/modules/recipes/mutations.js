export default {
  setRecipes(state, payload) {
    state.recipesList = payload;
  },
  setRecipe(state, payload) {
    state.recipe = payload;
  },
  setSimilar(state, payload) {
    state.similarRecipes = payload;
  },
  setCategoryList(state, payload) {
    state.categoryList = payload;
  },
  setFilteredList(state, payload) {
    state.filteredList = payload;
  },
  setNewRecipe(state, payload) {
    state.newRecipe = payload;
  },
  setNewRecipeError(state, payload) {
    state.newRecipeError = payload;
  },
  setNewComment(state, payload) {
    state.newComment = payload;
  },
  setNewCommentError(state, payload) {
    state.newCommentError = payload;
  },
  setRecipeDelete(state, payload) {
    state.recipeDelete = payload;
  },
  setDeleteError(state, payload) {
    state.deleteError = payload;
  },
  setUpdateRecipe(state, payload) {
    state.recipeUpdate = payload;
  },
  setUpdateRecipeError(state, payload) {
    state.recipeUpdateError = payload;
  },
};
