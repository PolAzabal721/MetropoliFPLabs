<template>
  <default-bar />
  <v-layout class="rounded rounded-md" style="background-color: #EFEFEF;">
    <v-main>
      <v-row style="margin: 25px;">

        <!-- Left Column for Submarines not in water -->
        <v-col cols="12" sm="3">
          <v-card>
            <v-toolbar height="60" style="background-color: #224870; color: white;">
              <h3 style="margin-left: 15px;">Submarinos Fuera del Agua</h3>
            </v-toolbar>
            <v-container>
              <v-row>
                <v-col v-for="submarino in submarinosFueraDelAgua" :key="submarino.id_sub" cols="12">
                  <v-card
                    @click="mostrarUbicacionSubmarino(submarino.id_sub) || mostrarUbicacionSubmarinoSinFiltros(submarino.id_sub)"
                    style="background-color: #84ACCE; color: white;">
                    <v-card-title>{{ submarino.nom_sub }}</v-card-title>
                    <v-card-text>Estado: {{ submarino.estado_sub }}</v-card-text>
                  </v-card>

                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>

        <!-- Center Column for Map and Filters -->
        <v-col cols="12" sm="6">

          <!-- Selector de Área -->
          <v-select v-model="nombreLugarBusqueda" :items="[...areas.map(area => area.nombreArea)]"
            label="Seleccionar Área" @change="actualizarSubmarinos" :disabled="areaSeleccionada"
            style="color: #224870;">
          </v-select>

          <!-- Selector de Tarea/Rutina -->
          <v-select v-model="filtroTarea" :items="[...tareasDisponibles]" label="Filtrar por Tarea/Rutina"
            @change="filtrarSubmarinosPorTarea" :disabled="!areaSeleccionada || tareaSeleccionada"
            style="color: #224870;">
          </v-select>

          <!-- btn para filtrar area -->
          <v-btn @click="buscarArea" :disabled="!nombreLugarBusqueda" :color="areaSeleccionada ? 'red' : '#84ACCE'"
            dark>
            {{ areaSeleccionada ? 'Limpiar Área' : 'Buscar' }}
          </v-btn>

          <!-- btn para filtar tarea -->
          <v-btn style="margin-left: 15px;" @click="filtrarSubmarinosPorTarea"
            :disabled="!nombreLugarBusqueda || !filtroTarea || filtroTarea === null"
            :color="tareaSeleccionada ? 'red' : '#84ACCE'">
            {{ tareaSeleccionada ? 'Limpiar Filtro' : 'Filtrar por Tarea' }}
          </v-btn>

          <v-card style="margin-top: 20px;" class="mx-auto slidecontainer" max-height="700" max-width="850">
            <div id="mapaSelect" style="height: 700px; width: 850px"></div>
          </v-card>
        </v-col>

        <!-- Right Column for Submerged Submarines -->
        <v-col cols="12" sm="3">
          <v-row>
            <v-col class="text-center">
              <h3>Submarinos Sumergidos</h3>
              <v-row>
                <v-col v-for="submarino in submarinosSumergidos" :key="submarino.id_sub" cols="12">
                  <v-card :class="{ 'estado-activo': true }">
                    <v-card-title>{{ submarino.nom_sub }}</v-card-title>
                    <v-card-text>Última ubicación: {{ submarino.ruta }}</v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-main>
  </v-layout>
</template>

<script>
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import "leaflet/dist/leaflet-src.js";
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw/dist/leaflet.draw";
import "leaflet-draw/dist/leaflet.draw-src";
import "leaflet-draw/dist/leaflet.draw-src.js";
import io from "socket.io-client";

import {
  fetchAreas,
  getSubmarinos,
  selectSubmarinosMongo,
  selectRutinas
} from "@/services/connectionManager.js";
import { useAppStore } from "@/store/app";

