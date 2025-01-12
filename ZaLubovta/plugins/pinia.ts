import { defineNuxtPlugin } from '#app';
import { createPinia } from 'pinia';

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia();
  nuxtApp.vueApp.use(pinia);
});

// stores/auth.ts
import { defineStore } from 'pinia';

interface User {
  id: string;
  email: string;
  // Add other user properties you need
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isLoggedIn: false,
    user: null
  }),
  
  actions: {
    setLoggedIn(status: boolean, user: User | null) {
      this.isLoggedIn = status;
      this.user = user;
    }
  }
});