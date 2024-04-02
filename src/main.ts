import { createApp } from "vue";
import { createPinia } from "pinia";
import Toast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import App from "./App.vue";
import router from "./router";

import "./scss/global.scss";

const app = createApp(App);

const pinia = createPinia();

app.use(pinia);
app.use(Toast, { position: "top-right" });
app.use(router);

pinia.use(piniaPluginPersistedstate);

app.mount("#app");
