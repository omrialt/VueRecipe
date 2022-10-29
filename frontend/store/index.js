import { createStore } from "vuex";
import recipesModule from "./modules/recipes/index";
import usersModel from "./modules/users/index";
const store = createStore({
  modules: {
    recipes: recipesModule,
    users: usersModel,
  },
});
export default store;
