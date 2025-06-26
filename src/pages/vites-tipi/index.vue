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
  tableName: "vites_tip",
  create: "vites-tipi",
  update: "vites-tipi",
  display_name: "Vites Tipi",
});

const settings = ref({
  showCreateButton: true,
  showActions: true,
  showEditButton: true,
})
</script>