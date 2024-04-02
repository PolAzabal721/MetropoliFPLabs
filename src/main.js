/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

//import { Vuetify } from 'vuetify';
//import 'vuetify/dist/vuetify.min.css'; 
//import { BarChart } from 'vuetify/lib';

const app = createApp(App)

registerPlugins(app)
//app.use(Vuetify);
// Registra el componente BarChart
//app.component('v-bar-chart', BarChart);
app.mount('#app')
