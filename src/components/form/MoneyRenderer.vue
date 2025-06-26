<template>
  <input
    type="text"
    :value="displayValue"
    @input="handleInput"
    class="w-full border border-gray-300 rounded px-3 py-2 text-right"
    :placeholder="placeholder"
    inputmode="decimal"
  />
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  placeholder: String
})
const emit = defineEmits(['update:modelValue'])

const rawInput = ref('')

function toDisplayFormat(val) {
  if (!val && val !== 0) return ''

  const str = val.toString()
  let [whole, decimal] = str.split('.')

  whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  if (decimal) {
  decimal = decimal.padEnd(2, '0').slice(0, 2)
  return whole + ',' + decimal
} else {
  return whole + ',00'
}
}

function handleInput(e) {
  const el = e.target
  const oldRaw = rawInput.value
  const oldCursor = el.selectionStart

  let inputVal = el.value.replace(/[^\d.,]/g, '')

  const parts = inputVal.split(',')
  if (parts.length > 2) {
    inputVal = parts[0] + ',' + parts.slice(1).join('')
  }

  const backendVal = inputVal.replace(/\./g, '').replace(',', '.')

  const display = toDisplayFormat(backendVal)

  let newCursor = oldCursor

  const oldDotsBeforeCursor = (oldRaw.slice(0, oldCursor).match(/\./g) || []).length
  const newDotsBeforeCursor = (display.slice(0, newCursor).match(/\./g) || []).length

  const dotDiff = newDotsBeforeCursor - oldDotsBeforeCursor
  newCursor += dotDiff

  emit('update:modelValue', backendVal)

  requestAnimationFrame(() => {
    rawInput.value = display
    requestAnimationFrame(() => {
      try {
        el.setSelectionRange(newCursor, newCursor)
      } catch (err) {
        // Bazı edge-case'lerde sorun çıkarsa caret ayarlanmasın
      }
    })
  })
}

watch(
  () => props.modelValue,
  (val) => {
    if (val !== undefined && val !== null && val !== '') {
      rawInput.value = toDisplayFormat(val)
    } else {
      rawInput.value = ''
    }
  },
  { immediate: true }
)

const displayValue = computed(() => rawInput.value)
</script>

