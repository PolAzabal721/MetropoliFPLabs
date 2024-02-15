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
        <v-card height="auto" width="600" style="position: absolute; margin-left: 300px; margin-top: 25px; background-color: rgb(189, 236, 255);">
        
            <!-- Contenedor para el botón y el campo de búsqueda -->
<div style="display: flex; justify-content: space-between; align-items: center; margin-left: 15px;">
  <!-- Botón para crear empresa -->
  <v-btn color="primary" @click="mostrarFormularioEmpresa">Crear Empresa</v-btn>
  
  <!-- Campo de búsqueda -->
  <div class="search-wrapper">
    <input class="search-input" type="text" v-model="filtroCliente" placeholder=" Buscar cliente">
  </div>
</div>


          <!-- Mostrar lista de clientes filtrada -->
          <v-card v-for="(cliente, index) in clientesFiltrados" :key="index" style="margin: 15px; width: auto; height: auto;">
            <v-row align="center">
              <v-col>
                <p style="margin: 20px;">
                  {{ cliente.nombre }}
                </p>
              </v-col>
            </v-row>
            <!-- Botones para editar y eliminar al final del v-card -->
            <v-btn icon @click="editarCliente(index)" style="position: absolute; right: 70px; bottom: 10px;">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="eliminarCliente(index)" style="position: absolute; right: 10px; bottom: 10px;">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card>

          <!-- Sección para agregar o editar un cliente -->
          <div v-if="clienteSeleccionado !== null">
            <h3>{{ modoEdicion ? 'Editar Cliente' : 'Agregar Cliente' }}</h3>
            <!-- Formulario para editar o agregar cliente -->
            <form @submit.prevent="guardarCliente">
              <label>Nombre:</label>
              <input v-model="clienteSeleccionado.nombre" required>
              <!-- Otros campos del cliente según tus necesidades -->
              <button type="submit">{{ modoEdicion ? 'Guardar cambios' : 'Agregar Cliente' }}</button>
              <button @click="cancelarEdicion">Cancelar</button>
            </form>
          </div>

     <!-- Modal o sección para crear empresa -->
