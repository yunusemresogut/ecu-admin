<template>
  <LoadingComponent v-if="loading" />
  <div v-else class="flex h-screen text-sm text-gray-800">
    <!-- SOL TARAF: Talepler -->
    <!-- SOL TARAF -->
<div class="w-1/3 p-4 space-y-2 border-r overflow-y-auto">
  <h2 class="text-lg">Destek Talepleri</h2>
  <hr />

  <div
    v-for="ticket in sortedTickets"
    :key="ticket.id"
    @click="selected = ticket"
    :class="[
      'p-4 rounded-xl shadow cursor-pointer transition',
      ticket.cevap_durumu === false
        ? 'border border-green-500'
        : 'border border-gray-200',
      selected?.id === ticket.id
        ? 'bg-blue-100 border-blue-400'
        : ticket.cevap_durumu === false
        ? 'bg-white hover:bg-green-50'
        : 'bg-white hover:bg-gray-100',
    ]"
  >
    <p class="font-semibold">{{ ticket.baslik }}</p>
    <p class="text-xs text-gray-500">{{ ticket.created_at }}</p>
  </div>

  <!-- Sayfalama -->
   <div v-if="totalPages == 0">Detek talebi bulunamadı.</div>
  <div v-else class="flex items-center justify-between mt-4">
    <button
      @click="changePage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
    >
      Önceki
    </button>
    <div class="flex gap-1">
      <button
        v-for="page in totalPages"
        :key="page"
        @click="changePage(page)"
        :class="[
          'px-3 py-1 rounded',
          page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-100',
        ]"
      >
        {{ page }}
      </button>
    </div>
    <button
      @click="changePage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
    >
      Sonraki
    </button>
  </div>
</div>

    <!-- SAĞ TARAF: Seçili Talep Detay -->
    <LoadingComponent v-if="loading2" />
    <div v-else class="w-2/3 p-4 flex flex-col">
      <template v-if="selected">
        <!-- Mesajlar -->
        <div class="flex-1 flex flex-col space-y-4 overflow-hidden">
          <div class="overflow-y-auto space-y-3 pr-2">
            <div
              class="p-3 rounded-xl border border-gray-100 bg-blue-100 ml-auto"
            >
              <p>{{ selected.mesaj }}</p>
              <div class="flex items-center justify-between mt-2">
                <p class="text-xs mt-1">
                  {{ selected.created_at }}
                </p>
                <p class="text-xs mt-1">{{ selected.bayi_id }}</p>
              </div>
              <p>
                <a
                  :href="
                    baseUrl +
                    JSON.parse(selected.report_file)?.[0]?.disk +
                    '/' +
                    JSON.parse(selected.report_file)?.[0]?.destination_path +
                    JSON.parse(selected.report_file)?.[0]?.file_name
                  "
                  download
                  target="_blank"
                  class="block px-4 py-2 text-rose-500 hover:underline rounded hover:bg-transparent"
                >
                  Dosya: {{ JSON.parse(selected.report_file)?.[0]?.file_name }}
                </a>
              </p>
            </div>
          </div>
          <div class="overflow-y-auto space-y-3 pr-2">
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="p-3 rounded-xl border border-gray-100 max-w-[80%]"
              :class="
                Number(msg.gonderen_id) === userId
                  ? 'bg-blue-50 ml-auto'
                  : 'bg-gray-100'
              "
            >
              <p>{{ msg.mesaj }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ msg.created_at }}</p>
              <p>
                <a
                  :href="
                    baseUrl +
                    JSON.parse(msg.report_file)?.[0]?.disk +
                    '/' +
                    JSON.parse(msg.report_file)?.[0]?.destination_path +
                    JSON.parse(msg.report_file)?.[0]?.file_name
                  "
                  download
                  target="_blank"
                  class="block px-4 py-2 text-rose-500 hover:underline rounded hover:bg-transparent"
                >
                  Dosya: {{ JSON.parse(msg.report_file)?.[0]?.file_name }}
                </a>
              </p>
            </div>
          </div>
        </div>

        <!-- Mesaj Yazma Alanı -->
        <form
          @submit.prevent="sendMessage"
          class="mt-4 flex gap-2 items-center"
        >
          <input
            v-model="messageText"
            type="text"
            placeholder="Mesajınızı yazın..."
            class="flex-1 p-2 border rounded"
            required
          />
          <input
            type="file"
            ref="fileInput"
            class="hidden"
            @change="handleFile"
          />
          <button
            type="button"
            @click="fileInput.click()"
            class="px-3 py-2 bg-gray-200 rounded"
          >
            📎
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Gönder
          </button>
        </form>
      </template>

      <div v-else class="flex-1 flex items-center justify-center text-gray-400">
        Bir destek talebi seçin.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";
