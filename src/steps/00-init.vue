<script setup lang="ts">
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useRouter } from "vue-router";
const router = useRouter();

const currentWindow = getCurrentWindow();
if(currentWindow.label === 'main'){
    router.replace("/language");
} else if(currentWindow.label === 'install'){
    router.replace("/install")
}

</script>

<template>Init</template>
