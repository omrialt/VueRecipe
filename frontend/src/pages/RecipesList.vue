<template>
  <b-container class="my-3">
    <the-spinner v-if="loading"></the-spinner>
    <div v-else-if="list.length && !loading">
      <b-row>
        <recipe-item
          v-for="item in list"
          :key="item._id"
          :recipe="item"
        ></recipe-item>
      </b-row>
    </div>
    <div v-else-if="!list.length && !loading">
      <h2>לא נמצאו מתכונים..</h2>
    </div>
  </b-container>
</template>
<script>
export default {
  data() {
    return {
      loading: true,
    };
  },
  created() {
    this.loadRecipes();
  },
  mounted() {
    if (this.$store.getters["recipes/recipesDelete"]) {
      this.loadRecipes();
    }
  },
  computed: {
    list() {
      if (this.$store.getters["recipes/filteredList"] === null) {
        return this.$store.getters["recipes/recipesList"]
          ? this.$store.getters["recipes/recipesList"]
          : this.$store.getters["recipes/recipesList"];
      }
      return this.$store.getters["recipes/filteredList"];
    },
  },
  methods: {
    async loadRecipes() {
      this.loading = false;
      try {
        await this.$store.dispatch("recipes/loadRecipes");
      } catch (err) {
        this.err = err.message;
      }
    },
  },
};
</script>
