<template>
  <div class="flex gap-4 max-w-1024px mx-auto md:flex-row flex-col items-center">
    <div class="min-h-150px md:(flex-1 min-w-240px max-w-320px) flex items-center justify-center">
      <img src="/artwork/logo-standard.png" alt="Logo" class="h-24 max-w-full object-contain block mx-auto mb-8" />
    </div>
    <div class="flex-1 flex flex-col md:justify-center pa-4 overflow-auto">
      <slot></slot>
    </div>
  </div>
</template>