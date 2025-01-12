<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-items">
        <NuxtLink
          v-for="(item, index) in navItems"
          :key="index"
          :to="item.path"
          :class="[
            'navbar-item',
            { 'navbar-item-disabled': selected === item.path },
          ]"
          :disabled="selected === item.path"
          @click.prevent="selected === item.path ? null : navigateTo(item.path)"
        >
          {{ item.name }}
        </NuxtLink>
      </div>

      <!-- Profile dropdown when logged in -->
      <div v-if="authStore.isLoggedIn" class="profile-dropdown-container">
        <button @click="toggleDropdown" class="profile-button">Профил</button>
        <div v-if="showDropdown" class="dropdown-menu">
          <NuxtLink to="/my-posts" class="dropdown-item font-light"
            >Моите постове</NuxtLink
          >
          <NuxtLink to="/settings" class="dropdown-item font-light">Настройки</NuxtLink>
          <button @click="handleLogout" class="dropdown-item font-bold">Изход</button>
        </div>
      </div>

      <!-- Login button when logged out -->
      <NuxtLink v-else to="/login" class="login-button">Вход</NuxtLink>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
  selected: {
    type: String,
    default: null,
  },
});

// Navigation Items
const navItems = [
  { name: "Главен проект", path: "/" },
  { name: "За проекта", path: "/about" },
  { name: "Контакти", path: "/contact" },
];

// Auth store and dropdown state
const authStore = useAuthStore();
const showDropdown = ref(false);
const supabase = useSupabaseClient();

// Toggle dropdown
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

// Close dropdown when clicking outside
const closeDropdown = (event) => {
  if (!event.target.closest(".profile-dropdown-container")) {
    showDropdown.value = false;
  }
};

// Handle logout
const handleLogout = async () => {
  await supabase.auth.signOut();
  authStore.setLoggedIn(false, null);
  showDropdown.value = false;
  router.push("/login");
};

// Lifecycle hooks
onMounted(() => {
  document.addEventListener("click", closeDropdown);

  // Check initial auth state
  checkAuthState();
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
});

// Check auth state
const checkAuthState = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  authStore.setLoggedIn(!!session?.user, session?.user);
};
</script>

<style scoped>
.navbar {
  background-color: var(--primary);
  padding: 1rem;
  position: static;
  top: 0;
  left: 0;
  z-index: 1000;
}

.navbar-container {
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.navbar-items {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
}

.navbar-item {
  color: white;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  text-decoration: none;
  transition: all 0.25s;
}

.navbar-item:hover:not(.navbar-item-disabled) {
  background-color: var(--primary-hover);
  scale: 1.1;
}

.navbar-item-disabled {
  background-color: hsl(0, 0%, 96%);
  color: white;
  cursor: not-allowed;
}

.login-button,
.profile-button {
  color: white;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  text-decoration: none;
  transition: all 0.25s;
  margin-left: auto;
  margin-right: 50px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.login-button:hover,
.profile-button:hover {
  background-color: var(--primary-hover);
  scale: 1.1;
}

.profile-dropdown-container {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 2.5rem;
  right: 0;
  background: white;
  color: black;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 150px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  font-size: 14px;
  text-decoration: none;
  color: var(--primary);
  cursor: pointer;
  text-align: left;
}

.dropdown-item:hover {
  background: var(--primary-hover);
  color: white;
}
</style>
