<script setup lang="ts">

useWindowTitle({
  title: 'Particionamento',
});

const router = useRouter();

</script>
<template>
  <div class="w-full">
    <p class="text-6 font-bold">Como deseja instalar o sistema?</p>
    <div class="flex gap-2 flex-col">
      <div class="flex gap-2 flex-col">
        <button class="text-left flex gap-4 pa-4 btn">
          <img src="/icons/steering-wheel.svg" alt="Steering Wheel" class="aspect-ratio-1 w-16" />
          <div>
            <p class="font-bold mb-1">Instalar o Arch Linux ao lado do Windows</p>
            <p class="text-3">Você poderá escolher entre o Arch Linux e o Windows ao iniciar o computador.</p>
          </div>
        </button>
        <button class="text-left flex gap-4 pa-4 btn">
          <img src="/icons/steering-wheel.svg" alt="Steering Wheel" class="aspect-ratio-1 w-16" />
          <div>
            <p class="font-bold mb-1">Apagar o disco e instalar o Arch Linux</p>
            <p class="text-3">Iniciar tudo do zero, apagando todos os dados do disco rígido.</p>
          </div>
        </button>
        <button class="text-left flex gap-4 pa-4 btn" @click="router.push('/03-user')">
          <img src="/icons/install.svg" alt="Steering Wheel" class="aspect-ratio-1 w-16" />
          <div>
            <p class="font-bold mb-1">Instalar o Arch Linux manualmente</p>
            <p class="text-3">
              Você pode criar suas próprias partições e escolher o que deseja instalar.
            </p>
          </div>
        </button>
      </div>
    </div>
  </div>
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