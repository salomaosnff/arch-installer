<script setup lang="ts">
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useRouter } from "vue-router";
import { execCommand } from "../utils/sh";
const router = useRouter();

const currentWindow = getCurrentWindow();


execCommand('id -u')
    .then(({ stdout }) => {
        if (import.meta.env.PROD && stdout.trim() !== "0") {
            return router.replace({
                path: "/error",
                query: {
                    title: "Erro de Permissão",
                    message: "Esta aplicação deve ser executada como root. Por favor, reinicie o instalador com privilégios de administrador.",
                }
            });
        }

        if (currentWindow.label === 'main') {
            return router.replace("/language");
        }

        if (currentWindow.label === 'install') {
            return router.replace("/install")
        }
    })

</script>

<template>
    <span></span>
</template>
