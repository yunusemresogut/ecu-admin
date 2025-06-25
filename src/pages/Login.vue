<template>
  <div class="flex justify-center items-center h-screen">
    <form @submit.prevent="submit" class="bg-white p-8 rounded shadow w-80">
      <h2 class="text-xl font-bold mb-4">Giriş Yap</h2>
      <input v-model="email" placeholder="Email" class="w-full mb-2 p-2 border rounded" />
      <input v-model="password" type="password" placeholder="Şifre" class="w-full mb-4 p-2 border rounded" />
      <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded">Giriş</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const email = ref('yönetici@kuvarssoft.com')
const password = ref('123456Aa.')
const auth = useAuthStore()
const router = useRouter()

const submit = async () => {
  const success = await auth.login(email.value, password.value)
  console.log("asdasdasd")
  if (success) {
    console.log("asd")
    router.push('/')
  } else {
    alert('Giriş başarısız! Bilgilerinizi kontrol edin.')
  }
}
</script>
