// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {

  state: () => ({
    userRole: localStorage.getItem('userRole') || '',
    userEmpresa: localStorage.getItem('userEmpresa') || '',
    userName: localStorage.getItem('userName') || '',
    userApellido: localStorage.getItem('userApellido') || '',
    userID: localStorage.getItem('userID') || '',
    empresas: JSON.parse(localStorage.getItem('empresas')) || [],

  }),
  getters: {
    getUserRole() {
      return this.userRole;
    },
    getUserEmpresa() {
      return this.userEmpresa;
    },

    getUserName(){
      return this.userName;
    },
    getUserApellido(){
      return this.userApellido;
    },
    getUserID(){
      return this.userID;
    },
    getEmpresas() {
      return this.empresas;
    },
  },
  actions: {
    setUserRole(role) {
      this.userRole = role;
      // Almacenar el rol del usuario en localStorage al establecerlo
      localStorage.setItem('userRole', role);
    },
    setUserEmpresa(empresa) {
      this.userEmpresa = empresa;
      localStorage.setItem('userEmpresa', empresa);
    },
    setUserName(nom){
      this.userName= nom;
      localStorage.setItem('userName', nom);

    },
    setUserApellido(apellido){
      this.userApellido = apellido;
      localStorage.setItem('userApellido', apellido);
    },
    setUserID(ID){
      this.userID = ID;
      localStorage.setItem('userID', ID);
    },
    setEmpresas(empresas) {
      this.empresas = empresas;
      localStorage.setItem('empresas', JSON.stringify(empresas));
    },
    // Agregar un método para limpiar la sesión al cerrar sesión
    clearSession() {
      this.userRole = '';
      this.userEmpresa = '';
      this.userName = '';
      this.userApellido = '';
      this.userID = '';
      this.empresas = [];
      localStorage.removeItem('empresas');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmpresa');
      localStorage.removeItem('userName');
      localStorage.removeItem('userApellido');
      localStorage.removeItem('userID');
    },
    
  },
  persist: true
})