export default {
  data() {
    return {
      drawer: false,
      submarinoSeleccionado: null,
      dialogoSubmarinoVisible: false,
      selectedArea: null,
      areas: [],
      submarinosAsignados: [],
      submarinosDisponibles: [],
      submarinos: [],
      mapa: null,
      mapaGlobal: null,
      areaEncontrada: null,
      areaEncontradaID: null,
      mapaInicializado: false,
      mostrarColumnaDerecha: false,
      seleccionSubmarinos: {},
      nombreLugarBusqueda: '',
      submarinosFueraDelAgua: [],
      submarinosSumergidos: [],
      rutinas: [],
      filtroTarea: null,
      tareasDisponibles: [],
      ubicacionesSubmarinos: {},
      socket: null,
      filtroAplicado: false,
      areaSeleccionada: false,
      tareaSeleccionada: false,
      estadoAnteriorMapa: {
        area: null,
        tarea: null,
        submarinos: [],
      },
      tareaSeleccionadaAntes: null,

    };
  },
  methods: {
    // GUARDAMOS EL ESTADO DEL MAPA ANTES DE SELECCIONAR UN SUB
    guardarEstadoActualMapa() {
      if (!this.estadoAnteriorMapa.area && this.areaEncontrada) {
        this.estadoAnteriorMapa.area = this.areaEncontrada;
        this.estadoAnteriorMapa.submarinos = [...this.submarinosAsignados];
      }

      if (!this.estadoAnteriorMapa.tarea && this.tareaSeleccionada) {
        this.estadoAnteriorMapa.tarea = this.filtroTarea;
      }
    },

    // MOSTRAR UBI AL SELECCIONAR UN SUBMARINO
    mostrarUbicacionSubmarino(idSub) {
      if (this.ubicacionesSubmarinos[idSub] && this.ubicacionesSubmarinos[idSub].length > 0) {
        if (this.areaSeleccionada || this.tareaSeleccionada) {

          if (this.submarinoSeleccionado === idSub) {
            // Volver al estado anterior
            this.restaurarEstadoMapa();
            this.submarinoSeleccionado = null;
            // Restaurar la tarea seleccionada solo si no es null
            if (this.tareaSeleccionadaAntes !== null) {
              this.filtroTarea = this.tareaSeleccionadaAntes;
              this.filtrarSubmarinosPorTarea();
              this.tareaSeleccionadaAntes = null;
            }
          } else {
            // Almacenar la tarea seleccionada antes de cambiarla
            this.tareaSeleccionadaAntes = this.filtroTarea;

            this.submarinoSeleccionado = idSub;
            this.guardarEstadoActualMapa();
            const ubicaciones = this.ubicacionesSubmarinos[idSub];

            const mapaActivo = this.mapa || this.mapaGlobal;
            this.limpiarMapa(mapaActivo);

            const polyline = L.polyline(ubicaciones, { color: '#122C34' }).addTo(mapaActivo);
            mapaActivo.fitBounds(polyline.getBounds());
          }
        }
      } else {
       
      }
    },

    // MOSTRAR SUBS SIN FILTROS APLICADOS
    mostrarUbicacionSubmarinoSinFiltros(idSub) {
      // console.log(this.areaSeleccionada);
      // console.log(this.tareaSeleccionada);
      if (this.ubicacionesSubmarinos[idSub] && this.ubicacionesSubmarinos[idSub].length > 0) {
        // Solo ejecutar si no hay filtros de área o tarea activos
        if (!this.areaSeleccionada && !this.tareaSeleccionada) {
          if (this.submarinoSeleccionado === idSub) {
            // Deseleccionar el submarino y limpiar/restaurar el mapa
            this.limpiarMapaGlobal();

            this.restaurarEstadoMapaSinFiltros(true); // Pasamos true para indicar que deseleccionamos
            this.submarinoSeleccionado = null;
          } else {
            // Seleccionar un nuevo submarino y mostrar su ubicación
            this.submarinoSeleccionado = idSub;
            this.guardarEstadoActualMapaSinFiltros();
            const ubicaciones = this.ubicacionesSubmarinos[idSub];

            const mapaActivo = this.mapa || this.mapaGlobal;
            this.limpiarMapaSinFiltros(mapaActivo);

            const polyline = L.polyline(ubicaciones, { color: '#122C34' }).addTo(mapaActivo);
            mapaActivo.fitBounds(polyline.getBounds());
          }
        }
      } else {
        // Si no tiene ubicaciones, muestra una alerta al usuario
        alert("Este submarino no tiene una ubicación.");
      }

    },

    // GUARDAR ESTADO MAPA SIN FILTROS
    guardarEstadoActualMapaSinFiltros() {
      if (!this.estadoAnteriorMapa.area && this.areaEncontrada) {
        this.estadoAnteriorMapa.area = this.areaEncontrada;
        this.estadoAnteriorMapa.submarinos = [...this.submarinosAsignados];
      }

      if (!this.estadoAnteriorMapa.tarea && this.tareaSeleccionada) {
        this.estadoAnteriorMapa.tarea = this.filtroTarea;
      }
    },

    // RESTAURAR MAPA ANTERIOR
    restaurarEstadoMapaSinFiltros(deseleccionar = false) {
      const { area, tarea, submarinos } = this.estadoAnteriorMapa;
      if (deseleccionar) {
        // Si estamos deseleccionando, limpiar el mapa y cargar el mapa global
        this.limpiarMapaGlobal();
        this.initMapaGlobal(); // Asegúrate de que esta función configura adecuadamente el mapa global
      } else {
        // Restaurar el estado previo
        if (area) {
          this.areaEncontrada = area;
          this.submarinosAsignados = submarinos;
          this.cargarCoordenadasEnMapaGlobal();
        }

        if (tarea) {
          this.filtroTarea = tarea;
          this.filtrarSubmarinosPorTarea();
        }
      }

      // Limpiar el estado anterior
      this.estadoAnteriorMapa = {
        area: null,
        tarea: null,
        submarinos: [],
      };
    },

    // LIMPIAR EL MAPA SIN FILTROS
    limpiarMapaSinFiltros(mapaActivo) {
      if (mapaActivo) {
        mapaActivo.eachLayer(layer => {
          // Asegúrate de no eliminar la capa de tiles base
          if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            mapaActivo.removeLayer(layer);
          }
        });
      }
    },

    // LIMPIAR EL MAPA GLOBAL Y REDIBUJAR LAS RUTAS (ESTA REPETIDA PERO NO BORRAR, NO VA EL COD SIN ESTO)
    limpiarMapaGlobal() {
      if (this.mapaGlobal) {
        this.mapaGlobal.eachLayer(layer => {
          if (layer instanceof L.Polyline) {
            this.mapaGlobal.removeLayer(layer); // Elimina solo las polilíneas
          }
        });

        this.dibujarRutasSubmarinos(); // Redibuja las rutas después de limpiar
      } else {
        // Si el mapa no existe, lo inicializamos de nuevo
        this.initMapaGlobal();
        this.dibujarRutasSubmarinos();
      }
    },

    // RESTAURAMOS EL ESTADO DEL MAPA
    restaurarEstadoMapa() {
      const { area, tarea, submarinos } = this.estadoAnteriorMapa;
      if (area) {
        this.areaEncontrada = area;
        this.submarinosAsignados = submarinos;
        this.cargarCoordenadasEnMapaSelect(area.coordenadas);
      }

      if (tarea) {
        this.filtroTarea = tarea;
        this.filtrarSubmarinosPorTarea();
      }

      // Limpiar el estado anterior
      this.estadoAnteriorMapa = {
        area: null,
        tarea: null,
        submarinos: [],
      };

    },

    // LIMPIAR EL MAPA DE 1 SUB SOLO
    limpiarMapa(mapaActivo) {
      if (mapaActivo) {
        mapaActivo.eachLayer(layer => {
          // Asegúrate de no eliminar la capa de tiles base
          if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            mapaActivo.removeLayer(layer);
          }
        });
      }
    },

    // BUSCAR LAS TAREAS DISPONIBLES
    tareasDisponible() {
      if (this.rutinas && this.rutinas.length > 0) {
        this.tareasDisponibles = this.rutinas.map(rutina => rutina.nombre);
      } else {
        this.tareasDisponibles = [];
        console.log("No hay rutinas disponibles o no se ha seleccionado un área.");
      }
    },

    // Calcular y devolver el valor de filtroTarea
    filtrarSubmarinosPorTarea() {
      if (this.tareaSeleccionada) {
        this.filtroAplicado = false;
        this.submarinosAsignados = this.submarinos.filter(sub => sub.id_area === this.areaEncontradaID);
        this.clasificarSubmarinosPorRutina();
        this.limpiarMapaSelect();
        this.cargarCoordenadasEnMapaSelect(this.areaEncontrada.coordenadas);
        this.tareaSeleccionada = false;
        this.filtroTarea = null;
      } else {
        const tareaSeleccionada = this.rutinas.find(tarea => tarea.nombre === this.filtroTarea);
        if (tareaSeleccionada) {
          this.submarinosAsignados = this.submarinos.filter(submarino => {
            return submarino.actividades && submarino.actividades.includes(tareaSeleccionada.id);
          });
          this.clasificarSubmarinosPorRutina();
          if (this.areaEncontrada && this.areaEncontrada.coordenadas) {
            this.dibujarMapaPorTarea(this.areaEncontrada.coordenadas, this.submarinosAsignados);
          }
          this.filtroAplicado = true;
          this.tareaSeleccionada = true;
        } else {
          this.submarinosAsignados = [];
        }
      }
    },

    // Clasificación de submarinos por su estado marino después de aplicar el filtro de tareas
    clasificarSubmarinosPorRutina() {
      this.submarinosFueraDelAgua = this.submarinosAsignados.filter(sub => !sub.estadoMarino);
      this.submarinosSumergidos = this.submarinosAsignados.filter(sub => sub.estadoMarino);
    },

    // Función para clasificar submarinos
    clasificarSubmarinos() {
      this.submarinosFueraDelAgua = this.submarinos.filter(sub => !sub.estadoMarino).slice();
      this.submarinosSumergidos = this.submarinos.filter(sub => sub.estadoMarino).slice();
      //console.log("Submarinos fuera del agua actualizados:", this.submarinosFueraDelAgua);
      //console.log("Submarinos sumergidos actualizados:", this.submarinosSumergidos);

      // Asegura la reactividad en Vue, si es necesario
      this.submarinosFueraDelAgua = [...this.submarinosFueraDelAgua];
      this.submarinosSumergidos = [...this.submarinosSumergidos];
    },

    // VER SI HAY SUBMARINOS EN ESE AREA
    actualizarSubmarinos() {
      if (!this.areaEncontrada) {
        // Clear assigned submarines if no area is selected
        this.submarinosAsignados = [];
        this.submarinosDisponibles = [];
        this.submarinosFueraDelAgua = [];
        this.submarinosSumergidos = [];
        return;
      }

      // Filter assigned submarines by the selected area
      this.submarinosAsignados = this.submarinos.filter(
        submarino => submarino.id_area === this.areaEncontradaID
      );

      // Update submarines not in water and submerged based on the selected area
      this.submarinosFueraDelAgua = this.submarinosAsignados.filter(sub => !sub.estadoMarino);
      this.submarinosSumergidos = this.submarinosAsignados.filter(sub => sub.estadoMarino);

      // Filter available submarines by different areas to the selected one
      this.submarinosDisponibles = this.submarinos.filter(
        submarino => submarino.id_area !== this.areaEncontradaID
      );
    },

    // SELECT PARA PILLAR COODS + NOMBRE DEL AREA + ID
    async getAreas() {
      try {
        const store = useAppStore();
        const idEmpresa = store.getUserEmpresa;
        this.areas = await fetchAreas();
        this.areas = this.areas.filter(area => area.idEmpresa === idEmpresa);
        // console.log(this.areas);
      } catch (error) {
        console.error("Error fetching areas:", error);
      }
    },

    // BUSCAR AREA + CARGAR SUBMARINOS ASIGNADOS
    async buscarArea() {
      if (this.areaSeleccionada) {
        // Proceso para limpiar la selección del área
        this.nombreLugarBusqueda = '';
        this.areaSeleccionada = false;
        this.submarinosAsignados = [];
        this.submarinosFueraDelAgua = [];
        this.submarinosSumergidos = [];
        this.submarinosDisponibles = [];
        this.limpiarMapaNoSelect();
        this.destruitMapaSelect();
        this.tareaSeleccionada = false;
        this.filtroTarea = null;

        const mapaActivo = this.mapa || this.mapaGlobal;
        this.limpiarMapa(mapaActivo);
        this.limpiarMapaGlobal();

        // Volver a cargar todos los submarinos
        this.initMapaGlobal();
        await this.getSubmarino();
        this.clasificarSubmarinos();
        this.dibujarRutasSubmarinos();
      } else {
        const areaEncontrada = this.areas.find(area => area.nombreArea === this.nombreLugarBusqueda);

        if (areaEncontrada) {
          this.limpiarMapaGlobal();
          this.areaEncontrada = areaEncontrada;
          this.areaEncontradaID = areaEncontrada._id;
          this.mostrarColumnaDerecha = true;

          // Limpiar los datos antes de cargar nuevos submarinos
          this.submarinos = [];
          this.submarinosAsignados = [];
          this.submarinosFueraDelAgua = [];
          this.submarinosSumergidos = [];
          this.submarinosDisponibles = [];

          await this.selectRutinas();
          await this.getSubmarinoMongo(); // Llama a getSubmarinoMongo después de limpiar los arrays
          await this.actualizarSubmarinos(); // Reclasifica y actualiza las listas de submarinos según el área seleccionada

          this.cargarCoordenadasEnMapaSelect(areaEncontrada.coordenadas);
          this.areaSeleccionada = true;
        } else {
          // Restablecer el estado de la aplicación a su estado inicial si no se encuentra el área
          this.areaEncontrada = null;
          this.areaEncontradaID = null;
          this.mostrarColumnaDerecha = false;
          this.tareasDisponibles = [];

          // Limpiar el mapa
          this.limpiarMapaNoSelect();
          this.limpiarMapaGlobal();

          // Volver a cargar todos los submarinos
          await this.getSubmarino();
          this.clasificarSubmarinos();
          this.dibujarRutasSubmarinos();

          // Ahora reintroduce el mapa global si es necesario
          this.destruitMapaSelect();
          this.areaSeleccionada = false;
        }
      }
    },

    // HACER SELECT A RUTINAS
    async selectRutinas() {
      //console.log("Buscando rutinas para el área ID:", this.areaEncontradaID);
      try {
        const response = await selectRutinas(this.areaEncontradaID);
        // console.log("Rutinas obtenidas:", response);
        this.rutinas = response.rutinas;
        this.tareasDisponible(); // Llama aquí después de asegurar que `this.rutinas` está actualizado.
      } catch (error) {
        console.error("Error fetching rutinas:", error);
        this.rutinas = []; // Asegúrate de resetear las rutinas si hay un error
      }
    },

    // SELECT A TODOS LOS SUBMARINOS
    async getSubmarino() {
      const store = useAppStore();
      const userEmpresa = store.getUserEmpresa;

      try {
        const submarinos = await getSubmarinos(userEmpresa);
        //console.log(submarinos);
        this.submarinos = submarinos; // Store all fetched submarines
        this.clasificarSubmarinos(); // Classify submarines after fetching
        this.dibujarRutasSubmarinos();

      } catch (error) {
        console.error("Error fetching submarinos:", error);
      }
    },

    // SELECT A TODOS LOS SUBMARINOS DE MONGO
    async getSubmarinoMongo() {
      if (!this.areaEncontradaID) {
        console.error("No area ID found. Please select an area first.");
        return;
      }

      try {
        const response = await selectSubmarinosMongo(this.areaEncontradaID);
        //console.log("Respuesta completa de getSubmarinoMongo:", response);

        // Acceder a la propiedad 'Submarino' y verificar que es un arreglo
        if (response && Array.isArray(response.Submarino)) {
          this.submarinos = response.Submarino;
          this.clasificarSubmarinos(); // Clasifica los submarinos después de la actualización
          //console.log("Submarinos fetched and classified for area ID:", this.areaEncontradaID);
        } else {
          console.error("Expected an array but got:", typeof response.Submarino);
          this.submarinos = []; // Asegúrate de que submarinos sigue siendo un arreglo
        }
      } catch (error) {
        console.error("Error fetching submarinos from Mongo:", error);
        this.submarinos = []; // Reiniciar en caso de error
      }
    },

    // INICIO Y CONFIG DEL MAPA DE SUBS FILTRADOS POR AREA
    initMapaSelect() {
      this.mapa = L.map("mapaSelect").setView([41.38879, 2.15899], 11);
      L.tileLayer(
        "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
        {
          maxZoom: 18,
        }
      ).addTo(this.mapa);

      const drawnItems = new L.FeatureGroup();
      this.mapa.addLayer(drawnItems);

      // Crear el control de dibujo y asignarlo a this.drawControl
      this.drawControl = new L.Control.Draw({
        edit: {
          featureGroup: drawnItems,
          edit: false,
          remove: false,
        },
        draw: {
          polygon: false,
          circle: false,
          rectangle: false,
          marker: false,
          polyline: false,
          circlemarker: false,
        },
      });

      this.mapa.addControl(this.drawControl);

      // Agregar control de edición a las capas existentes
      this.mapa.on(L.Draw.Event.CREATED, (event) => {
        const layer = event.layer;
        drawnItems.addLayer(layer);
      });
    },

    // CARGAR COODS EN EL MAPA
    cargarCoordenadasEnMapaSelect(coordenadas) {
      // Limpiar el mapa
      this.limpiarMapaSelect();

      // Inicializar el mapa y el control de dibujo
      this.initMapaSelect();
      this.drawControl.addTo(this.mapa);

      // Dibujar el área en el mapa
      this.dibujarAreaEnMapa(coordenadas, this.submarinosAsignados);
    },

    // DIBUJAR COODS + SUBS EN EL MAPA
    dibujarAreaEnMapa(coordenadas, submarinosAsignados) {
      //console.log("Coordenadas:", coordenadas);

      // Create a GeoJSON layer and add it to the map
      const geoJsonLayer = L.geoJSON({
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: coordenadas,
        },
      }).addTo(this.mapa);

      submarinosAsignados.forEach(submarino => {
        if (this.ubicacionesSubmarinos[submarino.id_sub]) {
          let latlngs = this.ubicacionesSubmarinos[submarino.id_sub];
          let polyline = L.polyline(latlngs, { color: '#122C34' }).addTo(this.mapa);
          this.mapa.fitBounds(polyline.getBounds());
        }
      });
      // Update the map view
      this.mapa.fitBounds(geoJsonLayer.getBounds());
    },

    // DIBUJAR SUBS FILTRADOS POR TAREA
    dibujarMapaPorTarea(coordenadas, submarinosAsignados) {
      // Limpiar cualquier contenido previo en el mapa
      this.limpiarMapaSelect();

      // Inicializar el mapa si aún no ha sido creado
      if (!this.mapa) {
        this.initMapaSelect();
      }

      // Dibujar el área y los submarinos filtrados
      if (coordenadas) {
        const geoJsonLayer = L.geoJSON({
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: coordenadas,
          },
        }).addTo(this.mapa);

        // Ajustar la vista del mapa para enfocar el área
        this.mapa.fitBounds(geoJsonLayer.getBounds());
      }

      // Dibujar solo los submarinos asignados a la tarea seleccionada
      submarinosAsignados.forEach(submarino => {
        if (this.ubicacionesSubmarinos[submarino.id_sub]) {
          let latlngs = this.ubicacionesSubmarinos[submarino.id_sub];
          let polyline = L.polyline(latlngs, { color: '#122C34' }).addTo(this.mapa);
          this.mapa.fitBounds(polyline.getBounds());
        }
      });
    },

    // LIMPIAR EL MAPA
    limpiarMapaSelect() {
      if (this.mapa) {
        // Remover el control de dibujo antes de destruir el mapa
        if (this.drawControl) {
          this.mapa.removeControl(this.drawControl);
        }

        // Remover todas las capas del mapa
        this.mapa.eachLayer((layer) => {
          this.mapa.removeLayer(layer);
        });

        // Destruir el mapa
        this.mapa.remove();
        this.mapa = null; // Reiniciar el objeto mapa
      }
    },

    // LIMPIAR MAPA AL SELECCIONAR NINGUNO
    limpiarMapaNoSelect() {
      if (this.mapa) {
        // Remover el control de dibujo antes de destruir el mapa
        if (this.drawControl) {
          this.mapa.removeControl(this.drawControl);
        }
      }
    },

    // DESTRUIR MAPA DE AREAS Y CARGAR EL GLOBAL
    destruitMapaSelect() {
      if (this.mapa) {
        this.mapa.remove();
        this.mapa = null;
        // Ahora reintroduce el mapa global si es necesario
        this.initMapaGlobal();
        this.dibujarRutasSubmarinos();
      }
    },

    // DIBUJAR TODAS LAS RUTAS EN EL MAPA GLOBAL
    dibujarRutasSubmarinos() {
      if (!this.mapaGlobal) {
        console.error("El mapa global no está inicializado");
        return;
      }

      let bounds = new L.LatLngBounds();

      // Filtrar submarinos cuyas IDs coinciden con las ubicaciones conocidas
      const submarinosConUbicaciones = this.submarinos.filter(submarino =>
        this.ubicacionesSubmarinos.hasOwnProperty(submarino.id_sub)
      );
      //console.log("Submarinos filtrados con ubicaciones:", submarinosConUbicaciones);

      // Dibujar las rutas de submarinos filtrados
      submarinosConUbicaciones.forEach(submarino => {
        let latlngs = this.ubicacionesSubmarinos[submarino.id_sub];
        let polyline = L.polyline(latlngs, { color: '#122C34' }).addTo(this.mapaGlobal);
        bounds.extend(polyline.getBounds());
      });


      if (bounds.isValid()) {
        this.mapaGlobal.fitBounds(bounds, { padding: [50, 50] }); // Ajustar el mapa para mostrar todos los límites con un padding
      }
    },

    // MAPA INICIAL DONDE SE VEN TODAS LAS UBIS DE LOS SUBS
    initMapaGlobal() {
      if (!this.mapaGlobal) {
        this.mapaGlobal = L.map('mapaSelect', {
          center: [41.38879, 2.15899], // Centro inicial del mapa
          zoom: 10, // Nivel de zoom inicial configurado a 13
          maxZoom: 19 // Establece el máximo zoom permitido a 19
        });
        L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(this.mapaGlobal);
        this.mapaGlobal.whenReady(() => {
          this.mapaGlobal.setZoom(13);
        });
        // Otras configuraciones y controles pueden ser añadidos aquí
      } else {
        console.log("El mapa global ya está inicializado.");
      }
    },

    // CARGAR COODS EN EL MAPA GLOBAL
    cargarCoordenadasEnMapaGlobal() {
      // Verificar si el mapa global ya está inicializado
      if (!this.mapaGlobal) {
        // Si no está inicializado, inicializarlo
        this.initMapaGlobal();
      } else {
        // Si ya está inicializado, limpiar el mapa antes de cargar nuevas coordenadas
        this.limpiarMapaGlobal(this.mapaGlobal);
      }
      this.drawControl.addTo(this.mapaGlobal);
    },

    // LIMPIAR EL MAPA GLOBAL (ESTA REPETIDA PERO NO BORRAR, NO VA EL COD SIN ESTO)
    limpiarMapaGlobal() {
      if (this.mapaGlobal) {
        this.mapaGlobal.remove(); // Esto destruirá la instancia del mapa y limpiará el contenedor
        this.mapaGlobal = null; // Reinicia la referencia a null para una nueva inicialización

      } else {
        // Si el mapa no existe, lo inicializamos de nuevo
        this.initMapaGlobal();
        this.dibujarRutasSubmarinos();
      }
    },

  },
  //
  computed: {
    submarinosAsignadosFiltrados() {
      return this.submarinosAsignados.filter(
        (submarino) => submarino.id_area === this.areaEncontradaID
      );
    }
  },

  //CONSOLA
  created() {
    console.log("CREADO");
    this.socket = io("http://localhost:3169/");
    this.socket.on("SelectUbicacionSubmarinos", (data) => {
      this.ubicacionesSubmarinos = {};
      data.forEach(ubicacion => {
        if (!this.ubicacionesSubmarinos[ubicacion.idSub]) {
          this.ubicacionesSubmarinos[ubicacion.idSub] = [];
        }
        ubicacion.ubicacions.forEach(u => {
          // Asegúrate de que 'u.coordenadas' es un array y tiene al menos dos elementos
          //console.log("Datos de ubicación recibidos:", u);
          if (Array.isArray(u.coordenadas) && u.coordenadas.length >= 2) {
            let lat = u.coordenadas[0].lat; // Acceso a la latitud
            let lon = u.coordenadas[1].lon; // Acceso a la longitud
            this.ubicacionesSubmarinos[ubicacion.idSub].push([lat, lon]);
          }
        });
      });
    })
  },

  mounted() {
    console.log("MONTADO");
    this.initMapaGlobal();
    this.getAreas();
    this.getSubmarino();
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
  background-color: #EFEFEF; /* Define el color de fondo aquí */
}
.navDrawer {
  float: left;
  z-index: -1 !important;
  position: relative !important;
}

.dialog-content {
  border: 2px solid black !important;
  padding: 5px;
}

.small-select {
  width: 750px;
  margin: 0 auto;
}
</style>