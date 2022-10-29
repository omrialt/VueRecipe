<template>
  <div class="layout">
    <the-header></the-header>
    <div class="main">
      <router-view></router-view>
      <the-footer></the-footer>
    </div>
  </div>
</template>
<script>
import TheHeader from "./TheHeader.vue";
import TheFooter from "./TheFooter.vue";
export default {
  components: { TheHeader, TheFooter },
};
</script>
<style scoped>
.layout {
  overflow-x: hidden !important;
}
.main {
  height: 78vh;
}
the-footer {
  height: 5vh;
}
</style>
