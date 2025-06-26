<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import StepImage from "../svg/sever.vue";

import Button from "primevue/button";

import SelectionCard from "../components/selection-card.vue";
import { useInstallerStore } from "../stores/installer";


import { Disk, DiskService } from "../services/disk-service";
import HardDisk from "../svg/hard-disk.vue";

const router = useRouter();
const installerStore = useInstallerStore();

const disks = ref<Disk[]>([]);

DiskService.getDisks().then((result) => {
  disks.value = result;
  installerStore.installDisk = result[0]?.device;
});

</script>

<template>
  <div
    class="flex items-center justify-center flex-col w-screen h-screen overflow-hidden"
  >
    <div class="w-full max-w-1024px flex flex-1 overflow-auto items-center gap-4 pa-4 pr-6">
      <StepImage class="w-380px" />
      <div class="flex-1 prose">
        <h3 class="mb-4">
          Onde você quer instalar o
          {{ installerStore.config.whitelabel.long_name }}?
        </h3>

        <div class="grid grid-cols-3 gap-2">
          <SelectionCard
            v-for="disk in disks"
            :key="disk.device"
            v-model="installerStore.installDisk"
            class="mb-2 text-center"
            :value="disk.device"
          >
            <HardDisk class="mx-auto" />
            <h5 class="m-0 mb-1">{{ disk.model }}</h5>
            <p class="m-0 leading-normal text-3">{{ disk.device }}</p>
            <p class="m-0 leading-normal text-3">{{ disk.size }}</p>
          </SelectionCard>
        </div>
      </div>
    </div>
    <div
      class="flex items-center justify-between w-full border-t b-#ddd px-4 py-2"
    >
      <Button severity="secondary" @click="router.back()">Voltar</Button>
      <Button label="Proximo" :disabled="!installerStore.installDisk" @click="router.push('/packages')" />
    </div>
  </div>
</template>
