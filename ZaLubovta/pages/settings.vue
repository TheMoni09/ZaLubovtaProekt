<template>
    <div class="profile-settings-container">
        <div v-if="loading" class="text-center loading-container">
            <span class="loader"></span>
            <strong class="loading-text">Loading...</strong>
        </div>

        <div class="profile-header">
            <h1>Настройки на профила</h1>
            <p>Тук можете да промените вашите лични данни или да изтриете акаунта си.</p>
        </div>

        <form @submit.prevent="updateProfile">
            <div class="form-group">
                <label for="name">Име</label>
                <input type="text" id="name" v-model="name" placeholder="Вашето име" required />
            </div>

            <div class="form-group">
                <label for="email">Имейл</label>
                <input type="email" id="email" v-model="email" placeholder="Вашият имейл" required />
            </div>

            <div class="form-group">
                <label for="password">Нова парола</label>
                <input type="password" id="password" v-model="password" placeholder="Нова парола" />
            </div>

            <button type="submit" class="submit-btn" :disabled="!password || !email || !name || loading">
                Запази промените
            </button>
        </form>

        <button @click="deleteAccount" class="delete-account-btn">
            Изтрий акаунта
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

export default defineComponent({
    setup() {
        const name = ref('');
        const email = ref('');
        const password = ref('');
        const loading = ref(false);
        const authStore = useAuthStore();
        const router = useRouter();
        const supabase = useSupabaseClient();

        console.log(authStore.user)

        // Load user profile data on component mount
        const loadUserProfile = () => {
            loading.value = true;
            try {
                name.value = authStore.user?.user_metadata.name || '';
                email.value = authStore.user?.email || '';
                // password.value = authStore.user?.password || '';
            } catch (err) {
                console.error(err);
            } finally {
                loading.value = false;
            }
        };

        // Update profile information
        const updateProfile = async () => {
            if (loading.value) return;

            loading.value = true;
            try {
                // Create the update object
                const updates: { email?: string; password?: string; data?: { full_name: string } } = {
                    email: email.value,
                    data: { full_name: name.value },
                };

                // Only add the password if it's not empty
                if (password.value) {
                    updates.password = password.value;
                }

                // Update the user's profile using Supabase
                const { error } = await supabase.auth.updateUser(updates);
                if (error) throw error;

                // Save the updated name and email to localStorage
                // localStorage.setItem('name', name.value);
                // localStorage.setItem('email', email.value);

                alert('Промените бяха запазени успешно!');
            } catch (err) {
                console.error('Грешка при актуализиране на профила:', err);
                alert('Възникна грешка при актуализирането на профила.');
            } finally {
                loading.value = false;
            }
        };

        // Delete user account
        const deleteAccount = async () => {
            if (confirm('Сигурни ли сте, че искате да изтриете акаунта си? Това действие не може да бъде отменено.')) {
                loading.value = true;
                try {
                    const { error } = await supabase.auth.deleteUser(authStore.user.id);
                    if (error) throw error;

                    alert('Акаунтът беше изтрит успешно.');
                    router.push('/login'); // Redirect to login page
                } catch (err) {
                    console.error('Грешка при изтриване на акаунта:', err);
                    alert('Възникна грешка при изтриването на акаунта.');
                } finally {
                    loading.value = false;
                }
            }
        };

        // Load profile data when component is mounted
        onMounted(loadUserProfile);

        return {
            name,
            email,
            password,
            loading,
            updateProfile,
            deleteAccount,
        };
    },
});
</script>

<style scoped>
.profile-settings-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.profile-header {
    margin-bottom: 30px;
    text-align: center;
}

.profile-header h1 {
    font-size: 2rem;
    color: #111827;
}

.profile-header p {
    font-size: 1.1rem;
    color: #4b5563;
    line-height: 1.6;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    font-size: 1rem;
    color: #111827;
    margin-bottom: 5px;
}

.form-group input {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    box-sizing: border-box;
}

.submit-btn,
.delete-account-btn {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.submit-btn {
    background-color: #3b82f6;
    color: white;
}

.submit-btn:hover {
    background-color: #2563eb;
}

.delete-account-btn {
    background-color: #f87171;
    color: white;
    margin-top: 20px;
}

.delete-account-btn:hover {
    background-color: #ef4444;
}
</style>