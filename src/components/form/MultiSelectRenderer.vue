<template>
  <select
    multiple
    v-model="internalValue"
    @change="onChange"
    class="w-full border border-gray-300 rounded px-3 py-2"
  >
    <option
      v-for="(option, i) in options"
      :key="i"
      :value="option.value ?? option"
    >
      {{ option.label ?? option }}
    </option>
  </select>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
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

const onChange = (e) => {
  const selected = Array.from(e.target.selectedOptions).map(opt => opt.value)
  emit("update:modelValue", selected)
}
</script>
