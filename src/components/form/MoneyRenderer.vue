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

const rawInput = ref('') // Kullanıcının yazdığı ham input

// Model value geldikçe inputu güncelle
watch(() => props.modelValue, (val) => {
  if (val === undefined || val === null || val === '') {
    rawInput.value = ''
    return
  }
  const strVal = val.toString()

  // Backend'den gelen: 123456789.99
  // Bunu kullanıcıya formatlı gösterim için çevir
  rawInput.value = toDisplayFormat(strVal)
})

// Backend tarzı sayıyı (nokta ondalık, virgül yok) -> "123.456.789,99" formata çevir
function toDisplayFormat(val) {
  if (!val) return ''

  let [whole, decimal] = val.split('.')

  // Binlik ayraç ekle
  whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  if (decimal) {
    decimal = decimal.slice(0, 2)
    return whole + ',' + decimal
  } else {
    return whole
  }
}

// Kullanıcının yazdığı inputu işleyip emit et
function handleInput(e) {
  let val = e.target.value

  // Kullanıcıdan sadece rakam, nokta, virgül kabul et
  val = val.replace(/[^\d.,]/g, '')

  // Virgül sadece 1 tane olabilir, fazlasını kaldır
  const parts = val.split(',')
  if (parts.length > 2) {
    val = parts[0] + ',' + parts.slice(1).join('')
  }

  // Şimdi bu val'i backend için düz sayıya çevirelim:
  // 1) Noktaları kaldır
  // 2) Virgülü noktaya çevir (ondalık ayraç)
  let backendVal = val.replace(/\./g, '').replace(',', '.')

  // Backend'e sayısal string gönder (ör: "123456789.99")
  emit('update:modelValue', backendVal)

  // Kullanıcıya gösterim için formatlayıp göster
  rawInput.value = toDisplayFormat(backendVal)
}

// Gösterilecek değer, rawInput değişince güncellenir
const displayValue = computed(() => rawInput.value)
</script>
