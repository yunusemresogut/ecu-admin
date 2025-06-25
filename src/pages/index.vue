<template>
  <div>
    <LoadingComponent v-if="loading" />
    <LineChart
    v-else
    :chart-title="chartData.title"
    :categories="chartData.axis.x.categories"
    :columns="chartData.data.columns"
  />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import LineChart from '@/components/LineChart.vue'
import axios from "axios"
import { useAuthStore } from "@/stores/auth";
import LoadingComponent from "@/components/LoadingComponent.vue";

const authStore = useAuthStore();

const loading = ref(true)
const chartData = ref(null)

const getChartData = async () => {
  loading.value = true
  try {
    const response = await axios.post(`${authStore.token}/dashboards/getData/dashboards:GraphicXY:Bayiler:Data`)
    console.log(response)
    chartData.value = response.data.data
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getChartData();
})
</script>


