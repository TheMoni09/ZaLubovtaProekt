<template>
  <div class="post-container">
    <div v-if="loading" class="text-center loading-container">
      <span class="loader"></span>
      <strong class="loading-text">Loading...</strong>
    </div>

    <div class="post-header">
      <h1>Моите публикации</h1>
      <p>
        Тук можете да създадете нови публикации, да ги редактирате или
        изтривате.
      </p>
    </div>

    <div v-if="posts.length === 0" class="no-posts">
      <p>Нямате направени публикации.</p>
      <button @click="createPost" class="create-post-btn">
        + Създай публикация
      </button>
    </div>

    <div v-if="posts.length > 0">
      <button @click="createPost" class="create-post-btn">
        + Създай публикация
      </button>
    </div>

    <div v-if="posts.length > 0" class="posts-list">
      <h2>Вашите публикации</h2>
      <ul>
        <li v-for="post in posts" :key="post.id" class="post-item">
          <div class="post-content">
            <h2>{{ post.title }}</h2>
            <p class="description text-gray-600 mb-4 font-light">
              {{ post.description }}
            </p>
          </div>
          <div class="post-actions">
            <button @click="editPost(post.id)">Редактиране</button>
            <button @click="deletePost(post.id)" class="delete-btn">
              Изтриване
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "vue-router"; // Import the useRouter function

export default defineComponent({
  setup() {
    interface Post {
      id: number;
      title: string;
      description: string;
      created_by: string;
      user_id: string;
      created_at: string;
    }

    const posts = ref<{ content: Post }[]>([]);
    const newPostContent = ref("");
    const showCreatePostForm = ref(false);
    const loading = ref(false);
    const authStore = useAuthStore();
    const router = useRouter(); // Initialize the router
    const userUUID = ref<string>(""); // Use `ref` for userUUID

    const supabase = useSupabaseClient();

    // Function to create a post
    const createPost = () => {
      loading.value = true;

      router
        .push(`/create-post`)
        .then(() => {
          loading.value = false;
        })
        .catch((error) => {
          console.error("Navigation error:", error);
          loading.value = false;
        });
    };

    // Function to edit a post, navigating to the edit page
    const editPost = (id: number) => {
      router.push(`/edit-post/${id}`);
    };

    // Function to delete a post
    const deletePost = async (id: string) => {
      if (confirm("Сигурни ли сте, че искате да изтриете тази публикация?")) {
        loading.value = true;
        try {
          const { data, error: fetchError } = await supabase
            .from("Posts")
            .delete()
            .eq("id", id);

          if (fetchError) throw fetchError;

          loadPosts(); // Reload the posts after deleting
        } catch (err) {
          console.log((err as Error).message);
        } finally {
          loading.value = false;
        }
      }
    };

    // Load posts from the database
    const loadPosts = async () => {
      loading.value = true;
      try {
        const { data, error: fetchError } = await supabase
          .from("Posts")
          .select("*")
          .eq("user_id", userUUID.value)
          .order("created_at", { ascending: false });
        if (fetchError) throw fetchError;

        posts.value = data || []; // Assign fetched posts or an empty array
      } catch (err) {
        console.log((err as Error).message);
      } finally {
        loading.value = false;
      }
    };

    // Wait for the user to be logged in and get userUUID
    const setUserUUID = () => {
      if (authStore.isLoggedIn && authStore.user !== null) {
        userUUID.value = authStore.user.id;
      } else {
        console.error("User is not logged in.");
        loading.value = false;
        return; // Handle case where user is not logged in
      }
    };

    // Load posts on component mount
    onMounted(async () => {
      loading.value = true;
      setUserUUID(); // Set user UUID
      if (userUUID.value) {
        await loadPosts(); // Fetch posts after user UUID is set
      }
    });

    return {
      posts,
      newPostContent,
      showCreatePostForm,
      loading,
      createPost,
      editPost,
      deletePost,
      loadPosts,
    };
  },
});
</script>

<style scoped>
.description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  /* Limit to 3 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  /* Allow text to break into multiple lines */
}

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

.no-posts {
  margin-bottom: 30px;
}

.create-post-btn {
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.create-post-btn:hover {
  background-color: #2563eb;
  scale: 1.05;
}

.create-post-form textarea {
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

.delete-btn {
  background-color: #f87171;
  color: white;
}

.delete-btn:hover {
  background-color: #ef4444;
}

.posts-list {
  margin-top: 30px;
}

.posts-list h2 {
  font-size: 1.8rem;
  color: #111827;
  margin-bottom: 15px;
}

ul {
  list-style-type: none;
  padding: 0;
}

.post-item {
  background-color: #f9f9f9;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.post-content p {
  font-size: 1.1rem;
  color: #4b5563;
  line-height: 1.6;
  text-align: left;
  margin-left: 10px;
}

.post-content h2 {
  text-align: left;
}

.post-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.post-actions button {
  padding: 5px 15px;
  font-size: 1rem;
}
</style>
