<template>
  <div class="space-y-8">
    <!-- Performans Modülleri -->
    <section>
      <h2 class="text-2xl font-semibold mb-4">Performans Modülleri</h2>
      <LoadingComponent v-if="loading" />

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="item in statCards" :key="item.key" class="card p-4 rounded-xl shadow bg-white">
          <div class="text-gray-500 text-lg">{{ item.label }}</div>
          <div class="text-2xl font-bold">{{ $formatCurrency(sonrapor[item.key]) }}</div>
        </div>
      </div>
    </section>

    <!-- Grafikler -->
    <section class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div v-for="(chart, index) in charts" :key="index">
        <LoadingComponent v-if="chart.loading" />
        <BarChart
          v-else
          :chart-title="chart.title"
          :categories="chart.categories"
          :series="chart.series"
        />
      </div>
    </section>
    <!-- Aylık Line Grafik -->
      <div>
        <LoadingComponent v-if="ayLoading" />
        <LineChart
          v-else
          chart-title="Aylık Satış Performansı"
          :categories="ayraporCategories"
          :series="ayraporSeries"
        />
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import BarChart from '@/components/BarChart.vue'
import LineChart from '@/components/LineChart.vue'
import axios from "axios"
import { useAuthStore } from "@/stores/auth"
import LoadingComponent from "@/components/LoadingComponent.vue"

const authStore = useAuthStore()

/* --- Performans Kartları --- */
const statCards = [
  { key: 'dun', label: 'Dün' },
  { key: 'bugun', label: 'Bugün' },
  { key: 'son_hafta', label: 'Son Hafta' },
  { key: 'son_ay', label: 'Son Ay' }
]

/* --- Chart Config --- */
const charts = ref([
  {
    title: "Bayi Bazlı Satış Tutarı (En Yüksek 20)",
    endpoint: "satistutari",
    loading: true,
    categories: [],
    series: []
  },
  {
    title: "Bayi Bazlı Satış Sayısı (En Yüksek 20)",
    endpoint: "satissayisi",
    loading: true,
    categories: [],
    series: []
  }
])

/* --- State --- */
const loading = ref(false)
const ayLoading = ref(false)
const sonrapor = ref([])
const ayrapor = ref([])
const ayraporCategories = ref([])
const ayraporSeries = ref([])

/* --- Genel Chart Fetch Function --- */
const fetchChart = async (chart) => {
  chart.loading = true
  try {
    const { data } = await axios.post(`${authStore.token}/${chart.endpoint}`)
    const rows = data.data

    chart.categories = rows.map(item => item.bayi_adi)
    chart.series = [
      {
        name: chart.title,
        data: rows.map(item => item.toplam_satis_tutari || item.toplam_satis_sayisi)
      }
    ]
  } catch (err) {
    console.log(err)
  } finally {
    chart.loading = false
  }
}

/* --- Performans Modülleri Fetch --- */
const fetchSummary = async () => {
  loading.value = true
  try {
    const { data } = await axios.post(`${authStore.token}/sonrapor`)
    sonrapor.value = data.data
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

/* --- Aylık Line Chart Fetch --- */
const fetchMonthly = async () => {
  ayLoading.value = true
  try {
    const { data } = await axios.post(`${authStore.token}/ayrapor`)
    ayrapor.value = data.data

    ayraporCategories.value = ayrapor.value.map(item => item.name)
    ayraporSeries.value = [
      {
        name: 'Aylık Performans',
        data: ayrapor.value.map(item => item.value)
      }
    ]
  } catch (err) {
    console.log(err)
  } finally {
    ayLoading.value = false
  }
}

/* --- Lifecycle --- */
onMounted(() => {
  charts.value.forEach(chart => fetchChart(chart))
  fetchSummary()
  fetchMonthly()
})
</script>