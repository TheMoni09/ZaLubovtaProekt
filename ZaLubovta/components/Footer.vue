<template>
  <footer class="footer">
    <div class="footer-content">
      <p>&copy; {{ currentYear }} ZaLubovta. All rights reserved.</p>
      <div class="footer-buttons">
        <NuxtLink to="/about" class="footer-button">About</NuxtLink>
        <NuxtLink to="/contact" class="footer-button">Contact</NuxtLink>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>

<style scoped>
.footer {
  left: 0;
  margin: 0;
  background-color: #272727;
  color: white;
  padding: 1rem 2rem;
  text-align: center;
  margin-top: auto;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.footer p {
  margin: 0;
  font-size: 0.9rem;
}

.footer-buttons {
  display: flex;
  gap: 1rem;
}

.footer-button {
  color: white;
  border: none;
  text-decoration: underline;
  transition: background-color 0.3s;
}
</style>
