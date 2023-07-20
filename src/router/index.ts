import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    redirect: {
      name: "test"
    }
  },
  {
    path: "/test",
    name: "test",
    component: () => import("@/views/DemoTest.vue"),
    meta: {
      title: "例子测试"
    }
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
