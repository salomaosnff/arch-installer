import "@unocss/reset/tailwind.css";
import "primeicons/primeicons.css";
import "uno.css";
import "./styles.css";

import { createPinia } from "pinia";
import { createApp } from "vue";

import { definePreset } from "@primeuix/themes";
import Lara from "@primeuix/themes/aura";
import PrimeVue from "primevue/config";

import App from "./App.vue";
import { router } from "./router";

import { getCurrentWindow } from "@tauri-apps/api/window";
import { exit } from "@tauri-apps/plugin-process";
import { execCommand } from "./utils/sh";
getCurrentWindow().onCloseRequested(async () => {
  await execCommand(`
      dconf write /org/gnome/shell/extensions/dash-to-dock/dock-fixed true;
      dconf write /org/gnome/shell/extensions/dash-to-dock/autohide false;
      dconf write /org/gnome/desktop/background/picture-uri "'file:///usr/share/backgrounds/gnome/ring-l.jxl'";
      dconf write /org/gnome/desktop/background/picture-uri-dark "'file:///usr/share/backgrounds/gnome/ring-d.jxl'";

    `);
  await exit(0)
});

fetch("/config.json")
  .then((res) => res.json())
  .then((config) => {
    createApp(App, {
      config,
    })
      .use(router)
      .use(createPinia())
      .use(PrimeVue, {
        theme: {
          options: {
            darkModeSelector: false,
          },
          preset: definePreset(Lara, {
            semantic: {
              colorScheme: {
                light: {
                  primary: {
                    color: config.whitelabel.primary_color,
                    // inverseColor: "#1794D2",
                    hoverColor: `oklch(from ${config.whitelabel.primary_color}  calc(l + 0.1) c h)`,
                    activeColor: `oklch(from  ${config.whitelabel.primary_color}  calc(l - 0.1) c h)`,
                  },
                  contrast: {
                    color: "#000000",
                    background: "#FFFFFF",
                  },
                },
                dark: {
                  primary: {
                    color: config.whitelabel.primary_color,
                    // inverseColor: "#FFFFFF",
                    hoverColor: `oklch(from ${config.whitelabel.primary_color}  calc(l + 0.1) c h)`,
                    activeColor: `oklch(from  ${config.whitelabel.primary_color}  calc(l - 0.1) c h)`,
                  },
                  contrast: {
                    color: "#FFFFFF",
                    background: "#000000",
                  },

                  highlight: {
                    background: config.whitelabel.primary_color,
                  },
                },
              },
            },
          } as typeof Lara),
        },
      })
      .mount("#app");
  });
