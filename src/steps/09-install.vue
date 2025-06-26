<script setup lang="ts">
import { ref } from "vue";
import StepImage from "../svg/loading.vue";

import ProgressBar from "primevue/progressbar";
import { useRouter } from "vue-router";
const router = useRouter();

import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";

const progressData = ref<{ progress: number; text: string }>();

getCurrentWindow().setClosable(false)

listen("install_progress", (event) => {
  progressData.value = event.payload as any;
})
  .then(() => invoke("start_install"))
  .then(() => router.push("/finish"));
</script>

<template>
  <div class="w-full max-w-1024px mx-auto pa-8 h-screen overflow-hidden">
    <StepImage class="h-380px mx-auto mb-8" />
    <p class="mb-2">{{ progressData?.text }}</p>
    <ProgressBar :value="progressData?.progress"></ProgressBar>
  </div>
</template>
