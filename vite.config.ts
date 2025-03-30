import { defineConfig } from "vite";

import vue from "@vitejs/plugin-vue";
import Uno from 'unocss/vite';
import Autoimports from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import Pages from 'unplugin-vue-router/vite';


// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Pages({
      importMode: 'sync',
      extensions: ['.vue'],
      dts: 'src/types/router.d.ts',
      routesFolder: 'src/steps',
    }),
    Uno(),
    vue(),
    Components({
      dts: 'src/types/components.d.ts',
      directoryAsNamespace: false,
      deep: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dirs: [
        'src/components',
      ],
    }),
    Autoimports({
      dts: 'src/types/auto-imports.d.ts',
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
      ],
      dirs: [
        'src/store',
        'src/composables',
      ],
      vueTemplate: true,
    }),
  ],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
        protocol: "ws",
        host,
        port: 1421,
      }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
});
