import { Channel, invoke } from "@tauri-apps/api/core";
import { readonly, ref } from "vue";
import { execCommand } from "../utils/sh";

export interface Task {
  title: string;
  commands: string[];
}

export interface InstallConfig {
  distro_name: string;
  device: string;
  type: "install" | "reinstall";
  bootloader: "grub" | "systemd-boot";
  locale: string;
  hostname?: string;
  packages?: string[];
  packages_aur?: string[];
  packages_flatpak?: string[];
}

export class InstallerService {
  static #tasks: Task[] = [];
  static #totalCommands = ref(0);
  static #totalRunned = ref(0);
  static #currentTask = ref<Task>();
  static #channel = new Channel<any>((data) => {
    if (data.StdOut) {
      this.logs.value += data.StdOut + "\n";
    }
    if (data.StdErr) {
      this.logs.value += data.StdErr + "\n";
    }
  });
  static logs = ref<string>("");

  static addTask(task: Task) {
    this.#tasks.push(task);
    this.#totalCommands.value += task.commands.length;
  }

  static async runAll() {
    this.logs.value = "";

    while (this.#tasks.length > 0) {
      const task = this.#tasks.shift();
      if (!task) {
        continue;
      }
      this.#currentTask.value = task;
      for (const command of task.commands) {
        this.#totalRunned.value++;
        await this.#execute(command);
      }
      this.#currentTask.value = undefined;
    }

    if (this.logs.value) {
      await execCommand(`echo "${this.logs.value}" >> ~/install.log`);
    }
  }

  static async #execute(command: string) {
    this.logs.value += `\n> ${command}\n`;
    const exitCode = await invoke("exec_sh", {
      command: command,
      channel: this.#channel,
    });

    if (exitCode !== 0) {
      this.logs.value += `\nErro: o comando falhou com o código de saída (${exitCode})\n`;
      throw new Error(`Command failed: ${command} (exit code: ${exitCode})`);
    }
  }

  static get totalCommands() {
    return readonly(this.#totalCommands);
  }

  static get totalRunned() {
    return readonly(this.#totalRunned);
  }

  static get currentTask() {
    return readonly(this.#currentTask);
  }

  static createTasks(config: InstallConfig) {
    this.addTask({
      title: "Escolhendo os melhores espelhos...",
      commands: [
        `sudo reflector --country "Brazil" --protocol https --sort age --save /etc/pacman.d/mirrorlist`,
      ],
    });
    this.addTask({
      title: "Inicializando chaveiro...",
      commands: [`pacman-key --init`, `pacman-key --populate archlinux`],
    });
    this.addTask({
      title: "Atualizando os repositórios...",
      commands: [`pacman -Sy --noconfirm`],
    });
    {
      const commands: string[] = [
        `umount -f ${config.device} || true`,
        `umount -f ${config.device}1 || true`,
        `umount -f ${config.device}2 || true`,
        `umount -f -R /mnt || true`,
      ];
      if (config.type === "install") {
        commands.push(
          `parted ${config.device} --script mklabel gpt`,
          `parted ${config.device} --script mkpart primary fat32 1MiB 1000MiB`,
          `parted ${config.device} --script set 1 esp on`,
          `parted ${config.device} --script mkpart primary ext4 1000MiB 100%`,
          `mkfs.btrfs -f ${config.device}2`,
          `mount ${config.device}2 /mnt`,
          `btrfs subvolume create /mnt/@`,
          `btrfs subvolume create /mnt/@home`,
          `umount /mnt`
        );
      }
      commands.push(
        `mkfs.fat -F32 "${config.device}1"`,
        `mount -o subvol=@,compress=zstd,noatime,ssd,discard=async,space_cache=v2,x-gvfs-show,x-gvfs-name=${encodeURIComponent(
          config.distro_name
        )} "${config.device}2" /mnt`,
        `rm -rf /mnt/*`,
        `mount --mkdir -o subvol=@home,rw,noatime,compress=zstd,ssd,discard=async "${config.device}2" /mnt/home`,
        `mount --mkdir "${config.device}1" /mnt/boot`
      );
      this.addTask({
        title: `Particionando o disco ${config.device}...`,
        commands,
      });
    }

    {
      const commands: string[] = [
        `sed -i 's/^#${config.locale} UTF-8/${config.locale} UTF-8/' /etc/locale.gen`,
        `locale-gen`,
        `echo "LANG=${config.locale}" > /etc/locale.conf`,
        `export LANG="${config.locale}"`,
        `timedatectl set-timezone America/Sao_Paulo`,
        `hwclock --systohc --utc`,
        `sed -i 's/^#ParallelDownloads = 5/ParallelDownloads = 8/' /etc/pacman.conf`,
      ];
      this.addTask({
        title: `Preparando instalação...`,
        commands,
      });
    }

    {
      let packages = [
        "base",
        "base-devel",
        "linux",
        "linux-firmware",
        "curl",
        "wget",
        "nano",
        "btrfs-progs",
        "networkmanager",
        "efibootmgr",
        "git",
        "sudo",
        "vim",
        "openssh",
        "openssl",
        "zsh",
        "cronie",
        "reflector",
        "gdm",
        "gnome-shell",
        "gnome-initial-setup",
        "gnome-backgrounds",
        "gnome-console",
        "gnome-control-center",
        "gnome-disk-utility",
        "gnome-menus",
        "gnome-shell",
        "gnome-text-editor",
        "gnome-shell-extensions",
        "gnome-software",
        "gnome-browser-connector",
        "gnome-calculator",
        "gnome-characters",
        "gnome-user-share",
        "gnome-remote-desktop",
        "gnome-mimeapps",
        "gnome-system-monitor",
        "gnome-tweaks",
        "gnome-keyring",
        "flatpak",
        ...(config.packages ?? []),
      ];

      if (config.bootloader === "grub") {
        packages.push("grub", "efibootmgr", "os-prober");
      }

      const commands: string[] = [
        `sudo pacstrap -K /mnt ${packages.join(" ")}`,
        `sudo genfstab -U /mnt >>/mnt/etc/fstab`,
      ];

      if (config.hostname) {
        commands.push(`echo "${config.hostname}" >/mnt/etc/hostname`);
      }

      commands.push(
        `echo "KEYMAP=br-abnt2" >/mnt/etc/vconsole.conf`,
        `cp /etc/locale.conf /mnt/etc/locale.conf`,
        `cp /etc/locale.gen /mnt/etc/locale.gen`
      );
      this.addTask({
        title: `Instalando a base do sistema...`,
        commands,
      });
    }

    this.addTask({
      title: `Gerando arquivos de idioma...`,
      commands: [`arch-chroot /mnt locale-gen`],
    });

    this.addTask({
      title: `Configurando sudo...`,
      commands: [`echo "%sudo ALL=(ALL) NOPASSWD: ALL" >>/mnt/etc/sudoers`],
    });
    if (config.packages_aur?.length) {
      this.addTask({
        title: `Preparando ambiente AUR...`,
        commands: [
          `arch-chroot /mnt sh -c "useradd -m -s /bin/zsh aur && passwd -d aur && echo 'aur ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers"`,
          "arch-chroot /mnt pacman -Sy --noconfirm",
        ],
      });
      for (const pkg of config.packages_aur ?? []) {
        const commands: string[] = [
          `arch-chroot /mnt sh -c "su - aur -c 'git clone --depth=1 https://aur.archlinux.org/${pkg}.git ~/${pkg}'"`,
          `arch-chroot /mnt sh -c "su - aur -c 'cd ~/${pkg} && makepkg -s --noconfirm'"`,
          `arch-chroot /mnt sh -c "su - aur -c 'mv ~/${pkg}/*.pkg.tar.zst ~/'"`,
          `arch-chroot /mnt sh -c "su - aur -c 'rm -rf ~/${pkg}'"`,
        ];
        this.addTask({
          title: `Compilando pacote AUR (${pkg})...`,
          commands,
        });
      }
      this.addTask({
        title: `Instalando pacotes AUR...`,
        commands: [
          `arch-chroot /mnt sh -c "pacman --noconfirm -U /home/aur/*.pkg.tar.zst"`,
          `arch-chroot /mnt sh -c "userdel -r aur"`,
          `arch-chroot /mnt sh -c "sed -i '/^aur ALL=(ALL) NOPASSWD: ALL$/d' /etc/sudoers"`,
        ],
      });
    }

    if (config.packages_flatpak?.length) {
      this.addTask({
        title: `Instalando pacotes Flatpak...`,
        commands: [
          `arch-chroot /mnt sh -c "flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo"`,
          `arch-chroot /mnt sh -c "flatpak install -y flathub ${config.packages_flatpak.join(" ")}"`,
        ],
      });
    }

    this.addTask({
      title: `Habilitando serviços...`,
      commands: [
        `arch-chroot /mnt systemctl enable NetworkManager || true`,
        `arch-chroot /mnt systemctl enable gdm || true`,
        `arch-chroot /mnt systemctl enable chronyd || true`,
        `arch-chroot /mnt systemctl enable reflector.service || true`,
        `arch-chroot /mnt systemctl enable reflector.timer || true`,
      ],
    });
    if (config.bootloader === "grub") {
      this.addTask({
        title: `Configurando o GRUB...`,
        commands: [
          `arch-chroot /mnt grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB --recheck`,
          `arch-chroot /mnt grub-mkconfig -o /boot/grub/grub.cfg`,
        ],
      });
    } else if (config.bootloader === "systemd-boot") {
      this.addTask({
        title: `Configurando o  systemd-boot...`,
        commands: [
          `arch-chroot /mnt bootctl install`,
          `mkdir -p /mnt/boot/loader/entries`,
          `PARTUUID=$(blkid -s PARTUUID -o value "${config.device}2")

cat <<EOF >/mnt/boot/loader/entries/arch.conf
title Arch Linux
linux /vmlinuz-linux
initrd /initramfs-linux.img
options root=PARTUUID=$PARTUUID rw rootflags=subvol=@,compress=zstd,noatime,ssd,discard=async,space_cache=v2,x-gvfs-show,x-gvfs-name=${encodeURIComponent(
            config.distro_name
          )}
EOF || true`,
        ],
      });
    }
  }
}
