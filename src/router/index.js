// Composables
import { createRouter, createWebHashHistory } from 'vue-router'
import { useAppStore } from "@/store/app";


const routes = [
    // INICIO
    {
        path: '/',
        component: () =>
            import ('@/components/home.vue'),
        meta: { title: 'Sea Shepherd - Home' }
    },

    // INFO GENERAL (DATOS)
    {
        path: '/datos/',
        component: () =>
            import ('@/components/datos.vue'),
        meta: { title: 'Sea Shepherd - Dades' }
    },

    // CAMARA
    {
        path: '/camara/',
        component: () =>
            import ('@/components/camara.vue'),
        meta: { title: 'Sea Shepherd - Càmera' }
    },

    // UBI DEL ROBOTS
    {
        path: '/ubicacion/',
        component: () =>
            import ('@/components/ubicacion.vue'),
        meta: { title: 'Sea Shepherd - Ubicació' }

    },

    // INFORMES (GRAFICOS Y MAS)
    {
        path: '/informes/',
        component: () =>
            import ('@/components/informes.vue'),
        meta: { title: 'Sea Shepherd - Informes' }

    },

    // CREAR AREAS (COMO LA RUMBA) + EDITAR + ELIMINAR 
    {
        path: '/areas/',
        component: () =>
            import ('@/components/areas.vue'),
        meta: { title: 'Sea Shepherd - Gestionar áreas' }

    },

    // SUBMARINOS + EMPAREJARLOS CON AREAS (CREAR RUTINAS + EDITAR + ELIMINAR)
    {
        path: '/submarinos/',
        component: () =>
            import ('@/components/submarinos.vue'),
        meta: { title: 'Sea Shepherd - Submarinos' }

    },

    // GESTION DE INCIDENCIAS
    {
        path: '/incidencias/',
        component: () =>
            import ('@/components/incidencias.vue'),
        meta: { title: 'Sea Shepherd - Incidencies' }

    },

    // CREAR LOGIN
    {
        path: '/login',
        component: () =>
            import ('@/components/login.vue'),
        meta: { title: 'Sea Shepherd - Login' }

    },



    // GESTION EMPRESAS 
    {
        path: '/gestioEmpresas',
        component: () =>
            import ('@/components/gestioEmpresas.vue'),
        meta: { title: 'Sea Shepherd - Gestio Empreses' }

    },
]

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes,
})

router.beforeEach((to, from, next) => {
    const appStore = useAppStore();
    const userRole = appStore.userRole;
    const isAdmin = userRole === 'admin';
    const isTecnicoWeb = userRole === 'tecnico_web';

    const allowedRoutes = ['/', '/home', '/camara', '/login'];

    // Rutas no permitidas para el técnico web
    const disallowedRoutesTecnicoWeb = ['/gestioEmpresas'];

    // Comprueba si el usuario es administrador, técnico web o está en una ruta permitida
    if ((!isAdmin && !isTecnicoWeb) && !allowedRoutes.includes(to.path)) {
        window.alert('Acceso denegado: no eres administrador ni técnico web');
        next('/'); // Redirige al usuario a la página de inicio
    } else if (isTecnicoWeb && disallowedRoutesTecnicoWeb.includes(to.path)) {
        window.alert('Acceso denegado: no tienes permiso para acceder a esta página');
        next('/'); // Redirige al usuario a la página de inicio
    } else {
        document.title = to.meta.title || 'Default Title';
        next();
    }
});


export default router