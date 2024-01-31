// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    userRole: ''
  }),
  actions: {
    setUserRole(role) {
      this.userRole = role;
    }
  }
})
