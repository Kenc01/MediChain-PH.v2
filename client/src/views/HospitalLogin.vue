<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { Heart, LogOut } from 'lucide-vue-next'

const router = useRouter()
const username = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')

async function handleLogin() {
  isLoading.value = true
  error.value = ''

  try {
    const response = await fetch('/api/hospital/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
    })

    if (response.ok) {
      const data = await response.json()
      localStorage.setItem('hospital', JSON.stringify(data.hospital))
      router.push('/hospital')
    } else {
      error.value = 'Invalid credentials'
    }
  } catch (e) {
    error.value = 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-2 mb-4">
          <Heart class="h-8 w-8 text-primary" />
          <h1 class="text-3xl font-bold">MediChain-PH</h1>
        </div>
        <h2 class="text-xl font-semibold mb-2">Hospital Portal</h2>
        <p class="text-muted-foreground">Access patient records with proper authorization</p>
      </div>

      <div class="bg-card border rounded-lg p-8 space-y-6">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="text-sm font-medium">Username</label>
            <input
              v-model="username"
              type="text"
              placeholder="Enter hospital username"
              class="w-full mt-2 px-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label class="text-sm font-medium">Password</label>
            <input
              v-model="password"
              type="password"
              placeholder="Enter password"
              class="w-full mt-2 px-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div v-if="error" class="p-3 bg-red-50 dark:bg-red-950 text-red-600 rounded-md text-sm">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {{ isLoading ? 'Logging in...' : 'Log In' }}
          </button>
        </form>

        <div class="border-t pt-6">
          <p class="text-sm text-muted-foreground mb-4">Demo Credentials</p>
          <div class="space-y-2 text-xs bg-muted p-3 rounded-md">
            <p><strong>Username:</strong> hospital</p>
            <p><strong>Password:</strong> hospital123</p>
          </div>
        </div>
      </div>

      <div class="mt-6 text-center">
        <RouterLink to="/" class="text-sm text-primary hover:underline flex items-center justify-center gap-2">
          <LogOut class="h-4 w-4" />
          Back to Home
        </RouterLink>
      </div>
    </div>
  </div>
</template>
