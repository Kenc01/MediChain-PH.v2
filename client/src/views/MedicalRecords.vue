<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { Heart, FileText, LogOut, Calendar, Building2, ArrowLeft, Plus, Menu, X } from 'lucide-vue-next'

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

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-PH', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}
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
            class="px-3 py-2 text-sm font-medium rounded-md hover-elevate"
          >
            Dashboard
          </RouterLink>
          <RouterLink 
            to="/records" 
            class="px-3 py-2 text-sm font-medium rounded-md bg-primary/10 text-primary"
          >
            Medical Records
          </RouterLink>
          <button 
            @click="logout" 
            class="px-3 py-2 text-sm font-medium text-muted-foreground hover-elevate rounded-md flex items-center gap-2"
          >
            <LogOut class="h-4 w-4" />
            Logout
          </button>
        </nav>
        
        <button @click="menuOpen = !menuOpen" class="md:hidden p-2">
          <Menu v-if="!menuOpen" class="h-5 w-5" />
          <X v-else class="h-5 w-5" />
        </button>
      </div>
      
      <div v-if="menuOpen" class="md:hidden border-t p-4 space-y-2">
        <RouterLink 
          to="/dashboard" 
          class="block px-3 py-2 text-sm font-medium rounded-md hover-elevate"
          @click="menuOpen = false"
        >
          Dashboard
        </RouterLink>
        <RouterLink 
          to="/records" 
          class="block px-3 py-2 text-sm font-medium rounded-md bg-primary/10 text-primary"
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
      <div class="mb-8">
        <RouterLink 
          to="/dashboard" 
          class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft class="h-4 w-4" />
          Back to Dashboard
        </RouterLink>
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 class="text-2xl font-bold" data-testid="text-records-title">Medical Records</h1>
            <p class="text-muted-foreground">Your complete health history</p>
          </div>
          <button 
            class="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover-elevate flex items-center gap-2"
            data-testid="button-add-record"
          >
            <Plus class="h-4 w-4" />
            Add Record
          </button>
        </div>
      </div>
      
      <div v-if="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p class="mt-4 text-muted-foreground">Loading records...</p>
      </div>
      
      <div v-else>
        <div v-if="patientData?.medicalRecords?.length" class="space-y-4" data-testid="list-records">
          <div 
            v-for="(record, index) in patientData.medicalRecords" 
            :key="index"
            class="bg-card border rounded-md p-6"
          >
            <div class="flex items-start justify-between gap-4 mb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText class="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 class="font-semibold">{{ record.diagnosis || record.type || 'Medical Record' }}</h3>
                  <div class="flex items-center gap-4 text-sm text-muted-foreground">
                    <span class="flex items-center gap-1">
                      <Calendar class="h-3 w-3" />
                      {{ formatDate(record.date) }}
                    </span>
                    <span v-if="record.hospital" class="flex items-center gap-1">
                      <Building2 class="h-3 w-3" />
                      {{ record.hospital }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="record.notes" class="text-sm text-muted-foreground">
              {{ record.notes }}
            </div>
            
            <div v-if="record.treatment" class="mt-3 p-3 bg-muted rounded-md">
              <p class="text-sm"><span class="font-medium">Treatment:</span> {{ record.treatment }}</p>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-12 bg-card border rounded-md">
          <FileText class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 class="font-semibold mb-2">No Medical Records Yet</h3>
          <p class="text-muted-foreground text-sm mb-4">
            Your medical history will appear here once records are added.
          </p>
          <button 
            class="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover-elevate"
          >
            Add Your First Record
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
