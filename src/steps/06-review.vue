<script setup lang="ts">
import { useRouter } from "vue-router";

import Button from "primevue/button";

import { useInstallerStore } from "../stores/installer";

import StepImage from "../svg/setting.vue";

const router = useRouter();
const installerStore = useInstallerStore();
</script>

<template>
  <div
    class="flex items-center justify-center flex-col w-screen h-screen overflow-hidden"
  >
    <div
      class="w-full max-w-1024px flex flex-1 overflow-auto items-center gap-4 pa-4 pr-6"
    >
      <StepImage class="w-380px" />
      <div class="flex-1 prose">
        <h3 class="mb-4">Revise suas escolhas</h3>
        <div class="">
          <table>
            <tbody>
              <tr>
                <th class="text-left">Método de instalação</th>
                <td v-if="installerStore.installType === 'install'">
                  Instalação completa
                </td>
                <td v-else-if="installerStore.installType === 'reinstall'">
                  Reinstalação do sistema
                </td>
              </tr>
              <tr>
                <th class="text-left">Disco</th>
                <td>{{ installerStore.installDisk }}</td>
              </tr>
              <template v-if="installerStore.installType === 'install'">
                <tr>
                  <th></th>
                  <td class="color-red">
                    Apagar o disco {{ installerStore.installDisk }}
                  </td>
                </tr>
                <tr>
                  <th></th>
                  <td class="color-red">
                    Criar e formatar partição {{ installerStore.installDisk }}1
                    (fat32)
                  </td>
                </tr>
                <tr>
                  <th></th>
                  <td class="color-red">
                    Criar e formatar partição {{ installerStore.installDisk }}2
                    (btrfs)
                  </td>
                </tr>
              </template>
              <template v-else-if="installerStore.installType === 'reinstall'">
                <tr>
                  <th></th>
                  <td class="color-red">
                    Formatar partição {{ installerStore.installDisk }}1 (fat32)
                  </td>
                </tr>
                <tr>
                  <th></th>
                  <td class="color-blue">
                    Montar partição {{ installerStore.installDisk }}2 (btrfs)
                  </td>
                </tr>
                <tr>
                  <th></th>
                  <td class="color-red">
                    Excluir arquivos sub-volume <strong>@</strong> da partição
                    {{ installerStore.installDisk }}2
                  </td>
                </tr>
                <tr>
                  <th></th>
                  <td class="color-blue">
                    Arquivos sub-volume <strong>@home</strong> da partição
                    {{ installerStore.installDisk }}2 serão mantidos.
                  </td>
                </tr>
              </template>
              <tr>
                <th class="text-left">Idioma</th>
                <td>{{ installerStore.languageForm.lang }}</td>
              </tr>
              <tr>
                <th class="text-left">Layout do teclado</th>
                <td>
                  {{ installerStore.languageForm.keymap.console }},
                  {{ installerStore.languageForm.keymap.graphical }}
                </td>
              </tr>

              <tr>
                <th class="text-left">Rede</th>
                <td v-if="installerStore.network.type === 'wired'">
                  Conexão cabeada
                </td>
                <td v-else-if="installerStore.network.type === 'wlan'">
                  Conexão sem fio {{ installerStore.network.wlan.ssid }}
                </td>
              </tr>
              <tr>
                <th class="text-left">Pacotes adicionais</th>
                <td>
                  {{
                    installerStore.additionalPackages
                      .map((pkg) => pkg.title)
                      .join(", ")
                  }},
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div
      class="flex items-center justify-between w-full border-t b-#ddd px-4 py-2"
    >
      <Button severity="secondary" @click="router.back()">Voltar</Button>
      <Button label="Proximo" @click="router.push('/install')" />
    </div>
  </div>
</template>
