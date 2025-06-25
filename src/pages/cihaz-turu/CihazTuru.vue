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
  tableName: "cihaz_türü",
  create: "cihaz-turu",
  display_name: "Cihaz Türü",
});

const settings = ref({
  showCreateButton: true,
  showActions: true,
  showEditButton: true,
})
</script>