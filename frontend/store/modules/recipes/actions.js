import axios from "axios";
export default {
  async loadRecipes(context) {
    try {
      const { data } = await axios.get("/api/recipes");
      console.log(data);
      context.commit("setRecipes", data);
    } catch (err) {
      context.commit("setRecipes", err.response.data.message);
    }
  },
  async loadRecipe(context, payload) {
    console.log(context);
    try {
      const { data } = await axios.get(`/api/recipes/${payload}`);
      context.commit("setRecipe", data);
    } catch (err) {
      context.commit("setRecipe", err.response.data.message);
    }
  },
  async loadSimilar(context, payload) {
    const { categories, current } = payload;
    try {
      const { data } = await axios.get(
        `/api/recipes/similar/${categories}/${current}`
      );
      context.commit("setSimilar", data);
    } catch (err) {
      context.commit("setSimilar", err.response.data.message);
    }
  },
  async loadCategory(context, payload) {
    try {
      const { data } = await axios.get(`/api/recipes/category/${payload}`);
      console.log(data);
      context.commit("setCategoryList", data);
    } catch (err) {
      context.commit("setCategoryList", err.response.data.message);
    }
  },
  filteredRecipes(context, payload) {
    context.commit("setFilteredList", payload);
  },
  async uploadRecipe(context, payload) {
    const userInfo = context.getters.user;
    const payloadData = { ...payload, user: userInfo };
    const config = {
      headers: {
        "Content-Type": "application/json",
        x_auth_token: userInfo.token,
      },
    };
    try {
      const { data } = await axios.post(`/api/recipes/`, payloadData, config);
      console.log(data);
      context.commit("setNewRecipe", data);
    } catch (err) {
      context.commit("setNewRecipeError", err.response.data.message);
    }
  },
  async addReview(context, payload) {
    const userInfo = context.getters.user;
    const currentRecipe = context.getters.recipe;
    const payloadData = { ...payload, user: userInfo };
    const config = {
      headers: {
        "Content-Type": "application/json",
        x_auth_token: userInfo.token,
      },
    };
    try {
      const { data } = await axios.post(
        `/api/recipes/${currentRecipe._id}/reviews`,
        payloadData,
        config
      );
      context.commit("setRecipe", data.recipe);
    } catch (err) {
      context.commit("setNewCommentError", err.response.data.message);
    }
  },
  async deleteRecipe(context, payload) {
    const userInfo = context.getters.user;
    const config = {
      headers: {
        x_auth_token: userInfo.token,
      },
    };
    try {
      const { data } = await axios.delete(`/api/recipes/${payload}`, config);
      context.commit("setRecipeDelete", data.recipe);
      context.commit("setRecipes", data.newList);
    } catch (err) {
      context.commit("setDeleteError", err.response.data.message);
    }
  },
  async updateRecipe(context, payload) {
    const userInfo = context.getters.user;
    const payloadData = { ...payload, user: userInfo };
    const config = {
      headers: {
        "Content-Type": "application/json",
        x_auth_token: userInfo.token,
      },
    };
    try {
      const { data } = await axios.put(
        `/api/recipes/${payload._id}`,
        payloadData,
        config
      );
      console.log(data);
      context.commit("setUpdateRecipe", data);
    } catch (err) {
      console.log(err);
      context.commit("setUpdateRecipeError", err.response.data.message);
    }
  },
};
