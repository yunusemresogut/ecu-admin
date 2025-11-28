<template>
  <div>
    <LoadingComponent v-if="loading" />
    <div v-else class="space-y-6 p-6 min-h-screen">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-semibold text-gray-800">
          {{ tableInfo.display_name }}
        </h2>
        <RouterLink
          v-if="settings?.showCreateButton"
          :to="props.tableInfo.create + '/yeni-olustur'"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Plus />
          Yeni
        </RouterLink>
      </div>
      <div class="flex flex-col md:flex-row justify-between gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Ara..."
          class="w-full md:w-1/3 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          @input="handleSearch"
        />
        <button
          @click="showFilterModal = true"
          class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition text-sm flex items-center gap-1"
        >
          <Funnel class="h-5 w-5" />
          Filtrele
          <span
            v-if="filterCount > 0"
            class="ml-1 inline-flex items-center justify-center text-xs bg-blue-600 text-white rounded-full w-5 h-5"
          >
            {{ filterCount }}
          </span>
        </button>
      </div>

      <div
        v-if="filterCount > 0"
        class="text-sm text-gray-600 flex flex-wrap gap-2"
      >
        <div
          v-for="(filter, key) in activeFilters"
          :key="key"
          class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full"
        >
          <strong>{{ filter.columnName }}:</strong>
          {{
            Array.isArray(filter.filter)
              ? filter.filter.join(", ")
              : filter.filter
          }}
        </div>
      </div>
      <div v-if="results.all_records_count > 0">
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
                  class="px-6 py-3 font-bold text-center w-32 bg-gray-100 sticky right-0 z-10"
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
                  class="sticky right-0 z-10 bg-white px-0"
                >
                  <div
                    class="h-full flex items-center justify-center gap-2 px-6 py-4"
                  >
                  <button
                      v-if="settings?.showGraphButton"
                      @click="(showGraph = true), (graphID = item.id)"
                      class="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md text-amber-500 hover:text-amber-700 transition"
                    >
                      <ChartArea class="h-5 w-5" />
                    </button>
                    <button
                      v-if="settings?.showFileButton"
                      @click="(showUpload = true), (fileID = item.id)"
                      class="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md text-emerald-500 hover:text-emerald-700 transition"
                    >
                      <FileInput class="h-5 w-5" />
                    </button>
                    <RouterLink
                      v-if="settings?.showEditButton"
                      :to="props.tableInfo.update + '/duzenle/' + item.id"
                      class="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md text-blue-500 hover:text-blue-700 transition"
                    >
                      <SquarePen class="h-5 w-5" />
                    </RouterLink>
                    <button
                      v-if="settings?.showDeleteButton"
                      @click="(showConfirm = true), (recordID = item.id)"
                      class="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md text-rose-500 hover:text-rose-700 transition"
                    >
                      <Trash2 class="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4"
        >
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
              <ChevronLeft class="h-4 w-4" />
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
              <ChevronRight class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div
        v-else
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
    </div>
    <ConfirmDialog
      :visible="showConfirm"
      message="Silmek istediğine emin misin?"
      @confirm="silOnayla"
      @cancel="showConfirm = false"
    />
    <FileDialog
      :visible="showUpload"
      title="Dönüştürülmüş Dosyayı Yükle"
      :maxSizeMB="50"
      @confirm="uploadFile"
      @cancel="showUpload = false"
    />
    <FilterModal
      :visible="showFilterModal"
      :columns="visibleColumns"
      :tableName="props.tableInfo.tableName"
      @close="showFilterModal = false"
      @apply="onFilterApply"
      @filterCount="(val) => (filterCount = val)"
    />
    <GraphModal
      :visible="showGraph"
      :id="graphID"
      @close="showGraph = false"
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
import FileDialog from "./FileDialog.vue";
import FilterModal from "@/components/FilterModal.vue";
import { useToast } from "vue-toastification";
import GraphModal from "./GraphModal.vue";
const toast = useToast();

const authStore = useAuthStore();

const showConfirm = ref(false);
const showUpload = ref(false);
const showFilterModal = ref(false);
const showGraph = ref(false);

const props = defineProps(["tableInfo", "notUseColumn", "settings", "filters"]);

const results = ref({ all_records_count: 0, records: [], columns: [] });
const searchQuery = ref("");
const fileID = ref(null);
const recordID = ref(null);
const graphID = ref(null);
const loading = ref(true);

const activeFilters = ref({});
const filterCount = ref(0);

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
    authStore.userDataAdmin.auths.tables[props.tableInfo.tableName].lists[0];
  params.value.column_array_id_query =
    authStore.userDataAdmin.auths.tables[props.tableInfo.tableName]?.lists?.[0];
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
    if (error.response.data.data.message == 'fail.token') {
      authStore.logout()
      router.push('/login')
    }
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

const silOnayla = async () => {
  const formData = new FormData();
  formData.append(
    "column_set_id",
    authStore.userDataAdmin.auths.tables[props.tableInfo.tableName]?.delete?.[0]
  );

  try {
    const res = await axios.post(
      `${authStore.token}/tables/${props.tableInfo.tableName}/${recordID.value}/delete`
    );
    if (res.data.data.message == "success") {
      toast.success("Kayıt başarıyla silindi.");
      showConfirm.value = false;
      getData();
    } else {
      toast.error("Kayıt silinemedi.");
    }
  } catch (err) {
    if (err.response.data.data.message == "no.auth")
      toast.error("Yetkiniz yok.", "Hata!");
    else toast.error(err.response.data.data.message, "Hata!");
  }
};

const onFilterApply = (filtersObj) => {
  console.log(filtersObj);
  if (!filtersObj) params.value.filters = {};
  params.value.filters = {
    ...params.value.filters,
    ...filtersObj,
  };
  showFilterModal.value = false;
  params.value.page = 1;
  activeFilters.value = filtersObj;
  getData();
};

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("donusturulmus_dosyalar[]", file);
  formData.append("id", fileID.value);
  formData.append("in_form_column_name", "donusturulmus_dosyalar");
  formData.append("single_column", "donusturulmus_dosyalar");
  formData.append(
    "column_set_id",
    authStore.userDataAdmin.auths.tables[props.tableInfo.tableName].edits[0]
  );

  try {
    const res = await axios.post(
      `${authStore.token}/tables/${props.tableInfo.tableName}/${fileID.value}/update`,
      formData
    );
    toast.success("Yükleme başarılı!");
    console.log(res);
  } catch (e) {
    toast.error("Yükleme başarısız.");
  } finally {
    showUpload.value = false;
    getData();
  }
};
</script>
