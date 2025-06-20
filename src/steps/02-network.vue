<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

import AutoComplete from "primevue/autocomplete";
import Button from "primevue/button";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import Password from "primevue/password";
import RadioButton from "primevue/radiobutton";

import { useInstallerStore } from "../stores/installer";
import StepImage from "../svg/signal-researching.vue";

import { Device, Network, NetworkManager } from "../services/NetworkManager";

const devices = ref<Device[]>([]);
const networks = ref<Network[]>([]);
const isWifiLoading = ref(false);
const isConnected = ref(false);
const isConnecting = ref(false);
const connectionError = ref("");

const router = useRouter();
const installerStore = useInstallerStore();

async function fetchWifiNetworks() {
  if (isWifiLoading.value) return;
  try {
    isWifiLoading.value = true;

    networks.value = await NetworkManager.scanWifi();
  } finally {
    isWifiLoading.value = false;
  }
}

const timer = setInterval(async () => {
  [isConnected.value, devices.value] = await Promise.all([
    NetworkManager.hasInternet(),
    NetworkManager.getDevices(),
  ]);

  if (installerStore.network.type === "wlan") {
    fetchWifiNetworks();
  }
}, 5000);

onUnmounted(() => {
  clearInterval(timer);
});

const networkSuggestions = ref<Network[]>([]);

const searchNetworks = async (event: any) => {
  const query = event.query.toLowerCase();

  networkSuggestions.value = Array.from(
    new Set(
      networks.value
        .filter(
          (network) =>
            network.ssid && network.ssid.toLowerCase().includes(query)
        )
        .sort((a, b) => b.signal - a.signal)
    )
  );
};

const selectedWifiNetwork = computed(() =>
  networks.value.find(
    (network) => network.ssid === installerStore.network.wlan.ssid
  )
);

watch(
  () => installerStore.network.type === "wlan",
  (isWlan) => isWlan && fetchWifiNetworks(),
  { immediate: true }
);

watch(
  () => installerStore.network.wlan.ssid,
  async () => {
    installerStore.network.wlan.password = "";
    [isConnected.value, devices.value] = await Promise.all([
      NetworkManager.hasInternet(),
      NetworkManager.getDevices(),
    ]);
  },
  { immediate: true }
);

async function nextStep() {
  if (
    (installerStore.network.type === "wlan" && !isConnected.value) ||
    wifiDevice.value?.state === "disconnected" ||
    (wifiDevice.value?.state === "connected" &&
      wifiDevice.value?.connection !== installerStore.network.wlan.ssid)
  ) {
    const { ssid, password } = installerStore.network.wlan;
    await connectWifi(ssid, password);
  }

  if (!isConnected.value) {
    connectionError.value = "Não foi possível conectar à internet.";
    return;
  }

  await router.push("/try-or-install");
}

async function connectWifi(ssid: string, password?: string) {
  if (isConnecting.value) return;
  try {
    if (!ssid) {
      throw new Error("SSID da rede Wi-Fi não pode ser vazio");
    }
    connectionError.value = "";
    isConnecting.value = true;

    await NetworkManager.wifiConnect(ssid, password);
    isConnected.value = true;
  } catch (error: any) {
    connectionError.value = error.message || "Erro desconhecido ao conectar";
    throw error;
  } finally {
    isConnecting.value = false;
  }
}

const ethernetDevice = computed(() =>
  devices.value.find((device) => device.type === "ethernet")
);

const wifiDevice = computed(() =>
  devices.value.find((device) => device.type === "wifi")
);

watch(
  () => ethernetDevice.value?.state,
  (state) => {
    if (state === "connected") {
      installerStore.network.type = "wired";
      return;
    }

    if (installerStore.network.type === "wired") {
      installerStore.network.type = "wlan";
      return;
    }
  },
  { immediate: true }
);

watch(
  () => wifiDevice.value?.connection,
  (ssid) => {
    if (ssid) {
      installerStore.network.wlan.ssid = ssid;
    }
  }
);
</script>

