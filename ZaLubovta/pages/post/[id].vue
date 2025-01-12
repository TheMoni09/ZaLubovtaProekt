<template>
  <div class="container">
    <div v-if="loading" class="text-center loading-container">
      <span class="loader"></span>
      <strong class="loading-text">Loading...</strong>
    </div>
    <div class="post" v-if="!loading">
      <p class="post-meta">
        <strong>{{ post?.created_by || "Unknown Author" }}</strong>
        <em
          ><strong>
            на
            {{
              post?.created_at
                ? new Date(post.created_at).toLocaleDateString()
                : "Unknown Date"
            }}</strong
          ></em
        >
      </p>
      <h1>{{ post?.title || "Loading..." }}</h1>
      <p class="font-light description">
        {{ post?.description || "Details about the post go here..." }}
      </p>
    </div>
    <p v-if="error" class="error-text">{{ error }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  setup() {
    const route = useRoute();
    const id = route.params.id as string;
    const supabase = useSupabaseClient();

    interface Post {
      id: number;
      title: string;
      description: string;
      category: string;
      created_at: string;
      created_by: string;
    }

    const post = ref<Post | null>(null);
    const error = ref<string | null>(null);
    const loading = ref(true);

    const FetchPost = async () => {
      loading.value = true;
      try {
        const { data, error: fetchError } = await supabase
          .from("Posts")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;

        post.value = data;
      } catch (err) {
        error.value = (err as Error).message;
      } finally {
        loading.value = false;
      }
    };

    onMounted(FetchPost);

    return {
      id,
      post,
      error,
      loading,
    };
  },
});
</script>

<style lang="css" scoped>
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

.post {
  width: 100%;
  max-width: 800px;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.post:hover {
  transform: translateY(-5px);
}

.post-meta {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 15px;
  text-align: left;
  transition: color 0.3s ease;
}

.post-meta strong {
  font-weight: 700;
}

.post-meta em {
  font-style: normal;
  color: #374151;
}

.post-meta:hover {
  color: #1d4ed8;
}

h1 {
  font-size: 2.5rem;
  color: #111827;
  margin-bottom: 20px;
}

.description {
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.7;
  text-align: justify;
}

.error-text {
  color: #ef4444;
  font-size: 16px;
  text-align: center;
  margin-top: 20px;
}
</style>
