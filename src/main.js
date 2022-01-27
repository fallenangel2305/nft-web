import Vue from "vue";
import "./plugins/bootstrap-vue";
import "./plugins/vue-formulate";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/assets/css/style.css"


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
