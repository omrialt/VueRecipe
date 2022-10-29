export default {
  setUser(state, payload) {
    state.userLogin = payload;
  },
  setUserError(state, payload) {
    state.userError = payload;
  },
};
