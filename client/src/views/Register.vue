<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { Heart, Eye, EyeOff } from 'lucide-vue-next'

const router = useRouter()
const fullName = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const bloodType = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const error = ref('')

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

async function handleRegister() {
  if (!fullName.value || !username.value || !password.value || !confirmPassword.value) {
    error.value = 'Please fill in all fields'
    return
  }
  
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  
  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }
  
  isLoading.value = true
  error.value = ''
  
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        fullName: fullName.value,
        username: username.value, 
        password: password.value,
        bloodType: bloodType.value || null
      })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/dashboard')
    } else {
      error.value = data.message || 'Registration failed'
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
        <h1 class="text-2xl font-bold" data-testid="text-register-title">Create Account</h1>
        <p class="text-muted-foreground">Start managing your health records</p>
      </div>
      
      <div class="bg-card border rounded-md p-6">
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div v-if="error" class="p-3 rounded-md bg-destructive/10 text-destructive text-sm" data-testid="text-error">
            {{ error }}
          </div>
          
          <div class="space-y-2">
            <label for="fullName" class="text-sm font-medium">Full Name</label>
            <input
              id="fullName"
              v-model="fullName"
              type="text"
              placeholder="Juan Dela Cruz"
              class="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="input-fullname"
            />
          </div>
          
          <div class="space-y-2">
            <label for="username" class="text-sm font-medium">Username</label>
            <input
              id="username"
              v-model="username"
              type="text"
              placeholder="Choose a username"
              class="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="input-username"
            />
          </div>
          
          <div class="space-y-2">
            <label for="bloodType" class="text-sm font-medium">Blood Type (Optional)</label>
            <select
              id="bloodType"
              v-model="bloodType"
              class="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="select-bloodtype"
            >
              <option value="">Select blood type</option>
              <option v-for="type in bloodTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>
          
          <div class="space-y-2">
            <label for="password" class="text-sm font-medium">Password</label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="At least 6 characters"
                class="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                data-testid="input-password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                <EyeOff v-if="showPassword" class="h-4 w-4" />
                <Eye v-else class="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div class="space-y-2">
            <label for="confirmPassword" class="text-sm font-medium">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              class="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="input-confirm-password"
            />
          </div>
          
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium hover-elevate disabled:opacity-50"
            data-testid="button-register"
          >
            {{ isLoading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>
        
        <div class="mt-6 text-center text-sm">
          <span class="text-muted-foreground">Already have an account? </span>
          <RouterLink to="/login" class="text-primary font-medium" data-testid="link-login">
            Sign in
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
