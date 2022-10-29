<template>
  <b-container class="my-3">
    <h2 class="head">המועדפים שלי</h2>
    <b-row v-if="favoritesList.length">
      <recipe-item
        v-for="item in favoritesList"
        :key="item._id"
        :recipe="item"
      ></recipe-item>
    </b-row>
    <b-row v-else-if="favoritesList === undefined || !favoritesList.length">
      <h4>
        לא נמצאו מועדפים..<router-link to="/">חזרה לעמוד הראשי</router-link>
      </h4>
    </b-row>
  </b-container>
</template>

<script>
export default {
  created() {
    this.$store.getters["users/userLogin"];
  },
  computed: {
    favoritesList() {
      return this.$store.getters["users/userLogin"].favorites;
    },
    userLogin() {
      return this.$store.getters["users/userLogin"];
    },
  },
};
</script>

<style>
.head {
  text-align: center;
}
</style>