<template>
  <div
    class="flex items-center justify-center flex-col w-screen h-screen overflow-hidden"
  >
    <div class="w-full max-w-1024px flex flex-1 overflow-auto items-center gap-4 pa-4 pr-6">
      <StepImage class="w-380px" />
      <div class="flex-1 prose">
        <h3 class="mb-4">Conecte-se à internet</h3>
        <p class="mb-4">
          Uma conexão com a internet é necessária para instalação de pacotes.
        </p>
        <template v-if="devices.length">
          <div v-if="ethernetDevice" class="flex items-center gap-2 mb-2">
            <RadioButton
              v-model="installerStore.network.type"
              input-id="wired"
              value="wired"
              :disabled="ethernetDevice.state !== 'connected'"
            />
            <label for="wired">Usar conexão cabeada</label>
          </div>
          <div v-if="wifiDevice" class="flex items-center gap-2 mb-2">
            <RadioButton
              v-model="installerStore.network.type"
              input-id="wlan"
              value="wlan"
              :disabled="wifiDevice.state === 'unavailable'"
            />
            <label for="wired">Usar conexão sem fio</label>
          </div>
          <div
            :class="{
              'invisible pointer-events-none':
                installerStore.network.type != 'wlan',
            }"
            class="mt-4"
          >
            <template v-if="wifiDevice?.state === 'connected'">
              <p>
                Você está conectado à rede Wi-Fi
                <strong>{{ wifiDevice?.connection }}</strong
                >.
                <br />
                Se desejar, você pode alterar a rede Wi-Fi selecionada.
              </p>
            </template>
            <template v-if="wifiDevice?.state !== 'unavailable'">
              <InputGroup class="mb-2 w-full">
                <InputGroupAddon>
                  <i class="pi pi-wifi"></i>
                </InputGroupAddon>
                <AutoComplete
                  :model-value="installerStore.network.wlan.ssid"
                  :suggestions="networkSuggestions"
                  placeholder="Selecione uma rede Wi-Fi"
                  :disabled="
                    installerStore.network.type !== 'wlan' || isConnecting
                  "
                  :loading="isWifiLoading"
                  option-label="ssid"
                  option-
                  dropdown
                  @complete="searchNetworks"
                  @update:model-value="
                    installerStore.network.wlan.ssid = $event.ssid
                  "
                >
                  <template #option="{ option }">
                    <div class="flex items-center gap-2">
                      <svg
                        width="24"
                        height="16"
                        viewBox="0 0 24 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="mr-2"
                      >
                        <rect
                          x="2"
                          y="12"
                          width="3"
                          height="4"
                          :fill="
                            option.signal > 0
                              ? 'var(--p-primary-color)'
                              : '#e5e7eb'
                          "
                          rx="1"
                        />
                        <rect
                          x="7"
                          y="8"
                          width="3"
                          height="8"
                          :fill="
                            option.signal > 25
                              ? 'var(--p-primary-color)'
                              : '#e5e7eb'
                          "
                          rx="1"
                        />
                        <rect
                          x="12"
                          y="4"
                          width="3"
                          height="12"
                          :fill="
                            option.signal > 50
                              ? 'var(--p-primary-color)'
                              : '#e5e7eb'
                          "
                          rx="1"
                        />
                        <rect
                          x="17"
                          y="0"
                          width="3"
                          height="16"
                          :fill="
                            option.signal > 75
                              ? 'var(--p-primary-color)'
                              : '#e5e7eb'
                          "
                          rx="1"
                        />
                      </svg>
                      <span>{{ option.ssid }}</span>
                      <i
                        :class="{
                          'pi pi-lock': option.security.length > 0,
                          'pi pi-unlock': option.security.length === 0,
                        }"
                      ></i>
                    </div>
                  </template>
                </AutoComplete>
              </InputGroup>
              <InputGroup
                :class="{
                  invisible:
                    selectedWifiNetwork &&
                    selectedWifiNetwork.security.length === 0,
                }"
                class="mb-2 w-full"
              >
                <InputGroupAddon>
                  <i class="pi pi-lock"></i>
                </InputGroupAddon>
                <Password
                  v-model="installerStore.network.wlan.password"
                  toggleMask
                  class="w-full"
                  placeholder="Senha da rede Wi-Fi"
                  :feedback="false"
                  :disabled="
                    installerStore.network.type !== 'wlan' ||
                    (selectedWifiNetwork &&
                      selectedWifiNetwork.security.length === 0) ||
                    isConnecting
                  "
                />
              </InputGroup>
            </template>
            <div v-else>
              <p class="text-gray-500">
                Não há dispositivos de rede sem fio disponíveis.<br />
                Verifique se o adaptador Wi-Fi está conectado e habilitado.
              </p>
            </div>
          </div>
        </template>
        <div
          v-else
          class="flex items-center justify-center h-full text-gray-500"
        >
          <p>
            Nenhum dispositivo de rede encontrado. Não é possível continuar.
          </p>
        </div>
        <p class="color-red">{{ connectionError }}</p>
      </div>
    </div>
    <div class="flex items-center justify-between w-full border-t b-#ddd px-4 py-2">
      <Button severity="secondary" @click="router.back()"
        >Voltar</Button
      >
      <Button
        label="Proximo"
        :disabled="!isConnected && wifiDevice?.state === 'unavailable'"
        :loading="isConnecting"
        @click="nextStep"
      />
    </div>
  </div>
</template>
