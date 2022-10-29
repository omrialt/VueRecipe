<template>
  <li>
    <div class="step-number">
      {{ idx + 1 }}
    </div>
    <div class="step-desc">
      <p>{{ step }}</p>
    </div>
  </li>
</template>
<script>
export default {
  props: ["idx", "step"],
};
</script>
<style scoped>
li {
  list-style-type: none;
}
.step-number {
  border-radius: 50%;
  width: 36px;
  height: 36px;
  padding: 8px;
  background: rgb(231, 73, 152);
  border: 2px solid #666;
  color: rgb(18, 12, 12);
  text-align: center;
}
.step-desc {
  font-weight: bold;
}
p {
  min-width: 200px;
}
</style>
