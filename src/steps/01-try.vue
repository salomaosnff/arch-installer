<script setup lang="ts">

useWindowTitle({
  title: 'Assistente de Instalação',
  titleTemplate: (title) => title
});

const router = useRouter();
</script>
<template>
  <ImageContent>
    <h1 class="text-6 font-bold">Experimente o Arch Linux</h1>
    <p class="opacity-82 mb-4">Escolha uma das opções abaixo para começar a usar o Arch Linux.</p>
    <div class="flex gap-2 flex-col">
      <button class="text-left flex gap-4 pa-4 btn">
        <img src="/icons/steering-wheel.svg" alt="Steering Wheel" class="aspect-ratio-1 w-16" />
        <div>
          <p class="font-bold mb-1">Experimentar</p>
          <p class="text-3">
            Experimente o Arch Linux diretamente do live CD sem instalar absolutamente nada no seu computador.
          </p>
        </div>
      </button>
      <button class="text-left flex gap-4 pa-4 btn" @click="router.push('/03-user')">
        <img src="/icons/install.svg" alt="Steering Wheel" class="aspect-ratio-1 w-16" />
        <div>
          <p class="font-bold mb-1">Instalar</p>
          <p class="text-3">
            Instale o Arch Linux no seu computador e tenha acesso a todos os recursos disponíveis.
          </p>
        </div>
      </button>
    </div>
  </ImageContent>
</template>

<style scoped lang="scss">
.btn {
  @apply: bg-white text-black rounded-lg shadow-md hover:(shadow-lg text-white) transition-all duration-200;

  p:first-child {
    color: var(--color-accent);
  }

  p:last-child {
    opacity: 0.82;
  }

  &:hover {
    background: var(--color-accent);

    p:first-child {
      color: white;
    }
  }
}
</style>