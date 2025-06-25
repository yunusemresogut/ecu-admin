import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('userToken') || null,
    userData: JSON.parse(localStorage.getItem('userData')) || null,
  }),
  actions: {
    async login(email, password) {
      try {
        const res = await axios.post('login', { email, password })
        const token = res.data.data.token
        this.token = token
        localStorage.setItem('userToken', this.token)

        const userRes = await axios.post(`${token}/getLoggedInUserInfo`)
        this.userData = userRes.data.data
        localStorage.setItem('userData', JSON.stringify(this.userData))

        return true
      } catch (err) {
        console.error('Login failed:', err)
        return false
      }
    },
    logout() {
      this.token = null
      this.userData = null
      localStorage.removeItem('userToken')
      localStorage.removeItem('userData')
    }
  }
})
