<template>
  <default-bar />
  <v-layout class="rounded rounded-md">
    <v-main>
      <div>
        <v-btn class="ml-4" style="margin-top: 20px" color="#84ACCE" @click="mostrarDialogo">Crear incidència</v-btn>

        <v-btn class="ml-4" style="margin-top: 20px" @click="toggleFiltro" text color="#84ACCE">
          Filtre <v-icon>mdi-menu-down</v-icon>
        </v-btn>

        <!-- Filtro de incidencias -->
        <v-card v-if="mostrarFiltroCard" class="filtro-card">
          <v-card-text>
            <v-btn class="filtro-btn" v-for="filtro in filtros" :key="filtro.id" @click="aplicarFiltro(filtro)"
              :class="{ 'filtro-btn-selected': esFiltroSeleccionado(filtro) }">
              {{ filtro.label }}
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- TABLA DE INCIDENCIAS -->
        <v-container fluid>
          <table class="table">
            <thead>
              <tr>
                <th>Assumpte de la incidència</th>
                <th>Submarí</th>
                <th>Autor</th>
                <th>Responsable</th>
                <th>Prioritat</th>
                <th>Estat</th>
                <th>Tipus</th>
                <th @click="ordenarPor('fechaInicio')">
                  Data d'inici
                  <v-icon>{{ obtenerIconoOrden("fechaInicio") }}</v-icon>
                </th>
                <th @click="ordenarPor('fechaFin')">
                  Data de fi
                  <v-icon>{{ obtenerIconoOrden("fechaFin") }}</v-icon>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in incidenciasFiltradas" :key="item.id_incidencia">
                <td>{{ item.Asunto }}</td>
                <td>{{ item.nom_sub }}</td>
                <td>{{ item.Autor }}</td>
                <td>{{ item.Asignado }}</td>
                <td >
                  <div
                    :class="{ 'circle': true, 'high-priority': item.prioridad === 'Alta', 'medium-priority': item.prioridad === 'Media', 'low-priority': item.prioridad === 'Baja' }">
                    {{ item.prioridad }}</div>
                </td>
                <td>{{ item.estado }}</td>
                <td>{{ item.tipo }}</td>
                <td>{{ formatearFecha(item.fecha_inicio) }}</td>
                <td>{{ formatearFecha(item.fecha_fin) }}</td>
                <td style="border: none">
                  <v-icon @click="mostrarDescripcion(item.descripcion)">mdi-eye</v-icon>
                </td>
                <td style="border: none; margin-left: ">
                  <v-icon @click="editarIncidencia(index, item.id_incidencia)">mdi-pencil</v-icon>
                </td>
                <td style="border: none; margin-left: ">

                  <v-icon @click="reportIncidencia(item.id_incidencia)">mdi-history</v-icon>
                </td>
              </tr>
            </tbody>
          </table>
        </v-container>
      </div>

      <!-- Diálogo para mostrar la descripción de la incidencia -->
      <v-dialog v-model="dialogDescripcion" max-width="500">
        <v-card>
          <v-toolbar height="60" style="background-color: #224870; color: white;">
            <h3 style="margin-left: 15px;">Descripció de la incidència</h3>
          </v-toolbar>
          <v-card-text>
            {{ descripcionSeleccionada }}
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="dialogDescripcion = false">Tancar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogReport" max-width="500">
        <v-card>
          <v-toolbar height="60" style="background-color: #224870; color: white;">
            <h3 style="margin-left: 15px;">Historial de reports de la incidència</h3>
          </v-toolbar>
          <v-list>
            <v-list-item v-for="(reporte, index) in reporteSeleccionado" :key="index">
              <v-list-item>
                <v-list-item-title>{{ reporte.fecha_report }}</v-list-item-title>
                <v-list-item-subtitle>{{ reporte.mensaje }}</v-list-item-subtitle>
                <v-list-item-subtitle>{{ reporte.solucionado }}</v-list-item-subtitle>

              </v-list-item>
            </v-list-item>
          </v-list>

          <v-card-actions>
            <v-btn color="primary" @click="dialogReport = false">Tancar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Diálogo para crear una nueva incidencia -->
      <v-dialog v-model="dialogoVisible" max-width="600px">
        <v-card>
          <v-toolbar height="60" style="background-color: #224870; color: white;">
            <h3 style="margin-left: 15px;">Crear nova incidència</h3>
          </v-toolbar>
          <v-card-text>
            <v-text-field v-model="nuevaIncidencia.nombre" label="Assumpte de la incidència"></v-text-field>
            <v-textarea v-model="nuevaIncidencia.descripcion" label="Descripció de la incidència"></v-textarea>
            <v-select v-model="nuevaIncidencia.submarinoSeleccionado" label="Submarí" :items="submarinos.map((submarino) => submarino.nom_sub)
          " item-text="text" item-value="value"></v-select>

            <v-select v-model="nuevaIncidencia.tipo" :items="['Actualización software', 'Reparación']"
              label="Tipo"></v-select>
            <v-select v-model="nuevaIncidencia.prioridad" :items="prioridades" label="Prioridad"></v-select>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="guardarIncidencia">Crear i desar</v-btn>
            <v-btn color="error" @click="cerrarDialogo">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Diálogo para editar nombre, descripción y prioridad -->
      <v-dialog v-model="dialogoEdicionVisible" max-width="600px">
        <v-card>
          <v-toolbar height="60" style="background-color: #224870; color: white;">
            <h3 style="margin-left: 15px;">Editar incidència</h3>
          </v-toolbar>
          <v-card-text>
            <v-text-field v-model="edicionIncidencia.nombre" label="Nou nom"></v-text-field>
            <v-textarea v-model="edicionIncidencia.descripcion" label="Nova descripció"></v-textarea>
            <v-select v-model="edicionIncidencia.prioridad" :items="prioridades" label="Canviar prioritat"></v-select>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="guardarEdicionIncidencia">Desar</v-btn>
            <v-btn color="error" @click="cancelarEdicion">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-layout>
