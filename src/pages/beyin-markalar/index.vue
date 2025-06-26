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
  tableName: "beyin_markalar",
  create: "beyin-markalar",
  update: "beyin-markalar",
  display_name: "Beyin Markalar",
});

const settings = ref({
  showCreateButton: true,
  showActions: true,
  showEditButton: true,
})
</script>