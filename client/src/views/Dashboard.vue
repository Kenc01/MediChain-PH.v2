<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { Heart, FileText, QrCode, LogOut, User, Droplet, AlertTriangle, Pill, Menu, X } from 'lucide-vue-next'

const router = useRouter()
const user = ref<any>(null)
const patientData = ref<any>(null)
const isLoading = ref(true)
const menuOpen = ref(false)

onMounted(async () => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
    await fetchPatientData()
  }
  isLoading.value = false
})

async function fetchPatientData() {
  try {
    const response = await fetch(`/api/patient/${user.value.nftId}`)
    if (response.ok) {
      patientData.value = await response.json()
    }
  } catch (e) {
    console.error('Failed to fetch patient data')
  }
}

function logout() {
  localStorage.removeItem('user')
  router.push('/')
}

const qrCodeUrl = computed(() => {
  if (user.value?.nftId) {
    return `${window.location.origin}/emergency/${user.value.nftId}`
  }
  return ''
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <header class="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
      <div class="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <Heart class="h-6 w-6 text-primary" />
          <span class="font-bold text-lg">MediChain-PH</span>
        </div>
        
        <nav class="hidden md:flex items-center gap-4">
          <RouterLink 
            to="/dashboard" 
            class="px-3 py-2 text-sm font-medium rounded-md bg-primary/10 text-primary"
            data-testid="link-dashboard"
          >
            Dashboard
          </RouterLink>
          <RouterLink 
            to="/records" 
            class="px-3 py-2 text-sm font-medium rounded-md hover-elevate"
            data-testid="link-records"
          >
            Medical Records
          </RouterLink>
          <button 
            @click="logout" 
            class="px-3 py-2 text-sm font-medium text-muted-foreground hover-elevate rounded-md flex items-center gap-2"
            data-testid="button-logout"
          >
            <LogOut class="h-4 w-4" />
            Logout
          </button>
        </nav>
        
        <button @click="menuOpen = !menuOpen" class="md:hidden p-2" data-testid="button-menu">
          <Menu v-if="!menuOpen" class="h-5 w-5" />
          <X v-else class="h-5 w-5" />
        </button>
      </div>
      
      <div v-if="menuOpen" class="md:hidden border-t p-4 space-y-2">
        <RouterLink 
          to="/dashboard" 
          class="block px-3 py-2 text-sm font-medium rounded-md bg-primary/10 text-primary"
          @click="menuOpen = false"
        >
          Dashboard
        </RouterLink>
        <RouterLink 
          to="/records" 
          class="block px-3 py-2 text-sm font-medium rounded-md hover-elevate"
          @click="menuOpen = false"
        >
          Medical Records
        </RouterLink>
        <button 
          @click="logout" 
          class="w-full text-left px-3 py-2 text-sm font-medium text-muted-foreground hover-elevate rounded-md flex items-center gap-2"
        >
          <LogOut class="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <div v-if="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p class="mt-4 text-muted-foreground">Loading your health data...</p>
      </div>
      
      <div v-else>
        <div class="mb-8">
          <h1 class="text-2xl font-bold mb-2" data-testid="text-welcome">
            Welcome, {{ user?.fullName || 'Patient' }}
          </h1>
          <p class="text-muted-foreground">Manage your health information securely</p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-card border rounded-md p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User class="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 class="font-semibold">Profile</h3>
                <p class="text-sm text-muted-foreground">Your basic info</p>
              </div>
            </div>
            <div class="space-y-2 text-sm">
              <p><span class="text-muted-foreground">Name:</span> {{ user?.fullName || 'Not set' }}</p>
              <p><span class="text-muted-foreground">NFT ID:</span> {{ user?.nftId || 'Generating...' }}</p>
            </div>
          </div>
          
          <div class="bg-card border rounded-md p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <Droplet class="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 class="font-semibold">Blood Type</h3>
                <p class="text-sm text-muted-foreground">Critical info</p>
              </div>
            </div>
            <p class="text-3xl font-bold text-red-500" data-testid="text-bloodtype">
              {{ patientData?.bloodType || user?.bloodType || 'Not set' }}
            </p>
          </div>
          
          <div class="bg-card border rounded-md p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <AlertTriangle class="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h3 class="font-semibold">Allergies</h3>
                <p class="text-sm text-muted-foreground">Known allergies</p>
              </div>
            </div>
            <div class="flex flex-wrap gap-2" data-testid="list-allergies">
              <span 
                v-for="allergy in (patientData?.allergies || [])" 
                :key="allergy"
                class="px-2 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded text-sm"
              >
                {{ allergy }}
              </span>
              <span v-if="!patientData?.allergies?.length" class="text-muted-foreground text-sm">
                None recorded
              </span>
            </div>
          </div>
          
          <div class="bg-card border rounded-md p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Pill class="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 class="font-semibold">Medications</h3>
                <p class="text-sm text-muted-foreground">Current medications</p>
              </div>
            </div>
            <div class="flex flex-wrap gap-2" data-testid="list-medications">
              <span 
                v-for="med in (patientData?.medications || [])" 
                :key="med"
                class="px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded text-sm"
              >
                {{ med }}
              </span>
              <span v-if="!patientData?.medications?.length" class="text-muted-foreground text-sm">
                None recorded
              </span>
            </div>
          </div>
          
          <div class="bg-card border rounded-md p-6 md:col-span-2">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <QrCode class="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 class="font-semibold">Emergency QR Code</h3>
                <p class="text-sm text-muted-foreground">Share this for emergency access</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-32 h-32 bg-muted rounded-md flex items-center justify-center">
                <QrCode class="h-16 w-16 text-muted-foreground" />
              </div>
              <div class="flex-1">
                <p class="text-sm text-muted-foreground mb-2">
                  First responders can scan this QR code to access your critical health information during emergencies.
                </p>
                <p class="text-xs font-mono bg-muted p-2 rounded break-all" data-testid="text-qr-url">
                  {{ qrCodeUrl }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
