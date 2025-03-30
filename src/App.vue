<script setup lang="ts">
import { invoke } from "@tauri-apps/api/core";
import { ref } from "vue";

const greetMsg = ref("");
const name = ref("");

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  greetMsg.value = await invoke("greet", { name: name.value });
}

useWindowTitle({
  titleTemplate: (title) => `${title} - Instalador do Arch Linux`,
})


</script>

<template>
  <InstallerStepper>
    <RouterView></RouterView>
  </InstallerStepper>
</template>

<style>
* {
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

@layer page {}
</style>