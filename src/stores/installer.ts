import { defineStore } from "pinia";
import { ref } from "vue";

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
      ssid: '',
      password: "",
    },
  });

  const installType = ref<"install" | 'try' | "reinstall">("install");
  const installDisk = ref("");
  const userForm = ref({
    fullName: "",
    login: "",
    hostname: "",
    password: "",
    requestPassword: true,
  });
  const timezoneForm = ref({
    timezone: "",
  });
  const additionalPackages = ref<any[]>([]);
  return {
    config,
    languageForm,
    network,
    installType,
    installDisk,
    userForm,
    timezoneForm,
    additionalPackages,
  };
});
