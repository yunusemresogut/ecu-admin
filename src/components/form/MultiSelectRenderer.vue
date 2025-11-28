<template>
  <Multiselect
    v-model="internalValue"
    :options="options"
    :multiple="true"
    :close-on-select="false"
    :track-by="'value'"
    :label="'label'"
    placeholder="Seçin"
  />
</template>

<script setup>
import { ref, watch } from "vue"
import Multiselect from "vue-multiselect"
import "vue-multiselect/dist/vue-multiselect.min.css"

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

const internalValue = ref([])

watch(
  () => props.modelValue,
  (newVal) => {
    const valSet = new Set(newVal.map(Number))
    internalValue.value = props.options.filter(opt => valSet.has(Number(opt.value)))
  },
  { immediate: true }
)

watch(
  internalValue,
  (val, oldVal) => {
    const onlyValues = val.map((item) => Number(item.value))
    const oldValues = oldVal?.map((item) => Number(item.value)) || []

    if (JSON.stringify(onlyValues) !== JSON.stringify(oldValues)) {
      emit("update:modelValue", onlyValues)
    }
  },
  { deep: false }
)
</script>
