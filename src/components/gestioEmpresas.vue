<template>
  <default-bar />
  <v-container fluid fill-height>
    <v-row>
      <!-- Gráfico vacío a la izquierda -->
      <v-col cols="12" md="6">
        
        <v-card>
          <v-card-title>Gráfico de Barras</v-card-title>
          <v-card-text>
            <v-bar-chart
              :data="getChartData()"
              :options="getChartOptions()"
            ></v-bar-chart>
          </v-card-text>
        </v-card>
        
      </v-col>

      <!-- Lista de clientes a la derecha -->
      <v-col cols="12" md="6">
        <v-card max-width="1000" height="auto" width="auto" style="
            position: absolute;
            margin-top: 25px;
            background-color: rgb(189, 236, 255);
          ">

          <!-- Contenedor para el botón y el campo de búsqueda -->
          <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-left: 15px;
            ">

            <!-- Botón para crear empresa -->
            <v-btn color="primary" @click="abrirModalCrearEmpresa">Crear Empresa</v-btn>

            <!-- Campo de búsqueda -->
            <div class="search-wrapper">
              <input class="search-input" type="text" v-model="filtroEmpresa" placeholder=" Buscar cliente" />
            </div>
          </div>

          <!-- Mostrar lista de clientes filtrada -->
          <v-card v-for="(empresa, index) in clientesFiltrados" :key="index"
            style="margin: 15px; width: auto; height: auto">
            <v-row align="center">
              <v-col>
                <p style="margin: 20px; margin-right: 200px;">
                  {{ empresa.nom_empresa }}
                </p>
              </v-col>
            </v-row>
            <!-- BTN para eliminar clientes -->
            <v-btn icon @click="eliminarCliente(empresa)" style="position: absolute; right: 10px; bottom: 10px">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <!-- Botón para editar empresa -->
            <v-btn icon @click="editarEmpresa(empresa)" style="position: absolute; right: 70px; bottom: 10px">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <!-- Botón para ver todos los datos de las empresas -->
            <v-btn icon @click="mostrarDatosEmpresa(empresa)" style="position: absolute; right: 130px; bottom: 10px">
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
                  <div style="
                      display: flex;
                      flex-direction: row;
                      justify-content: space-between;
                    ">
                    <div style="width: 48%">
                      <label>Nombre: </label>
                      <input v-model="empresaEditada.nombre" required class="bordered-input"
                        style="height: auto; width: 300px" maxlength="30" />
                    </div>
                    <div style="width: 48%">
                      <label>Teléfono: </label>

                      <!-- Campo para el número de teléfono -->
                      <input v-model="empresaEditada.telefono" required class="bordered-input" type="tel"
                        @input="filtrarNumeros" maxlength="15" />
                    </div>
                  </div>

                  <!-- PROVINCIA + CIUDAD -->
                  <div style="
                      display: flex;
                      flex-direction: row;
                      justify-content: space-between;
                      margin-top: 15px;
                    ">
                    <!-- Provincia y CIUDAD -->
                    <div style="width: 48%;">
                      <label>Provincia: </label>
                      <input v-model="empresaEditada.provincia" required class="bordered-input"
                        style="height: auto; width: 290px" maxlength="45" />
                    </div>
                    <div style="width: 48%">
                      <label>Ciudad: </label>
                      <input v-model="empresaEditada.ciudad" required class="bordered-input"
                        style="height: auto; width: 270px" maxlength="45" />
                    </div>
                  </div>

                  <!-- Direccion -->
                  <div style="margin-top: 15px">
                    <label>Dirección: </label>
                    <v-textarea v-model="empresaEditada.nombre_calle" required class="bordered-input"
                      style="height: auto; width: 653px" maxlength="245"></v-textarea>
                  </div>

                  <!-- CORREO + PLAN DE SUSCRIPCION -->
                  <div style="
                      display: flex;
                      flex-direction: row;
                      justify-content: space-between;
                      margin-top: 15px;
                    ">
                    <div style="width: 48%">
                      <label>Correo Electrónico: </label>
                      <input v-model="empresaEditada.correo" required class="bordered-input"
                        style="height: auto; width: 220px" type="email" />
                    </div>
                    <div style="width: 48%">
                      <label>Plan de Suscripción: </label>
                      <select v-model="empresaEditada.plan" class="bordered-input" style="height: auto; width: 173px">
                        <option value="Standard">Standard</option>
                        <option value="Premium">Premium</option>
                        <option value="Premium Plus">Premium Plus</option>
                      </select>
                    </div>
                  </div>

                  <!-- SITIO WEB -->
                  <div style="margin-top: 15px">
                    <label>Sitio Web: </label>
                    <input v-model="empresaEditada.sitioWeb" required class="bordered-input"
                      style="height: auto; width: 653px" maxlength="250" type="url" />
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
                  <!-- NOMBRE + TEL -->
                  <div style="
                      display: flex;
                      flex-direction: row;
                      justify-content: space-between;
                    ">
                    <!-- NOPMBRE y TELEFONO -->
                    <div style="width: 48%">
                      <label>Nombre: </label>
                      <input v-model="nuevaEmpresa.nombre" required class="bordered-input"
                        style="height: auto; width: 300px" maxlength="30" />
                    </div>
                    <div style="width: 48%">
                      <label>Teléfono: </label>
                      <input v-model="nuevaEmpresa.telefono" required class="bordered-input" @input="filtrarNumeros"
                        type="tel" pattern="[0-9]*" maxlength="15" />
                    </div>
                  </div>

                  <!-- PROVINCIA + CIUDAD -->
                  <div style="
                      display: flex;
                      flex-direction: row;
                      justify-content: space-between;
                      margin-top: 15px;
                    ">
                    <!-- Provincia y CIUDAD -->
                    <div style="width: 48%;">
                      <label>Provincia: </label>
                      <input v-model="nuevaEmpresa.provincia" required class="bordered-input"
                        style="height: auto; width: 290px" maxlength="45" />
                    </div>
                    <div style="width: 48%">
                      <label>Ciudad: </label>
                      <input v-model="nuevaEmpresa.ciudad" required class="bordered-input"
                        style="height: auto; width: 270px" maxlength="45" />
                    </div>
                  </div>

                  <!-- Dirección -->
                  <div style="margin-top: 15px">
                    <label>Dirección: </label>
                    <v-textarea v-model="nuevaEmpresa.nombre_calle" required class="bordered-input"
                      style="height: auto; width: 653px" maxlength="245"></v-textarea>
                  </div>

                  <!-- Correo electrónico + Plan de suscripción -->
                  <div style="
                      display: flex;
                      flex-direction: row;
                      justify-content: space-between;
                      margin-top: 15px;
                    ">
                    <div style="width: 48%">
                      <label>Correo Electrónico: </label>
                      <input v-model="nuevaEmpresa.correo" required class="bordered-input"
                        style="height: auto; width: 220px" type="email" />
                    </div>
                    <div style="width: 48%">
                      <label>Plan de Suscripción: </label>
                      <select v-model="nuevaEmpresa.plan" required class="bordered-input"
                        style="height: auto; width: 173px">
                        <option value="Standard">Standard</option>
                        <option value="Premium">Premium</option>
                        <option value="Premium Plus">Premium Plus</option>
                      </select>
                    </div>
                  </div>

                  <!-- Sitio web -->
                  <div style="margin-top: 15px">
                    <label>Sitio Web: </label>
                    <input v-model="nuevaEmpresa.sitioWeb" required class="bordered-input"
                      style="height: auto; width: 653px" maxlength="250" type="url" />
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
                      <v-list-item-title>{{
              empresaSeleccionada.nom_empresa
            }}</v-list-item-title>
                      <v-list-item-subtitle><b>Provincia: </b> {{
                empresaSeleccionada.provincia
              }}</v-list-item-subtitle>
                      <v-list-item-subtitle><b>Ciudad: </b> {{
                empresaSeleccionada.ciudad
              }}</v-list-item-subtitle>
                      <v-list-item-subtitle><b>Calle: </b> {{
                empresaSeleccionada.nombre_calle
              }}</v-list-item-subtitle>
                      <v-list-item-subtitle><b>TEL: </b>{{
                empresaSeleccionada.numero_teléfono
              }}</v-list-item-subtitle>
                      <v-list-item-subtitle><b>MAIL: </b>{{
                empresaSeleccionada.correo
              }}</v-list-item-subtitle>
                      <v-list-item-subtitle><b>Web: </b>{{
                empresaSeleccionada.sitio_web
              }}</v-list-item-subtitle>
                      <v-list-item-subtitle><b>Suscripción: </b>{{
                        empresaSeleccionada.plan
                        }}</v-list-item-subtitle>
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
import { insertEmpresa, getEmpresa, updateEmpresa, deleteEmpresa } from "@/services/connectionManager";
//import { BarChart } from 'vuetify/lib';

