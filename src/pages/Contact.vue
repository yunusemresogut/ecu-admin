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
  tableName: "iletisim",
  display_name: "İletişim",
});

const settings = ref({
  showCreateButton: false,
  showActions: false,
  showEditButton: false,
})
</script>