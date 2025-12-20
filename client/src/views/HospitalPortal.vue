<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { Heart, LogOut, Search, Lock, Plus, Menu, X, Calendar, Pill } from 'lucide-vue-next'
import { useHospitalStore } from '../stores/hospitalStore'

const router = useRouter()
const hospitalStore = useHospitalStore()
const isLoading = ref(true)
const menuOpen = ref(false)
const activeTab = ref<'search' | 'addRecord'>('search')
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const selectedPatient = ref<any>(null)
const selectedForAccess = ref<any>(null)
const accessDuration = ref(30)
const addRecordForm = ref({
  patientNftId: '',
  diagnosis: '',
  treatment: '',
  notes: '',
})

const hospital = computed(() => hospitalStore.currentHospital)

onMounted(async () => {
  hospitalStore.restoreHospitalSession()
  if (!hospital.value) {
    router.push('/')
  }
  isLoading.value = false
})

async function performSearch() {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  try {
    const response = await fetch(`/api/hospital/search?query=${encodeURIComponent(searchQuery.value)}`)
    if (response.ok) {
      searchResults.value = await response.json()
    }
  } catch (error) {
    console.error('Search failed:', error)
  }
}

async function grantAccess() {
  if (!selectedForAccess.value || !hospital.value) return

  try {
    const response = await fetch('/api/hospital/grant-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientNftId: selectedForAccess.value.nftId,
        hospitalId: hospital.value.id,
        durationDays: accessDuration.value,
      }),
    })

    if (response.ok) {
      alert('Access granted successfully!')
      selectedForAccess.value = null
      accessDuration.value = 30
    }
  } catch (error) {
    console.error('Error granting access:', error)
  }
}

async function submitAddRecord() {
  if (!addRecordForm.value.patientNftId || !hospital.value) return

  try {
    const response = await fetch('/api/hospital/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...addRecordForm.value,
        hospital: hospital.value.hospitalName,
        hospitalId: hospital.value.id,
      }),
    })

    if (response.ok) {
      alert('Record added successfully!')
      addRecordForm.value = {
        patientNftId: '',
        diagnosis: '',
        treatment: '',
        notes: '',
      }
    } else {
      const error = await response.json()
      alert(error.error || 'Failed to add record')
    }
  } catch (error) {
    console.error('Error adding record:', error)
  }
}

function logout() {
  hospitalStore.clearHospital()
  router.push('/')
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
        
        <div v-if="hospital" class="hidden md:block text-sm">
          <p class="font-medium">{{ hospital.hospitalName }}</p>
        </div>
        
        <button 
          @click="logout" 
          class="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md flex items-center gap-2"
        >
          <LogOut class="h-4 w-4" />
          Logout
        </button>
        
        <button @click="menuOpen = !menuOpen" class="md:hidden p-2">
          <Menu v-if="!menuOpen" class="h-5 w-5" />
          <X v-else class="h-5 w-5" />
        </button>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8" v-if="!isLoading">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Hospital Portal</h1>
        <p class="text-muted-foreground">Manage patient records and access permissions</p>
      </div>

      <!-- Tabs -->
      <div class="border-b mb-8">
        <div class="flex gap-4">
          <button
            @click="activeTab = 'search'"
            :class="[
              'px-4 py-2 font-medium border-b-2 transition-colors',
              activeTab === 'search'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            ]"
          >
            <Search class="h-4 w-4 inline mr-2" />
            Search Patients
          </button>
          <button
            @click="activeTab = 'addRecord'"
            :class="[
              'px-4 py-2 font-medium border-b-2 transition-colors',
              activeTab === 'addRecord'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            ]"
          >
            <Plus class="h-4 w-4 inline mr-2" />
            Add Record
          </button>
        </div>
      </div>

      <!-- Search Tab -->
      <div v-if="activeTab === 'search'" class="space-y-6">
        <div class="flex gap-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or NFT ID..."
            @keyup.enter="performSearch"
            class="flex-1 px-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            @click="performSearch"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
          >
            Search
          </button>
        </div>

        <!-- Search Results -->
        <div v-if="searchResults.length" class="space-y-4">
          <h3 class="font-semibold text-lg">Results ({{ searchResults.length }})</h3>
          <div
            v-for="patient in searchResults"
            :key="patient.nftId"
            class="bg-card border rounded-lg p-6"
          >
            <div class="flex items-start justify-between gap-4 mb-4">
              <div class="flex-1">
                <h4 class="font-semibold text-lg mb-1">{{ patient.patientName }}</h4>
                <p class="text-sm text-muted-foreground mb-3">NFT ID: {{ patient.nftId }}</p>
                <div class="flex flex-wrap gap-4 text-sm">
                  <span class="flex items-center gap-1">
                    <Heart class="h-4 w-4 text-red-500" />
                    {{ patient.bloodType }}
                  </span>
                  <span class="flex items-center gap-1">
                    <Pill class="h-4 w-4" />
                    {{ patient.medications.length }} medications
                  </span>
                </div>
              </div>
              <button
                @click="selectedForAccess = patient"
                class="px-4 py-2 bg-primary/10 text-primary rounded-md font-medium hover:bg-primary/20 flex items-center gap-2"
              >
                <Lock class="h-4 w-4" />
                Grant Access
              </button>
            </div>

            <!-- Access Grant Modal -->
            <div v-if="selectedForAccess?.nftId === patient.nftId" class="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-md border">
              <h5 class="font-semibold mb-3">Grant Access Permission</h5>
              <div class="space-y-3">
                <div>
                  <label class="text-sm font-medium">Duration (days):</label>
                  <input
                    v-model.number="accessDuration"
                    type="number"
                    min="1"
                    max="365"
                    class="w-full mt-1 px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div class="flex gap-2">
                  <button
                    @click="grantAccess"
                    class="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
                  >
                    Confirm Access
                  </button>
                  <button
                    @click="selectedForAccess = null"
                    class="px-4 py-2 bg-muted text-foreground rounded-md font-medium hover:bg-muted/80"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="searchQuery && !searchResults.length" class="text-center py-12 bg-card border rounded-md">
          <Search class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p class="text-muted-foreground">No patients found</p>
        </div>
      </div>

      <!-- Add Record Tab -->
      <div v-if="activeTab === 'addRecord'" class="max-w-2xl">
        <div class="bg-card border rounded-lg p-6">
          <h3 class="font-semibold text-lg mb-4">Add Medical Record</h3>
          <form @submit.prevent="submitAddRecord" class="space-y-4">
            <div>
              <label class="text-sm font-medium">Patient NFT ID *</label>
              <input
                v-model="addRecordForm.patientNftId"
                type="text"
                placeholder="e.g., NFT-DEMO-001"
                required
                class="w-full mt-1 px-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label class="text-sm font-medium">Diagnosis *</label>
              <input
                v-model="addRecordForm.diagnosis"
                type="text"
                placeholder="e.g., Type 2 Diabetes Check"
                required
                class="w-full mt-1 px-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label class="text-sm font-medium">Treatment Plan *</label>
              <textarea
                v-model="addRecordForm.treatment"
                placeholder="Describe the treatment or recommendation..."
                required
                rows="4"
                class="w-full mt-1 px-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>

            <div>
              <label class="text-sm font-medium">Notes</label>
              <textarea
                v-model="addRecordForm.notes"
                placeholder="Additional notes (optional)..."
                rows="3"
                class="w-full mt-1 px-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>

            <button
              type="submit"
              class="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
            >
              Add Record
            </button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>
