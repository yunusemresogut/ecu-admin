<template>
  <div class="space-y-6 p-6 min-h-screen">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold text-gray-800">Kayıtlar</h2>
      <RouterLink
        to="/kayitlar/yeni-olustur"
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
    <div class="grid gap-6 mb-6" v-if="results?.records.length">
      <div v-for="tr in results?.records" :key="tr.id" class="w-full">
        <div
          class="shadow-sm rounded-xl p-5 flex flex-col justify-between h-full"
        >
          <div class="flex justify-between items-start">
            <div>
              <h5 class="text-lg font-semibold text-blue-400">
                <span class="italic text-gray-500">{{ tr.id }} - </span>{{ tr.arac_marka_modeli_id || "Başlık Yok" }}
              </h5>
              <p class="text-sm text-gray-400">{{ tr.plaka || "Plaka Yok" }}</p>
            </div>
            <div class="flex items-center gap-4">
              <button
                v-if="tr.donusturulmus_dosyalar"
                @click="docDownload(tr)"
                class="flex items-center text-blue-400 text-sm hover:underline"
              >
                <i class="bi bi-download mr-1"></i>
                Dönüştürülmüş Dosya
              </button>
              <div class="relative">
                <button
                  class="p-1 rounded-full hover:bg-gray-700"
                  @click="openDropdown[tr.id] = !openDropdown[tr.id]"
                >
                  <EllipsisVertical />
                  <i class="pi bi-three-dots-vertical"></i>
                </button>
                <div
                  v-if="openDropdown[tr.id]"
                  class="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50"
                >
                  <ul class="py-1 text-sm">
                    <li>
                      <!-- v-if="tr.kayit_durum_id !== 'Tamamlandı'" -->
                      <RouterLink
                        :to="`/kayitlar/duzenle/${tr.id}`"
                        class="block px-4 py-2 hover:bg-gray-100"
                      >
                        Düzenle
                      </RouterLink>
                    </li>
                    <li>
                      <!-- v-if="tr.kayit_durum_id !== 'Tamamlandı'" -->
                      <a
                        @click="(showUpload = true), (fileID = tr.id)"
                        class="block px-4 py-2 hover:bg-gray-100"
                      >
                        Dosya Dönüştür
                      </a>
                    </li>
                    <li
                      v-for="ad in JSON.parse(tr.arac_dosyalar)"
                      :key="ad.file_name"
                    >
                      <a
                        :href="
                          baseUrl +
                          ad.disk +
                          '/' +
                          ad.destination_path +
                          ad.file_name
                        "
                        download
                        target="_blank"
                        class="block px-4 py-2 hover:bg-gray-100"
                      >
                        Araç Dosyası
                      </a>
                    </li>

                    <!-- <li v-if="!tr.odeme_durumu">
                      <a
                        @click="odemeCheck(tr)"
                        class="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        Öde
                      </a>
                    </li> -->

                    <!-- <li v-if="false">
                      <a
                        @click="garantiBelge(tr)"
                        class="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        Garanti Belgesi
                      </a>
                    </li> -->

                    <li>
                      <!-- v-if="tr.kayit_durum_id !== 'Tamamlandı'" -->
                      <a
                        @click="
                          showConfirm = true;
                          deleteId = tr;
                        "
                        class="block px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer"
                      >
                        Sil
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="(ozellik, i) in parseOzellikler(tr.ozellikler_ids)"
              :key="i"
              class="bg-gray-100 text-black text-xs px-3 py-2 rounded-lg border border-gray-300"
            >
              {{ ozellik.display }}
            </span>
          </div>

          <div class="mt-5 flex justify-between items-end">
            <div class="text-sm text-gray-400 space-y-1">
              <div>
                <i class="bi bi-calendar mr-1"></i>
                Model Yılı: {{ tr.model_yili || "-" }}
              </div>
              <div>
                <i class="bi bi-funnel mr-1"></i>
                Yakıt Türü: {{ tr.yakıt_türü_id || "-" }}
              </div>
              <div>
                <i class="bi bi-gear mr-1"></i>
                Cihaz Türü: {{ tr.cihaz_türü_id || "-" }}
              </div>
              <div>
                <i class="bi bi-slash-circle mr-1"></i>
                Silindir Hacmi: {{ tr.silindir_hacmi || "-" }}
              </div>
            </div>

            <div class="text-right">
              <div class="text-2xl font-bold text-white mb-2">
                {{ $formatCurrency(tr.islem_fiyat) }}₺
              </div>
              <div class="mb-2 space-x-1">
                <span
                  :class="getDurumClass(tr.kayit_durum_id)"
                  class="px-2 py-1 text-xs rounded-md"
                >
                  {{ tr.kayit_durum_id }}
                </span>
                <span
                  :class="tr.odeme_durumu ? 'bg-green-600' : 'bg-red-600'"
                  class="text-white px-2 py-1 text-xs rounded-md"
                >
                  {{ tr.odeme_durumu ? "Ödendi" : "Ödenmedi" }}
                </span>
              </div>
              <div class="text-xs text-gray-400">{{ tr.kayit_zaman }}</div>
            </div>
          </div>
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
    <div
      class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pb-4"
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

    <ConfirmDialog
      :visible="showConfirm"
      message="Silmek istediğine emin misin?"
      @confirm="silOnayla(deleteId)"
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
      :tableName="'kayitlar'"
      @close="showFilterModal = false"
      @apply="onFilterApply"
      @filterCount="(val) => (filterCount = val)"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import axios from "axios";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import FileDialog from "@/components/FileDialog.vue";
