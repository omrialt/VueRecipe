import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

export default {
  namespaced: true,
  state() {
    return {
      recipesList: [],
      recipe: {},
      filteredList: null,
      newRecipeError: null,
    };
  },
  mutations,
  actions,
  getters,
};
