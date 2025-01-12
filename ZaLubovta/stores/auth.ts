// stores/auth.js
import { defineStore } from 'pinia'
import type { User } from '@supabase/supabase-js'

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
