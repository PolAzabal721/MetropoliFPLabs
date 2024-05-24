import{_ as b,l as w}from"./index-64449bee.js";import{t as g,v as h}from"./connectionManager-2eeae4e5.js";import{u as v,o as d,c as p,d as n,R as m,a as l,f as u,ac as c,M as f,N as V}from"./index-31b0bcf3.js";import{_ as y}from"./logonofons-d2a6b16f.js";import{V as a}from"./VTextField-977154ce.js";import"./VField-b8a35a97.js";const k={data(){return{username:"",password:"",showPassword:!1,socket:null,showRegister:!1,name:"",surname:"",email:"",rol:"cliente",empresa:[]}},created(){this.socket=w("http://seashepherd.duckdns.org:3170/")},methods:{login(){const t={correo:this.username,contra:this.password};this.socket.emit("loginPage",t)},async register(){try{const t=await g(this.name,this.surname,this.email,this.password,this.rol);console.log("Registro exitoso:",t),window.alert("T'has registrat correctament"),this.$router.push("/")}catch(t){console.error("Error en el registro:",t)}},togglePasswordVisibility(){this.showPassword=!this.showPassword}},mounted(){const t=v();this.socket.on("RespuestaLogin",async e=>{if(e.authorization){if(t.setUserRole(e.roles),t.setUserEmpresa(e.idEmpresa),t.setUserName(e.nom),t.setUserApellido(e.apellido),t.setUserID(e.id_user),e.roles==="admin")try{const i=await h();t.setEmpresas(i)}catch(i){console.error("Error fetching empresas:",i)}this.$router.push("/")}else window.alert("Nom d'usuari o contrasenya incorrectes")})}},C=t=>(f("data-v-01d3b5ba"),t=t(),V(),t),x={class:"login-container"},M={class:"login"},R=C(()=>n("img",{src:y,alt:"Logo",class:"logo"},null,-1)),B=c('<button type="submit" data-v-01d3b5ba>Iniciar sessió</button><button class="button" data-v-01d3b5ba><svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" data-v-01d3b5ba><path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" data-v-01d3b5ba></path><path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" data-v-01d3b5ba></path><path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" data-v-01d3b5ba></path><path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" data-v-01d3b5ba></path></svg> Inicia sessió amb Google </button>',2),P=c('<button type="submit" data-v-01d3b5ba>Registrar-se</button><button class="button" data-v-01d3b5ba><svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" data-v-01d3b5ba><path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" data-v-01d3b5ba></path><path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" data-v-01d3b5ba></path><path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" data-v-01d3b5ba></path><path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" data-v-01d3b5ba></path></svg> Registrar-se amb Google </button>',2);function U(t,e,i,_,s,r){return d(),p("div",x,[n("div",M,[R,s.showRegister?u("",!0):(d(),p("form",{key:0,onSubmit:e[4]||(e[4]=m((...o)=>r.login&&r.login(...o),["prevent"]))},[l(a,{clearable:"",modelValue:s.username,"onUpdate:modelValue":e[0]||(e[0]=o=>s.username=o),"prepend-inner-icon":"mdi-email",label:"Correo",required:""},null,8,["modelValue"]),l(a,{clearable:"",modelValue:s.password,"onUpdate:modelValue":e[1]||(e[1]=o=>s.password=o),type:s.showPassword?"text":"password","prepend-inner-icon":"mdi-lock-outline",label:"Contraseña",required:"","append-icon":s.showPassword?"mdi-eye":"mdi-eye-off","onClick:append":e[2]||(e[2]=o=>r.togglePasswordVisibility())},null,8,["modelValue","type","append-icon"]),B,n("p",{onClick:e[3]||(e[3]=o=>s.showRegister=!0),class:"register-link"},"Registra't")],32)),s.showRegister?(d(),p("form",{key:1,onSubmit:e[11]||(e[11]=m((...o)=>r.register&&r.register(...o),["prevent"]))},[l(a,{clearable:"",modelValue:s.name,"onUpdate:modelValue":e[5]||(e[5]=o=>s.name=o),"prepend-inner-icon":"mdi-account",label:"Nom",required:""},null,8,["modelValue"]),l(a,{clearable:"",modelValue:s.surname,"onUpdate:modelValue":e[6]||(e[6]=o=>s.surname=o),"prepend-inner-icon":"mdi-account",label:"Cognoms",required:""},null,8,["modelValue"]),l(a,{clearable:"",modelValue:s.email,"onUpdate:modelValue":e[7]||(e[7]=o=>s.email=o),"prepend-inner-icon":"mdi-email",label:"Correu",required:""},null,8,["modelValue"]),l(a,{clearable:"",modelValue:s.password,"onUpdate:modelValue":e[8]||(e[8]=o=>s.password=o),type:s.showPassword?"text":"password","prepend-inner-icon":"mdi-lock-outline",label:"Contrasenya",required:"","append-icon":s.showPassword?"mdi-eye":"mdi-eye-off","onClick:append":e[9]||(e[9]=o=>r.togglePasswordVisibility())},null,8,["modelValue","type","append-icon"]),P,n("p",{onClick:e[10]||(e[10]=o=>s.showRegister=!1),class:"register-link"},"Inicia Sessió")],32)):u("",!0)])])}const F=b(k,[["render",U],["__scopeId","data-v-01d3b5ba"]]);export{F as default};
