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
  tableName: "kullanici_hareketleri",
  create: "hesap-hareketleri",
  display_name: "Hesap Hareketleri",
});

const settings = ref({
  showCreateButton: true,
  showActions: true,
  showEditButton: true,
})
</script>