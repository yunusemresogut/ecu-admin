<template>
  <div>
    <LoadingComponent v-if="loading" />
    <div
      v-else-if="results.all_records_count === 0"
      class="flex flex-col items-center justify-center py-16 px-4 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-xl shadow-sm bg-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-12 w-12 text-gray-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 17v-2a4 4 0 014-4h3a4 4 0 014 4v2m-5-6a2 2 0 10-4 0m6 6H9m12 0H3"
        />
      </svg>
      <h2 class="text-lg font-semibold">Kayıt bulunamadı</h2>
      <p class="mt-2 text-sm text-gray-400">
        Şu anda görüntülenecek bir veri yok.
      </p>
    </div>

    <div v-else class="space-y-6 p-6 min-h-screen">
      <!-- Üst Başlık -->
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-semibold text-gray-800">
          {{ tableInfo.display_name }}
        </h2>
        <RouterLink
          v-if="settings?.showCreateButton"
          :to="props.tableInfo.create + '/yeni-olustur'"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-plus-icon lucide-plus"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Yeni
        </RouterLink>
      </div>

      <!-- Arama ve Filtre -->
      <div class="flex flex-col md:flex-row justify-between gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Ara..."
          class="w-full md:w-1/3 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          @input="handleSearch"
        />
        <!-- Buraya filtreler eklenebilir -->
      </div>

      <!-- Tablo -->
      <div class="overflow-auto border border-gray-200 rounded-lg shadow-sm">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100 text-left text-sm text-gray-700">
            <tr>
              <th
                v-for="col in visibleColumns"
                :key="col.name"
                class="px-6 py-3 font-bold cursor-pointer select-none text-nowrap"
                @click="sortBy(col.name)"
              >
                {{ col.display_name }}
                <span v-if="params.sorts[col.name] === true">▲</span>
                <span v-else-if="params.sorts[col.name] === false">▼</span>
              </th>
              <th
                v-if="settings?.showActions"
                class="px-6 py-3 font-bold text-center w-32"
              >
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 text-sm text-gray-800">
            <tr
              v-for="(item, i) in results.records"
              :key="i"
              class="hover:bg-gray-100 odd:bg-white even:bg-gray-50"
            >
              <td
                v-for="col in visibleColumns"
                :key="col.name"
                class="px-6 py-4 max-w-[300px] text-nowrap truncate"
              >
                <component
                  :is="getColumnComponent(col.gui_type_name)"
                  :value="item[col.name]"
                  :rowData="item"
                  :column="col.name"
                />
              </td>
              <td
                v-if="settings?.showActions"
                class="px-6 py-4 flex items-center justify-center gap-2"
              >
                <RouterLink
                  v-if="settings?.showEditButton"
                  :to="props.tableInfo.update + '/duzenle/' + item.id"
                  class="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md text-blue-500 hover:text-blue-700 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-square-pen-icon lucide-square-pen"
                  >
                    <path
                      d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                    />
                    <path
                      d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"
                    />
                  </svg>
                  Düzenle
                </RouterLink>

                <button
                  v-if="settings?.showDeleteButton"
                  @click="showConfirm = true"
                  class="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md text-rose-500 hover:text-rose-700 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-trash2-icon lucide-trash-2"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" x2="10" y1="11" y2="17" />
                    <line x1="14" x2="14" y1="11" y2="17" />
                  </svg>
                  Sil
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Alt Bar: Sayfalama -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-sm text-gray-700">
          Sayfa başına:
          <select
            v-model.number="params.limit"
            @change="getData"
            class="ml-2 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="px-3 py-1 border rounded text-sm text-gray-700 hover:bg-gray-100"
            :disabled="params.page === 1"
            @click="
              params.page--;
              getData();
            "
          >
            ‹
          </button>
          <span class="text-sm text-gray-600">
            {{ params.page }} / {{ totalPages }}
          </span>
          <button
            class="px-3 py-1 border rounded text-sm text-gray-700 hover:bg-gray-100"
            :disabled="params.page >= totalPages"
            @click="
              params.page++;
              getData();
            "
          >
            ›
          </button>
        </div>
      </div>
    </div>

    <ConfirmDialog
      :visible="showConfirm"
      message="Silmek istediğine emin misin?"
      @confirm="silOnayla"
      @cancel="showConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import tableComponents from "@/components/table";
import LoadingComponent from "./LoadingComponent.vue";
import ConfirmDialog from "./ConfirmDialog.vue";

const authStore = useAuthStore();

const props = defineProps(["tableInfo", "notUseColumn", "settings", "filters"]);

const results = ref({ all_records_count: 0, records: [], columns: [] });
const searchQuery = ref("");
const loading = ref(true);
const showConfirm = ref(false);

const params = ref({
  page: 1,
  limit: 10,
  sorts: {},
  filters: {},
});

const visibleColumns = computed(() => {
  console.log(results.value.columns);
  return results.value.columns;
});

const totalPages = computed(() => {
  return Math.ceil(results.value.all_records_count / params.value.limit);
});

const getData = async () => {
  loading.value = true;
  params.value.column_array_id =
    authStore.userData.auths.tables[props.tableInfo.tableName].lists[0];
  params.value.column_array_id_query =
    authStore.userData.auths.tables[props.tableInfo.tableName]?.lists?.[0];
  if (props.filters) {
    params.value.filters = props.filters;
  }

  try {
    const response = await axios.post(
      `${authStore.token}/tables/${props.tableInfo.tableName}`,
      {
        params: JSON.stringify(params.value),
      }
    );
    results.value = response.data.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const sortBy = (field) => {
  const currentSort = params.value.sorts[field];
  if (currentSort === undefined) {
    params.value.sorts = { [field]: true };
  } else if (currentSort === true) {
    params.value.sorts = { [field]: false };
  } else {
    delete params.value.sorts[field];
  }
  getData();
};

const handleSearch = () => {
  params.value.filters.query = searchQuery.value;
  params.value.page = 1;
  getData();
};

onMounted(() => {
  getData();
});

const getColumnComponent = (type) => {
  switch (type) {
    case "string":
      return tableComponents.StringRenderer;
    case "boolean":
    case "boolean:fastchange":
      return tableComponents.BooleanTagRenderer;
    case "numeric":
      return tableComponents.InputNumberRenderer;
    case "select":
    case "select:static":
      return tableComponents.SelectRenderer;
    case "date":
      return tableComponents.DateRenderer;
    case "datetime":
      return tableComponents.DateTimeRenderer;
    case "files":
      return tableComponents.FilesRenderer;
    case "text":
      return tableComponents.HtmlRenderer;
    case "multiselect":
    case "multiselect:static":
      return tableComponents.MultiSelectRenderer;
    case "json":
      return tableComponents.JsonRenderer;
    case "money:tl":
      return tableComponents.MoneyRenderer;
    default:
      return tableComponents[type] || tableComponents.DefaultRenderer || "span";
  }
};

const silOnayla = () => {
  // API çağrısı, işlem vs.
  showConfirm.value = false;
};
</script>

<style scoped>
/* Gerekirse özel scrollbar veya responsive style eklersin */
</style>
