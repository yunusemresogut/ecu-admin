<template>
  <FormComponent
    :tableName="tableName"
  />
</template>

<script setup>
import { ref } from "vue";
import FormComponent from "@/components/DynamicCreateForm.vue";

const tableName = ref("arac_marka_modeli");
</script>