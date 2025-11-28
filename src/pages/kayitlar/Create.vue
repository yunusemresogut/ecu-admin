<template>
  <LoadingComponent v-if="loading" />
  <form v-else @submit.prevent="submitForm" class="space-y-8 p-6 mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <select v-model="form.beyinMarkasi" class="form-input">
        <option disabled selected value="">Beyin Markası</option>
        <option
          v-for="item in selectOptions.beyinMarka"
          :key="item.id"
          :value="item.id"
        >
          {{ item.text }}
        </option>
      </select>
      <select v-model="form.aracModel" class="form-input">
        <option disabled selected value="">Araç Marka / Model</option>
        <option
          v-for="item in selectOptions.aracMarka"
          :key="item.id"
          :value="item.id"
        >
          {{ item.text }}
        </option>
      </select>
      <input
        v-model="form.beyinModeli"
        type="text"
        placeholder="Beyin Modeli"
        class="form-input"
      />
      <select v-model="form.yakitTuru" class="form-input">
        <option disabled selected value="">Yakıt Türü</option>
        <option
          v-for="item in selectOptions.yakitTuru"
          :key="item.id"
          :value="item.id"
        >
          {{ item.text }}
        </option>
      </select>
    </div>
    <hr class="border-t border-gray-300 my-6" />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        v-model="form.ad"
        type="text"
        placeholder="Ad"
        class="form-input"
      />
      <input
        v-model="form.soyad"
        type="text"
        placeholder="Soyad"
        class="form-input"
      />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        v-model="form.mail"
        type="email"
        placeholder="Mail"
        class="form-input"
      />
      <input
        v-model="form.telefon"
        type="text"
        placeholder="Telefon"
        class="form-input"
      />
    </div>
    <hr class="border-t border-gray-300 my-6" />
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        v-model="form.silindir"
        type="number"
        placeholder="Silindir Hacmi"
        class="form-input"
      />
      <input
        v-model="form.km"
        type="number"
        placeholder="Kilometre"
        class="form-input"
      />
      <input
        v-model="form.hp"
        type="number"
        placeholder="HP"
        class="form-input"
      />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        v-model="form.plaka"
        type="text"
        placeholder="Plaka"
        class="form-input"
      />
      <input
        v-model="form.modelYili"
        type="number"
        placeholder="Model Yılı"
        class="form-input"
      />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Vites Tipi</label>
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="item in selectOptions.vitesTipi"
            :key="item.id"
            type="button"
            @click="form.vitesTipi = item.id"
            class="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all duration-150"
            :class="
              form.vitesTipi === item.id
                ? 'bg-sky-100 border-sky-500 text-sky-700'
                : 'bg-white border-gray-300 hover:bg-gray-100 text-gray-700'
            "
          >
            <component :is="getIconComponent(item.id)" class="w-4 h-4" />
            <span>{{ item.text }}</span>
          </button>
        </div>
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Yönetim Tipi</label>
        <div class="flex gap-2 flex-wrap">
          <button
            type="button"
            @click="form.master = 1"
            class="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all duration-150"
            :class="
              form.master === 1
                ? 'bg-sky-100 border-sky-500 text-sky-700'
                : 'bg-white border-gray-300 hover:bg-gray-100 text-gray-700'
            "
          >
            <Server class="w-4 h-4" />
            <span>Master</span>
          </button>
          <button
            type="button"
            @click="form.master = 0"
            class="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all duration-150"
            :class="
              form.master === 0
                ? 'bg-sky-100 border-sky-500 text-sky-700'
                : 'bg-white border-gray-300 hover:bg-gray-100 text-gray-700'
            "
          >
            <HardDrive class="w-4 h-4" />
            <span>Slave</span>
          </button>
        </div>
      </div>
    </div>
    <hr class="border-t border-gray-300 my-6" />
    <div>
      <h2 class="text-lg font-semibold mb-4">Özellikler</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <label
          v-for="item in ozellikler"
          :key="item.id"
          :for="`ozellik-${item.id}`"
          class="flex flex-col p-3 rounded-lg cursor-pointer transition-all duration-200 gap-2 border hover:bg-gray-100"
          :class="{
            'bg-sky-100 border-sky-500 shadow-sm':
              seciliOzellikler.includes(item),
            'border-gray-300': !seciliOzellikler.includes(item),
          }"
        >
          <div class="flex flex-1 items-center gap-2">
            <input
              type="checkbox"
              :id="`ozellik-${item.id}`"
              v-model="seciliOzellikler"
              :value="item"
              class="accent-sky-500"
              @change="fiyatHesapla"
            />
            <span class="text-sm font-medium break-words">
              {{ item.ozellik }} - {{ item.islem_fiyat }}₺
            </span>
          </div>

          <!-- Açıklama varsa göster -->
          <div
            v-if="item.description"
            class="flex shrink-0 items-start gap-2 mt-1 text-xs text-gray-700 bg-sky-50 border border-sky-200 rounded-md p-2"
          >
            <BadgeInfo class="text-sky-400 h-4 w-4" />
            <span class="leading-snug">
              {{ item.description }}
            </span>
          </div>
        </label>
      </div>
    </div>
    <hr class="border-t border-gray-300 my-6" />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <select v-model="form.cihazTuru" class="form-input">
        <option disabled selected value="">Cihaz Türü</option>
        <option
          v-for="item in selectOptions.cihazTuru"
          :key="item.id"
          :value="item.id"
        >
          {{ item.text }}
        </option>
      </select>
      <select v-model="form.uygulamaSekli" class="form-input">
        <option disabled selected value="">Uygulama Şekli</option>
        <option
          v-for="item in selectOptions.uygulamaSekli"
          :key="item.id"
          :value="item.id"
        >
          {{ item.text }}
        </option>
      </select>
    </div>
    <hr class="border-t border-gray-300 my-6" />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="dosya" class="block text-sm font-medium text-gray-700 mb-1">
          Dosya Yükle
        </label>
        <input
          id="dosya"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          @change="handleFileUpload"
          class="block w-full text-sm text-gray-700 border border-gray-300 rounded-md px-3 py-2 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
        />
        <p v-if="selectedFileName" class="text-xs text-gray-500 mt-1">
          Seçilen dosya: {{ selectedFileName }}
        </p>
      </div>
      <div>
        <label
          for="aciklama"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Açıklama
        </label>
        <textarea
          id="aciklama"
          v-model="form.aciklama"
          rows="4"
          placeholder="Not veya açıklama girin..."
          class="form-input resize-none"
        ></textarea>
      </div>
    </div>
    <div class="text-right text-lg font-medium mt-4">
      <div
        class="mt-6 p-4 border border-gray-300 rounded-lg bg-white shadow-sm space-y-2 text-sm"
      >
        <div>
          <strong>Tutar:</strong>
          {{ $formatCurrency(hesapSonucu.original_total) }} ₺
        </div>
        <div>
          <strong>İndirim:</strong>
          {{ $formatCurrency(hesapSonucu.discount_amount) }} ₺
        </div>
        <div>
          <strong>Ödenecek Tutar:</strong>
          {{ $formatCurrency(hesapSonucu.total_price) }} ₺
        </div>
      </div>
    </div>
    <div class="flex justify-end mt-6">
      <button
        type="submit"
        class="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors"
        @click.prevent="submitForm"
      >
        Kayıt Oluştur
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import LoadingComponent from "@/components/LoadingComponent.vue";
import { Move, RefreshCw, Circle } from "lucide-vue-next";

