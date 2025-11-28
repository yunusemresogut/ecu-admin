<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <form
      @submit.prevent="submit"
      class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 transition-all"
    >
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-800">Giriş Yap</h2>
        <p class="text-sm text-gray-500">Hesabınıza giriş yapın</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
        <input
          v-model="email"
          type="email"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
          placeholder="E-posta adresinizi girin"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
        <input
          v-model="password"
          type="password"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
          placeholder="Şifrenizi girin"
        />
      </div>

      <div>
        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
        >
          Giriş Yap
        </button>
      </div>

      <p class="text-center text-xs text-gray-400 mt-4">
        © {{ new Date().getFullYear() }} Ecusave. Tüm hakları saklıdır.
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from "vue-toastification";

const toast = useToast()

const email = ref('')
const password = ref('')

const auth = useAuthStore()
const router = useRouter()

const submit = async () => {
  const success = await auth.login(email.value, password.value)
  if (success) {
    router.push('/')
  } else {
    toast.error('Giriş başarısız! Bilgilerinizi kontrol edin.', {
      position: "top-right",
      timeout: 5000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }
}
</script>
