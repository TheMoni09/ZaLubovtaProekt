// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },

  css: [
    '@/assets/css/global.css'
  ],

  modules: ['@nuxtjs/supabase'],
  compatibilityDate: '2025-01-11',
  supabase: {
    redirect: false,
  }
})