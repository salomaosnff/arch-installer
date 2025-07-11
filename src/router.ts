import { createRouter, createWebHistory } from "vue-router";
import Init from "./steps/00-init.vue";
import Language from "./steps/01-language.vue";
import Network from "./steps/02-network.vue";
import TryOrInstall from "./steps/03-try-or-install.vue";
import Disk from "./steps/04-disk.vue";
import Packages from "./steps/05-packages.vue";
import Review from "./steps/06-review.vue";
import Install from "./steps/07-install.vue";
import Finish from "./steps/08-finish.vue";
import ErrorPage from "./steps/00-error.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Init,
    },
    {
      path: "/language",
      component: Language,
    },
    {
      path: "/network",
      component: Network,
    },
    {
      path: "/try-or-install",
      component: TryOrInstall,
    },
    {
      path: "/disk",
      component: Disk,
    },
    {
      path: "/packages",
      component: Packages,
    },
    {
      path: "/review",
      component: Review,
    },
    {
      path: "/install",
      component: Install,
    },
    {
      path: "/finish",
      component: Finish,
    },
    {
      path: "/error",
      name: "error",
      component: ErrorPage
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/error",
      beforeEnter: (_to, _from, next) => {
        next({
          name: "error",
          query: {
            title: "Página Não Encontrada",
            message: "A página que você está tentando acessar não existe.",
            code: "404"
          }
        });
      }
    }
  ],
});