export default {
  data() {
    return {
      clienteSeleccionado: null,
      modoEdicion: false,
      filtroEmpresa: "",
      mostrarModalEditarEmpresa: false,
      empresaEditada: {
        nombre: "",
        nombre_calle: "",
        telefono: "",
        correo: "",
        plan: "Standard",
        sitioWeb: "",
        provincia: "",
        ciudad: "",
        id: ""
      },
      nuevaEmpresa: {
        nombre: "",
        nombre_calle: "",
        telefono: "",
        correo: "",
        plan: "Standard",
        sitioWeb: "",
        provincia: "",
        ciudad: ""
      },
      prefijoTelefonoEditar: "+1",
      clienteEditado: null,
      modoEdicionCliente: false,
      mostrarModalDatosEmpresas: false,
      empresaSeleccionada: null,
      empresas: [],
      empresasEnviar: [],
      empresaEditadaEnviar: [],
      mostrarModalCrear: false,
      
    };
  },
  computed: {
    // Computed property para filtrar clientes
    clientesFiltrados() {
      return this.empresas.filter((empresa) => {
        return (
          empresa.nom_empresa &&
          empresa.nom_empresa
            .toLowerCase()
            .includes(this.filtroEmpresa.toLowerCase())
        );
      });
    },
  },
  // METODOS
  methods: {
    // Método para filtrar solo números en el campo de teléfono
    filtrarNumeros(event) {
      const input = event.target.value;
      // Filtrar cualquier carácter que no sea un número
      const filteredInput = input.replace(/\D/g, "");
      // Actualizar el valor del campo de entrada con los números filtrados
      this.nuevaEmpresa.telefono = filteredInput;
    },

    // EDITAR EMPRESAS
    editarEmpresa(empresa) {
      this.empresaSeleccionada = empresa;

      this.empresaEditada.nombre = empresa.nom_empresa;
      this.empresaEditada.nombre_calle = empresa.nombre_calle;
      this.empresaEditada.telefono = empresa.numero_teléfono;
      this.empresaEditada.correo = empresa.correo;
      this.empresaEditada.sitioWeb = empresa.sitio_web;
      this.empresaEditada.plan = empresa.plan;
      this.empresaEditada.provincia = empresa.provincia;
      this.empresaEditada.ciudad = empresa.ciudad;
      this.empresaEditada.id = empresa.id_empresa;

      // Abre el modal de edición de empresa
      this.mostrarModalEditarEmpresa = true;
    },

    // ELIMINAR EMPRESA
    async eliminarCliente(empresa) {
      const confirmacion = confirm("¿Estás seguro que quieres eliminar la empresa " + empresa.nom_empresa + "?");
      if (confirmacion) {
        const id_empresa = empresa.id_empresa;
        await deleteEmpresa(id_empresa);
        this.getEmpresas();
      } else {
        // Si el usuario cancela, no se realiza ninguna acción
        return;
      }
    },

    // GUARDAR EDICION EMPRESA
    async guardarEdicionEmpresa() {
      this.empresaEditadaEnviar.push(
        this.empresaEditada.nombre,
        this.empresaEditada.nombre_calle,
        this.empresaEditada.telefono,
        this.empresaEditada.correo,
        this.empresaEditada.sitioWeb,
        this.empresaEditada.plan,
        this.empresaEditada.provincia,
        this.empresaEditada.ciudad,
        this.empresaEditada.id
      );
      // console.log(this.empresaEditadaEnviar);
      await updateEmpresa(this.empresaEditadaEnviar)
      this.getEmpresas();
      this.mostrarModalEditarEmpresa = false;
    },

    // CERRAR DIALOGO DE EDITAR
    cancelarEdicionEmpresa() {
      // Restablece los valores originales antes de la edición
      this.empresaEditada.nombre = "";
      this.empresaEditada.nombre_calle = "";
      this.empresaEditada.telefono = "";
      this.empresaEditada.correo = "";
      this.empresaEditada.plan = "Standard";
      this.empresaEditada.sitioWeb = "";
      this.empresaEditada.provincia = "";
      this.empresaEditada.ciudad = "";

      // Cierra el modal de edición
      this.mostrarModalEditarEmpresa = false;
    },

    mostrarFormularioEmpresa() {
      // Mostrar el modal editar empresa
      this.mostrarModalEditarEmpresa = true;
    },

    // CREAR Y GUARDAR EMPRESA
    async crearYGuardarEmpresa() {
      // Validar que todos los campos estén rellenados
      if (
        !this.nuevaEmpresa.nombre ||
        !this.nuevaEmpresa.nombre_calle ||
        !this.nuevaEmpresa.telefono ||
        !this.nuevaEmpresa.correo ||
        !this.nuevaEmpresa.sitioWeb ||
        !this.nuevaEmpresa.provincia ||
        !this.nuevaEmpresa.ciudad
      ) {
        alert("Por favor, complete todos los campos antes de guardar.");
        return; // Detener la función si algún campo está vacío
      }

      // Validar el formato del correo electrónico
      const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        this.nuevaEmpresa.correo
      );
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

      // Validar que la provincia no tenga caracteres raros (solo letras )
      const provinciaValida = /^[a-zA-Z\s]*$/.test(this.nuevaEmpresa.provincia);
      if (!provinciaValida) {
        alert("La provincia solo puede contener letras.");
        return; // Detener la función si la provincia contiene caracteres no permitidos
      }

      // Validar que la ciudad no tenga caracteres raros (solo letras )
      const ciudadValida = /^[a-zA-Z\s]*$/.test(this.nuevaEmpresa.ciudad);
      if (!ciudadValida) {
        alert("La ciudad solo puede contener letras.");
        return; // Detener la función si la ciudad contiene caracteres no permitidos
      }

      // Agregar la nueva empresa a la lista de empresas
      this.empresas.push({
        nom_empresa: this.nuevaEmpresa.nombre,
        nombre_calle: this.nuevaEmpresa.nombre_calle,
        numero_teléfono: this.nuevaEmpresa.telefono,
        correo: this.nuevaEmpresa.correo,
        plan: this.nuevaEmpresa.plan,
        sitio_web: this.nuevaEmpresa.sitioWeb,
        provincia: this.nuevaEmpresa.provincia,
        ciudad: this.nuevaEmpresa.ciudad
      });

      this.empresasEnviar.push(
        this.nuevaEmpresa.nombre,
        this.nuevaEmpresa.nombre_calle,
        this.nuevaEmpresa.telefono,
        this.nuevaEmpresa.correo,
        this.nuevaEmpresa.sitioWeb,
        this.nuevaEmpresa.plan,
        this.nuevaEmpresa.provincia,
        this.nuevaEmpresa.ciudad
      );

      await insertEmpresa(this.empresasEnviar);

      // console.log("Después de agregar a empresas:", this.empresas);

      // Limpiar el formulario y ocultar el modal
      this.nuevaEmpresa = {
        nombre: "",
        nombre_calle: "",
        telefono: "",
        correo: "",
        plan: "Standard",
        sitioWeb: "",
        provincia: "",
        ciudad: ""
      };

      this.empresasEnviar = [];

      this.getEmpresas();
      this.mostrarModalCrear = false;
    },

    // Método para limpiar el formulario
    limpiarFormularioEmpresa() {
      this.nuevaEmpresa = {
        nombre: "",
        nombre_calle: "",
        telefono: "",
        correo: "",
        plan: "Standard",
        sitioWeb: "",
        provincia: "",
        ciudad: ""
      };

      // Ocultamos el modal
      this.mostrarModalCrear = false;
    },

    // SELECT EMPRESAS
    async getEmpresas() {
      this.empresas = await getEmpresa();
      //console.log(this.empresas);
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

    getChartData() {
      return {
        labels: ['Aigües de Barcelona', 'Institut de Ciències del Mar', 'INS mi casa', 'Empresa Carlos Ramirez'],
        datasets: [
          {
            label: 'Plan de la Empresa',
            backgroundColor: ['#2196F3', '#4CAF50', '#FFC107', '#FF5722'],
            data: [2, 3, 1, 2] // Se debe adaptar según la cantidad de planes
          }
        ]
      };
    },
    getChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            ticks: {
              autoSkip: false
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              stepSize: 1
            }
          }]
        },
        legend: {
          display: true,
          position: 'top'
        }
      };
    }
   
  },

  //CONSOLA
  created() {
    console.log("CREADO");
    this.getEmpresas();
    //console.log(this.empresas);
  },
  mounted() {
    console.log("MONTADO");
    this.getEmpresas().then(() => {

    });
  },

  updated() {
    console.log("UPDATED");
  },
};
</script>

<script setup>
import DefaultBar from "@/layouts/default/AppBar.vue";
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