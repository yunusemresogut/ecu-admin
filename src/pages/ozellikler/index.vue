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
  tableName: "ozellikler",
  create: "ozellikler",
  update: "ozellikler",
  display_name: "Özellikler",
});

const settings = ref({
  showCreateButton: true,
  showActions: true,
  showEditButton: true,
  showDeleteButton: true,
})
</script>