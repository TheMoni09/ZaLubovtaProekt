<template>
  <title>За любовта</title>
  <div class="layout">
    <header>
      <Navbar />
    </header>
    <main class="content">
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Footer from '@/components/Footer.vue';
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1; /* Ensures content grows to fill space between header and footer */
}
</style>
