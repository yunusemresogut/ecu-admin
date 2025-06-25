<template>
  <input
    type="text"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    class="w-full border border-gray-300 rounded px-3 py-2"
    :placeholder="placeholder"
  />
</template>

<script setup>
defineProps({
  modelValue: String,
  placeholder: String
})
defineEmits(["update:modelValue"])
</script>
