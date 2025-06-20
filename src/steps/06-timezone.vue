<script setup lang="ts">

import { ref } from "vue";
import { useRouter } from "vue-router";
import { z } from "zod";

import Button from "primevue/button";
import Message from "primevue/message";
import Select from "primevue/select";

import Form from "@primevue/forms/form";
import { zodResolver } from "@primevue/forms/resolvers/zod";

import { useInstallerStore } from "../stores/installer";
import { execCommand } from "../utils/sh";

import StepImage from "../svg/world.vue";

const router = useRouter();
const installerStore = useInstallerStore();

const resolver = zodResolver(
  z.object({
    timezone: z
      .string({ message: "Este campo é obrigatório" })
      .min(1, "Este campo é obrigatório"),
  })
);

const timezones = ref<string[]>([]);
execCommand("timedatectl list-timezones").then(
  (value) => (timezones.value = value.stdout.split("\n"))
);
</script>

<template>
  <Form
    v-slot="$form"
    :resolver
    class="flex items-center justify-center flex-col w-screen h-screen overflow-hidden"
    :initialValue="installerStore.timezoneForm"
    validateOnBlur
    validate-on-submit
    @submit="$event.valid && router.push('/packages')"
  >
    <div
      class="w-full max-w-1024px flex flex-1 overflow-auto items-center gap-4 pa-4 pr-6"
    >
      <StepImage class="w-380px" />
      <div class="flex-1 prose">
        <h3 class="mb-4">Escolha seu Fuso horário</h3>
        <Select
          v-model="installerStore.timezoneForm.timezone"
          :options="timezones"
          name="timezone"
          filter
          placeholder="Selecione..."
          fluid
        >
        </Select>
        <Message
          v-if="$form.timezone?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.timezone.error?.message }}</Message
        >
      </div>
    </div>
    <div
      class="flex items-center justify-between w-full border-t b-#ddd px-4 py-2"
    >
      <Button severity="secondary" @click="router.back()">Voltar</Button>
      <Button label="Proximo" type="submit" />
    </div>
  </Form>
</template>
