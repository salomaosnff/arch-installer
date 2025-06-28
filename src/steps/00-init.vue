<script setup lang="ts">
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useRouter } from "vue-router";
import { execCommand } from "../utils/sh";
const router = useRouter();

const currentWindow = getCurrentWindow();


execCommand('id -u')
    .then(({ stdout }) => {
        if (import.meta.env.PROD && stdout.trim() !== "0") {
            alert(`Esta aplicação deve ser executada como root. Por favor, reinicie o instalador com privilégios de administrador.`);
            currentWindow.close();
        }
    }).then(() => {
        if (currentWindow.label === 'main') {
            router.replace("/language");
        } else if (currentWindow.label === 'install') {
            router.replace("/install")
        }
    })

</script>

<template>
    <span></span>
</template>