<v-dialog v-model="mostrarModalEmpresa" max-width="820" max-height="700">
  <v-card width="auto" height="auto">
    <v-card-title>Crear Empresa</v-card-title>
    <v-card-text>
      <form @submit.prevent="crearEmpresa">
        <!-- NOMBRE + TEL -->
        <div style="display: flex; flex-direction: row; justify-content: space-between;">
          <div style="width: 48%;">
            <label>Nombre: </label>
            <input v-model="nuevaEmpresa.nombre" required class="bordered-input" style="height: auto; width: 300px;" maxlength="30">
          </div>
          <div style="width: 48%;">
            <label>Teléfono: </label>
             <!-- Campo para seleccionar el prefijo -->
      <select v-model="prefijoTelefono" class="select-prefijo">
        <option value="+1">+1</option>
        <option value="+44">+44</option>
        <option value="+49">+49</option>
        <option value="+33">+33</option>
        <option value="+34">+34</option>
  <option value="+61">+61</option>
  <option value="+81">+81</option>
  <option value="+82">+82</option>
  <option value="+86">+86</option>
  <option value="+91">+91</option>
  <option value="+92">+92</option>
  <option value="+93">+93</option>
  <option value="+94">+94</option>
  <option value="+95">+95</option>
  <option value="+98">+98</option>
  <option value="+212">+212</option>
  <option value="+213">+213</option>
  <option value="+216">+216</option>
  <option value="+218">+218</option>
  <option value="+220">+220</option>
  <option value="+221">+221</option>
  <option value="+222">+222</option>
  <option value="+223">+223</option>
  <option value="+224">+224</option>
  <option value="+225">+225</option>
  <option value="+226">+226</option>
  <option value="+227">+227</option>
  <option value="+228">+228</option>
  <option value="+229">+229</option>
  <option value="+230">+230</option>
  <option value="+231">+231</option>
  <option value="+232">+232</option>
  <option value="+233">+233</option>
  <option value="+234">+234</option>
  <option value="+235">+235</option>
  <option value="+236">+236</option>
  <option value="+237">+237</option>
  <option value="+238">+238</option>
  <option value="+239">+239</option>
  <option value="+240">+240</option>
  <option value="+241">+241</option>
  <option value="+242">+242</option>
  <option value="+243">+243</option>
  <option value="+244">+244</option>
  <option value="+245">+245</option>
  <option value="+246">+246</option>
  <option value="+247">+247</option>
  <option value="+248">+248</option>
  <option value="+249">+249</option>
  <option value="+250">+250</option>
  <option value="+251">+251</option>
  <option value="+252">+252</option>
  <option value="+253">+253</option>
  <option value="+254">+254</option>
  <option value="+255">+255</option>
  <option value="+256">+256</option>
  <option value="+257">+257</option>
  <option value="+258">+258</option>
  <option value="+259">+259</option>
  <option value="+260">+260</option>
  <option value="+261">+261</option>
  <option value="+262">+262</option>
  <option value="+263">+263</option>
  <option value="+264">+264</option>
  <option value="+265">+265</option>
  <option value="+266">+266</option>
  <option value="+267">+267</option>
  <option value="+268">+268</option>
  <option value="+269">+269</option>
  <option value="+290">+290</option>
  <option value="+291">+291</option>
  <option value="+297">+297</option>
  <option value="+298">+298</option>
  <option value="+299">+299</option>
  <option value="+350">+350</option>
  <option value="+351">+351</option>
  <option value="+352">+352</option>
  <option value="+353">+353</option>
  <option value="+354">+354</option>
  <option value="+355">+355</option>
  <option value="+356">+356</option>
  <option value="+357">+357</option>
  <option value="+358">+358</option>
  <option value="+359">+359</option>
  <option value="+370">+370</option>
  <option value="+371">+371</option>
  <option value="+372">+372</option>
  <option value="+373">+373</option>
  <option value="+374">+374</option>
  <option value="+375">+375</option>
  <option value="+376">+376</option>
  <option value="+377">+377</option>
  <option value="+378">+378</option>
  <option value="+379">+379</option>
  <option value="+380">+380</option>
  <option value="+381">+381</option>
  <option value="+382">+382</option>
  <option value="+383">+383</option>
  <option value="+384">+384</option>
  <option value="+385">+385</option>
  <option value="+386">+386</option>
  <option value="+387">+387</option>
  <option value="+388">+388</option>
  <option value="+389">+389</option>
  <option value="+420">+420</option>
  <option value="+421">+421</option>
  <option value="+423">+423</option>
  <option value="+500">+500</option>
  <option value="+501">+501</option>
  <option value="+502">+502</option>
  <option value="+503">+503</option>
  <option value="+504">+504</option>
  <option value="+505">+505</option>
  <option value="+506">+506</option>
  <option value="+507">+507</option>
  <option value="+508">+508</option>
  <option value="+509">+509</option>
  <option value="+590">+590</option>
  <option value="+591">+591</option>
  <option value="+592">+592</option>
  <option value="+593">+593</option>
  <option value="+594">+594</option>
  <option value="+595">+595</option>
  <option value="+596">+596</option>
  <option value="+597">+597</option>
  <option value="+598">+598</option>
  <option value="+599">+599</option>
  <option value="+670">+670</option>
  <option value="+672">+672</option>
  <option value="+673">+673</option>
  <option value="+674">+674</option>
  <option value="+675">+675</option>
  <option value="+676">+676</option>
  <option value="+677">+677</option>
  <option value="+678">+678</option>
  <option value="+679">+679</option>
  <option value="+680">+680</option>
  <option value="+681">+681</option>
  <option value="+682">+682</option>
  <option value="+683">+683</option>
  <option value="+685">+685</option>
  <option value="+686">+686</option>
  <option value="+687">+687</option>
  <option value="+688">+688</option>
  <option value="+689">+689</option>
  <option value="+690">+690</option>
  <option value="+691">+691</option>
  <option value="+692">+692</option>
  <option value="+850">+850</option>
  <option value="+852">+852</option>
  <option value="+853">+853</option>
  <option value="+855">+855</option>
  <option value="+856">+856</option>
  <option value="+870">+870</option>
  <option value="+871">+871</option>
  <option value="+872">+872</option>
  <option value="+873">+873</option>
  <option value="+874">+874</option>
  <option value="+878">+878</option>
  <option value="+879">+879</option>
  <option value="+880">+880</option>
  <option value="+881">+881</option>
  <option value="+882">+882</option>
  <option value="+883">+883</option>
  <option value="+886">+886</option>
  <option value="+888">+888</option>
  <option value="+960">+960</option>
  <option value="+961">+961</option>
  <option value="+962">+962</option>
  <option value="+963">+963</option>
  <option value="+964">+964</option>
  <option value="+965">+965</option>
  <option value="+966">+966</option>
  <option value="+967">+967</option>
  <option value="+968">+968</option>
  <option value="+969">+969</option>
  <option value="+971">+971</option>
  <option value="+972">+972</option>
  <option value="+973">+973</option>
  <option value="+974">+974</option>
  <option value="+975">+975</option>
  <option value="+976">+976</option>
  <option value="+977">+977</option>
  <option value="+992">+992</option>
  <option value="+993">+993</option>
  <option value="+994">+994</option>
  <option value="+995">+995</option>
  <option value="+996">+996</option>
  <option value="+998">+998</option>
      </select>
              <!-- Campo para el número de teléfono -->
              <input v-model="nuevaEmpresa.telefono" required class="bordered-input" type="tel" @input="filtrarNumeros" maxlength="15">
    
          </div>
        </div>

                <!-- DIRECCION -->
        <div style="margin-top: 15px;">
          <label>Dirección: </label>
          <v-textarea  v-model="nuevaEmpresa.direccion" required class="bordered-input" style="height: auto; width: 653px;" maxlength="245"></v-textarea>
        </div>

                <!-- CORREO + PLAN DE SUSCRIPCION -->
        <div style="display: flex; flex-direction: row; justify-content: space-between; margin-top: 15px;">
          <div style="width: 48%;">
            <label>Correo Electrónico: </label>
            <input v-model="nuevaEmpresa.correo" required class="bordered-input" style="height: auto; width: 220px;" type="email">
          </div>
          <div style="width: 48%;">
            <label>Plan de Suscripción: </label>
            <select v-model="nuevaEmpresa.plan" class="bordered-input" style="height: auto; width: 173px;">
              <option value="bronce">Bronce</option>
              <option value="plata">Plata</option>
              <option value="oro">Oro</option>
              <option value="diamante">Diamante</option>
            </select>
          </div>
        </div>

        <!-- SITIO WEB -->
        <div style="margin-top: 15px;">
          <label>Sitio Web: </label>
          <input v-model="nuevaEmpresa.sitioWeb" required class="bordered-input" style="height: auto; width: 653px;" maxlength="250">
        </div>

      </form>
    </v-card-text>
    <v-card-actions>
          <v-btn color="primary" @click="crearYGuardarEmpresa">Crear y guardar</v-btn>
          <v-btn color="error" @click="cerrarModalEmpresa">Cancelar</v-btn>
        </v-card-actions>
  </v-card>
