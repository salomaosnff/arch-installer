<script setup lang="ts">
import StepImage from "../svg/loading.vue";

import ProgressBar from "primevue/progressbar";
import ProgressSpinner from "primevue/progressspinner";
import { useRouter } from "vue-router";
const router = useRouter();

import { computed, onBeforeUnmount, useTemplateRef, watch } from "vue";
import { InstallerService } from "../services/installer-service";
import { isInstalling, useInstallerStore } from "../stores/installer";

const installerStore = useInstallerStore();

isInstalling.value = true;

const { packages, packages_aur } = installerStore.additionalPackages.reduce(
  (acc, pkg) => {
    if (pkg.source === "AUR") {
      acc.packages_aur.push(pkg.package);
    } else {
      acc.packages.push(pkg.package);
    }

    return acc;
  },
  { packages: [] as string[], packages_aur: [] as string[] }
);
InstallerService.createTasks({
  device: installerStore.installDisk,
  bootloader: "systemd-boot",
  distro_name: installerStore.config.whitelabel.long_name,
  locale: installerStore.languageForm.lang,
  type: installerStore.installType as any,
  packages: packages,
  packages_aur: packages_aur,
});
InstallerService.runAll().then(() => router.push("/finish")).catch((err) => {
  console.error(err);
  return router.replace({
    name: "error",
    query: {
      title: "Falha na Instalação",
      message: "Ocorreu um erro durante a instalação. Por favor, verifique os logs para mais detalhes.",
      code: "E002",
      logs: 1,
    },
  })
});

const { totalCommands, totalRunned, currentTask, logs } = InstallerService;

const progress = computed(() => {
  if (totalCommands.value === 0) return 0;
  return (totalRunned.value / totalCommands.value) * 100;
});

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

onBeforeUnmount(() => {
  isInstalling.value = false;
});
</script>

<template>
  <div class="flex flex-col w-full max-w-1024px mx-auto pa-8 h-screen overflow-hidden">
    <StepImage class="h-240px mx-auto mb-8" />

    <div class="flex items-center gap-2 mb-2">
      <ProgressSpinner style="width: 24px; height: 24px" strokeWidth="2" fill="transparent" animationDuration=".5s"
        aria-label="Custom ProgressSpinner" />
      <p class="flex-1">{{ progress.toFixed(0) }}% {{ currentTask?.title }}</p>
    </div>
    <ProgressBar class="mb-4" :value="progress">
      <span></span>
    </ProgressBar>
    <pre ref="log" class="flex-1 min-h-80px overflow-auto bg-black color-white pa-4 text-3 rounded-md">{{ logs }}</pre>
  </div>
</template>
