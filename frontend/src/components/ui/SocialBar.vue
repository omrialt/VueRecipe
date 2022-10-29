<template>
  <ShareNetwork
    v-for="network in networks"
    :key="network.name"
    :network="network.name"
    :title="title"
    :description="description"
    :url="url"
  >
    <img :src="network.icon" :alt="network.name" class="socialIcon" />
  </ShareNetwork>
</template>

<script>
import whatsappIcon from "../../assets/whatsapp-share-icon.png";
import facebookIcon from "../../assets/facebook-share-icon.png";
export default {
  props: ["title", "description", "customUrl"],
  data() {
    return {
      networks: [
        { name: "whatsapp", icon: whatsappIcon },
        { name: "facebook", icon: facebookIcon },
      ],
    };
  },
  computed: {
    url() {
      return window.location.href;
    },
  },
};
</script>

<style>
.socialIcon {
  margin: 4px;
}
</style>
