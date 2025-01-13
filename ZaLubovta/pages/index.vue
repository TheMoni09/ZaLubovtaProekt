<template>
  <div class="flex justify-center items-center min-h-screen p-4 container">
    <div class="posts-container">
      <!-- Introduction Section -->
      <div class="intro text-center mb-6">
        <h2 class="text-2xl font-semibold">
          Добре дошли в секцията с публикации
        </h2>
        <p class="text-gray-600">
          Тук можете да разгледате всички най-нови публикации. Кликнете върху
          която и да е публикация, за да видите повече подробности.
        </p>
      </div>

      <div v-if="loading" class="text-center">
        <span class="loader"></span>
        <strong>Loading</strong>
      </div>

      <div v-else-if="error" class="text-red-500">
        <p>Error: {{ error }}</p>
      </div>

      <div v-else class="posts-list">
        <div
          v-for="post in posts"
          :key="post.id"
          class="border rounded-lg p-4 shadow-sm mb-4 post"
          v-on:click="() => OpenPost(post.id)"
        >
          <h2 class="text-xl font-bold mb-2">{{ post.title }}</h2>
          <p class="description text-gray-600 mb-4 font-light">
            {{ post.description }}
          </p>
          <div
            class="flex justify-between items-center date-author font-normal"
          >
            <span class="text-gray-500">{{ post.created_by }} </span>
            <span class="text-gray-500 date">
              {{ formatDate(post.created_at) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="text-center mt-4">
        <button
          v-if="currentPage > 1"
          @click="navigateToPage(currentPage - 1)"
          class="px-4 py-2 bg-blue-500 text-white rounded-md pageBtn"
          style="margin-right: 10px;"
        >
          Предишна страница
        </button>
        <button
          v-if="hasNextPage"
          @click="navigateToPage(currentPage + 1)"
          class="px-4 py-2 bg-blue-500 text-white rounded-md ml-2 pageBtn"
        >
          Следваща страница
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";


// Define post type
interface Post {
  id: number;
  title: string;
  description: string;
  category: string;
  created_at: string;
  created_by: string;
}

// State
const posts = ref<Post[]>([]); // Define the type of posts as an array of Post objects
const loading = ref(true);
const error = ref<string | null>(null);
  const route = useRoute();
  const currentPage = ref(Number(route.query.page) || 1);
  const totalPages = ref(0); // Track the total number of pages
const postsPerPage = 3; // Number of posts per page
const hasNextPage = ref(false); // Track if there's a next page
const router = useRouter();


// Supabase client
const supabase = useSupabaseClient();

const OpenPost = (postId: number) => {
  loading.value = true;

  router
    .push(`/post/${postId}`)
    .then(() => {
      loading.value = false;
    })
    .catch((error) => {
      console.error("Navigation error:", error);
      loading.value = false;
    });
};

// Fetch posts
const loadPosts = async (page: number) => {
  loading.value = true;
  try {
    const { data, error: fetchError, count } = await supabase
      .from("Posts")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * postsPerPage, page * postsPerPage - 1);

    if (fetchError) throw fetchError;

    posts.value = data || [];
    totalPages.value = Math.ceil((count || 0) / postsPerPage);
    hasNextPage.value = page < totalPages.value;
    currentPage.value = page;
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
};

const navigateToPage = (page: number) => {
  router.push({ path: "/", query: { page: page.toString() } }).then(() => {
    window.scrollTo(0, 0);
  });
};

// Format dates
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Lifecycle hook
onMounted(() => {
  loadPosts(currentPage.value); // Load posts for the first page
});

watch(
  () => route.query.page,
  (newPage) => {
    const page = Number(newPage);
    if (page > 0 && page !== currentPage.value) {
      loadPosts(page);
      currentPage.value = page;
    }
  }
);

</script>

<style scoped>
.pageBtn {
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pageBtn:hover {
  background-color: #2563eb;
  scale: 1.05;
}

.container {
  font-family: "Roboto", serif;
  font-optical-sizing: auto;
  font-weight: 100;
  font-style: normal;
  font-variation-settings: "wdth" 100;
}

.intro > p {
  font-family: Arial, sans-serif;
  font-size: 1.1rem;
  color: #4b5563;
  line-height: 1.6;
}

.posts-container {
  width: 600px;
  height: auto;
  max-height: 800px;
  overflow-y: none;
  padding: 16px;
}

.posts-list {
  display: flex;
  gap: 10px;
  flex-direction: column;
  align-items: flex-start;
}

.post {
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: 0.25s;
  cursor: pointer;
}

.post:hover {
  scale: 1.05;
}

.posts-list .border {
  width: 100%;
}

.flex {
  display: flex;
}

.justify-center {
  justify-content: center;
}

.items-center {
  align-items: center;
}

.min-h-screen {
  min-height: 100vh;
}

.p-4 {
  padding: 1rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.text-center {
  text-align: center;
}

.text-red-500 {
  color: red;
}

.date {
  margin-left: auto;
}

.text-gray-600 {
  color: #3d3d3d;
}

.text-gray-500 {
  color: #3d3d3d;
}

.bg-blue-100 {
  background-color: #ebf8ff;
}

.text-blue-800 {
  color: #2b6cb0;
}

.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.rounded {
  border-radius: 0.375rem;
}

/* Description Truncation */
.description {
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Limit to 3 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal; /* Allow text to break into multiple lines */
}
</style>
