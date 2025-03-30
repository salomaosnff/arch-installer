<script setup lang="ts">

useWindowTitle({
  title: 'Configuração de usuário',
});

const { nextLink } = useInstallerStepper()
nextLink.value = '/04-partition';

</script>
<template>
  <ImageContent>
    <div class="w-full">
      <p class="text-6 font-bold">Quem é você?</p>
      <div class="flex gap-2 flex-col">
        <label class="block">
          <p class="mb-1">Seu nome</p>
          <input type="text" class="w-full" placeholder="Ex: João da Silva" />
        </label>
        <label class="block">
          <p class="mb-1">Nome de usuário</p>
          <input type="text" class="w-full" placeholder="Ex: joao" />
        </label>
        <hr class="my-2" />
        <label class="block">
          <p class="mb-1">Nome do computador</p>
          <input type="text" class="w-full" placeholder="Ex: joao-pc" />
        </label>
        <hr class="my-2" />
        <label class="block">
          <p class="mb-1">Senha</p>
          <input type="password" class="w-full" />
        </label>
        <label class="block">
          <p class="mb-1">Repetir senha</p>
          <input type="password" class="w-full" />
        </label>

        <label>
          <input type="checkbox" class="mr-2" />
          <span>Logar automaticamente</span>
        </label>

        <label>
          <input type="checkbox" class="mr-2" />
          <span>Usar a mesma senha para o usuário root</span>
        </label>
      </div>
    </div>
  </ImageContent>
</template>