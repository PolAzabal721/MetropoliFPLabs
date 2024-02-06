// Composables
import { createRouter, createWebHashHistory } from 'vue-router'
import { useAppStore } from "@/store/app";


const routes = [
  // INICIO
  {
    path: '/',
    component: () => import('@/components/home.vue'),
    meta: { title: 'Sea Shepherd - Home' }
  },

  // INFO GENERAL (DATOS)
  {
    path: '/datos/',
    component: () => import('@/components/datos.vue'),
    meta: { title: 'Sea Shepherd - Dades' }
  },

  // CAMARA
  {
    path: '/camara/',
    component: () => import('@/components/camara.vue'),
    meta: { title: 'Sea Shepherd - Càmera' }
  },

  // UBI DEL ROBOT
  {
    path: '/ubicacion/',
    component: () => import('@/components/ubicacion.vue'),
    meta: { title: 'Sea Shepherd - Ubicació' }

  },

  // INFORMES (GRAFICOS Y MAS)
  {
    path: '/informes/',
    component: () => import('@/components/informes.vue'),
    meta: { title: 'Sea Shepherd - Informes' }

  },

  // CREAR AREAS (COMO LA RUMBA) + EDITAR + ELIMINAR 
  {
    path: '/areas/',
    component: () => import('@/components/areas.vue'),
    meta: { title: 'Sea Shepherd - Gestionar áreas' }

  },

  // SUBMARINOS + EMPAREJARLOS CON AREAS (CREAR RUTINAS + EDITAR + ELIMINAR)
  {
    path: '/submarinos/',
    component: () => import('@/components/submarinos.vue'),
    meta: { title: 'Sea Shepherd - submarinos' }

  },

  // GESTION DE INCIDENCIAS
  {
    path: '/incidencias/',
    component: () => import('@/components/incidencias.vue'),
    meta: { title: 'Sea Shepherd - submarinos' }

  },

  // CREAR LOGIN
  {
    path: '/login',
    component: () => import('@/components/login.vue'),
    meta: { title: 'Sea Shepherd - Login' }

  },

  // APPABAR DE TODO EL COD
  {
    path: '/appbar/',
    component: () => import('@/components/appbar.vue'),
  },

]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const appStore = useAppStore();
  const isAdmin = appStore.userRole === 'admin'; // Comprueba si userRole es 'admin'

  if (!isAdmin && to.path !== '/' && to.path !== '/home' && to.path !== '/camara'&& to.path !== '/login') {
    window.alert('Acceso denegado: no eres administrador');
    next('/home'); // Redirige al usuario a la página de inicio
  } else {
    document.title = to.meta.title || 'Default Title';
    next();
  }
});

export default router
