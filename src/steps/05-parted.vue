<script setup lang="ts">

interface SubVolume {
  name: string;
  mount?: string | null;
}

interface Partition {
  name: string;
  size: number;
  type: string;
  mount?: string | null;
  format: string;
  sub_volumes?: SubVolume[]
}

interface Disk {
  device: string;
  partitions: Partition[];
}

const disks = ref<Disk[]>([
  {
    device: "/dev/sda",
    partitions: [
      {
        name: "/dev/sda1",
        size: 1 * 1024 * 1024 * 1024,
        type: "EFI",
        mount: "/boot/efi",
        format: "fat32",
      },
      {
        name: "/dev/sda2",
        size: 100 * 1024 * 1024 * 1024,
        type: "Linux Filesystem",
        mount: null,
        format: "btrfs",
        sub_volumes: [
          {
            name: "@",
            mount: "/",
          },
          {
            name: "@home",
            mount: "/home",
          },
        ],
      },
    ],
  },
  {
    device: "/dev/sdb",
    partitions: [
      {
        name: "/dev/sdb1",
        size: 1 * 1024 * 1024 * 1024,
        type: "EFI",
        mount: "/boot/efi",
        format: "fat32",
      },
      {
        name: "/dev/sdb2",
        size: 100 * 1024 * 1024 * 1024,
        type: "Linux Filesystem",
        mount: null,
        format: "ext4",
      },
    ]
  }
])

const selectedDisk = ref<Disk>();
const selectedPartition = ref<Partition>();

watchEffect(() => {
  if (selectedPartition.value?.format === 'btrfs') {
    selectedPartition.value.sub_volumes ??= []
  }
})

watch(disks, (newDisks) => {
  selectedDisk.value = newDisks[0];
}, { immediate: true });

function formatStorage(byteSize: number) {
  const UNITS = ["byte", "kilobyte", "megabyte", "gigabyte", "terabyte", 'petabyte'];

  const i = byteSize == 0 ? 0 : Math.floor(Math.log(byteSize) / Math.log(1024));
  const value = byteSize / Math.pow(1024, i);
  const unit = UNITS[i];

  return new Intl.NumberFormat("pt-BR", {
    style: "unit",
    unit: unit,
    unitDisplay: "short",
  }).format(value);
}
</script>
<template>
  <div class="pa-4 h-full">
    <div class="flex gap-2 h-full">
      <div class="flex-1 max-w-180px">
        <h1>Disco</h1>
        <ul>
          <li v-for="disk of disks" :key="disk.device" class="py-1 cursor-pointer disk" :class="{
            'active': selectedDisk?.device === disk.device,
          }" @click="selectedDisk = disk, selectedPartition = disk.partitions[0]">{{ disk.device }}</li>
        </ul>
      </div>
      <div class="flex-1 flex flex-col">
        <div class="h-16 flex overflow-hidden bg-gray-200 rounded-lg mb-2 partitions">
          <div v-for="partition in selectedDisk?.partitions" :key="partition.name" class="text-center pa-2"
            @click="selectedPartition = partition" :class="{
              'active': selectedPartition?.name === partition.name,
            }">
            <p>{{ partition.name }}</p>
            <p>{{ formatStorage(partition.size) }}</p>
          </div>
        </div>
        <div v-if="selectedPartition" class="flex-1">
          <label class="block mb-2">
            <p>Ponto de montagem</p>
            <input type="text" v-model="selectedPartition.mount" class="w-full" list="mounts" />
          </label>

          <label class="mb-2">
            <p>Formato</p>
            <select v-model="selectedPartition.format" class="w-full">
              <option selected disabled :value="null">Selecione...</option>
              <option value="ext4">ext4</option>
              <option value="btrfs">btrfs</option>
            </select>
          </label>

          <table v-if="selectedPartition?.format === 'btrfs'" class="w-full mt-2">
            <thead>
              <tr>
                <th class="text-left">Sub-volume</th>
                <th class="text-left">Montagem</th>
                <th class="text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="subVolume in selectedPartition?.sub_volumes">
                <td>
                  <input type="text" v-model="subVolume.name" class="w-full" list="subvolumes" />
                </td>
                <td>
                  <input type="text" v-model="subVolume.mount" class="w-full" list="mounts" />
                </td>
                <td>
                  <button class="btn"
                    @click="selectedPartition.sub_volumes?.splice(selectedPartition.sub_volumes.indexOf(subVolume), 1)">Remover</button>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2">
                  <button class="btn"
                    @click="selectedPartition.sub_volumes?.push({ name: '', mount: '' })">Adicionar</button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <datalist id="mounts">
      <option value="/"></option>
      <option value="/home"></option>
      <option value="/boot"></option>
    </datalist>

    <datalist id="subvolumes">
      <option value="@"></option>
      <option value="@home"></option>
      <option value="@snapshots"></option>
    </datalist>
  </div>
</template>

<style scoped lang="scss">
.disk {
  @apply: py-2 px-4 mb-1 rounded-lg cursor-pointer;

  &:hover {
    background: var(--color-surface);
  }

  &.active {
    background: var(--color-accent);
    color: white;
  }
}

.partitions {
  &>div {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: var(--color-primary);

    &+div {
      background: var(--color-secondary);
    }

    &.active {
      color: white;
      border: 2px solid black;
    }
  }
}
</style>