<script setup lang="ts">
import { exit } from "@tauri-apps/plugin-process";
import Button from "primevue/button";
import { useRoute, useRouter } from "vue-router";
import { InstallerService } from "../services/installer-service";
import ServerError from "../svg/server-error.vue";

const router = useRouter();
const route = useRoute();
</script>

<template>
  <div class="flex items-center justify-center flex-col w-screen h-screen overflow-hidden">
    <div class="w-full max-w-1024px flex flex-1 overflow-auto items-center gap-4 pa-4 pr-6">
      <ServerError class="h-240px w-auto" />
      <div class="flex-1 prose pa-8">
        <h3 class="mb-4">{{ route.query.title || 'Erro' }}</h3>
        <p class="mb-8">{{ route.query.message || 'Erro desconhecido' }}</p>
        <div class="flex gap-2 justify-end">
          <Button class="block" label="Tentar novamente" @click="router.replace('/')" /><br />
          <Button class="block" label="Sair do instalador" severity="secondary" @click="exit(0)" />
        </div>
      </div>
    </div>
    <div class="pa-2 w-full">
      <pre v-if="route.query.logs"
        class="w-full h-128px overflow-auto bg-black color-white pa-4 text-3 rounded-md">{{ InstallerService.logs.value }}</pre>
    </div>
  </div>
</template>
