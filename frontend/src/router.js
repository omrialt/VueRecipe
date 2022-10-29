import { createRouter, createWebHistory } from "vue-router";
import RecipesList from "./pages/RecipesList.vue";
import RecipePage from "./pages/RecipePage.vue";
import CategoriesPage from "./pages/CategoriesPage.vue";
import NewRecipe from "./pages/NewRecipe.vue";
import LoginPage from "./pages/LoginPage.vue";
import FavoritePage from "./pages/FavoritesPage.vue";
import UpdateRecipe from "./pages/UpdateRecipe.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: RecipesList },
    { path: "/recipes/:id", component: RecipePage },
    { path: "/recipes/category/:category", component: CategoriesPage },
    { path: "/recipes/new", component: NewRecipe },
    { path: "/login", component: LoginPage },
    { path: "/favorites", component: FavoritePage },
    { path: "/recipes/update/:id", component: UpdateRecipe },
  ],
});
export default router;
