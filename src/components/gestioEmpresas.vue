<template>
  <default-bar />
  <v-layout style="background-color: #EFEFEF;">
    <v-container fluid fill-height>
      <v-row>
        <!-- Gráfico a la izquierda -->
        <v-col cols="12" md="6">
          <v-card style="max-width: 900px; max-height: auto; margin-top: 25px">
            <!-- Gráfico de empresas por plan -->
            <v-card width="900" height="450">
              <canvas id="empresasPorPlan"></canvas>
            </v-card>

            <!-- Gráfico de empresas por ciudad -->
            <v-card style="margin-top: 30px;" width="900" height="450">
              <canvas ref="barChartByCity"></canvas>
            </v-card>

            <!-- Gráfico de empresas por provincia  -->
            <v-card style="margin-top: 30px;" width="900" height="450">
              <canvas ref="barChartByProvince"></canvas>
            </v-card>

          </v-card>
        </v-col>

        <!-- Lista de clientes a la derecha -->
        <v-col cols="12" md="6">

          <div style="display: flex; flex-direction: column;">

            <!-- CLIENTES -->
            <v-card max-width="1000" height="auto" width="auto" style="background-color: rgb(189, 236, 255);">

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
                <v-btn icon @click="mostrarDatosEmpresa(empresa)"
                  style="position: absolute; right: 130px; bottom: 10px">
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
                          <select v-model="empresaEditada.plan" required class="bordered-input"
                            style="height: auto; width: 173px">
                            <option v-for="plan in planes" :value="plan.id">{{ plan.nombre }}</option>
                          </select>
                        </div>
                        <div style="width: 48%">
                          <label>Auto-renovable: </label>
                          <input type="checkbox" v-model="empresaEditada.autorenovable" />
                          <!-- Muestra el valor de autorenovable para verificar -->
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
                            <option v-for="plan in planes" :value="plan.id">{{ plan.nombre }}</option>
                          </select>
                        </div>
                        <div style="width: 48%">
                          <label>Auto-renovable: </label>
                          <input type="checkbox" v-model="nuevaEmpresa.autorenovable" />
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
                    empresaSeleccionada.numero_telefono
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

            <!-- PLANES -->
            <v-card max-width="1000" height="auto" width="auto"
              style="background-color: rgb(189, 236, 255); order: 1; margin-top: 25px;">

              <!-- Contenedor para el botón y el campo de búsqueda -->
              <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-left: 15px;
            ">

                <!-- Botón para crear plan -->
                <v-btn color="primary" @click="abrirModalCrearPlan">Crear Plan</v-btn>

                <!-- Campo de búsqueda -->
                <div class="search-wrapper">
                  <input class="search-input" type="text" v-model="filtroPlan" placeholder=" Buscar Plan" />
                </div>
              </div>


              <!-- Mostrar lista de planes filtrada -->
              <v-card v-for="(plan, index) in planesFiltrados" :key="index"
                style="margin: 15px; width: auto; height: auto">
                <v-row align="center">
                  <v-col>
                    <p style="margin: 20px; margin-right: 200px;">
                      {{ plan.nombre }}
                    </p>
                  </v-col>
                </v-row>
                <!-- BTN para eliminar clientes -->
                <v-btn icon @click="eliminarPlan(plan)" style="position: absolute; right: 10px; bottom: 10px">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <!-- Botón para editar empresa -->
                <v-btn icon @click="editarPlan(plan)" style="position: absolute; right: 70px; bottom: 10px">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>

                <!-- Botón para ver todos los datos de las empresas -->
                <v-btn icon @click="mostrarDatosPlan(plan)" style="position: absolute; right: 130px; bottom: 10px">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </v-card>


              <!-- EDITAR PLAN -->
              <v-dialog v-model="mostrarModalEditarPlan" max-width="820" max-height="700">
                <v-card width="auto" height="auto">
                  <v-card-title>Editar Plan</v-card-title>
                  <v-card-text>
                    <form>
                      <div style="display: flex; flex-direction: row; justify-content: space-between;">
                        <div style="width: 48%">
                          <label>Nombre: </label>
                          <input v-model="planEditado.nombre" required class="bordered-input"
                            style="height: auto; width: 300px" maxlength="30" />
                        </div>
                        <div style="width: 48%">
                          <label>Precio: </label>
                          <input v-model="planEditado.precio" required class="bordered-input"
                            style="height: auto; width: 270px" type="number" />
                        </div>
                      </div>

                      <div
                        style="display: flex; flex-direction: row; justify-content: space-between; margin-top: 15px;">
                        <div style="width: 48%;">
                          <label>Descripcion: </label>
                          <v-textarea v-model="planEditado.descripcion" required class="bordered-input"
                            style="height: auto; width: 290px" maxlength="45" />
                        </div>
                        <div style="width: 48%">
                          <label>Plan de Suscripción: </label>
                          <select v-model="planEditado.duracion_dias" class="bordered-input"
                            style="height: auto; width: 173px">
                            <option value="30">Mensual</option>
                            <option value="365">Anual</option>
                          </select>
                        </div>
                      </div>
                    </form>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="primary" @click="guardarEdicionPlan">Guardar</v-btn>
                    <v-btn color="error" @click="cancelarEdicionPlan">Cancelar</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>


              <!-- CREAR PLAN -->
              <v-dialog v-model="mostrarModalCrearPlan" max-width="820" max-height="700">
                <v-card width="auto" height="auto">
                  <v-card-title>Crear Plan</v-card-title>
                  <v-card-text>
                    <form>
                      <!-- NOMBRE -->
                      <div style="display: flex; flex-direction: row; justify-content: space-between;">
                        <div style="width: 48%">
                          <label>Nombre: </label>
                          <input v-model="nuevoPlan.nombre" required class="bordered-input"
                            style="height: auto; width: 300px" maxlength="30" />
                        </div>
                        <!-- PRECIO -->
                        <div style="width: 48%">
                          <label>Precio: </label>
                          <input v-model="nuevoPlan.precio" required class="bordered-input"
                            style="height: auto; width: 270px" type="number" />
                        </div>
                      </div>

                      <!-- DESCRIPCION -->
                      <div style="margin-top: 15px">
                        <label>Descripción: </label>
                        <v-textarea v-model="nuevoPlan.descripcion" required class="bordered-input"
                          style="height: auto; width: 100%" maxlength="245" />
                      </div>

                      <!-- DURACION DEL PLAN -->
                      <div style="margin-top: 15px">
                        <label>Duración del Plan : </label>
                        <select v-model="nuevoPlan.duracion_dias" required class="bordered-input"
                          style="height: auto; width: 100%">
                          <option value="30">Mensual</option>
                          <option value="365">Anual</option>
                        </select>
                      </div>

                    </form>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="primary" @click="crearYGuardarPlan">Guardar</v-btn>
                    <v-btn color="error" @click="limpiarFormularioPlan">Cancelar</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>


              <!-- Diálogo para ver todos los datos de los planes -->
              <v-dialog v-model="mostrarModalDatosPlan" max-width="820" max-height="700">
                <v-card width="auto" height="auto">
                  <v-card-title>Detalles del Plan</v-card-title>
                  <v-card-text>
                    <v-list>
                      <v-list-item v-if="planSeleccionada">
                        <v-list-item>
                          <v-list-item-title>{{ planSeleccionada.nombre }}</v-list-item-title>
                          <v-list-item-subtitle><b>Precio: </b>{{ planSeleccionada.precio }}</v-list-item-subtitle>
                          <v-list-item-subtitle><b>Descripción: </b>{{ planSeleccionada.descripcion
                            }}</v-list-item-subtitle>
                          <v-list-item-subtitle><b>Duración (días): </b>{{ planSeleccionada.duracion_dias
                            }}</v-list-item-subtitle>
                        </v-list-item>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="primary" @click="mostrarModalDatosPlan = false">Cerrar</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>
