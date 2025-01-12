import { useAuthStore } from "~/stores/auth";

// middleware/protected.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // If user is not logged in and tries to access protected routes
  if (!authStore.isLoggedIn) {
    return navigateTo("/login");
  }
});
