<template>
  <input
    type="number"
    :value="modelValue"
    @input="onInput"
    class="w-full border border-gray-300 rounded px-3 py-2 no-spinner"
    :placeholder="placeholder"
  />
</template>

<script setup>
defineProps({
  modelValue: [Number, String, null],
  placeholder: String
})

function onInput(event) {
  const val = event.target.value
  const numVal = event.target.valueAsNumber
  if (val === '') {
    emitUpdate(null)
  } else if (isNaN(numVal)) {
    emitUpdate(null)
  } else {
    emitUpdate(numVal)
  }
}

function emitUpdate(value) {
  emit("update:modelValue", value)
}

const emit = defineEmits(["update:modelValue"])
</script>

<style>
input.no-spinner::-webkit-outer-spin-button,
input.no-spinner::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input.no-spinner[type=number] {
  -moz-appearance: textfield;
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}
</style>