import { useToast } from "vue-toastification";
import FilterModal from "@/components/FilterModal.vue";

const authStore = useAuthStore();
const toast = useToast();
const baseUrl = import.meta.env.VITE_BASE_UPLOAD_URL;
const showFilterModal = ref(false);

const openDropdown = ref([]);
const results = ref({ all_records_count: 0, records: [], columns: [] });
const loading = ref(false);
const showConfirm = ref(false);
const fileID = ref(null);
const showUpload = ref(false);
const params = ref({
  page: 1,
  limit: 10,
  sorts: {},
  filters: {},
  column_array_id: authStore.userDataAdmin.auths.tables["kayitlar"].lists[0],
  column_array_id_query:
    authStore.userDataAdmin.auths.tables["kayitlar"].lists[0],
});

const activeFilters = ref({});
const filterCount = ref(0);

const visibleColumns = computed(() => {
  console.log(results.value.columns);
  return results.value.columns;
});

const getData = async () => {
  loading.value = true;
  try {
    const response = await axios.post(`${authStore.token}/tables/kayitlar`, {
      params: JSON.stringify(params.value),
    });
    results.value = response.data.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const totalPages = computed(() => {
  return Math.ceil(results.value.all_records_count / params.value.limit);
});

onMounted(() => {
  getData();
});

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

const silOnayla = (e) => {
  axios
    .post(authStore.token + "/tables/kayitlar/" + e.id + "/delete", {
      column_set_id: authStore.userDataAdmin.auths.tables["kayitlar"].delete[0],
    })
    .then((res) => {
      if (res.data.data.message == "success") {
        toast.success("Seçili işlem silindi.", "Başarılı!");
      } else if (res.data.data.message == "error") {
        toast.error("Seçili işlem silinirken bir hata oluştu.", "Hata!");
      }
    })
    .catch((err) => {
      if (err.response.data.data.message == "no.auth")
        toast.error("Tamamlanmış kayıtları silemezsiniz.", "Hata!");
      else toast.error(err.response.data.data.message, "Hata!");
    })
    .finally(() => {
      showConfirm.value = false;
      getData();
    });
};
const garantiBelge = (val) => {
  const recordId = val.id;
  const url = `${import.meta.env.VITE_API_BASE_URL}${
    authStore.token
  }/tables/kayitlar/report?params=${encodeURIComponent(
    JSON.stringify({
      page: 1,
      limit: 10,
      column_array_id:
        authStore.userDataAdmin.auths.tables["kayitlar"]?.lists[0],
      column_array_id_query:
        authStore.userDataAdmin.auths.tables["kayitlar"]?.queries[0],
      sorts: {},
      filters: {},
      editMode: false,
      liveDataMode: false,
      columnNames: [],
      report_format: "pdf",
      record_id: recordId,
      report_id: 1,
    })
  )}`;

  window.open(url, "_blank");
};
const docDownload = (val) => {
  axios
    .post(
      authStore.token + "/downloadByRecords",
      { id: val.id },
      { responseType: "blob" }
    )
    .then((res) => {
      console.log(res);
      // Content-Disposition'dan filename çıkar
      const contentDisposition = res.headers["content-disposition"];
      let fileName = "dosya.dat"; // varsayılan

      const match = contentDisposition?.match(/filename="?([^"]+)"?/);
      if (match && match[1]) {
        fileName = match[1];
      }

      // Dosya indirme işlemi
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Temizlik
    })
    .catch((err) => {
      const message =
        err?.response?.data?.data?.message || "Dosya indirilemedi.";
      toast.error(message, "Hata!");
    });
};
const odemeCheck = (val) => {
  axios
    .post(authStore.token + "/bakiyeOde", {
      id: val.id,
    })
    .then((res) => {
      if (res.data.status == "success") {
        toast.success(err.response.data.message, "Başarılı");
        getTable();
      } else {
        toast.error("Bir hata oluştu.", "Hata!");
      }
    })
    .catch((err) => {
      if (err.response.data.code == 400)
        toast.error(err.response.data.data.message, "Hata!");
      else toast.error(err.response.data.data.message, "Hata!");
    });
};

const parseOzellikler = (val) => {
  try {
    return JSON.parse(val || "[]");
  } catch {
    return [];
  }
};

const getDurumClass = (durum) => {
  switch (durum) {
    case "Onay Bekliyor":
      return "bg-blue-600 text-white";
    case "Reddedildi":
      return "bg-red-600 text-white";
    case "Tamamlandı":
      return "bg-green-600 text-white";
    case "işlemde":
      return "bg-yellow-400 text-black";
    default:
      return "bg-gray-600 text-white";
  }
};

const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("id", fileID.value);
  formData.append("file", file);

  axios
    .post(authStore.token + "/fileup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      if (res.data.status === "success") {
        toast.success("Dosya başarıyla yüklendi.", "Başarılı!");
        showUpload.value = false;
        getData();
      } else {
        toast.error("Dosya yüklenirken bir hata oluştu.", "Hata!");
      }
    })
    .catch((err) => {
      toast.error("Dosya yüklenirken bir sorun oluştu.", "Hata!");
    })
    .finally(() => {
      showUpload.value = false;
      getData();
    });
};
</script>
