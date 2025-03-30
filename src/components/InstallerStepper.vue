<script setup lang="ts">

const router = useRouter();
const nextLink = ref('');

function next() {
  if (nextLink.value) {
    history.value.push(router.currentRoute.value.fullPath);
    router.push(nextLink.value);
    nextLink.value = '';
  }
}

provide("stepper", {
  nextLink,
});

const history = ref<string[]>([]);
</script>
<template>
  <div class="flex flex-col stepper w-full h-full overflow-auto">
    <slot></slot>
    <div class="flex pa-2 footer sticky bottom-0 bg-white">
      <button v-if="history.length > 0" class="btn-outline" @click="router.replace(history.pop()!)">Voltar</button>
      <div class="flex-1"></div>
      <div class="flex items-center justify-center gap-1 steps absolute top-50% left-50% translate--50%">
        <span></span>
        <span></span>
        <span class="current"></span>
        <span></span>
        <span></span>
      </div>
      <button v-if="nextLink" @click="next">Continuar</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.stepper {
  &>*:first-child {
    @apply: flex-1;
  }
}

.steps {
  &>span {
    @apply: inline-block bg-gray-300 rounded-full w-2 h-2;

    &.current {
      background: var(--color-accent);
    }
  }
}

.footer {
  border-top: 1px solid var(--color-surface);
}
</style>