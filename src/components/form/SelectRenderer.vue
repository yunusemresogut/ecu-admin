<template>
  <select
    v-model="internalValue"
    class="w-full border border-gray-300 rounded px-3 py-2"
  >
    <option value="">Seçiniz</option>
    <option v-for="(option, i) in options" :key="i" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  options: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(["update:modelValue"])

const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val)
})
</script>
