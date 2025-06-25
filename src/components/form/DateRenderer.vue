<template>
  <input
    ref="inputRef"
    type="text"
    :value="displayValue"
    @input="onInput"
    placeholder="gg.aa.yyyy"
    maxlength="10"
    inputmode="numeric"
    class="w-full border border-gray-300 rounded px-3 py-2"
    autocomplete="off"
  />
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: String // 'yyyy-mm-dd'
})
const emit = defineEmits(['update:modelValue'])

const inputRef = ref(null)
const displayValue = ref('')

watch(
  () => props.modelValue,
  (val) => {
    displayValue.value = isoToDisplay(val)
  },
  { immediate: true }
)

function isoToDisplay(iso) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return ''
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

function displayToIso(display) {
  const parts = display.split('.')
  if (parts.length !== 3) return ''
  const [d, m, y] = parts
  if (d.length !== 2 || m.length !== 2 || y.length !== 4) return ''
  return `${y}-${m}-${d}`
}

function onInput(e) {
  let val = e.target.value

  // Sadece rakam ve nokta kalacak
  val = val.replace(/[^\d.]/g, '')

  // Noktaları doğru konuma otomatik ekle
  if (val.length > 2 && val[2] !== '.') val = val.slice(0, 2) + '.' + val.slice(2)
  if (val.length > 5 && val[5] !== '.') val = val.slice(0, 5) + '.' + val.slice(5)
  if (val.length > 10) val = val.slice(0, 10)

  // Bölümleri al
  const parts = val.split('.')

  // Gün kontrolü
  if (parts[0]) {
    let d = parts[0].replace(/\D/g, '')
    if (d.length === 1) {
      if (d !== '0' && d > '3') d = '3'
    } else if (d.length === 2) {
      let dayNum = parseInt(d)
      if (dayNum < 1) d = '01'
      else if (dayNum > 31) d = '31'
    }
    parts[0] = d
  }

  // Ay kontrolü
  if (parts[1]) {
    let m = parts[1].replace(/\D/g, '')
    if (m.length === 1) {
      if (m !== '0' && m > '1') m = '1'
    } else if (m.length === 2) {
      let monNum = parseInt(m)
      if (monNum < 1) m = '01'
      else if (monNum > 12) m = '12'
    }
    parts[1] = m
  }

  // Yıl kontrol
  if (parts[2]) {
    let y = parts[2].replace(/\D/g, '')
    if (y.length > 4) y = y.slice(0, 4)
    parts[2] = y
  }

  // Birleştir ve göster
  let newVal = parts.filter(Boolean).join('.')
  displayValue.value = newVal

  // Model güncelle
  if (
    parts.length === 3 &&
    parts[0].length === 2 &&
    parts[1].length === 2 &&
    parts[2].length === 4
  ) {
    emit('update:modelValue', displayToIso(newVal))
  } else {
    emit('update:modelValue', '')
  }

  // İmleci uygun yere taşı (noktalardan sonra 1 sağa)
  nextTick(() => {
    const input = inputRef.value
    if (!input) return
    let pos = input.selectionStart
    if (pos === 3 || pos === 6) pos++
    input.setSelectionRange(pos, pos)
  })
}
</script>