import LoadingComponent from "@/components/LoadingComponent.vue";

const authStore = useAuthStore();
const toast = useToast();
const loading = ref(false);
const loading2 = ref(false);

const tickets = ref([]);
const selected = ref(null);
const messages = ref([]);
const messageText = ref("");
const file = ref(null);
const fileInput = ref(null);
const userId = authStore.userDataAdmin.user.id;
const baseUrl = import.meta.env.VITE_BASE_UPLOAD_URL;

const currentPage = ref(1); // şimdiki sayfa
const perPage = 10; // her zaman 10 kayıt
const totalRecords = ref(0); // apiden gelecek toplam kayıt

const params = ref({
  page: currentPage.value,
  limit: perPage,
  sorts: {},
  filters: {},
  column_array_id: authStore.userDataAdmin.auths.tables["destek"].lists[0],
  column_array_id_query:
    authStore.userDataAdmin.auths.tables["destek"]?.queries?.[0],
});

const params2 = ref({
  page: 1,
  limit: 1000,
  sorts: {
    id: true,
  },
  filters: {},
  column_array_id:
    authStore.userDataAdmin.auths.tables["destek_mesaj"].lists[0],
  column_array_id_query:
    authStore.userDataAdmin.auths.tables["destek_mesaj"]?.queries?.[0],
});

const sortedTickets = computed(() => {
  return [...tickets.value].sort((a, b) => {
    if (a.cevap_durumu === false && b.cevap_durumu !== false) return -1;
    if (a.cevap_durumu !== false && b.cevap_durumu === false) return 1;
    return 0;
  });
});

const totalPages = computed(() =>
  Math.ceil(totalRecords.value / perPage)
);

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  params.value.page = currentPage.value;
  fetchTickets();
};

// Destek taleplerini getir
const fetchTickets = async () => {
  try {
    loading.value = true;
    const response = await axios.post(`${authStore.token}/tables/destek`, {
      params: JSON.stringify(params.value),
    });
    tickets.value = response.data.data.records;
    totalRecords.value = response.data.data.all_records_count;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Seçilen destek talebinin mesajlarını getir
const fetchMessages = async () => {
  if (!selected.value) return;

  params2.value.filters.destek_id = {
    type: 1,
    guiType: "select",
    filter: [selected.value.id],
  };
  try {
    loading2.value = true;
    const response = await axios.post(
      `${authStore.token}/tables/destek_mesaj`,
      {
        params: JSON.stringify(params2.value),
      }
    );
    messages.value = response.data.data.records;
  } catch (err) {
    console.error(err);
  } finally {
    loading2.value = false;
  }
};

// Mesaj gönder
const sendMessage = async () => {
  const formData = new FormData();
  formData.append("destek_id", selected.value.id);
  formData.append("mesaj", messageText.value);
  formData.append(
    "column_set_id",
    authStore.userDataAdmin.auths.tables["destek_mesaj"]?.creates?.[0]
  );
  if (file.value) formData.append("report_file[]", file.value);

  await axios.post(`${authStore.token}/tables/destek_mesaj/store`, formData);
  messageText.value = "";
  file.value = null;
  fetchMessages();
};

const handleFile = (e) => {
  file.value = e.target.files[0];
};

// Seçilen destek değiştiğinde mesajları getir
watch(selected, () => {
  if (selected.value) fetchMessages();
});

onMounted(fetchTickets);
</script>
