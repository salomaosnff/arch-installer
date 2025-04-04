<script setup lang="ts">
import { useInstallerStepper } from "../composables/useStepper";
import { readTextFile, readTextFileLines } from "@tauri-apps/plugin-fs";

useWindowTitle({
  title: "Bem-vindo ao Arch Linux",
  titleTemplate: (title) => title,
});

interface KeyboardVariant {
  code: string;
  title: string;
}

interface KeyboardLayout {
  code: string;
  title: string;
  variants: Array<KeyboardVariant>
}

const language = ref("pt_BR");
const useSameKeymap = ref(true);
const keymap = ref<{ layout: KeyboardLayout | null, variant?: string; }>({ layout: null, variant: "" });

const keymaps = ref<Array<KeyboardLayout>>([]);
const languages = ref<Array<{ code: string; title: string }>>([]);

const { nextLink } = useInstallerStepper();

nextLink.value = "/01-try";

readTextFileLines("/etc/locale.gen").then(async (rows) => {
  const regex = /^#?\s*([a-z]{2}_[A-Z]{2})\.UTF-8/gm;
  languages.value = [];
  for await (const line of rows) {
    const lang = regex.exec(line);
    if (!lang) {
      continue;
    }
    const normalizedCode = lang[1].replace("_", "-");

    languages.value.push({
      code: lang[1],
      title:
        new Intl.DisplayNames([normalizedCode], {
          type: "language",
        }).of(normalizedCode) ?? lang[1],
    });
  }
  languages.value.sort((a, b) => a.title.localeCompare(b.title));
});

readTextFile("/usr/share/X11/xkb/rules/base.xml").then((content) => {
  const doc = new DOMParser().parseFromString(content, "application/xml");
  const layoutsTags = doc.querySelectorAll("layoutList > layout");

  for (const layout of layoutsTags) {
    const layoutName = layout.querySelector("configItem > name")?.textContent;
    const layoutDescription = layout.querySelector("configItem > description")?.textContent;

    if (!layoutName || !layoutDescription) {
      continue;
    }

    const layoutVariants = Array.from(layout.querySelectorAll("variantList > variant"), (item) => ({
      code: item.querySelector("configItem > name")?.textContent!,
      title: item.querySelector("configItem > description")?.textContent!,
    }));

    keymaps.value.push({
      code: layoutName,
      title: layoutDescription,
      variants: layoutVariants,
    });
  }

  keymaps.value.sort((a, b) => a.title.localeCompare(b.title));
});
</script>

<template>
  <ImageContent class="h-full">
    <h1 class="text-6 font-bold">Bem-vindo ao instalador do Arch Linux</h1>
    <p class="opacity-82 mb-4">
      Selecione o idioma e o layout do teclado que deseja usar durante a
      instalação.
    </p>

    <div class="flex gap-4 flex-col max-w-480px">
      <label>
        <p>Idioma</p>
        <select v-model="language" class="w-full">
          <option v-for="lang in languages" :key="lang.code" :value="lang.code">
            {{ lang.title }}
          </option>
        </select>
      </label>

      <label>
        <p>Layout do Teclado</p>
        <select v-model="keymap.layout" class="w-full">
          <option v-for="item in keymaps" :key="item.code" :value="item">{{ item.title }}</option>
        </select>
      </label>

      <pre>
        {{ {
          layout: keymap.layout?.code,
          variant: keymap.variant,
        } }}
      </pre>

      <label v-if="keymap.layout?.variants.length">
        <p>Variante do Teclado</p>
        <select v-model="keymap.variant" class="w-full">
          <option v-for="item in keymap.layout.variants" :key="item.code" :value="item.code">{{ item.title }}</option>
        </select>
      </label>

      <label class="flex gap-1 items-start">
        <input class="mt-1" type="checkbox" v-model="useSameKeymap" />
        <p>
          Utilizar essa configuração de idioma e layout de teclado para o
          sistema instalado
        </p>
      </label>
    </div>
  </ImageContent>
</template>
