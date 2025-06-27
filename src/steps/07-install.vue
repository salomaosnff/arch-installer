<script setup lang="ts">
import StepImage from "../svg/loading.vue";

import ProgressBar from "primevue/progressbar";
import { useRouter } from "vue-router";
const router = useRouter();

import { computed, useTemplateRef, watch } from "vue";
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
InstallerService.runAll().then(() => router.push("/finish"));

const { totalCommands, totalRunned, currentTask, logs } = InstallerService;

const progress = computed(() => {
  if (totalCommands.value === 0) return 0;
  return (totalRunned.value / totalCommands.value) * 100;
});

const log = useTemplateRef("log");

watch(logs, () => {
  if (log.value) {
    log.value.scroll({
      top: log.value.scrollHeight,
      behavior: "smooth",
    });
  }
}, {
  flush: "post",
});
</script>

<template>
  <div class="w-full max-w-1024px mx-auto pa-8 h-screen overflow-hidden">
    <StepImage class="h-380px mx-auto mb-8" />

    <p class="mb-2">{{ progress.toFixed(0) }}% {{ currentTask?.title }}</p>
    <ProgressBar class="mb-4" :value="progress">
      <span></span>
    </ProgressBar>
    <pre ref="log" class="h-180px overflow-auto bg-black color-white pa-4 text-3 rounded-md">{{
      logs
    }}</pre>
  </div>
</template>