</v-dialog>


        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { socket, state } from '../services/socket';

export default {

    data() {
        return {
            clientes: [
                { nombre: 'Cliente 1' },
                { nombre: 'peces ramon' },
                { nombre: 'rara' },
                { nombre: 'sobras' },
                { nombre: 'iaiaiaia' },
                { nombre: 'Cliente 6' },
                { nombre: 'Cliente 7' },
                { nombre: 'Cliente 8' },
                { nombre: 'Cliente feo' },
            ],
            clienteSeleccionado: null,
            modoEdicion: false,
            filtroCliente: '',

            mostrarModalEmpresa: false,
      nuevaEmpresa: {
        nombre: '',
        direccion: '',
        telefono: '',
        correo: '',
        plan: 'bronce',
        sitioWeb: '',
      },
      prefijoTelefono: '+1',
        };
    },
    computed: {
  // Computed property para filtrar clientes
  clientesFiltrados() {
      return this.clientes.filter(cliente => {
        return cliente.nombre.toLowerCase().includes(this.filtroCliente.toLowerCase());
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

        editarCliente(index) {
            this.clienteSeleccionado = { ...this.clientes[index] };
            this.modoEdicion = true;
        },
        eliminarCliente(index) {
            this.clientes.splice(index, 1);
        },
        guardarCliente() {
            if (this.modoEdicion) {
                // Lógica para guardar cambios en la edición
            } else {
                // Lógica para agregar un nuevo cliente
                this.clientes.push({ ...this.clienteSeleccionado });
            }

            // Limpiar formulario después de guardar
            this.clienteSeleccionado = null;
            this.modoEdicion = false;
        },
        cancelarEdicion() {
            // Cancelar la edición y limpiar formulario
            this.clienteSeleccionado = null;
            this.modoEdicion = false;
        },

        mostrarFormularioEmpresa() {
      // Mostrar el modal o sección para crear empresa
      this.mostrarModalEmpresa = true;
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
  this.clientes.push({
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
  this.mostrarModalEmpresa = false;
},

  // LIMPIAR FORMULARIO DE CREAR
  limpiarFormularioEmpresa() {
    // Limpiamos los campos del formulario
    this.nuevaEmpresa = {
      nombre: '',
      direccion: '',
      telefono: '',
      correo: '',
      plan: 'bronce',
      sitioWeb: '',
    };

    // Ocultamos el modal
    this.mostrarModalEmpresa = false;
  },
    },

    //CONSOLA
    created() {
        console.log("CREADO");
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