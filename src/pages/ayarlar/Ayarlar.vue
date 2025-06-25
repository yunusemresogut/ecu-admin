<template>
  <TableComponent
    :tableInfo="tableInfo"
    :settings="settings"
    :filters="filters"
  />
</template>

<script setup>
import { ref } from "vue";
import TableComponent from "@/components/TableComponent.vue";

const tableInfo = ref({
  tableName: "settings",
  create: "Ayarlar",
  display_name: "Ayarlar",
});

const settings = ref({
  showActions: true,
})
</script>