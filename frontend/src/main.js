import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "../store/index";
import { BootstrapVue3 } from "bootstrap-vue-3";
import RecipeItem from "./components/RecipeItem.vue";
import TheSpinner from "./components/ui/TheSpinner.vue";
import VueSocialSharing from "vue-social-sharing";
//import BootstrapVue from "bootstrap-vue";

const app = createApp(App);
app.use(router);
app.use(store);
app.use(BootstrapVue3);
app.use(VueSocialSharing);
app.component("recipe-item", RecipeItem);
app.component("the-spinner", TheSpinner);
app.mount("#app");