import {
  insertEmpresa, getEmpresa, updateEmpresa, deleteEmpresa, insertSuscripcion,
  updateSuscripcion,
  deleteSuscripcion,
  getSuscripciones,
  insertEmpresaSub,
  editSubEmpresa,
  deleteSubEmpresa
} from "@/services/connectionManager";
import { Chart } from "chart.js/auto";

export default {
  data() {
    return {
      clienteSeleccionado: null,
      modoEdicion: false,
      filtroEmpresa: "",
      filtroPlan: "",
      mostrarModalEditarEmpresa: false,
      mostrarModalEditarPlan: false,
      empresaEditada: {
        nombre: "",
        nombre_calle: "",
        telefono: "",
        correo: "",
        plan: "",
        sitioWeb: "",
        provincia: "",
        ciudad: "",
        id: "",
        autorenovable: 0
      },
      planEditado: {
        nombre: "",
        precio: "",
        descripcion: "",
        duracion_dias: "",
        id: ""
      },
      nuevoPlan: {
        nombre: "",
        precio: "",
        descripcion: "",
        duracion_dias: ""
      },
      nuevaEmpresa: {
        nombre: "",
        nombre_calle: "",
        telefono: "",
        correo: "",
        plan: 2,
        sitioWeb: "",
        provincia: "",
        ciudad: "",
        autorenovable: 0
      },
      prefijoTelefonoEditar: "+1",
      clienteEditado: null,
      modoEdicionCliente: false,
      mostrarModalDatosEmpresas: false,
      mostrarModalDatosPlan: false,

      empresaSeleccionada: null,
      planSeleccionada: null,
      empresas: [],
      planes: [],
      empresasEnviar: [],
      planesEnviar: [],
      planEditadoEnviar: [],
      empresaEditadaEnviar: [],
      mostrarModalCrear: false,
      mostrarModalCrearPlan: false,
      empresasPorPlanChart: null,
      barChartByCity: null,
      barChartByProvince: null,

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
    planesFiltrados() {
      return this.planes.filter((plan) => {
        return (
          plan.nombre &&
          plan.nombre
            .toLowerCase()
            .includes(this.filtroPlan.toLowerCase())
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
      this.empresaEditada.telefono = empresa.numero_telefono;
      this.empresaEditada.correo = empresa.correo;
      this.empresaEditada.sitioWeb = empresa.sitio_web;
      this.empresaEditada.plan = empresa.plan;
      this.empresaEditada.provincia = empresa.provincia;
      this.empresaEditada.ciudad = empresa.ciudad;
      this.empresaEditada.id = empresa.id_empresa;
      this.empresaEditada.autorenovable = empresa.autorenovable;
      this.empresaEditada.plan = empresa.plan;

      // Abre el modal de edición de empresa
      this.mostrarModalEditarEmpresa = true;
    },

    editarPlan(plan) {
      this.planSeleccionada = plan;

      this.planEditado.nombre = plan.nombre;
      this.planEditado.precio = plan.precio;
      this.planEditado.descripcion = plan.descripcion;
      this.planEditado.duracion_dias = plan.duracion_dias;
      this.planEditado.id = plan.id;


      // Abre el modal de edición de empresa
      this.mostrarModalEditarPlan = true;
    },

    // ELIMINAR EMPRESA
    async eliminarCliente(empresa) {
      const confirmacion = confirm("¿Estás seguro que quieres eliminar la empresa " + empresa.nom_empresa + "?");
      if (confirmacion) {
        const id_empresa = empresa.id_empresa;
        await deleteSubEmpresa(id_empresa);
        await deleteEmpresa(id_empresa);
        this.getEmpresas();

        // Destruir y recrear los gráficos
        this.destroyAndRecreateCharts();
        window.location.reload();
      } else {
        // Si el usuario cancela, no se realiza ninguna acción
        return;
      }
    },

    // ELIMINAR EMPRESA
    async eliminarPlan(plan) {
      const confirmacion = confirm("¿Estás seguro que quieres eliminar la empresa " + plan.nombre + "?");
      if (confirmacion) {
        const id_plan = plan.id
        await deleteSuscripcion(id_plan);
        this.getPlanes();

        // Destruir y recrear los gráficos
        this.destroyAndRecreateCharts();
        window.location.reload();
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
      console.log(this.empresaEditada.id);
      console.log(this.empresaEditada.plan);
      console.log(this.empresaEditada.autorenovable);
      await editSubEmpresa(this.empresaEditada.id, this.empresaEditada.plan, this.empresaEditada.autorenovable)
      this.getEmpresas();
      this.mostrarModalEditarEmpresa = false;

      // Destruir y recrear los gráficos
      this.destroyAndRecreateCharts();
      window.location.reload();
    },

    async guardarEdicionPlan() {
      if (
        !this.planEditado.nombre ||
        !this.planEditado.precio ||
        !this.planEditado.descripcion ||
        !this.planEditado.duracion_dias
      ) {
        alert("Por favor, complete todos los campos antes de guardar.");
        return; // Detener la función si algún campo está vacío
      }
      this.planEditadoEnviar.push(
        this.planEditado.nombre,
        this.planEditado.precio,
        this.planEditado.duracion_dias,
        this.planEditado.descripcion,
        this.planEditado.id
      );
      // console.log(this.empresaEditadaEnviar);
      await updateSuscripcion(this.planEditadoEnviar)
      this.getPlanes();
      this.mostrarModalEditarPlan = false;

      // Destruir y recrear los gráficos
      this.destroyAndRecreateCharts();
      window.location.reload();
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

    cancelarEdicionPlan() {
      // Restablece los valores originales antes de la edición
      this.planEditado.nombre = "";
      this.planEditado.precio = "";
      this.planEditado.descripcion = "";
      this.planEditado.duracion_dias = "";
      this.planEditado.id = "";


      // Cierra el modal de edición
      this.mostrarModalEditarPlan = false;
    },

    mostrarFormularioEmpresa() {
      // Mostrar el modal editar empresa
      this.mostrarModalEditarEmpresa = true;
    },

    mostrarFormularioPlan() {
      // Mostrar el modal editar empresa
      this.mostrarModalEditarPlan = true;
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
        numero_telefono: this.nuevaEmpresa.telefono,
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

      const id = await insertEmpresa(this.empresasEnviar);
      console.log(id.result);
      console.log(this.nuevaEmpresa.plan);
      console.log(this.nuevaEmpresa.autorenovable);
      this.mostrarModalCrear = false;
      await insertEmpresaSub(id.result, this.nuevaEmpresa.plan, this.nuevaEmpresa.autorenovable)

      // console.log("Después de agregar a empresas:", this.empresas);

      // Limpiar el formulario y ocultar el modal

      this.empresasEnviar = [];
      this.getEmpresas();
      // Destruir y recrear los gráficos
      this.destroyAndRecreateCharts();
      window.location.reload();
    },

    async crearYGuardarPlan() {
      // Validar que todos los campos estén rellenados
      if (
        !this.nuevoPlan.nombre ||
        !this.nuevoPlan.precio ||
        !this.nuevoPlan.descripcion ||
        !this.nuevoPlan.duracion_dias
      ) {
        alert("Por favor, complete todos los campos antes de guardar.");
        return; // Detener la función si algún campo está vacío
      }


      this.planesEnviar.push(
        this.nuevoPlan.nombre,
        this.nuevoPlan.precio,
        this.nuevoPlan.duracion_dias,
        this.nuevoPlan.descripcion
      );

      await insertSuscripcion(this.planesEnviar);

      // console.log("Después de agregar a planes:", this.planes);

      // Limpiar el formulario y ocultar el modal
      this.nuevoPlan = {
        nombre: "",
        precio: "",
        descripcion: "",
        duracion_dias: ""
      };

      this.planesEnviar = [];

      this.getPlanes();
      this.mostrarModalCrearPlan = false;

      // Destruir y recrear los gráficos
      this.destroyAndRecreateCharts();
      window.location.reload();
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
      this.getEmpresas().then(() => {

        // Llamar a graficoPlanes una vez que se hayan obtenido las empresas
        this.graficoPlanes();
        this.renderBarChartByCity();
        this.renderBarChartByProvince();
      });
    },

    limpiarFormularioPlan() {
      this.nuevoPlan = {
        nombre: "",
        precio: "",
        descripcion: "",
        duracion_dias: ""
      };

      // Ocultamos el modal
      this.mostrarModalCrearPlan = false;
      this.getPlanes();
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

    mostrarDatosPlan(plan) {
      // Asignar la empresa seleccionada
      this.planSeleccionada = plan;
      // Abrir el diálogo modal para mostrar los detalles
      this.mostrarModalDatosPlan = true;
    },

    // Método para abrir el modal de creación
    abrirModalCrearEmpresa() {
      this.mostrarModalCrear = true;
    },

    abrirModalCrearPlan() {
      this.mostrarModalCrearPlan = true;
    },

    // GRAFICO CANTIDAD DE EMPRESAS POR PLAN
    graficoPlanes() {
      // Obtener el contexto del lienzo
      const ctx = document.getElementById('empresasPorPlan').getContext('2d');

      // Si ya hay un gráfico asociado con el contexto, destruirlo antes de crear uno nuevo
      if (this.empresasPorPlanChart) {
        this.empresasPorPlanChart.destroy();
        // También liberamos el contexto
        this.empresasPorPlanChart = null;
        ctx.canvas.parentNode.removeChild(ctx.canvas);
      }


      // Obtener la cantidad de empresas por plan de servicio
      const empresasPorPlan = this.empresas.reduce((acc, empresa) => {
        acc[empresa.nombre_sub] = (acc[empresa.nombre_sub] || 0) + 1;
        return acc;
      }, {});

      // Datos para el gráfico de barras
      const data = {
        labels: Object.keys(empresasPorPlan),
        datasets: [{
          label: 'Cantidad de empresas por plan de servicio',
          data: Object.values(empresasPorPlan),
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            // Puedes agregar más colores si tienes más planes
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            // Puedes agregar más colores si tienes más planes
          ],
          borderWidth: 1
        }]
      };

      // Configuración del gráfico
      const config = {
        type: 'bar',
        data: data,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      };

      // Crear el nuevo gráfico y almacenar su instancia para futuras actualizaciones
      this.empresasPorPlanChart = new Chart(ctx, config);
    },

    // GRAFICO DE CIUDAD
    renderBarChartByCity() {
      const cities = {};
      this.empresas.forEach((empresa) => {
        const city = empresa.ciudad;
        if (city in cities) {
          cities[city]++;
        } else {
          cities[city] = 1;
        }
      });

      const ctx = this.$refs.barChartByCity.getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(cities),
          datasets: [
            {
              label: "Cantidad de Empresas por ciudad",
              data: Object.values(cities),
              backgroundColor: "grey",
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    },

    // GRAFICO POR PROVINCIAS
    renderBarChartByProvince() {
      const provinces = {};
      this.empresas.forEach((empresa) => {
        const province = empresa.provincia;
        if (province in provinces) {
          provinces[province]++;
        } else {
          provinces[province] = 1;
        }
      });

      const ctx = this.$refs.barChartByProvince.getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(provinces),
          datasets: [
            {
              label: "Cantidad de Empresas por provincia",
              data: Object.values(provinces),
              backgroundColor: "#007bff",
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    },

    // Método para destruir y recrear los gráficos
    async destroyAndRecreateCharts() {
      // Destruir los gráficos existentes si ya se han creado antes
      if (this.empresasPorPlanChart) {
        this.empresasPorPlanChart.destroy();
      }
      if (this.barChartByCity) {
        this.barChartByCity.destroy();
      }
      if (this.barChartByProvince) {
        this.barChartByProvince.destroy();
      }

      // Esperar a que se destruyan los gráficos antes de recrearlos
      await this.$nextTick();
      this.getEmpresas().then(() => {
        this.limpiarTodo();
        // Crear los nuevos gráficos y almacenar las instancias en las variables correspondientes
        this.empresasPorPlanChart = this.graficoPlanes();
        this.barChartByCity = this.renderBarChartByCity();
        this.barChartByProvince = this.renderBarChartByProvince();
      });
    },

    limpiarTodo() {
      this.empresasPorPlanChart = null;
      this.barChartByCity = null;
      this.barChartByProvince = null;
    },
    async getPlanes() {
      this.planes = await getSuscripciones();
      console.log(this.planes);

    }


  },
  //CONSOLA
  created() {
    console.log("CREADO");
    this.getEmpresas().then(() => {


      // Llamar a graficoPlanes una vez que se hayan obtenido las empresas
      this.graficoPlanes();
      this.renderBarChartByCity();
      this.renderBarChartByProvince();
    });
    this.getPlanes();
  },
  mounted() {
    console.log("MONTADO");
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