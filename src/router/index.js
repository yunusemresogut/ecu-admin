import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '/',
        name: 'Dashboard',
        component: () => import('../pages/index.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/kayitlar',
        name: 'Kayıtlar',
        component: () => import('../pages/kayitlar/Kayitlar.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/kayitlar/yeni-kayit',
        name: 'Yeni Kayıt',
        component: () => import('../pages/kayitlar/KayitEkle.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/bayiler',
        name: 'Bayiler',
        component: () => import('../pages/bayiler/Bayiler.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/bayiler/yeni-olustur',
        name: 'BayilerCreate',
        component: () => import('../pages/bayiler/BayilerCreate.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/bayiler/duzenle/:id',
        name: 'BayilerEdit',
        component: () => import('../pages/bayiler/BayilerUpdate.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/arac-marka-modeli',
        name: 'AracMarkaModel',
        component: () => import('../pages/arac-marka-modeli/AracMarkaModel.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/arac-marka-modeli/yeni-olustur',
        name: 'AracMarkaModelCreate',
        component: () => import('../pages/arac-marka-modeli/AracMarkaModelCreate.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/beyin-markalar',
        name: 'Beyin Markalar',
        component: () => import('../pages/beyin-markalar/BeyinMarkalar.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/beyin-markalar/yeni-olustur',
        name: 'BeyinMarkalarCreate',
        component: () => import('../pages/beyin-markalar/BeyinMarkalarCreate.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/cihaz-turu',
        name: 'Cihaz Türü',
        component: () => import('../pages/cihaz-turu/CihazTuru.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/cihaz-turu/yeni-olustur',
        name: 'CihazTuruCreate',
        component: () => import('../pages/cihaz-turu/CihazTuruCreate.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/ozellikler',
        name: 'Özellikler',
        component: () => import('../pages/ozellikler/Ozellikler.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/ozellikler/yeni-olustur',
        name: 'OzelliklerCreate',
        component: () => import('../pages/ozellikler/OzelliklerCreate.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/uygulama-sekli',
        name: 'Uygulama Şekli',
        component: () => import('../pages/uygulama-sekli/UygulamaSekli.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/uygulama-sekli/yeni-olustur',
        name: 'UygulamaSekliCreate',
        component: () => import('../pages/uygulama-sekli/UygulamaSekliCreate.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/vites-tipi',
        name: 'Vites Tipi',
        component: () => import('../pages/vites-tipi/VitesTip.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/vites-tipi/yeni-olustur',
        name: 'VitesTipiCreate',
        component: () => import('../pages/vites-tipi/VitesTipCreate.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/yakit-turu',
        name: 'Yakıt Turu',
        component: () => import('../pages/yakit-turu/YakitTuru.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/yakit-turu/yeni-olustur',
        name: 'YakitTuruCreate',
        component: () => import('../pages/yakit-turu/YakitTuruCreate.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/hesap-hareketleri',
        name: 'Hesap Hareketleri',
        component: () => import('../pages/hesap-hareketleri/HesapHareketleri.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/hesap-hareketleri/yeni-olustur',
        name: 'HesapHareketleriCreate',
        component: () => import('../pages/hesap-hareketleri/HesapHareketleriCreate.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/faturalar',
        name: 'Faturalar',
        component: () => import('../pages/faturalar/Faturalar.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/faturalar/yeni-olustur',
        name: 'FaturalarCreate',
        component: () => import('../pages/faturalar/FaturalarCreate.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/ayarlar',
        name: 'Ayarlar',
        component: () => import('../pages/ayarlar/Ayarlar.vue'),
        meta: { requiresAuth: true }
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue'),
    meta: { layout: 'auth' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFound.vue'),
    meta: { layout: 'auth' }
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ top: 0, behavior: 'smooth' });
        }, 100);
      });
    }
  },
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('userToken')
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

router.beforeEach(async (to, from, next) => {
  document.title = (to.meta.breadcrumb || to.name) + ' - KAF'

  const authStore = useAuthStore()

  const isAuthenticated = !!authStore.token

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'Login' })
    } else {
      if (authStore.userData) {
        next()
      } else {
        try {
          const userRes = await axios.post(`${authStore.token}/getLoggedInUserInfo`)
          authStore.userData = userRes.data.data
          localStorage.setItem('userData', JSON.stringify(authStore.userData))
          next()
        } catch (error) {
          console.error('Kullanıcı verisi alınamadı:', error)
          authStore.logout()
          next({ name: 'Login' })
        }
      }
    }
  } else if (to.name === 'Login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
