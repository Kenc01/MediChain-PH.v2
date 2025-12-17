<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { Heart, Eye, EyeOff } from 'lucide-vue-next'

const router = useRouter()
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const error = ref('')

async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }
  
  isLoading.value = true
  error.value = ''
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: username.value, 
        password: password.value 
      })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/dashboard')
    } else {
      error.value = data.message || 'Login failed'
    }
  } catch (e) {
    error.value = 'Connection error. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <RouterLink to="/" class="inline-flex items-center gap-2 mb-4">
          <Heart class="h-8 w-8 text-primary" />
          <span class="font-bold text-xl">MediChain-PH</span>
        </RouterLink>
        <h1 class="text-2xl font-bold" data-testid="text-login-title">Welcome Back</h1>
        <p class="text-muted-foreground">Sign in to access your health records</p>
      </div>
      
      <div class="bg-card border rounded-md p-6">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div v-if="error" class="p-3 rounded-md bg-destructive/10 text-destructive text-sm" data-testid="text-error">
            {{ error }}
          </div>
          
          <div class="space-y-2">
            <label for="username" class="text-sm font-medium">Username</label>
            <input
              id="username"
              v-model="username"
              type="text"
              placeholder="Enter your username"
              class="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="input-username"
            />
          </div>
          
          <div class="space-y-2">
            <label for="password" class="text-sm font-medium">Password</label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                class="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                data-testid="input-password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                data-testid="button-toggle-password"
              >
                <EyeOff v-if="showPassword" class="h-4 w-4" />
                <Eye v-else class="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium hover-elevate disabled:opacity-50"
            data-testid="button-login"
          >
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
        
        <div class="mt-6 text-center text-sm">
          <span class="text-muted-foreground">Don't have an account? </span>
          <RouterLink to="/register" class="text-primary font-medium" data-testid="link-register">
            Sign up
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
