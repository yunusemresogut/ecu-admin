import { createApp } from 'vue'
import './style.css'
import './index.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import axios from 'axios'
import { formatCurrency, dateFormatter, dateFormatterTime } from './utils/formatter'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL

const app = createApp(App)

app.config.globalProperties.$formatCurrency = formatCurrency
app.config.globalProperties.$dateFormatter = dateFormatter
app.config.globalProperties.$dateFormatterTime = dateFormatterTime

const options = {
    // You can set your default options here
};

app.use(Toast, options);

app.use(createPinia())
app.use(router)
app.mount('#app')
