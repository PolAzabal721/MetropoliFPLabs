<template>
  <v-toolbar color="#259FAF">
    <div v-if="isWideScreen" style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      ">
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      ">
        <div class="header-container">
          <div class="title-container">
            <router-link :to="'/'" class="titulo">
              <v-toolbar-title class="mx-5 titulo">Sea Shepherd</v-toolbar-title>
            </router-link>
          </div>
          <i v-if="userRole === 'admin'" class="mdi mdi-cog-box mdi-36px"></i>
          <div v-if="userRole === 'admin'" class="select-container">
            <select class="select" v-model="selectedEmpresa" @change="seleccionarEmpresa">
              <option disabled value="">Selecciona una empresa</option>
              <option v-for="empresa in empresas" :value="empresa.id_empresa">{{ empresa.nom_empresa }}</option>
            </select>
          </div>
          <span v-if="userRole === 'admin'" class="icon" @click="limpiarSeleccion"><i class="mdi mdi-close mdi-36px"></i></span>
          
        </div>

        <!-- CLIENTE SIN INICIAR SESION -->
        <div style="width: 50%" v-if="userRole === ''">
          <router-link :to="'/login'" class="colorBTN">Iniciar Sesión</router-link>
          <router-link :to="'/camara'" class="colorBTN"> Càmera</router-link>
        </div>

        <!-- CLIENTE CON SESION INICIADA -->
        <div style="width: 50%" v-if="userRole === 'cliente'">
          <router-link :to="'/'" class="colorBTN" @click.prevent="logout">Tancar Sessió</router-link>
          <router-link :to="'/camara'" class="colorBTN"> Càmera</router-link>
        </div>

        <!-- TECNICO WEB -->
        <div style="width: 50%" v-if="userRole === 'tecnico_web'">
          <router-link :to="'/'" class="colorBTN" @click.prevent="logout">Tancar Sessió</router-link>
          <v-btn id="gestioSubmari" class="colorBTN" @mouseover="mostrarSubmari = true"
            @mouseleave="mostrarSubmari = false">Gestiò Sumbarins</v-btn>
          <router-link :to="'/incidencias'" class="colorBTN">Gestiò Incidències</router-link>
          <router-link :to="'/camara'" class="colorBTN"> Càmera</router-link>
        </div>

        <!-- ADMIN DE TODO -->
        <div style="width: 50%" v-if="userRole === 'admin'">
          <router-link :to="'/'" class="colorBTN" @click.prevent="logout">Tancar Sessió</router-link>
          <v-btn id="gestioSubmari" class="colorBTN" @mouseover="mostrarSubmari = true"
            @mouseleave="mostrarSubmari = false">Gestiò Sumbarins</v-btn>
          <router-link :to="'/incidencias'" class="colorBTN">Gestiò Incidències</router-link>
          <router-link :to="'/camara'" class="colorBTN"> Càmera</router-link>
          <router-link :to="'/gestioEmpresas'" class="colorBTN"> Empresas</router-link>


        </div>

      </div>
    </div>
    <div v-else class="collapsat">
      <!-- Your collapsed view for smaller screens -->


      <router-link style="width: 80%; !important" :to="'/'" class="titulo">
        <v-toolbar-title class="mx-5 titulo">Sea Shepherd</v-toolbar-title>
      </router-link>
      <v-btn icon @click="toggleCollapsedView">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <!-- Add other collapsed view items as needed -->

      <!-- ... Your existing code for collapsed view ... -->
    </div>
  </v-toolbar>
  <transition name="fade">
    <div v-if="mostrarSubmari" class="dropdown-submari" @mouseover="mostrarSubmari = true"
      @mouseleave="mostrarSubmari = false">

      <router-link :to="'/datos'" class="colorBTN"> Dades</router-link>
      <router-link :to="'/ubicacion'" class="colorBTN"> Ubicació</router-link>
      <router-link :to="'/areas'" class="colorBTN">
        Configurar àrees</router-link>
      <router-link :to="'/submarinos'" class="colorBTN">
        Submarins</router-link>
      <router-link :to="'/informes'" class="colorBTN"> Informes</router-link>
    </div>

  </transition>
