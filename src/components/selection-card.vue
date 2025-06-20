<script setup lang="ts">
import { includes, isEqual } from "lodash-es";
import Checkbox from "primevue/checkbox";
import RadioButton from "primevue/radiobutton";
import { computed, useId } from "vue";

const inputId = useId();

const props = defineProps<{
  disabled?: boolean;
  value: any;
}>();

const model = defineModel<any>();

const isSelected = computed(() => {
  if (isMultiple.value) {
    return includes(model.value, props.value);
  }
  return isEqual(props.value, model.value);
});
const isMultiple = computed(() => Array.isArray(model.value));
</script>

<template>
  <label :for="inputId" :class="{ 'card--selected': isSelected }" class="card">
    <Checkbox
      v-if="isMultiple"
      v-model="model"
      :input-id="inputId"
      :value="value"
      :disabled="disabled"
    ></Checkbox>
    <RadioButton
      v-else
      v-model="model"
      :input-id="inputId"
      :value="value"
      :disabled="disabled"
    />

    <div class="flex-1">
      <slot />
    </div>
  </label>
</template>

<style lang="css">
.card {
  --at-apply: "cursor-pointer flex gap-2 pa-2 rounded-md pr-8!";
  border: 1px solid #ddd;
}
.card--selected {
  border-color: var(--p-primary-color);
  background-color: oklch(from var(--p-primary-color) l c h / 10%);
}
</style>
