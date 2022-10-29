<template>
  <b-card
    border-variant="secondary"
    :header="userName"
    header-border-variant="secondary"
    align="center"
  >
    <b-card-text>{{ comment }}</b-card-text>
  </b-card>
</template>

<script>
export default {
  props: ["userName", "comment"],
};
</script>

<style></style>
