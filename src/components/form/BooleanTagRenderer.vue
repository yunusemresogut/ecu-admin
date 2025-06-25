<template>
  <label class="inline-flex items-center space-x-2 cursor-pointer border-gray-300">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
      class="form-checkbox h-5 w-5 text-blue-600"
    />
    <span>{{ modelValue ? 'Evet' : 'Hayır' }}</span>
  </label>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue'])
</script>
