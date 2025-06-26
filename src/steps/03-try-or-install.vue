<script setup lang="ts">
import { useRouter } from "vue-router";

import StepImage from "../svg/vintage.vue";

import Button from "primevue/button";
// import RadioButton from "primevue/radiobutton";

import SelectionCard from "../components/selection-card.vue";
import { useInstallerStore } from "../stores/installer";

import { getCurrentWindow } from "@tauri-apps/api/window";

const router = useRouter();
const installerStore = useInstallerStore();

async function nextStep() {
  if (installerStore.installType === "try") {
    return getCurrentWindow().close();
  }
  return router.push("/disk");
}
</script>

<template>
  <div
    class="flex items-center justify-center flex-col w-screen h-screen overflow-hidden"
  >
    <div class="flex flex-1 overflow-auto items-center gap-4 pa-4 pr-6">
      <StepImage class="w-380px" />
      <div class="flex-1 prose">
        <h3 class="mb-4">
          O que você que fazer com o
          {{ installerStore.config.whitelabel.long_name }}?
        </h3>

        <SelectionCard
          v-model="installerStore.installType"
          class="mb-2"
          value="install"
        >
          <h4 class="m-0 mb-1">Instalar no disco</h4>
          <p class="m-0 leading-normal">
            Instalar o {{ installerStore.config.whitelabel.long_name }} no seu
            disco e tornar como sistema operacional principal.
          </p>
        </SelectionCard>

        <SelectionCard
          v-model="installerStore.installType"
          class="mb-2"
          value="try"
        >
          <h4 class="m-0 mb-1">Experimentar sem instalar</h4>
          <p class="m-0 leading-normal">
            Voce pode experimentar o
            {{ installerStore.config.whitelabel.long_name }}, sem fazer nenhuma
            alteração no seu computador.
          </p>
        </SelectionCard>

        <SelectionCard
          v-model="installerStore.installType"
          class="mb-2"
          value="reinstall"
        >
          <h4 class="m-0 mb-1">
            Reinstalar o {{ installerStore.config.whitelabel.long_name }}
          </h4>
          <p class="m-0 leading-normal">
            Reinstale o {{ installerStore.config.whitelabel.long_name }} e
            mantenha seus arquivos. Programas e pacotes não serão mantidos.
          </p>
        </SelectionCard>
      </div>
    </div>
    <div
      class="flex items-center justify-between w-full border-t b-#ddd px-4 py-2"
    >
      <Button severity="secondary" @click="router.back()">Voltar</Button>
      <Button label="Proximo" @click="nextStep()" />
    </div>
  </div>
</template>
