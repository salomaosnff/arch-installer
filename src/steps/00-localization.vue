<script setup lang="ts">
import { useInstallerStepper } from '../composables/useStepper';


const router = useRouter();

const language = ref('pt-BR');
const keymap = ref('br-abnt2');
const useSameKeymap = ref(true);

useWindowTitle({
  title: 'Bem-vindo ao Arch Linux',
  titleTemplate: (title) => title
});

const { nextLink } = useInstallerStepper()

nextLink.value = '/01-try';
</script>
<template>
  <ImageContent class="h-full">
    <h1 class="text-6 font-bold">Bem-vindo ao instalador do Arch Linux</h1>
    <p class="opacity-82 mb-4">Selecione o idioma e o layout do teclado que deseja usar durante a instalação.</p>

    <div class="flex gap-4 flex-col max-w-480px">
      <label>
        <p>Idioma</p>
        <select v-model="language" class="w-full">
          <option value="pt-BR">Português (Brasil)</option>
          <option value="en-US">English (US)</option>
          <option value="es-ES">Español (España)</option>
          <option value="fr-FR">Français (France)</option>
        </select>
      </label>

      <label>
        <p>Layout do Teclado</p>
        <select v-model="keymap" class="w-full">
          <option value="br-abnt2">Português (Brasil - ABNT2)</option>
          <option value="us">English (US)</option>
          <option value="es">Español (España)</option>
          <option value="fr">Français (France)</option>
        </select>
      </label>

      <label class="flex gap-1 items-start">
        <input class="mt-1" type="checkbox" v-model="useSameKeymap" />
        <p>Utilizar essa configuração de idioma e layout de teclado para o sistema instalado</p>
      </label>
    </div>
  </ImageContent>
</template>