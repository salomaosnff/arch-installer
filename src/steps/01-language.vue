<script setup lang="ts">
import { useInstallerStore } from "../stores/installer";

import { Form } from "@primevue/forms";
import Button from "primevue/button";
import Select from "primevue/select";

import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import { useRouter } from "vue-router";

const installerStore = useInstallerStore();

const router = useRouter()


</script>

<template>
  <div class="flex items-center justify-center w-screen h-screen">
    <div class="container text-center">
      <img class="mx-auto" height="218" :src="installerStore.config.whitelabel.logo" alt="" />
      <p class="my-8">
        Para configurar a instalação do
        {{ installerStore.config.whitelabel.long_name }}, selecione o idioma e
        clique no botão Continuar
      </p>
      <Form class="max-w-640px mx-auto">
        <InputGroup class="mb-2">
          <InputGroupAddon>
            <i class="pi pi-language"></i>
          </InputGroupAddon>
          <Select
            v-model="installerStore.languageForm.lang"
            :options="installerStore.config.languages"
            optionLabel="title"
            optionValue="locale"
          ></Select>
        </InputGroup>

        <InputGroup class="mb-2">
          <InputGroupAddon>
            <i class="pi pi-desktop"></i>
          </InputGroupAddon>
          <Select
            v-model="installerStore.languageForm.keymap"
            :options="installerStore.config.keymaps"
            optionLabel="title"
            optionValue="keymap"
          ></Select>
        </InputGroup>

        <Button @click="router.push('/network')" class="mt-4">Continuar</Button>
      </Form>
    </div>
  </div>
</template>