</template>

<script>
import {
  getSubmarinos,
  getReports
} from "@/services/connectionManager.js";
import { useAppStore } from "@/store/app";
import io from "socket.io-client";


export default {
  computed: {
    // Filtrar la lista de incidencias según el filtro actual
    incidenciasFiltradas() {
      let incidenciasFiltradas = this.incidencias;

      if (this.filtroPrioridad) {
        incidenciasFiltradas = incidenciasFiltradas.filter(
          (item) => item.prioridad === this.filtroPrioridad
        );
      }

      if (this.filtroEstado) {
        incidenciasFiltradas = incidenciasFiltradas.filter(
          (item) =>
            (this.filtroEstado === "acabadas" && item.estado === "Finalizada") ||
            (this.filtroEstado === "sin_acabar" && item.estado !== "Finalizada")
        );
      }

      return incidenciasFiltradas;
    },
  },
  data() {
    return {
      listaEnviar: [],
      reportes: [],
      reporteSeleccionado: [],
      incidencias: [],
      ordenFecha: {
        campo: null,
        direccion: null,
      },
      dialogoVisible: false,
      nuevaIncidencia: {
        nombre: "",
        descripcion: "",
        submarinoSeleccionado: null,
        submarino: "",
        autor: "",
        tipo: "",
        prioridad: "",
        fechaInicio: new Date().toISOString().substr(0, 10),
      },
      dialogoEdicionVisible: false,
      edicionIncidencia: {
        nombre: "",
        descripcion: "",
        prioridad: "",
      },
      indiceEdicion: null,
      prioridades: ["Alta", "Media", "Baja"],
      filtroActual: null,
      filtroPrioridad: null,
      filtroEstado: null,
      filtros: [
        { id: 1, label: "Todas las incidencias", tipo: null, filtro: null },
        {
          id: 2,
          label: "Incidencias acabadas",
          tipo: "estado",
          filtro: "acabadas",
        },
        {
          id: 3,
          label: "Incidencias sin acabar",
          tipo: "estado",
          filtro: "sin_acabar",
        },
        { id: 4, label: "Prioridad Alta", tipo: "prioridad", filtro: "Alta" },
        { id: 5, label: "Prioridad Media", tipo: "prioridad", filtro: "Media" },
        { id: 6, label: "Prioridad Baja", tipo: "prioridad", filtro: "Baja" },
      ],

      mostrarFiltroCard: false,
      submarinos: [],
      submarinoOptions: [],
      nomCompleto: "",
      descripcionVisible: null,
      dialogDescripcion: false,
      descripcionSeleccionada: "",
      idIncidenciaEditando: null,
      dialogReport: false,
      socket: null,

    };
  },
  methods: {
    // MOSTRAR PARA CREAR INCIDENCIAS
    mostrarDialogo() {
      this.dialogoVisible = true;
    },

    // CERRAR DIALOGO DE INCIDENCIAS
    cerrarDialogo() {
      this.dialogoVisible = false;
    },

    // GUARDAR LA INCIDENCIA
    async guardarIncidencia() {
      const store = useAppStore();
      const idEmpresa = store.getUserEmpresa;  // Supongamos que esto te da el ID directamente
      const idUser = store.getUserID;

      const hasIdEmpresa = idEmpresa !== null;
      // Validar que todos los campos obligatorios estén llenos
      const submarino = this.submarinos.find(
        (submarinos) => submarinos.nom_sub === this.nuevaIncidencia.submarinoSeleccionado
      );

      if (
        !this.nuevaIncidencia.nombre ||
        !this.nuevaIncidencia.descripcion ||
        !this.nuevaIncidencia.tipo ||
        !this.nuevaIncidencia.prioridad ||
        !this.nuevaIncidencia.submarinoSeleccionado
      ) {
        // Mostrar un mensaje de error indicando que todos los campos son obligatorios
        alert(
          "Tots els camps són obligatoris. Si us plau, completa la informació."
        );
        return;
      }

      // Validar la longitud máxima del nombre
      if (this.nuevaIncidencia.nombre.length > 45) {
        alert("El nom no pot tenir més de 45 caràcters.");
        return;
      }

      // Validar la longitud máxima de la descripción
      if (this.nuevaIncidencia.descripcion.length > 250) {
        alert("La descripció no pot tenir més de 250 caràcters.");
        return;
      }
      this.nomCompleto = store.getUserName + " " + store.getUserApellido;

      //console.log(submarino);

      this.incidencias.push({
        Asunto: this.nuevaIncidencia.nombre,
        descripcion: this.nuevaIncidencia.descripcion,
        Autor: this.nomCompleto,
        tipo: this.nuevaIncidencia.tipo,
        prioridad: this.nuevaIncidencia.prioridad,
        estado: "Nueva",
        fecha_inicio: this.nuevaIncidencia.fechaInicio,
        fecha_fin: "",
        nom_sub: submarino.nom_sub,
      });
      const id = store.getUserEmpresa;

      this.listaEnviar.push(
        this.nuevaIncidencia.nombre,
        this.nuevaIncidencia.descripcion,
        store.getUserID,
        this.nuevaIncidencia.tipo,
        this.nuevaIncidencia.prioridad,
        "Nueva",
        this.nuevaIncidencia.fechaInicio,
        submarino.id_sub,
        id
      );


      const dataToSend = {
        listaEnviar: this.listaEnviar,
        hasIdEmpresa: hasIdEmpresa, //Si hasId es true es que tiene una empresa seleccionada si es false es admin sin empresa elegida
        id: id,
        idUser: idUser
      };
      this.socket.emit('insertarIncidencia', dataToSend, (response) => {
        if (response.status === 200) {
          window.alert('Incidència inserida correctament')
        } else {
          window.alert('Error en inserir la incidència')
        }
      });

      this.socket.emit('SelectReports', id, (response) => {
        if (response.status === 200) {
          window.alert('Incidència inserida correctament')
        } else {
          window.alert('Error en inserir la incidència')
        }
      });

      this.socket.on("incidenciaResult", (result) => {
        this.incidencias = result;
        console.log("Incidencias para la empresa:", this.incidencias);
      });

      //console.log(this.listaEnviar);

      // Limpiar el formulario y cerrar el diálogo
      this.nuevaIncidencia.nombre = "";
      this.nuevaIncidencia.descripcion = "";
      this.nomCompleto = "";
      this.nuevaIncidencia.tipo = "";
      this.nuevaIncidencia.prioridad = "";
      this.nuevaIncidencia.submarinoSeleccionado = null;
      this.dialogoVisible = false;
      this.listaEnviar = [];
    },

    // FORMATO DE LA FECHA DE INICIO
    formatearFecha(fecha) {
      if (!fecha) return "";
      const dateObj = new Date(fecha);
      const options = { year: "numeric", month: "numeric", day: "numeric" };
      return dateObj.toLocaleDateString("es-ES", options);
    },

    toggleFiltro() {
      this.mostrarFiltroCard = !this.mostrarFiltroCard;
    },

    // Verificar si un filtro está seleccionado
    esFiltroSeleccionado(filtro) {
      if (filtro.filtro === null) {
        // Si el filtro es "Todas las incidencias", marcarlo siempre
        return this.filtroPrioridad === null && this.filtroEstado === null;
      }

      if (
        filtro.tipo === "prioridad" &&
        this.filtroPrioridad === filtro.filtro
      ) {
        return true;
      }

      if (filtro.tipo === "estado" && this.filtroEstado === filtro.filtro) {
        return true;
      }

      return false;
    },

    // APLICAR EL FILTRO
    aplicarFiltro(filtro) {
      // Cambiar los filtros según el tipo de filtro seleccionado
      if (filtro.filtro === null) {
        this.filtroPrioridad = null;
        this.filtroEstado = null;
      } else {
        if (filtro.tipo === "prioridad") {
          this.filtroPrioridad =
            this.filtroPrioridad !== filtro.filtro ? filtro.filtro : null;
        } else if (filtro.tipo === "estado") {
          this.filtroEstado =
            this.filtroEstado !== filtro.filtro ? filtro.filtro : null;
        }
      }
      // Actualizar filtroActual
      this.filtroActual = filtro.filtro;
    },

    // Manejar clic en el encabezado de la columna
    ordenarPor(campo) {
      if (this.ordenFecha.campo === campo) {
        this.ordenFecha.direccion =
          this.ordenFecha.direccion === "asc" ? "desc" : "asc";
      } else {
        this.ordenFecha.campo = campo;
        this.ordenFecha.direccion = "asc";
      }

      this.incidencias.sort((a, b) => {
        const orderFactor = this.ordenFecha.direccion === "asc" ? 1 : -1;
        return orderFactor * (new Date(a[campo]) - new Date(b[campo]));
      });
    },

    // Obtener el icono de la flecha para el orden actual
    obtenerIconoOrden(campo) {
      if (this.ordenFecha.campo === campo) {
        return this.ordenFecha.direccion === "asc"
          ? "mdi-arrow-up"
          : "mdi-arrow-down";
      } else {
        return "mdi-arrow-down"; // Mostrar una flecha neutra si no está ordenado por este campo
      }
    },

    // EDITAR INCIDENCIA
    editarIncidencia(index, id) {
      // Obtener la incidencia seleccionada para edición
      const incidenciaSeleccionada = this.incidenciasFiltradas[index];


      // Asignar los valores al formulario de edición
      this.edicionIncidencia.nombre = incidenciaSeleccionada.Asunto;
      this.edicionIncidencia.descripcion = incidenciaSeleccionada.descripcion;
      this.edicionIncidencia.prioridad = incidenciaSeleccionada.prioridad;
      // Guardar el índice de la incidencia para utilizarlo en el método guardarEdicionIncidencia
      this.indiceEdicion = index;
      this.idIncidenciaEditando = id;

      // Abrir el diálogo de edición
      this.dialogoEdicionVisible = true;
    },

    reportIncidencia(id) {
      // Encuentra todos los reportes que coinciden con el id_incidencia proporcionado
      const reportesEncontrados = this.reportes.filter(reporte => reporte.id_incidencia === id);

      if (reportesEncontrados.length > 0) {
        // Si se encontraron reportes, asigna el array de reportes encontrados a reporteSeleccionado
        this.reporteSeleccionado = reportesEncontrados;
        console.log(this.reporteSeleccionado);
        // Muestra el diálogo
        this.dialogReport = true;
      } else {
        // Si no se encontró ningún reporte, puedes manejarlo como desees
        window.alert('No es va trobar cap report en aquesta incidència.');
        // Podrías mostrar un mensaje de error o tomar alguna otra acción
      }
    },


    // GUARDAR Y HACER UPDATE
    async guardarEdicionIncidencia() {

      const store = useAppStore();
      const idEmpresa = store.getUserEmpresa;
      // Verificar que el índice de edición esté definido
      if (this.indiceEdicion !== null) {
        // Validar que todos los campos obligatorios estén llenos
        if (
          !this.edicionIncidencia.nombre ||
          !this.edicionIncidencia.descripcion ||
          !this.edicionIncidencia.prioridad
        ) {
          // Mostrar un mensaje de error indicando que todos los campos son obligatorios
          alert(
            "Tots els camps són obligatoris. Si us plau, completa la informació."
          );
          return;
        }

        // Validar la longitud máxima del nombre
        if (this.edicionIncidencia.nombre.length > 45) {
          alert("El nom no pot tenir més de 45 caràcters.");
          return;
        }

        // Validar la longitud máxima de la descripción
        if (this.edicionIncidencia.descripcion.length > 250) {
          alert("La descripció no pot tenir més de 250 caràcters.");
          return;
        }

        // Obtener la incidencia seleccionada para edición
        const incidenciaSeleccionada =
          this.incidenciasFiltradas[this.indiceEdicion];

        // Actualizar los campos de nombre y descripción
        incidenciaSeleccionada.nombre = this.edicionIncidencia.nombre;
        incidenciaSeleccionada.descripcion = this.edicionIncidencia.descripcion;
        incidenciaSeleccionada.prioridad = this.edicionIncidencia.prioridad;

        const id = this.idIncidenciaEditando

        const dataToSend = {
          nombre: incidenciaSeleccionada.nombre,
          descripcion: incidenciaSeleccionada.descripcion,
          prioridad: incidenciaSeleccionada.prioridad,
          id: id,
          id_empresa: idEmpresa
        };

        this.socket.emit('updateIncidencia', dataToSend, (response) => {
          if (response.status === 200) {
          } else {
            window.alert('Error en inserir la incidència')
          }
        });

        this.socket.emit('SelectReports', id, (response) => {
          if (response.status === 200) {
          } else {
            window.alert('Error en inserir la incidència')
          }
        });

        this.socket.on("incidenciaResult", (result) => {
          this.incidencias = result;
          console.log("Incidencias para la empresa:", this.incidencias);
        });


        // Cerrar el diálogo de edición
        this.dialogoEdicionVisible = false;

        // Limpiar los datos de edición
        this.edicionIncidencia.nombre = "";
        this.edicionIncidencia.descripcion = "";
        this.edicionIncidencia.prioridad = "";
        this.indiceEdicion = null;
      }
    },

    // CANCELAMOS EDITAR
    cancelarEdicion() {
      // Cerrar el diálogo de edición y limpiar los datos
      this.dialogoEdicionVisible = false;
      this.edicionIncidencia.nombre = "";
      this.edicionIncidencia.descripcion = "";
      this.indiceEdicion = null;
    },

    // SELECT A TODOS LOS SUBMARINOS
    async getSubmarino() {
      const store = useAppStore();
      const userEmpresa = store.getUserEmpresa;
      try {
        const submarinosProxy = await getSubmarinos(userEmpresa);
        // Extraer los datos del Proxy
        this.submarinos = Array.from(submarinosProxy);
        //console.log(this.submarinos);
      } catch (error) {
        console.error("Error fetching submarinos:", error);
      }
    },

    // MOSTRAR LA DESCRIPCIÓN
    mostrarDescripcion(descripcion) {
      this.descripcionSeleccionada = descripcion;
      this.dialogDescripcion = true;
    },

    async getReportes() {
      try {
        this.reportes = await getReports();
        //console.log(this.reportes);
      } catch (error) {
        console.error("Error fetching reportes:", error);
      }
    }

  },

  //CONSOLA
  created() {
    this.socket = io("http://seashepherd.duckdns.org:3170/");
    const store = useAppStore();
    const userEmpresa = store.getUserEmpresa;

    const fetchItems = async () => {
      try {
        if (userEmpresa === null || userEmpresa === 'null') {
          this.socket.on("selectIncidencia", (inc) => {
            this.incidencias = inc;
            console.log(this.incidencias);
          });
        } else {
          // Aseguramos que el ID de la empresa se envíe correctamente
          this.socket.emit("selectIncidenciaEmpresa", { idEmpresa: userEmpresa });

          // Manejar la respuesta para incidencias específicas de la empresa
          this.socket.on("incidenciaResult", (result) => {
            this.incidencias = result;
            // console.log("Incidencias para la empresa:", this.incidencias);
          });
        }

        // Agregar escucha para el evento de actualización de incidencias
        this.socket.on("ResultUpdateInci", (jsonEnviar) => {
          //console.log("Actualización recibida para incidencias:", jsonEnviar);
          // Aquí puedes implementar lógica para actualizar las incidencias visibles
          // Por ejemplo, buscar la incidencia por ID y actualizar su estado y asignado
          const index = this.incidencias.findIndex(inc => inc.id_incidencia === jsonEnviar.id_incidencia);
          if (index !== -1) {
            this.incidencias[index].Asignado = jsonEnviar.asignado;
            this.incidencias[index].estado = jsonEnviar.newEstado;
            console.log("IF");
            console.log(this.incidencias[index]);
          }
          console.log("Fuera:");
          console.log(this.incidencias);
        });

        this.socket.on("ResultUpdateEstado", (jsonEnviar) => {
          console.log("Actualización recibida para incidencias 2:", jsonEnviar);
          // Aquí puedes implementar lógica para actualizar las incidencias visibles
          // Por ejemplo, buscar la incidencia por ID y actualizar su estado y asignado
          const index = this.incidencias.findIndex(inc => inc.id_incidencia === jsonEnviar.id_incidencia);
          if (index !== -1) {
            this.incidencias[index].estado = jsonEnviar.newEstado;
            this.incidencias[index].fecha_fin = jsonEnviar.fecha_fin;
            console.log("IF");
            console.log(this.incidencias[index]);
          }
          console.log("Fuera:");
          console.log(this.incidencias);
        });

      } catch (error) {
        console.error('Error al obtener las incidencias:', error);
      }
    };

    fetchItems(); // Asegúrate de llamar a la función para iniciar el proceso
    fetchItems().then(() => {
      console.log("CREADO");
      this.getSubmarino();
      this.getReportes();
    });
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
// APP BAR
import DefaultBar from "@/layouts/default/AppBar.vue";
</script>

<style scoped>
body, html {
  height: 100%;
  margin: 0;
  background-color: #EFEFEF; 
}

.circle {
  width: auto;
  height: auto;
  border-radius: 20px !important;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
}

.high-priority {
  background-color: #ff0000;
  /* rojo para alta prioridad */
}

.medium-priority {
  background-color: #ffff00;
  /* amarillo para media prioridad */
}

.low-priority {
  background-color: #00ff00;
  /* verde para baja prioridad */
}

.filtro-card {
  background-color: #ccc;
  top: 5px;
  /* Ajusta esta posición según sea necesario */
  right: 10px;
  /* Ajusta esta posición según sea necesario */
  left: 13px;
  width: 605px;
  z-index: 1000;
  /* Asegura que esté por encima de otros elementos */
}

.filtro-btn {
  margin-right: 8px;
  margin-bottom: 8px;
  border-radius: 12px;
  padding: 8px 8px;
  /* Ajusta el padding según tu preferencia para el tamaño de los botones */
  font-size: 12px;
  /* Ajusta el tamaño de la letra según tu preferencia */
  color: #888;
  /* Cambia el color a gris o el tono deseado */
  background-color: #f0f0f0;
  /* Cambia el color de fondo si es necesario */
  border: 1px solid #ccc;
  /* Añade un borde para resaltar el botón */
}

.filtro-btn-selected {
  background-color: #224870;
  /* Puedes ajustar el color de fondo cuando está seleccionado */
  color: #fff;
  /* Puedes ajustar el color del texto cuando está seleccionado */
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  border: 1px solid #122C34;
  padding: 8px;
}

.table th {
  background-color: #224870;
  font-weight: bold;
  color: #fff;
}
</style>