import { defineStore } from "pinia";
import { ref } from "vue";

export let isInstalling = ref(false);

export const useInstallerStore = defineStore("installer", () => {
  const config = ref<Record<string, any>>({});
  const languageForm = ref({
    lang: "pt_BR.UTF-8",
    keymap: {
      graphical: "br",
      console: "br-abnt2",
    },
  });

  const network = ref({
    type: "wired",
    wlan: {
      ssid: "",
      password: "",
    },
  });

  const installType = ref<"install" | "try" | "reinstall">("install");
  const installDisk = ref("");
  const additionalPackages = ref<any[]>([]);
  return {
    config,
    languageForm,
    network,
    installType,
    installDisk,
    additionalPackages,
  };
});
