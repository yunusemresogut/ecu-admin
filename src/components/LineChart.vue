<template>
  <div class="bg-white p-4 rounded shadow">
    <Line :data="data" :options="options" />
  </div>
</template>

<script setup>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const props = defineProps({
  chartTitle: String,
  categories: Array,
  series: Array   // ✔ doğru props
})

const colorPalette = [
  "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
  "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
  "#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f",
  "#edc948", "#b07aa1", "#ff9da7", "#9c755f", "#bab0ab"
]

const datasets = props.series?.map((col, index) => ({
  label: col.name,
  data: col.data,
  borderColor: colorPalette[index % colorPalette.length],
  backgroundColor: 'transparent',
  tension: 0.4
})) || []

const data = {
  labels: props.categories,
  datasets
}

const options = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom' },
    title: {
      display: true,
      text: props.chartTitle || 'Grafik'
    }
  }
}
</script>
