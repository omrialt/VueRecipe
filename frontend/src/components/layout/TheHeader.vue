<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="primary">
      <b-navbar-brand href="/">המתכונים שלי</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item v-if="!userLogin" href="/login">התחברות/הרשמה</b-nav-item>
          <b-nav-item @click="logout" v-if="userLogin">התנתק</b-nav-item>
          <b-nav-item :href="favoritesPath">מועדפים</b-nav-item>
          <b-nav-item :href="newRecipePath">מתכון חדש</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-5">
          <b-nav-form>
            <b-form-input
              v-model="searchInp"
              size="sm"
              class="mr-sm-2"
              placeholder="חיפוש"
            ></b-form-input>
            <b-button
              @click="search"
              size="sm"
              class="my-2 my-sm-0"
              type="submit"
              >חיפוש</b-button
            >
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>
<script>
export default {
  created() {
    this.loadRecipes();
  },
  computed: {
    list() {
      return this.$store.getters["recipes/recipesList"]
        ? this.$store.getters["recipes/recipesList"]
        : this.$store.getters["recipes/recipesList"];
    },
    userLogin() {
      return this.$store.getters["users/userLogin"] ? true : false;
    },
    favoritesPath() {
      return this.$store.getters["users/userLogin"] ? "/favorites" : "/login";
    },
    newRecipePath() {
      return this.$store.getters["users/userLogin"] ? "/recipes/new" : "/login";
    },
  },
  methods: {
    search() {
      const listArr = this.list.filter((recipe) =>
        recipe.name.includes(this.searchInp)
      );
      this.$store.dispatch("recipes/filteredRecipes", listArr);
      this.$router.replace("/");
    },
    async loadRecipes() {
      try {
        await this.$store.dispatch("recipes/loadRecipes");
      } catch (err) {
        this.err = err.message;
      }
    },
    logout() {
      this.$store.dispatch("users/logoutUser");
      this.$router.replace("/login");
    },
  },
};
</script>
