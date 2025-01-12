// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
    const supabase = useSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
  
    // If user is authenticated and trying to access login page
    if (session && to.path === '/login') {
      return navigateTo('/')
    }
  })