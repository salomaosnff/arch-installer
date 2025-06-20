<script setup lang="ts">
import { watch } from "vue";
import { useInstallerStore } from "./stores/installer";
const installerStore = useInstallerStore();
const props = defineProps<{
  config: object;
}>();

watch(
  () => props.config,
  (config) => {
    installerStore.config = config;
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <RouterView />
</template>
