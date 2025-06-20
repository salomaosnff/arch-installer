<script setup lang="ts">
import { onMounted } from "vue";
import StepImage from "../svg/loading.vue";

import ProgressBar from "primevue/progressbar";
import { useRouter } from "vue-router";
const router = useRouter();

onMounted(() => {
  setTimeout(() => {
    router.push("/finish");
  }, 3000);
});
</script>

<template>
  <div class="w-full max-w-1024px mx-auto pa-8 h-screen overflow-hidden">
    <StepImage class="h-380px mx-auto mb-8" />
    <p class="mb-2">Instalando pacotes adicionais...</p>
    <ProgressBar :value="50"></ProgressBar>
  </div>
</template>
