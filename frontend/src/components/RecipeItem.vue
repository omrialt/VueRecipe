<template>
  <b-col md="3" sm="12">
    <b-card
      :title="recipe.name"
      :img-src="recipe.image"
      :img-alt="recipe.name"
      img-top
      tag="article"
      style="max-width: 20rem"
      class="mb-2"
    >
      <b-card-text>
        {{ recipe.description }}
        <p>תגיות: {{ tags }}</p>
        <p>עודכן: {{ lastUpdate }}</p>
      </b-card-text>

      <a :href="recipePageLink" variant="secondary">למתכון המלא</a>
    </b-card>
  </b-col>
</template>
<script>
export default {
  props: ["recipe"],
  computed: {
    lastUpdate() {
      return new Date(this.recipe.updatedAt).toLocaleDateString();
    },
    tags() {
      return this.recipe.category.join(",");
    },
    recipePageLink() {
      return "/recipes/" + this.recipe._id;
    },
  },
};
</script>
<style scoped>
.card {
  border: 1px solid black;
  height: 35rem;
}
</style>
