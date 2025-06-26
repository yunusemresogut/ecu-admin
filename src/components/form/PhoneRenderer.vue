<template>
  <input
    ref="inputRef"
    type="tel"
    :value="formattedValue"
    @focus="onFocus"
    @input="onInput"
    class="w-full border border-gray-300 rounded px-3 py-2"
    maxlength="15"
    placeholder="0 ___ ___ __ __"
    inputmode="tel"
  />
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue'

const props = defineProps({
  modelValue: String
})
const emit = defineEmits(['update:modelValue'])

const inputRef = ref(null)
const rawValue = ref('')

watch(() => props.modelValue, (val) => {
  if (!val) {
    rawValue.value = ''
  } else {
    rawValue.value = val.replace(/\D/g, '')
  }
}, { immediate: true })

function formatNumber(value) {
  if (!value) return ''
  let v = value

  if (!v.startsWith('0')) v = '0' + v
  v = v.slice(0, 11)

  const part1 = v.slice(0,1)
  const part2 = v.slice(1,4)
  const part3 = v.slice(4,7)
  const part4 = v.slice(7,9)
  const part5 = v.slice(9,11)

  let formatted = part1
  if(part2) formatted += ' ' + part2
  if(part3) formatted += ' ' + part3
  if(part4) formatted += ' ' + part4
  if(part5) formatted += ' ' + part5

  return formatted
}

const formattedValue = computed(() => formatNumber(rawValue.value))

function onFocus() {
  if (rawValue.value === '') {
    rawValue.value = '0'
    emit('update:modelValue', formatNumber('0'))
  }
}

function onInput(e) {
  let val = e.target.value

  val = val.replace(/\D/g, '')

  if (val !== '' && !val.startsWith('0')) val = '0' + val

  val = val.slice(0, 11)

  rawValue.value = val

  emit('update:modelValue', formatNumber(val))

  nextTick(() => {
    const input = inputRef.value
    if (!input) return

    let pos = input.selectionStart
    if ([2,6,10,13].includes(pos)) {
      pos++
      input.setSelectionRange(pos, pos)
    }
  })
}

</script>
