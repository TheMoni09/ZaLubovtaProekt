<template>
  <div class="post-container">
    <div v-if="loading" class="text-center loading-container">
      <span class="loader"></span>
      <strong class="loading-text">Loading...</strong>
    </div>

    <div class="post-header">
      <h1>Редактиране на Публикация</h1>
      <p>Тук можете да редактирате съществуваща публикация.</p>
    </div>

    <div v-if="!loading && post" class="edit-post-form">
      <textarea
        v-model="post.description"
        placeholder="Редактирайте публикацията..."
        rows="5"
      ></textarea>
      <div class="post-actions">
        <button @click="savePost" :disabled="!post.description">
          Запази Промените
        </button>
        <button @click="goBack">Отказ</button>
      </div>
    </div>

    <div v-if="!loading && !post" class="no-post">
      <p>Публикацията не беше намерена.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";

export default defineComponent({
  setup() {
    interface Post {
      id: number;
      title: string;
      description: string;
      category: string;
      created_at: string;
      created_by: string;
    }

    const post = ref<Post | null>(null);
    const loading = ref(false);
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();
    const supabase = useSupabaseClient();

    // Load post by ID
    const loadPost = async () => {
      loading.value = true;
      try {
        const { data, error } = await supabase
          .from("Posts")
          .select("*")
          .eq("id", route.params.id)
          .single();

        if (error) throw error;
        post.value = data;
      } catch (err) {
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadPost();
    });

    // Save changes to post
    const savePost = async () => {
      if (post.value) {
        try {
          const { error } = await supabase
            .from("Posts")
            .update({
              description: post.value.description,
            })
            .eq("id", post.value.id);

          if (error) throw error;
          router.push("/my-posts"); // Navigate to posts list
        } catch (err) {
          console.error("Error saving post:", err);
        }
      }
    };

    // Go back to the posts list
    const goBack = () => {
      router.push("/my-posts");
    };

    // Load the post on component mount

    return {
      post,
      loading,
      savePost,
      goBack,
    };
  },
});
</script>

<style scoped>
.post-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  font-family: Arial, sans-serif;
}

.post-header {
  margin-bottom: 30px;
}

.post-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #111827;
}

.post-header p {
  font-size: 1.1rem;
  color: #4b5563;
  line-height: 1.6;
}

.edit-post-form textarea {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  resize: vertical;
  margin-bottom: 15px;
}

.post-actions button {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:disabled {
  background-color: #e5e7eb;
  cursor: not-allowed;
}

button:not(:disabled):hover {
  background-color: #3b82f6;
  color: white;
}

.no-post {
  margin-top: 20px;
  font-size: 1.2rem;
  color: #e11d48;
}
</style>
