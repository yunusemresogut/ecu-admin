<template>
  <UpdateComponent
    :tableName="tableName"
  />
</template>

<script setup>
import { ref } from "vue";
import UpdateComponent from "@/components/DynamicUpdateForm.vue";

const tableName = ref("arac_marka_modeli");
</script>