// Utilities
import { defineStore } from 'pinia'


export const useAppStore = defineStore('app', {

  state: () => ({
    userRole: localStorage.getItem('userRole') || '',
    userEmpresa: localStorage.getItem('userEmpresa') || ''
  }),
  getters: {
    getUserRole() {
      return this.userRole;
    },
    getUserEmpresa() {
      return this.userEmpresa;
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
    // Agregar un método para limpiar la sesión al cerrar sesión
    clearSession() {
      this.userRole = '';
      localStorage.removeItem('userRole');
    }
  },
  persist: true
})
