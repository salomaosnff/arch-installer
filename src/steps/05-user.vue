<script setup lang="ts">
import { useTemplateRef, watch } from "vue";
import { useRouter } from "vue-router";

import StepImage from "../svg/profile.vue";

import Button from "primevue/button";

import { useInstallerStore } from "../stores/installer";


import Form, { FormInstance } from "@primevue/forms/form";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import Checkbox from "primevue/checkbox";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import Password from "primevue/password";
import { z } from "zod";
import { execCommand } from "../utils/sh";

const router = useRouter();
const installerStore = useInstallerStore();

const resolver = zodResolver(
  z.object({
    fullName: z
      .string({ message: "Este campo é obrigatório" })
      .min(1, "Este campo é obrigatório")
      .max(128, "Este campo deve ter no maximo 128 caracteres"),
    login: z
      .string({ message: "Este campo é obrigatório" })
      .min(1, "Este campo é obrigatório")
      .max(32, "Este campo deve ter no maximo 32 caracteres")
      .refine(
        (value) => /^[a-z_][a-z0-9_\-]+$/.test(value),
        "Este campo não poder conter caracteres especiais"
      ),
    hostname: z
      .string({ message: "Este campo é obrigatório" })
      .min(1, "Este campo é obrigatório")
      .max(128, "Este campo deve ter no maximo 128 caracteres")
      .refine(
        (value) => /^[a-z_][a-z0-9_\-]+$/.test(value),
        "Este campo não poder conter caracteres especiais"
      ),
    password: z
      .string({ message: "Este campo é obrigatório" })
      .min(3, "Este campo deve ter no minimo 3 caracteres"),
    confirmPassword: z
      .string({ message: "Este campo é obrigatório" })
      .refine(
        (value) => value === installerStore.userForm.password,
        "As senhas não conferem"
      ),
    autoLogin: z.boolean(),
  })
);

const formRef = useTemplateRef<FormInstance>("form");

let productName = "linux";
execCommand("cat /sys/devices/virtual/dmi/id/product_name").then(
  (value) => (productName = value.stdout)
);

function onBlurFullName() {
  if (!installerStore.userForm.login) {
    installerStore.userForm.login = installerStore.userForm.fullName
      .split(" ")[0]
      .toLocaleLowerCase();
  }
  if (!installerStore.userForm.hostname) {
    installerStore.userForm.hostname =
      installerStore.userForm.login +
      "-" +
      productName.trim().replace(/\s+/g, "-").toLocaleLowerCase();
  }
}

watch(
  () => installerStore.userForm,
  (userForm) => {
    formRef.value?.setValues(userForm);
  },
  { deep: true }
);

</script>

<template>
  <Form
    ref="form"
    v-slot="$form"
    :resolver
    class="flex items-center justify-center flex-col w-screen h-screen overflow-hidden"
    :initialValue="installerStore.userForm"
    validateOnBlur
    validate-on-submit
    @submit="$event.valid && router.push('/timezone')"
  >
    <!-- <pre>{{ $form }}</pre> -->
    <div
      class="w-full max-w-1024px flex flex-1 overflow-auto items-center gap-4 pa-4 pr-6"
    >
      <StepImage class="w-380px" />
      <div class="flex-1 prose">
        <h3 class="mb-4">Quem é você?</h3>
        <div class="mb-2">
          <label for="fullName" class="inline-block mb-2">Nome Completo</label>
          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-user"></i>
            </InputGroupAddon>
            <InputText
              v-model="installerStore.userForm.fullName"
              id="fullName"
              name="fullName"
              class="w-full"
              placeholder="John Doe"
              @blur="onBlurFullName"
            />
          </InputGroup>
          <Message
            v-if="$form.fullName?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.fullName.error?.message }}</Message
          >
        </div>
        <div class="mb-2">
          <label for="login" class="inline-block mb-2">Nome de usuário</label>
          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-user"></i>
            </InputGroupAddon>
            <InputText
              v-model="installerStore.userForm.login"
              name="login"
              id="login"
              class="w-full"
              placeholder="john"
              @blur="onBlurFullName"
            />
          </InputGroup>
          <Message
            v-if="$form.login?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.login.error?.message }}</Message
          >
        </div>

        <div class="mb-2">
          <label for="hostname" class="inline-block mb-2"
            >Nome do dispositivo</label
          >
          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-desktop"></i>
            </InputGroupAddon>
            <InputText
              v-model="installerStore.userForm.hostname"
              id="hostname"
              name="hostname"
              class="w-full"
              placeholder="john-pc"
            />
          </InputGroup>
          <Message
            v-if="$form.hostname?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.hostname.error?.message }}</Message
          >
        </div>
        <div class="mb-2">
          <label for="password" class="inline-block mb-2"
            >Escolha uma senha</label
          >
          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-lock"></i>
            </InputGroupAddon>
            <Password
              input-id="password"
              name="password"
              v-model="installerStore.userForm.password"
              toggleMask
              class="w-full"
              placeholder="Escolha uma senha"
            />
          </InputGroup>
          <Message
            v-if="$form.password?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.password.error?.message }}</Message
          >
        </div>
        <div class="mb-6">
          <label for="confirmPassword" class="inline-block"
            >Confirme a senha</label
          >
          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-lock"></i>
            </InputGroupAddon>
            <Password
              input-id="confirmPassword"
              toggleMask
              name="confirmPassword"
              class="w-full"
              placeholder="Confirme sua senha"
              :feedback="false"
            />
          </InputGroup>
          <Message
            v-if="$form.confirmPassword?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.confirmPassword.error?.message }}</Message
          >
        </div>
        <div class="flex items-center gap-2 mb-2">
          <Checkbox
            v-model="installerStore.userForm.requestPassword"
            input-id="autoLogin"
            binary
          />
          <label for="autoLogin">Pedir minha senha para entrar</label>
        </div>
      </div>
    </div>
    <div
      class="flex items-center justify-between w-full border-t b-#ddd px-4 py-2"
    >
      <Button severity="secondary" @click="router.back()">Voltar</Button>
      <Button
        label="Proximo"
        type="submit"
      />
    </div>
  </Form>
</template>
