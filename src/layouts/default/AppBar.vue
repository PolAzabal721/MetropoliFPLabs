<template>
  <v-toolbar color="#122C34">
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
            <router-link :to="'/'" class="title">
              <v-toolbar-title class="mx-5 title">Sea Shepherd</v-toolbar-title>
            </router-link>
          </div>
          <i v-if="userRole === 'admin'" class="mdi mdi-cog-box mdi-36px"></i>
          <div v-if="userRole === 'admin'" class="seleccion-container">
            <select class="seleccion" v-model="selectedEmpresa" @change="seleccionarEmpresa">
              <option disabled value="">Selecciona una empresa</option>
              <option v-for="empresa in empresas" :value="empresa.id_empresa">{{ empresa.nom_empresa }}</option>
            </select>
          </div>
          <span v-if="userRole === 'admin'" class="icono" @click="limpiarSeleccion"><i
              class="mdi mdi-close mdi-36px "></i></span>
        </div>

        <!-- CLIENTE SIN INICIAR SESION -->
        <div style="width: 50%" v-if="userRole === ''">
          <router-link :to="'/login'" class="colorBoton">Iniciar Sesión</router-link>
          <router-link :to="'/camara'" class="colorBoton"> Càmera</router-link>
        </div>

        <!-- CLIENTE CON SESION INICIADA -->
        <div style="width: 50%" v-if="userRole === 'cliente'">
          <router-link :to="'/'" class="colorBoton" @click.prevent="logout">Tancar Sessió</router-link>
          <router-link :to="'/camara'" class="colorBoton"> Càmera</router-link>
        </div>

        <!-- TECNICO WEB -->
        <div style="width: 50%" v-if="userRole === 'tecnico_web'">
          <router-link :to="'/'" class="colorBoton" @click.prevent="logout">Tancar Sessió</router-link>
          <v-btn id="gestioSubmari" class="colorBoton" @mouseover="mostrarSubmari = true"
            @mouseleave="mostrarSubmari = false">Gestiò Sumbarins</v-btn>
          <router-link :to="'/incidencias'" class="colorBoton">Gestiò Incidències</router-link>
          <router-link :to="'/camara'" class="colorBoton"> Càmera</router-link>
        </div>

        <!-- ADMIN DE TODO -->
        <div style="width: 50%" v-if="userRole === 'admin'">
          <router-link :to="'/'" class="colorBoton" @click.prevent="logout">Tancar Sessió</router-link>
          <v-btn id="gestioSubmari" class="colorBoton" @mouseover="mostrarSubmari = true"
            @mouseleave="mostrarSubmari = false">Gestiò Sumbarins</v-btn>
          <router-link :to="'/incidencias'" class="colorBoton">Gestiò Incidències</router-link>
          <router-link :to="'/camara'" class="colorBoton"> Càmera</router-link>
          <router-link :to="'/gestioEmpresas'" class="colorBoton"> Empresas</router-link>


        </div>

      </div>
    </div>
    <div v-else class="collapsat">
      <!-- Your collapsed view for smaller screens -->


      <router-link style="width: 80%;" :to="'/'" class="title">
        <v-toolbar-title class="mx-5 title">Sea Shepherd</v-toolbar-title>
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

      <router-link :to="'/datos'" class="colorBoton"> Dades</router-link>
      <router-link :to="'/ubicacion'" class="colorBoton"> Ubicació</router-link>
      <router-link :to="'/areas'" class="colorBoton">
        Configurar àrees</router-link>
      <router-link :to="'/submarinos'" class="colorBoton">
        Submarins</router-link>
      <router-link :to="'/informes'" class="colorBoton"> Informes</router-link>
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

.icono {
  cursor: pointer;
  margin-left: 10px;
  /* Ajusta este valor según tus necesidades */
}

.dropdown-submari {
  color: white !important;
  background-color: rgba(18, 44, 52, 0.85) !important;  padding: 2%;
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

.title {
  font-size: 24px !important;
  font-weight: bold !important;
  color: white !important;
  text-decoration: none;
}

.colorBoton {
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

.colorBoton:hover {
  font-weight: bold;
  color: #FFEBD6;
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



.seleccion-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.seleccion {
  padding: 5px;
  border-radius: 5px;
  border: 2px solid white;
  color: white;
  /* color normal */

}

.seleccion:focus,
.seleccion option:checked {
  color: black;
  /* Cambiar color a negro cuando esté seleccionado o enfocado */
  background-color: white;
  /* Cambiar el fondo a blanco para que se vea el texto negro */
}
</style>

<script>
import { useAppStore } from "@/store/app";
import { socket, state } from "@/services/socket";
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