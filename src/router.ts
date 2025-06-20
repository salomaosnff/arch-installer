import { createRouter, createWebHistory } from "vue-router";
import Init from "./steps/00-init.vue";
import Language from "./steps/01-language.vue";
import Network from "./steps/02-network.vue";
import TryOrInstall from "./steps/03-try-or-install.vue";
import Disk from "./steps/04-disk.vue";
import User from "./steps/05-user.vue";
import Timezone from "./steps/06-timezone.vue";
import Packages from "./steps/07-packages.vue";
import Review from "./steps/08-review.vue";
import Install from "./steps/09-install.vue";
import Finish from "./steps/10-finish.vue";

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
      path: "/user",
      component: User,
    },
    {
      path: "/timezone",
      component: Timezone,
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
  ],
});
