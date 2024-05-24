import{V as b,D as E,a as y,h as n,c as v,g as C,q as w}from"./VLayout-adda45de.js";import{L as i}from"./leaflet.draw-src-43f32a12.js";import{i as L,f as N,d as A,u as S}from"./connectionManager-2eeae4e5.js";import{o as V,c as D,b as d,a as t,w as o,n as u,F as k,u as h,d as l,t as p,M as T,N as x}from"./index-9ba3883d.js";import{_ as B}from"./index-729d7a69.js";import{V as I}from"./VMain-ee8a0062.js";import{V as g}from"./VTextField-1fb5a8e2.js";import{V as G}from"./VDialog-e9c9ca24.js";import{V as f,a as m}from"./VRow-f18ab1bf.js";import{V as M}from"./VSelect-586de474.js";import"./VList-88c86c8f.js";import"./VField-0d46687c.js";import"./VOverlay-0623f727.js";import"./scopeId-6d8fa96d.js";const c=a=>(T("data-v-cfe2f7a2"),a=a(),x(),a),_={id:"appBarContainer"},z={class:"d-flex align-center justify-center"},q=c(()=>d("div",{class:"mx-auto",id:"map",style:{height:"750px",width:"1500px"}},null,-1)),F={class:"d-flex align-center justify-center"},H=c(()=>d("h3",{style:{"margin-left":"15px"}},"Editar Àrea",-1)),O=c(()=>d("div",{id:"mapaSelect",style:{height:"730px",width:"1500px",margin:"25px"}},null,-1)),J={data(){return{drawnGeometries:[],isSearchActive:!1,minHeight:0,nombreLugar:"",map:null,mapa:null,dialogEditar:!1,isCreatingArea:!1,drawControl:null,areaCreated:!1,areas:[],nombreLugarBusqueda:"",nuevoNombreLugar:"",selectedSubmarine:"",areaEncontrada:null,areaEncontradaID:null,mapaInicializado:!1,nuevoNombre:"",nombreExistente:null,drawnItems:null,editedCoordinates:null,layerToEdit:null,isEditing:!1,nombreLugarExcedeLongitud:!1,nuevoNombreExcedeLongitud:!1,cambiosNombre:!1,backgroundColor:"#EFEFEF"}},methods:{verificarLongitudNombre(){this.nombreLugar.length>45?(this.nombreLugar=this.nombreLugar.slice(0,45),this.nombreLugarExcedeLongitud=!0,alert("El nombre no pot excedir els 45 caràcters.")):this.nombreLugarExcedeLongitud=!1},truncarValor(a){const e=a.clipboardData.getData("text/plain");if(e.length>45){a.preventDefault();const r=e.slice(0,45);this.nombreLugar=r,alert("El valor ha estat truncat a 45 caràcters.")}},verificarLongitudNuevoNombre(){this.nuevoNombre.length>45?(this.nuevoNombre=this.nuevoNombre.slice(0,45),this.nuevoNombreExcedeLongitud=!0,alert("El nom nou no pot excedir els 45 caràcters.")):this.nuevoNombreExcedeLongitud=!1},truncarNuevoNombre(a){const e=a.clipboardData.getData("text/plain");if(e.length>45){a.preventDefault();const r=e.slice(0,45);this.nuevoNombre=r,alert("El nou nom ha estat truncat a 45 caràcters.")}},initMap(){this.map=i.map("map").setView([41.38879,2.15899],11),i.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",{maxZoom:18}).addTo(this.map);const a=new i.FeatureGroup;this.map.addLayer(a),this.drawControl=new i.Control.Draw({edit:{featureGroup:a},draw:{polygon:!0,circle:!1,rectangle:!1,marker:!1,polyline:!1,circlemarker:!1}}),this.map.addControl(this.drawControl),this.map.on(i.Draw.Event.CREATED,e=>{if(!this.areaCreated){const r=e.layer;a.addLayer(r);const s=r.toGeoJSON();this.saveGeometry(s),this.drawControl._toolbars.draw.disable(),this.areaCreated=!0}}),this.map.on(i.Draw.Event.EDITED,e=>{e.layers.eachLayer(r=>{this.drawnGeometries=[];const s=r.toGeoJSON();this.saveGeometry(s)})})},limpiarMapa(){this.map&&(this.map.eachLayer(a=>{(a instanceof i.Path||a instanceof i.Marker)&&this.map.removeLayer(a)}),this.drawnGeometries=[],this.nombreLugar="",this.areaCreated=!1)},async crearLugar(){if(this.nombreLugar!==""&&this.drawnGeometries.length>0){this.isCreatingArea=!0,console.log(this.selectedSubmarine);const e=h().getUserEmpresa;try{const r=await L(this.drawnGeometries,this.nombreLugar,e,this.selectedSubmarine);alert(`Àrea creada: ${this.nombreLugar}`),this.nombreLugar="",this.drawnGeometries=[],this.selectedSubmarine=""}catch(r){console.error("Error saving area:",r),alert("Error al guardar l'àrea")}this.limpiarMapa(),this.isCreatingArea=!1,this.getAreas()}},abrirEditarDialog(){this.dialogEditar=!0,this.$nextTick(()=>{this.initMapaSelect()})},cerrarEditarDialog(){this.dialogEditar=!1,this.limpiarMapaSelect(),this.reiniciarEstado()},reiniciarEstado(){this.areaEncontrada=null,this.areaEncontradaID=null,this.nombreLugarBusqueda="",this.nuevoNombre=""},async getAreas(){try{const e=h().getUserEmpresa;this.areas=await N(),this.areas=this.areas.filter(r=>r.idEmpresa===e)}catch(a){console.error("Error fetching areas:",a)}},initMapaSelect(){this.mapa=i.map("mapaSelect").setView([41.38879,2.15899],11),i.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",{maxZoom:18}).addTo(this.mapa),this.drawnItems||(this.drawnItems=new i.FeatureGroup,this.mapa.addLayer(this.drawnItems)),this.drawControl=new i.Control.Draw({edit:{featureGroup:this.drawnItems,remove:!1,edit:!1},draw:{polygon:!1,circle:!1,rectangle:!1,marker:!1,polyline:!1,circlemarker:!1}}),this.mapa.addControl(this.drawControl),this.mapa.on(i.Draw.Event.CREATED,a=>{const e=a.layer;this.drawnItems.addLayer(e)})},async buscarArea(){if(this.isEditing=!1,this.isSearchActive)this.isSearchActive=!1,this.nombreLugarBusqueda="",this.areaEncontrada=null,this.limpiarMapaSelect(),this.initMapaSelect();else{const a=this.areas.find(e=>e.nombreArea===this.nombreLugarBusqueda);if(this.areaEncontrada=a,a&&a.coordenadas){this.isSearchActive=!0;const r=(await this.cargarCoordenadasEnMapaSelect(a.coordenadas)).getLayers();this.nuevoNombre=this.areaEncontrada.nombreArea,r.length>0?(this.layerToEdit=r[0],this.layerToEdit&&this.layerToEdit.editing||(console.log(this.layerToEdit),console.error("Editing not available on the layer."))):console.error("No layers in drawnItems to enable editing.")}}},async cargarCoordenadasEnMapaSelect(a){this.limpiarMapaSelect(),this.initMapaSelect();const e=new i.FeatureGroup;this.mapa.addLayer(e);const r=new i.Control.Draw({edit:{featureGroup:e,remove:!1,edit:!1},draw:{polygon:!1,circle:!1,rectangle:!1,marker:!1,polyline:!1,circlemarker:!1}});this.mapa.addControl(r);const s=i.geoJSON({type:"Feature",geometry:{type:"Polygon",coordinates:a}},{editOptions:{featureGroup:e,remove:!1,edit:!1}}).addTo(e);return this.mapa.fitBounds(s.getBounds()),this.drawControl=r,this.drawnItems=e,s},dibujarAreaEnMapa(a){const e=i.geoJSON({type:"Feature",geometry:{type:"Polygon",coordinates:a}}).addTo(this.mapa);this.mapa.fitBounds(e.getBounds())},limpiarMapaSelect(){this.mapa&&(this.drawControl&&this.mapa.removeControl(this.drawControl),this.mapa.eachLayer(a=>{this.mapa.removeLayer(a)}),this.mapa.remove())},limpiarEdicion(){this.nombreLugarBusqueda="",this.nuevoNombreLugar="",this.areaEncontrada=null},deleteArea(){this.areaEncontrada?window.confirm(`¿Estàs segur de voler eliminar l'àrea "${this.areaEncontrada.nombreArea}"?`)?A(this.areaEncontrada._id).then(()=>{this.getAreas(),this.limpiarEdicion(),this.mapa&&(this.mapa.eachLayer(e=>{this.mapa.removeLayer(e)}),this.mapa.remove(),this.mapa=null),this.cerrarEditarDialog()}).catch(e=>{console.error("Error al eliminar el área:",e)}):alert("Eliminació cancel·lada."):console.error("No area to delete")},editarArea(){this.layerToEdit&&(this.isEditing?(this.layerToEdit.editing.disable(),this.editedCoordinates=this.layerToEdit.toGeoJSON().geometry.coordinates,this.isEditing=!1):(this.layerToEdit.editing.enable(),this.editedCoordinates=this.areaEncontrada.coordenadas,this.isEditing=!0))},guardarCambiosClick(){if((/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/.test(this.nuevoNombre)||!this.nuevoNombre.trim())&&this.nuevoNombre.trim().length>=3)this.cambiosNombre=!0,this.guardarCambios(),this.isSearchActive=!1;else{alert("El nom nou no és vàlid. Ha de contenir almenys 3 lletres i només caràcters alfabètics.");return}},async guardarCambios(){this.isEditing=!1;let a=!1;if(this.editedCoordinates&&this.editedCoordinates.length>0&&(a=!0),this.cambiosNombre||a)try{const e=a?this.editedCoordinates:this.areaEncontrada.coordenadas;await this.actualizarCoordenadas(this.areaEncontrada._id,this.nuevoNombre,e),this.cambiosNombre&&a?alert("El nom i les coordenades s'han canviat i desat amb èxit."):this.cambiosNombre?alert("El nom s'ha canviat i desat amb èxit."):alert("Les coordenades s'han canviat i guardat amb èxit.")}catch(e){console.error("Error guardando cambios:",e),alert("Error en desar canvis");return}else{alert("No s'ha fet cap canvi.");return}this.cerrarEditarDialog()},async actualizarCoordenadas(a,e,r){await S(a,e,r),this.getAreas()},saveGeometry(a){const e=a.geometry.coordinates;this.drawnGeometries.push(e)},updateMinHeight(){const a=document.getElementById("appBarContainer"),e=a?a.offsetHeight:0;this.minHeight=window.innerHeight-e}},computed:{},created(){console.log("CREADO")},mounted(){console.log("MONTADO"),this.updateMinHeight(),window.addEventListener("resize",this.updateMinHeight),this.getAreas(),this.initMap()},updated(){console.log("UPDATED")},beforeDestroy(){window.removeEventListener("resize",this.updateMinHeight)}},P=Object.assign(J,{__name:"areas",setup(a){return(e,r)=>(V(),D(k,null,[d("div",_,[t(E)]),t(b,{class:"rounded rounded-md",style:u({backgroundColor:e.backgroundColor,height:`${e.minHeight}px`})},{default:o(()=>[t(I,null,{default:o(()=>[t(y,{fluid:"",class:"mx-auto"},{default:o(()=>[d("div",z,[t(g,{style:{height:"75px","max-width":"1300px","font-size":"auto",color:"#224870"},modelValue:e.nombreLugar,"onUpdate:modelValue":r[0]||(r[0]=s=>e.nombreLugar=s),label:"Introdueix un nom per a l'àrea",onInput:e.verificarLongitudNombre,onPaste:e.truncarValor,maxlength:"45"},null,8,["modelValue","onInput","onPaste"]),t(n,{onClick:e.crearLugar,style:{"background-color":"#84ACCE",color:"white","margin-left":"15px"},disabled:e.nombreLugar===""||e.drawnGeometries.length===0||e.nombreLugarExcedeLongitud},{default:o(()=>[l(" Crear ")]),_:1},8,["onClick","disabled"]),t(n,{onClick:e.abrirEditarDialog,class:"ml-4",style:{"background-color":"#84ACCE",color:"white"}},{default:o(()=>[l(" Editar ")]),_:1},8,["onClick"])]),q]),_:1})]),_:1}),t(G,{modelValue:e.dialogEditar,"onUpdate:modelValue":r[3]||(r[3]=s=>e.dialogEditar=s)},{default:o(()=>[d("div",F,[t(v,{height:"1020",width:"1550"},{default:o(()=>[t(C,{height:"60",style:{"background-color":"#224870",color:"white"}},{default:o(()=>[H]),_:1}),t(f,null,{default:o(()=>[t(m,{class:"mr-3"},{default:o(()=>[t(M,{class:"editarSelect",modelValue:e.nombreLugarBusqueda,"onUpdate:modelValue":r[1]||(r[1]=s=>e.nombreLugarBusqueda=s),items:e.areas.map(s=>s.nombreArea),style:{height:"75px","font-size":"auto",color:"#224870","margin-top":"15px","margin-left":"25px"},disabled:e.isSearchActive,label:"Selecciona l'àrea que vulguis editar"},null,8,["modelValue","items","disabled"])]),_:1}),t(m,null,{default:o(()=>[t(g,{class:"small-text-field",modelValue:e.nuevoNombre,"onUpdate:modelValue":r[2]||(r[2]=s=>e.nuevoNombre=s),label:"Nou nom àrea",style:{height:"75px","font-size":"auto",color:"#224870","margin-top":"15px"},disabled:!e.areaEncontrada,onInput:e.verificarLongitudNuevoNombre,onPaste:e.truncarNuevoNombre,maxlength:"45"},null,8,["modelValue","disabled","onInput","onPaste"])]),_:1})]),_:1}),t(f,{style:{"margin-top":"-20px"}},{default:o(()=>[t(m,null,{default:o(()=>[t(n,{class:"ml-4 elevation-2 btnBuscar",onClick:e.buscarArea,disabled:e.nombreLugarBusqueda===""&&!e.isSearchActive,style:u({backgroundColor:e.isSearchActive?"red":"#84ACCE",color:"white"})},{default:o(()=>[l(p(e.isSearchActive?"Netejar àrea seleccionada":"Buscar àrea"),1)]),_:1},8,["onClick","disabled","style"])]),_:1}),t(m,null,{default:o(()=>[t(n,{class:"editarArea",onClick:e.editarArea,disabled:e.nombreLugarBusqueda==="",style:{"background-color":"#84ACCE",color:"white","margin-left":"5px"}},{default:o(()=>[l(p(e.isEditing?"Guardar canvis":"Editar coordenades"),1)]),_:1},8,["onClick","disabled"])]),_:1})]),_:1}),O,t(w,null,{default:o(()=>[t(n,{onClick:e.guardarCambiosClick,color:"primary"},{default:o(()=>[l(" Guardar ")]),_:1},8,["onClick"]),t(n,{onClick:e.deleteArea,color:"error"},{default:o(()=>[l(" Eliminar àrea ")]),_:1},8,["onClick"])]),_:1})]),_:1})])]),_:1},8,["modelValue"])]),_:1},8,["style"])],64))}}),oe=B(P,[["__scopeId","data-v-cfe2f7a2"]]);export{oe as default};
