import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import APlayer from '@moefe/vue-aplayer';
Vue.use(<any>APlayer, {
  defaultCover: 'https://github.com/u3u.png',
  productionTip: false,
});

// @ts-ignore
import HappyScroll from "vue-happy-scroll";
import "vue-happy-scroll/docs/happy-scroll.css";

Vue.use(HappyScroll);

// @ts-ignore
import Particles from "vue2-particles";

Vue.use(Particles);

import "element-ui/lib/theme-chalk/index.css";
import {ElementUI} from "@/common/conifg/ElementUI";

Vue.use(ElementUI);

router.beforeEach((to, from, next) => {
  switch (to.path) {
    case "/visual":
    case "/test":
      document.title = (<Record<string, any>>to.meta).title;
      next();
      break;
    case "/":
      next();
      break;
    default:
      next({path: "/"});
  }
});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
