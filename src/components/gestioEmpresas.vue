<template>
  <default-bar />
  <v-container fluid fill-height>
    <v-row>
      <!-- Gráfico vacío a la izquierda -->
      <v-col cols="12" md="6">
        <!-- Aquí puedes agregar tu gráfico o cualquier otro contenido -->
        <div>
          gráfico <!-- Contenido del gráfico o cualquier otro elemento -->
        </div>
      </v-col>

      <!-- Lista de clientes a la derecha -->
      <v-col cols="12" md="6">
        <v-card height="auto" width="600"
          style="position: absolute; margin-left: 300px; margin-top: 25px; background-color: rgb(189, 236, 255);">

          <!-- Contenedor para el botón y el campo de búsqueda -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-left: 15px;">
            <!-- Botón para crear empresa -->
            <v-btn color="primary" @click="abrirModalCrearEmpresa">Crear Empresa</v-btn>

            <!-- Campo de búsqueda -->
            <div class="search-wrapper">
              <input class="search-input" type="text" v-model="filtroEmpresa" placeholder=" Buscar cliente">
            </div>
          </div>

          <!-- Mostrar lista de clientes filtrada -->
          <v-card v-for="(empresa, index) in clientesFiltrados" :key="index"
            style="margin: 15px; width: auto; height: auto;">
            <v-row align="center">
              <v-col>
                <p style="margin: 20px;">
                  {{ empresa.nom_empresa }}
                </p>
              </v-col>
            </v-row>
            <v-btn icon @click="eliminarCliente(index)" style="position: absolute; right: 10px; bottom: 10px;">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <!-- Botón para editar empresa -->
            <v-btn icon @click="editarEmpresa(empresa)" style="position: absolute; right: 70px; bottom: 10px;">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <!-- Botón para ver todos los datos de las empresas -->
            <v-btn icon @click="mostrarDatosEmpresa(empresa)" style="position: absolute; right: 130px; bottom: 10px;">
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </v-card>

          <!-- EDITAR EMPRESA -->
          <v-dialog v-model="mostrarModalEditarEmpresa" max-width="820" max-height="700">
            <v-card width="auto" height="auto">
              <v-card-title>Editar Empresa</v-card-title>
              <v-card-text>
                <form>
                  <!-- NOMBRE + TEL -->
                  <div style="display: flex; flex-direction: row; justify-content: space-between;">
                    <div style="width: 48%;">
                      <label>Nombre: </label>
                      <input v-model="empresaEditada.nombre" required class="bordered-input"
                        style="height: auto; width: 300px;" maxlength="30">
                    </div>
                    <div style="width: 48%;">
                      <label>Teléfono: </label>

                      <!-- Campo para seleccionar el prefijo -->
                      <select v-model="prefijoTelefonoEditar" class="select-prefijo">
                        <!-- Opciones de prefijo telefónico -->
                      </select>

                      <!-- Campo para el número de teléfono -->
                      <input v-model="empresaEditada.telefono" required class="bordered-input" type="tel"
                        @input="filtrarNumeros" maxlength="15">
                    </div>
                  </div>

                  <!-- DIRECCION -->
                  <div style="margin-top: 15px;">
                    <label>Dirección: </label>
                    <v-textarea v-model="empresaEditada.direccion" required class="bordered-input"
                      style="height: auto; width: 653px;" maxlength="245"></v-textarea>
                  </div>

                  <!-- CORREO + PLAN DE SUSCRIPCION -->
                  <div style="display: flex; flex-direction: row; justify-content: space-between; margin-top: 15px;">
                    <div style="width: 48%;">
                      <label>Correo Electrónico: </label>
                      <input v-model="empresaEditada.correo" required class="bordered-input"
                        style="height: auto; width: 220px;" type="email">
                    </div>
                    <div style="width: 48%;">
                      <label>Plan de Suscripción: </label>
                      <select v-model="empresaEditada.plan" class="bordered-input" style="height: auto; width: 173px;">
                        <!-- Opciones de plan de suscripción -->
                      </select>
                    </div>
                  </div>

                  <!-- SITIO WEB -->
                  <div style="margin-top: 15px;">
                    <label>Sitio Web: </label>
                    <input v-model="empresaEditada.sitioWeb" required class="bordered-input"
                      style="height: auto; width: 653px;" maxlength="250" type="url">
                  </div>

                </form>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" @click="guardarEdicionEmpresa">Guardar</v-btn>
                <v-btn color="error" @click="cancelarEdicionEmpresa">Cancelar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>


          <!-- CREAR EMPRESA -->
          <v-dialog v-model="mostrarModalCrear" max-width="820" max-height="700">
            <v-card width="auto" height="auto">
              <v-card-title>Crear Empresa</v-card-title>
              <v-card-text>
                <form>
                  <div style="display: flex; flex-direction: row; justify-content: space-between;">
                    <div style="width: 48%;">
                      <label>Nombre: </label>
                      <input v-model="nuevaEmpresa.nombre" required class="bordered-input"
                        style="height: auto; width: 300px;" maxlength="30">
                    </div>
                    <div style="width: 48%;">
                      <label>Teléfono: </label>
                      <input v-model="nuevaEmpresa.telefono" required class="bordered-input" type="tel" pattern="[0-9]*"
                        maxlength="15">
                    </div>
                  </div>

                  <!-- Dirección -->
                  <div style="margin-top: 15px;">
                    <label>Dirección: </label>
                    <v-textarea v-model="nuevaEmpresa.direccion" required class="bordered-input"
                      style="height: auto; width: 653px;" maxlength="245"></v-textarea>
                  </div>

                  <!-- Correo electrónico + Plan de suscripción -->
                  <div style="display: flex; flex-direction: row; justify-content: space-between; margin-top: 15px;">
                    <div style="width: 48%;">
                      <label>Correo Electrónico: </label>
                      <input v-model="nuevaEmpresa.correo" required class="bordered-input"
                        style="height: auto; width: 220px;" type="email">
                    </div>
                    <div style="width: 48%;">
                      <label>Plan de Suscripción: </label>
                      <select v-model="nuevaEmpresa.plan" required class="bordered-input"
                        style="height: auto; width: 173px;">
                        <option value="bronce">Bronce</option>
                        <option value="plata">Plata</option>
                        <option value="oro">Oro</option>
                        <option value="diamante">Diamante</option>
                      </select>
                    </div>
                  </div>

                  <!-- Sitio web -->
                  <div style="margin-top: 15px;">
                    <label>Sitio Web: </label>
                    <input v-model="nuevaEmpresa.sitioWeb" required class="bordered-input"
                      style="height: auto; width: 653px;" maxlength="250" type="url">
                  </div>
                </form>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" @click="crearYGuardarEmpresa">Guardar</v-btn>
                <v-btn color="error" @click="limpiarFormularioEmpresa">Cancelar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>







          <!-- Diálogo para ver todos los datos de las empresas -->
          <v-dialog v-model="mostrarModalDatosEmpresas" max-width="820" max-height="700">
            <v-card width="auto" height="auto">
              <v-card-title>Detalles de la Empresa</v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item v-if="empresaSeleccionada">
                    <v-list-item>
                      <v-list-item-title>{{ empresaSeleccionada.nom_empresa }}</v-list-item-title>
                      <v-list-item-subtitle>{{ empresaSeleccionada.direccion }}</v-list-item-subtitle>
                      <v-list-item-subtitle>{{ empresaSeleccionada.numero_teléfono }}</v-list-item-subtitle>
                      <v-list-item-subtitle>{{ empresaSeleccionada.correo }}</v-list-item-subtitle>
                      <v-list-item-subtitle>{{ empresaSeleccionada.sitio_web }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-list-item>
                </v-list>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" @click="mostrarModalDatosEmpresas = false">Cerrar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useAppStore } from "@/store/app";
import { socket, state } from '../services/socket';

export default {

  data() {
    return {
      clienteSeleccionado: null,
      modoEdicion: false,
      filtroEmpresa: '',

      mostrarModalEditarEmpresa: false,
      empresaEditada: {
        nombre: '',
        direccion: '',
        telefono: '',
        correo: '',
        plan: 'bronce',
        sitioWeb: '',
      },

      nuevaEmpresa: {
        nombre: '',
        direccion: '',
        telefono: '',
        correo: '',
        plan: 'bronce',
        sitioWeb: '',
      },
      prefijoTelefonoEditar: '+1',
      clienteEditado: null,
      modoEdicionCliente: false,
      mostrarModalDatosEmpresas: false,
      empresaSeleccionada: null,
      empresas: [],
      mostrarModalCrear: false,
    };
  },
  computed: {
    userRole() {
      const appStore = useAppStore();
      return appStore.userRole; // Añade el rol del usuario a tus datos computados
    },

    // Computed property para filtrar clientes
    clientesFiltrados() {
      return this.empresas.filter(empresa => {
        return empresa.nom_empresa.toLowerCase().includes(this.filtroEmpresa.toLowerCase());
      });
    },
  },
  // METODOS
  methods: {
    // Método para filtrar solo números en el campo de teléfono
    filtrarNumeros(event) {
      const input = event.target.value;
      // Filtrar cualquier carácter que no sea un número
      const filteredInput = input.replace(/\D/g, '');
      // Actualizar el valor del campo de entrada con los números filtrados
      this.nuevaEmpresa.telefono = filteredInput;
    },

    editarEmpresa(empresa) {
      this.empresaSeleccionada = empresa;

      this.nuevaEmpresa.nombre = empresa.nom_empresa;
      this.nuevaEmpresa.direccion = empresa.direccion;
      this.nuevaEmpresa.telefono = empresa.numero_teléfono;
      this.nuevaEmpresa.correo = empresa.correo;
      this.nuevaEmpresa.sitioWeb = empresa.sitio_web;

      // Abre el modal de edición de empresa
      this.mostrarModalEditarEmpresa = true;
    },

    // Método para cerrar el diálogo de edición sin guardar cambios
    cerrarModalEditar() {
      // Limpiar los datos del cliente editado y el modo de edición
      this.clienteEditado = null;
      this.modoEdicionCliente = false;
    },

    mostrarFormularioEmpresa() {
      // Mostrar el modal o sección para crear empresa
      this.mostrarModalEditarEmpresa = true;
    },

    // CREAR Y GUARDAAR EMPRESA
    crearYGuardarEmpresa() {
      // Validar que todos los campos estén rellenados
      if (!this.nuevaEmpresa.nombre || !this.nuevaEmpresa.direccion || !this.nuevaEmpresa.telefono || !this.nuevaEmpresa.correo || !this.nuevaEmpresa.sitioWeb) {
        alert("Por favor, complete todos los campos antes de guardar.");
        return; // Detener la función si algún campo está vacío
      }

      // Validar el formato del correo electrónico
      const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.nuevaEmpresa.correo);
      if (!correoValido) {
        alert("Por favor, ingrese un correo electrónico válido.");
        return; // Detener la función si el correo electrónico no es válido
      }

      // Validar que el nombre no tenga caracteres raros (solo letras y números)
      const nombreValido = /^[a-zA-Z0-9\s]*$/.test(this.nuevaEmpresa.nombre);
      if (!nombreValido) {
        alert("El nombre solo puede contener letras y números.");
        return; // Detener la función si el nombre contiene caracteres no permitidos
      }

      // Agregar la nueva empresa a la lista de empresas
      this.empresas.push({
        nombre: this.nuevaEmpresa.nombre,
        direccion: this.nuevaEmpresa.direccion,
        telefono: this.nuevaEmpresa.telefono,
        correo: this.nuevaEmpresa.correo,
        plan: this.nuevaEmpresa.plan,
        sitioWeb: this.nuevaEmpresa.sitioWeb,
      });

      // Limpiar el formulario y ocultar el modal
      this.nuevaEmpresa = {
        nombre: '',
        direccion: '',
        telefono: '',
        correo: '',
        plan: 'bronce',
        sitioWeb: '',
      };
      this.mostrarModalCrear = false;
    },

    // Método para limpiar el formulario
    limpiarFormularioEmpresa() {
      this.nuevaEmpresa = {
        nombre: '',
        direccion: '',
        telefono: '',
        correo: '',
        plan: 'bronce',
        sitioWeb: '',
      };

      // Ocultamos el modal
      this.mostrarModalCrear = false;
    },

    getEmpresa() {
      const appStore = useAppStore()
      this.empresas = appStore.getEmpresas;
    },

    // Método para mostrar los datos de una empresa específica
    mostrarDatosEmpresa(empresa) {
      // Asignar la empresa seleccionada
      this.empresaSeleccionada = empresa;
      // Abrir el diálogo modal para mostrar los detalles
      this.mostrarModalDatosEmpresas = true;
    },

    // Método para abrir el modal de creación
    abrirModalCrearEmpresa() {
      this.mostrarModalCrear = true;
    },
  },

  //CONSOLA
  created() {
    console.log("CREADO");
    this.getEmpresa();
    //console.log(this.empresas);
  },
  mounted() {
    console.log("MONTADO");
  },

  updated() {
    console.log("UPDATED");
  }
};
</script>

<script setup>
import DefaultBar from '@/components/appbar.vue'

</script>

<style scoped>
/* Estilos para el campo de búsqueda */
.search-wrapper {
  position: relative;
  margin: 15px;
  height: 50px;
  width: 250px;
}

.search-input {
  width: 100%;
  height: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #000000;
}

.bordered-input {
  border: 1px solid #ced4da;
  border-radius: 5px;
  padding: 8px;
  transition: border-color 0.2s ease;
}

.bordered-input:focus {
  outline: none;
  border-color: #007bff;
}
</style>