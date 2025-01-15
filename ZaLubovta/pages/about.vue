<template>
  <div class="about-container">
    <div class="about-header">
      <h1>За този проект</h1>
      <p>
        Това е училищен проект, разработен съвместно от нашия екип за да
        демонстрираме уменията си в уеб разработка,работа в екип и четене с разбиране. По-долу са
        описани всички, които участваха в този проект.
      </p>
    </div>

    <div class="contributors">
      <div
        v-for="contributor in contributors"
        :key="contributor.name"
        class="profile-card"
      >
        <img
          :src="contributor.image"
          :alt="`${contributor.name}'s profile picture`"
          class="profile-picture"
        />
        <h2 class="name">{{ contributor.name }}</h2>
        <p class="role">{{ contributor.role }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    // Contributor data
    const contributors = ref([
      {
        name: "Симеон Петков",
        role: "Редактор",
        image: "/images/simeon.JPG", // Replace with actual image URL
      },
      {
        name: "Георги Гергов",
        role: "Документалист",
        image: "/images/georgi.JPG", // Replace with actual image URL
      },
      {
        name: "Емилиан Николов",
        role: "Визуалист",
        image: "/images/emo.JPG", // Replace with actual image URL
      },
      {
        name: "Денис Илийчев",
        role: "Презентатор",
        image: "/images/denis.JPG", // Replace with actual image URL
      }
    ]);

    return {
      contributors,
    };
  },
});
</script>

<style scoped>
.about-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  font-family: Arial, sans-serif;
}

.about-header {
  margin-bottom: 30px;
}

.about-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #111827;
}

.about-header p {
  font-size: 1.1rem;
  color: #4b5563;
  line-height: 1.6;
}

.contributors {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.profile-card {
  width: 200px;
  background-color: #f9f9f9;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.profile-card:hover {
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.profile-picture {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}

.name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 5px;
}

.role {
  font-size: 0.9rem;
  color: #6b7280;
}
</style>
