<template>
  <b-container class="my3">
    <the-spinner v-if="loading"></the-spinner>
    <h2 class="category-name">מתכונים ל{{ category }}</h2>
    <div v-if="list">
      <b-row>
        <recipe-item
          v-for="item in list"
          :key="item._id"
          :recipe="item"
        ></recipe-item>
      </b-row>
    </div>
    <div v-else>
      <h2>התרחשה שגיאה..</h2>
    </div>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      recipesList: [],
      loading: true,
    };
  },
  created() {
    this.loadRecipes();
  },
  computed: {
    category() {
      return this.$route.params.category;
    },
    list() {
      return this.$store.getters["recipes/categoryList"];
    },
  },
  methods: {
    async loadRecipes() {
      const recipeCategory = this.$route.params.category;
      await this.$store.dispatch("recipes/loadCategory", recipeCategory);
      this.recipesList = await this.$store.getters["recipes/categoryList"];
      this.loading = false;
    },
  },
};
</script>

<style scoped>
.category-name {
  text-align: center;
}
</style>
