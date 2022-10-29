import axios from "axios";
export default {
  async registerUser(context, payload) {
    const { name, password, email } = payload;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const { data } = await axios.post(
        "/api/users",
        { name, email, password },
        config
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      context.commit("setUser", data);
    } catch (err) {
      context.commit("setUserError", err.response.data.message);
    }
  },
  async loginUser(context, payload) {
    const { password, email } = payload;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const { data } = await axios.post(
        "/api/users/login",
        { email, password },
        config
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      context.commit("setUser", data);
    } catch (err) {
      console.log(err);
      context.commit("setUserError", err.response.data.message);
    }
  },
  logoutUser(context) {
    localStorage.removeItem("userInfo");
    context.commit("setUser", null);
  },
  async addRecipeToFavorites(context, payload) {
    const userInfo = context.state.userLogin;
    const payloadData = {
      recipe: payload,
      user: userInfo._id,
      token: userInfo.token,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
        x_auth_token: userInfo.token,
      },
    };
    try {
      const { data } = await axios.put(
        "/api/recipes/favorites/add",
        payloadData,
        config
      );
      console.log(data);
      context.commit("setUser", data);
      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (err) {
      console.log(err);
    }
  },
  async removeRecipeFromFavorites(context, payload) {
    const userInfo = context.state.userLogin;
    const payloadData = {
      recipe: payload,
      user: userInfo._id,
      token: userInfo.token,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
        x_auth_token: userInfo.token,
      },
    };
    try {
      const { data } = await axios.put(
        "/api/recipes/favorites/remove",
        payloadData,
        config
      );
      context.commit("setUser", data);
      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (err) {
      console.log(err);
    }
  },
};
