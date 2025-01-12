// middleware/auth.ts
import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  // If user is logged in and tries to access login page
  if (authStore.isLoggedIn && to.path === "/login") {
    return navigateTo("/");
  }
});

// For protected routes (optional)
// middleware/protected.ts
