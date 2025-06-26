<script setup lang="ts">
import { getCurrentWindow } from "@tauri-apps/api/window";
import { exit } from "@tauri-apps/plugin-process";
import Button from "primevue/button";
import StepImage from "../svg/completing.vue";

getCurrentWindow().setClosable(true)
</script>

<template>
  <div
    class="prose w-full max-w-1024px mx-auto text-center pa-8 h-screen overflow-hidden"
  >
    <StepImage class="h-380px mx-auto mb-8" />
    <h4 class="mb-2">Instalação Concluída</h4>
    <p class="mb-8">Você pode continuar experimentando o live CD ou reiniciar seu novo sistema.</p>
      <Button class="block mb-4" label="Reiniciar" @click="exit(0)" /><br>
      <Button class="block" label="Continuar experimentado" severity="secondary"
      @click="exit(0)"/>
  </div>
</template>
