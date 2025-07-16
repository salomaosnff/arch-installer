<script setup lang="ts">
import { useRouter } from "vue-router";

import Button from "primevue/button";
import InputText from "primevue/inputtext";

import { useInstallerStore } from "../stores/installer";

import SelectionCard from "../components/selection-card.vue";

import { computed, ref } from "vue";
import StepImage from "../svg/delivered.vue";

const router = useRouter();
const installerStore = useInstallerStore();
const search = ref("");
const filtered = computed(() => {
  const query = search.value.toLowerCase().trim();
  return installerStore.config.additional_packages.filter(
    (pkg: any) =>
      pkg.title.toLowerCase().includes(query) ||
      pkg.package.toLowerCase().includes(search) ||
      pkg.description.toLowerCase().includes(query) ||
      pkg.source.toLowerCase().includes(query)
  );
});
</script>

<template>
  <div
    class="flex items-center justify-center flex-col w-screen h-screen overflow-hidden"
  >
    <div
      class="w-full max-w-1024px flex flex-1 overflow-hidden items-center gap-4 pa-4 pr-6"
    >
      <StepImage class="w-380px" />
      <div class="flex flex-col flex-1 prose h-full my-auto overflow-hidden">
        <h3 class="mb-4">Selecione pacotes adicionais</h3>
        <InputText
          v-model="search"
          class="mb-2 mr-4"
          placeholder="Pesquisar..."
        ></InputText>
        <div class="flex-1 overflow-y-auto pr-4">
          <div class="grid grid-cols-1 gap-2">
            <SelectionCard
              v-for="pkg in filtered"
              :key="`${pkg.source}-${pkg.package}`"
              v-model="installerStore.additionalPackages"
              :value="pkg"
              :title="pkg.description"
            >
              <div class="flex gap-2">
                <img class="aspect-ratio-1 h-48px" :src="pkg.logo" />
                <div class="flex-1">
                  <div
                    class="flex overflow-hidden flex-wrap gap-1 items-center"
                  >
                    <h5 class="m-0 mb-1">{{ pkg.title }}</h5>
                    <p class="m-0 leading-normal text-3">({{ pkg.source }})</p>
                  </div>
                  <p class="m-0 text-3">{{ pkg.description }}</p>
                </div>
              </div>
            </SelectionCard>
          </div>
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
