<script setup lang="ts">
import { exit } from "@tauri-apps/plugin-process";
import Button from "primevue/button";
import { useTemplateRef, watch } from "vue";
import { InstallerService } from "../services/installer-service";
import { isInstalling } from "../stores/installer";
import StepImage from "../svg/completing.vue";
import { execCommand } from "../utils/sh";

isInstalling.value = false;
const { logs } = InstallerService;
const log = useTemplateRef("log");

watch(
  logs,
  () => {
    if (log.value) {
      log.value.scroll({
        top: log.value.scrollHeight,
        behavior: "instant",
      });
    }
  },
  {
    flush: "post",
  }
);

function reboot() {
  return execCommand("reboot");
}
</script>

<template>
  <div class="flex flex-col w-full max-w-1024px mx-auto pa-8 h-screen overflow-hidden">
    <div
      class="prose flex-1 w-full max-w-1024px mx-auto text-center pa-8 overflow-hidden"
    >
      <StepImage class="h-240px mx-auto mb-8" />
      <h4 class="mb-2">Instalação Concluída</h4>
      <p class="mb-8">
        Você pode continuar experimentando o live CD ou reiniciar seu novo
        sistema.
      </p>
      <Button class="block mb-4" label="Reiniciar" @click="reboot" /><br />
      <Button
        class="block"
        label="Continuar experimentado"
        severity="secondary"
        @click="exit(0)"
      />
    </div>
    <pre ref="log" class="flex-1 min-h-80px overflow-auto bg-black color-white pa-4 text-3 rounded-md">{{ logs }}</pre>

  </div>
</template>