const authStore = useAuthStore();

const form = ref({
  beyinMarkasi: "",
  aracModel: "",
  beyinModeli: "",
  yakitTuru: "",
  ad: "",
  soyad: "",
  km: "",
  hp: "",
  mail: "",
  silindir: "",
  telefon: "",
  vitesTipi: "",
  plaka: "",
  modelYili: "",
  cihazTuru: "",
  uygulamaSekli: "",
  aciklama: "",
  master: "",
  dosya: null,
});

const seciliOzellikler = ref([]);
const hesapSonucu = ref({
  total_price: 0,
  original_total: 0,
  discount_amount: 0,
});

const getIconComponent = (id) => {
  if (id === 1) return Move;
  if (id === 2) return RefreshCw;
  return Circle;
};

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    // Dosya uzantısı kontrolü
    const allowedExtensions = ["pdf", "jpg", "jpeg", "png"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (allowedExtensions.includes(fileExtension)) {
      form.value.dosya = file;
      selectedFileName.value = file.name;
    } else {
      alert(
        "Geçersiz dosya türü. Sadece PDF, JPG, JPEG, PNG dosyaları yüklenebilir."
      );
      event.target.value = ""; // input sıfırlanır
      form.value.dosya = null;
      selectedFileName.value = "";
    }
  }
}

async function fiyatHesapla() {
  const ozelliklerIds = seciliOzellikler.value.map((item) => item.id);

  try {
    const { data } = await axios.post(`${authStore.token}/calculatePrice`, {
      ozellikler_ids: ozelliklerIds,
    });

    hesapSonucu.value = {
      total_price: data.total_price,
      original_total: data.original_total,
      discount_amount: data.discount_amount,
    };
  } catch (error) {
    console.error(error);
  }
}

const selectOptions = ref({
  beyinMarka: [],
  aracMarka: [],
  yakitTuru: [],
  vitesTipi: [],
  cihazTuru: [],
  uygulamaSekli: [],
});

const columnKeyMap = {
  beyinMarka: "beyin_marka_id",
  aracMarka: "arac_marka_modeli_id",
  yakitTuru: "yakıt_türü_id",
  vitesTipi: "vites_tip_id",
  cihazTuru: "cihaz_türü_id",
  uygulamaSekli: "uygulama_sekli_id",
};

const fetchSelectData = async (key) => {
  const columnKey = columnKeyMap[key];
  if (!columnKey) return;

  try {
    const response = await axios.get(
      `${
        authStore.token
      }/tables/kayitlar/getSelectColumnData/${encodeURIComponent(
        columnKey
      )}?search=***&page=1&limit=1500`
    );
    selectOptions.value[key] = response.data.results;
  } catch (error) {
    console.error(`Hata [${key}]:`, error);
  }
};

const fetchAllSelectData = () => {
  Object.keys(columnKeyMap).forEach(fetchSelectData);
};

const loading = ref(false);
const ozellikler = ref([]);

const selectedFileName = ref("");

const getOzellikler = async () => {
  loading.value = true;
  let params = {
    page: 1,
    limit: 1000,
    sorts: {
      sira: true,
    },
    filters: {},
    column_array_id: authStore.userDataAdmin.auths.tables["ozellikler"].lists[0],
    column_array_id_query:
      authStore.userDataAdmin.auths.tables["ozellikler"].lists[0],
  };

  try {
    const response = await axios.post(`${authStore.token}/tables/ozellikler`, {
      params: JSON.stringify(params),
    });
    ozellikler.value = response.data.data.records;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAllSelectData();
  getOzellikler();
});
</script>