</template>

<style>
.collapsat {
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
  {
  opacity: 0;
}

.dropdown-submari {
  color: #8ecae6 !important;
  background-color: rgba(127, 217, 233, 0.95) !important;
  padding: 5%;
  position: absolute;
  left: 0;
  width: 100%;
  z-index: 1000;
  /* Ensure it appears over everything */
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  /* Optional: Add a box shadow */
}

.dropdown-incidencies {
  display: none;
}

.titulo {
  font-size: 24px !important;
  font-weight: bold !important;
  color: white;
  text-decoration: none;
}

.colorBTN {
  font-weight: bold;
  color: white;
  padding: 5px;
  border-radius: 10px;
  text-decoration: none;
  margin-left: 3%;
  margin-right: 3%;
  height: 100%;
  display: flex;
  float: right;
}

.colorBTN:hover {
  font-weight: bold;
  color: #152636;
  transition: 0.2s;
}

.header-container {
  display: flex;
  align-items: center;
}

.title-container {
  margin-right: auto;
  /* Esto empujará el select hacia la derecha */
}

.select-container {
  flex-grow: 1;
  /* Esto permite que el select ocupe todo el espacio restante disponible */
}

.select {
  /* Estilos del select según tus preferencias */
  padding: 5px;
  border-radius: 5px;
  border: 2px solid #333;
  /* Añade bordes */
}
</style>

<script>
import { useAppStore } from "@/store/app";
import { socket, state } from "../services/socket";
export default {
  computed: {
    // ESTADO DEL MOTOR
    motor() {
      return state.motor;
    },
    userRole() {
      const appStore = useAppStore();
      return appStore.userRole; // Añade el rol del usuario a tus datos computados
    },
    selectedEmpresa: {
      get() {
        return localStorage.getItem('selectedEmpresa') || ''; // Get selectedEmpresa from localStorage or default to an empty string
      },
      set(value) {
        localStorage.setItem('selectedEmpresa', value); // Store selectedEmpresa in localStorage
      }
    }
  },
  methods: {
    
    cambiar() {
      if (this.mostrarSubmari) {
        this.mostrarSubmari = false
      } else {
        this.mostrarSubmari = true
      }
    },
    seleccionarEmpresa(event) {
      const appStore = useAppStore();
      
      const selectedValue = event.target.value;
      this.selectedEmpresa = selectedValue;
      appStore.setUserEmpresa(selectedValue);
      localStorage.setItem('selectedEmpresa', selectedValue);
      window.alert('¡Empresa cambiada!', selectedValue);

      // Recargar la página
      location.reload();

    },
    limpiarSeleccion() {
      const appStore = useAppStore();
      this.selectedEmpresa = '';
      localStorage.removeItem('selectedEmpresa');
      appStore.setUserEmpresa(null);

      location.reload();
    },
    logout() {
      const appStore = useAppStore();
      appStore.clearSession();
    },
    toggleCollapsedView() {
      this.mostrarSubmari = !this.mostrarSubmari;
    },
    handleResize() {
      this.isWideScreen = window.innerWidth >= 1000; // Adjust the breakpoint as needed
    },
    getEmpresa() {
      const appStore = useAppStore()
      this.empresas = appStore.getEmpresas;
    }
  },
  data() {
    return {
      mostrarSubmari: false,
      mostrarEmpresa: false,
      isWideScreen: window.innerWidth >= 1000, // Adjust the breakpoint as needed
      empresas: [],
      //selectedEmpresa: localStorage.getItem('selectedEmpresa') || null, // Initialize selectedEmpresa from localStorage or default to null
    };
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },

  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  created() {
    this.getEmpresa()
  }
};

</script>
