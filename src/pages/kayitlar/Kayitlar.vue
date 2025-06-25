<template>
  <div class="w-full mx-auto px-4 py-6">
    <!-- Tab Başlıkları -->
    <div class="flex border-b border-gray-300 mb-4 space-x-2">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        @click="selectedTab = index"
        :class="[
          'px-4 py-2 text-sm font-medium rounded-t-md transition',
          selectedTab === index
            ? 'bg-white border-x border-t border-gray-300 text-blue-600'
            : 'bg-gray-100 text-gray-500 hover:text-blue-500'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- İçerikler -->
    <div class="border border-gray-300 rounded-md bg-white p-4">
      <component
        :is="tabs[selectedTab].component"
        :key="tabs[selectedTab].key"
        v-if="tabs[selectedTab].loaded"
        :tableInfo="tabs[selectedTab].tableInfo"
        :settings="settings"
        :filters="tabs[selectedTab].filters"
      />

      <!-- Lazy yükleme kontrolü -->
      <div v-else class="text-sm text-gray-400">Veri hazırlanıyor...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, watchEffect } from "vue";
import TableComponent from "@/components/TableComponent.vue";

// Ortak ayarlar
const settings = ref({
  showCreateButton: true,
  showActions: true,
  showEditButton: true,
  showDeleteButton: true,
});

// Sekmelerin bilgileri
const tabs = ref([
  {
    label: "Tümü",
    key: "1",
    component: shallowRef(TableComponent),
    loaded: false,
    tableInfo: {
      tableName: "kayitlar",
      create: "kayitlar",
      display_name: "Tüm Kayıtlar",
    },
  },
  {
    label: "İşlemde",
    key: "2",
    component: shallowRef(TableComponent),
    loaded: false,
    tableInfo: {
      tableName: "kayitlar",
      create: "kayitlar",
      display_name: "İşlemdeki Kayıtlar",
    },
    filters: {
      kayit_durum_id: {
        type: 1,
        guiType: "multiselect",
        filter: [2],
      },
    },
  },
  {
    label: "Bekleyen",
    key: "3",
    component: shallowRef(TableComponent),
    loaded: false,
    tableInfo: {
      tableName: "kayitlar",
      create: "kayitlar",
      display_name: "Onay Bekleyen Kayıtlar",
    },
    filters: {
      kayit_durum_id: {
        type: 1,
        guiType: "multiselect",
        filter: [1],
      },
    },
  },
]);

const selectedTab = ref(0);

// Tıklanınca sadece o tab'ın içeriği render edilsin
watchEffect(() => {
  if (!tabs.value[selectedTab.value].loaded) {
    tabs.value[selectedTab.value].loaded = true;
  }
});
</script>
