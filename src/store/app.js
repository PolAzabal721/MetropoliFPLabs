// Utilities
import { defineStore } from 'pinia'


export const useAppStore = defineStore('app', {

  state: () => ({
    userRole: localStorage.getItem('userRole') || ''
  }),
  actions: {
    setUserRole(role) {
      this.userRole = role;
      // Almacenar el rol del usuario en localStorage al establecerlo
      localStorage.setItem('userRole', role);
    },
    // Agregar un método para limpiar la sesión al cerrar sesión
    clearSession() {
      this.userRole = '';
      localStorage.removeItem('userRole');
    }
  },
  persist: true
})
