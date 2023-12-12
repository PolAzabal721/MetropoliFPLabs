// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // INICIO
    {
      path: '/',
      component: () => import('@/components/home.vue'),
    },

    // CAMARA
    {
      path: '/info/',
      component: () => import('@/components/info.vue'),
    },
  
    // CAMARA
    {
      path: '/camara/',
      component: () => import('@/components/camara.vue'),
    },
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
