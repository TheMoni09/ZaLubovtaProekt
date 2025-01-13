<template>
  <div class="post-container">
    <div v-if="loading" class="text-center loading-container">
      <span class="loader"></span>
      <strong class="loading-text">Loading...</strong>
    </div>

    <div class="post-header">
      <h1>Нова публикация</h1>
    </div>

    <div class="create-post-form">
      <input type="text" class="title" v-model="newPostTitle" placeholder="Заглавие">
      <textarea placeholder="Пиши тук..." v-model="newPostContent" style="resize: none;" class="editor"></textarea>

      <div class="post-actions">
        <button @click="createPost" :disabled="!newPostContent">
          Създай публикация
        </button>
        <button @click="goBack">Отказ</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "vue-router"; // Import the useRouter function


export default defineComponent({

  components: {
    QuillEditor: defineAsyncComponent(() =>
      import('../components/Editor.vue')
    )
  },

  data() {
    return {
      options: {
        theme: "snow",
        placeholder: "Write here"
      }
    }
  },

  setup() {
    interface Post {
      id: number;
      title: string;
      description: string;
      created_by: string;
      user_id: string;
      created_at: string;
    }



    const newPostContent = ref("");
    const newPostTitle = ref("");


    const loading = ref(false);
    const authStore = useAuthStore();
    const router = useRouter(); // Initialize the router

    const supabase = useSupabaseClient();

    const onEditorReady = (editor: any) => {
      console.log('Editor is ready:', editor);
    };

    const goBack = () => {
      loading.value = true;

      router
        .push(`/my-posts`)
        .then(() => {
          loading.value = false;
        })
        .catch((error) => {
          console.error("Navigation error:", error);
          loading.value = false;
        });
    }

    // Function to create a post
    const createPost = async () => {
      if (newPostContent.value && newPostTitle.value) {
        try {
          const postData = {
            title: newPostTitle.value,
            description: newPostContent.value,
            created_by: authStore.user?.user_metadata.name,
            user_id: authStore.user?.id,
          };

          const { data, error } = await supabase
            .from("Posts")
            .upsert(postData)
            .select();
          if (error) {
            throw new Error(error.message);
          }

          loading.value = false;
          goBack()
        } catch (err) {
          console.error("Error creating post:", err);
        }
      }
    };

    onMounted(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        // User is already logged in, redirect to home
        router.push('/')
      }
    });

    return {
      newPostContent,
      newPostTitle,
      loading,
      createPost,
      onEditorReady,
      goBack
    };
  },
});
</script>

<style scoped>
.editor {
  margin-bottom: 10px;
  height: 150px;
  overflow: auto;
  resize: none;
  outline: none;
}

.title {
  border: 1px solid #d1d9e6;
  outline: none;
  border-radius: 5px;
  width: 100%;
  height: 30px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
}

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
  transition: background-color 0.3s ease;
}

.create-post-btn:hover {
  background-color: #2563eb;
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
