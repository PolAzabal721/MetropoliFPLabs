// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {

  state: () => ({
    userRole: localStorage.getItem('userRole') || '',
    userEmpresa: localStorage.getItem('userEmpresa') || '',
    userName: localStorage.getItem('userName') || '',
    userApellido: localStorage.getItem('userApellido') || ''
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
    }
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
    // Agregar un método para limpiar la sesión al cerrar sesión
    clearSession() {
      this.userRole = '';
      this.userEmpresa = '';
      this.userName = '';
      this.userApellido = '';
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmpresa');
      localStorage.removeItem('userName');
      localStorage.removeItem('userApellido');
    }
  },
  persist: true
})
