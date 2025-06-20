<script setup lang="ts">
import { useRouter } from "vue-router";

import Button from "primevue/button";

import { useInstallerStore } from "../stores/installer";

import SelectionCard from "../components/selection-card.vue";

import StepImage from "../svg/delivered.vue";

const router = useRouter();
const installerStore = useInstallerStore();
</script>

<template>
  <div
    class="flex items-center justify-center flex-col w-screen h-screen overflow-hidden"
  >
    <div
      class="w-full max-w-1024px flex flex-1 overflow-auto items-center gap-4 pa-4 pr-6"
    >
      <StepImage class="w-380px" />
      <div class="flex-1 prose">
        <h3 class="mb-4">Selecione pacotes adicionais</h3>
        <div class="grid grid-cols-3 gap-2">
          <SelectionCard
            class="text-center"
            v-for="pkg in installerStore.config.additional_packages"
            v-model="installerStore.additionalPackages"
            :value="pkg"
          >
            <img class="aspect-ratio-1 h-72px mx-auto mb-4" :src="pkg.logo" />
            <h5 class="m-0 mb-1">{{ pkg.title }}</h5>
            <p class="m-0 leading-normal text-3">{{ pkg.package }}</p>
            <p class="m-0 leading-normal text-3">{{ pkg.source }}</p>
          </SelectionCard>
        </div>
      </div>
    </div>
    <div
      class="flex items-center justify-between w-full border-t b-#ddd px-4 py-2"
    >
      <Button severity="secondary" @click="router.back()">Voltar</Button>
      <Button label="Proximo" @click="router.push('/review')" />
    </div>
  </div>
</template>
