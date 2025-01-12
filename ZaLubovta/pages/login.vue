<template>
  <div class="container">
    <div v-if="loading" class="text-center loading-container">
      <span class="loader"></span>
      <strong class="loading-text">Loading...</strong>
    </div>

    <div v-else>
      <div v-if="isLogin" class="form-container">
        <h2>Вход</h2>
        <div :class="['error-message', { active: error }]" v-if="error">
          {{ error }}
        </div>
        <div :class="['succes-message', { active: succes }]" v-if="succes">
          {{ succes }}
        </div>
        <form @submit.prevent="login">
          <div class="form-group">
            <label for="email">Емайл</label>
            <input type="email" id="email" v-model="loginEmail" required />
          </div>
          <div class="form-group">
            <label for="password">Парола</label>
            <input
              type="password"
              id="password"
              v-model="loginPassword"
              required
            />
          </div>
          <div class="form-group">
            <button type="submit" class="btn">Вход</button>
          </div>
        </form>
        <p class="switch-auth">
          Нямате профил? <a href="#" @click="toggleForm">Регистрирай се</a>
        </p>
      </div>

      <div v-else class="form-container">
        <h2>Регистрация</h2>
        <div :class="['error-message', { active: error }]" v-if="error">
          {{ error }}
        </div>
        <form @submit.prevent="register">
          <div class="form-group">
            <label for="register-email">Емайл</label>
            <input type="email" id="register-email" v-model="email" required />
          </div>
          <div class="form-group">
            <label for="register-email">Две имена</label>
            <input type="text" id="register-email" v-model="name" required />
          </div>
          <div class="form-group">
            <label for="register-password">Парола</label>
            <input
              type="password"
              id="register-password"
              v-model="password"
              required
            />
            <label for="register-password">Потвърди паролата</label>
            <input
              type="password"
              id="confirm-password"
              v-model="confirmPassword"
              required
            />
          </div>
          <div class="form-group">
            <button type="submit" class="btn">Регистрация</button>
          </div>
        </form>
        <p class="switch-auth">
          Имате профил? <a href="#" @click="toggleForm">Вход в профила</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth"; // Use the store

const authStore = useAuthStore();

// Supabase client
const supabase = useSupabaseClient();
const router = useRouter();

const email = ref("");
const name = ref("");
const loginEmail = ref("");
const password = ref("");
const loginPassword = ref("");
const confirmPassword = ref("");
const error = ref<string | null>(null);
const succes = ref<string | null>(null);
const loading = ref(false);
const isLogin = ref(true);

// Register/Log in state management
const toggleForm = () => {
  isLogin.value = !isLogin.value;
  error.value = null; // Clear errors when toggling forms
};

// Registration function
const register = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = "Паролите не съвпадат";
    return;
  }

  loading.value = true;
  try {
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
            name: name.value
        }
      }
    });
    if (signUpError) throw signUpError;

    // Handle success
    error.value = null;
    succes.value = "Успешна регистрация!";
    toggleForm();
  } catch (err) {
    if ((err as Error).message === "User already registered") {
      (err as Error).message = "Емайлът вече е регистриран";
    }
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
};

// Login function
const login = async () => {
  succes.value = null;
  loading.value = true;
  try {
    const { error: loginError, data } = await supabase.auth.signInWithPassword({
      email: loginEmail.value,
      password: loginPassword.value,
    });
    if (loginError) throw loginError;

    // Pass the entire user object from Supabase
    authStore.setLoggedIn(true, data.user);

    succes.value = "Успешен вход!";
    router.push("/");
  } catch (err) {
    if ((err as Error).message === "Invalid login credentials") {
      (err as Error).message = "Грешни данни за вход";
    } else if ((err as Error).message === "Email not confirmed") {
      (err as Error).message = "Емайлът не е потвърден";
    }
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    // User is already logged in, redirect to home
    router.push('/')
  }
});
</script>

<style lang="css" scoped>
.error-message {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1; /* Place it above the form background */
  height: 40px;
  background-color: #ff4d4f; /* Red background */
  color: white;
  font-size: 14px;
  text-align: center;
  line-height: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-100%); /* Hidden above the form */
  opacity: 0; /* Fully transparent */
  transition: transform 0.4s ease, opacity 0.4s ease;
}

.error-message.active {
  transform: translateY(0); /* Slide into view */
  opacity: 1; /* Fully visible */
}

.succes-message {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1; /* Place it above the form background */
  height: 40px;
  background-color: #17e043; /* Red background */
  color: white;
  font-size: 14px;
  text-align: center;
  line-height: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-100%); /* Hidden above the form */
  opacity: 0; /* Fully transparent */
  transition: transform 0.4s ease, opacity 0.4s ease;
}

.succes-message.active {
  transform: translateY(0); /* Slide into view */
  opacity: 1; /* Fully visible */
}

.form-container {
  position: relative; /* Establish a positioning context for error-message */
  width: 100%;
  max-width: 400px;
  background-color: #ffffff;
  padding: 30px 20px 20px; /* Add padding for spacing */
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8, #d1d9e6);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.loading-text {
  font-size: 18px;
  font-weight: 600;
  color: #4b5563;
  margin-top: 10px;
}

.error-message {
  color: white;
  font-size: 14px;
  margin-bottom: 80px;
}

.form-container {
  width: 100%;
  max-width: 400px;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.form-container:hover {
  transform: translateY(-5px);
}

h2 {
  font-size: 2rem;
  color: #111827;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 14px;
  color: #374151;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #d1d9e6;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #1d4ed8;
  outline: none;
}

.btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  background-color: #1d4ed8;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #2563eb;
}

.switch-auth {
  text-align: center;
  font-size: 14px;
  color: #374151;
}

.switch-auth a {
  color: #1d4ed8;
  text-decoration: none;
}

.switch-auth a:hover {
  text-decoration: underline;
}
</style>
