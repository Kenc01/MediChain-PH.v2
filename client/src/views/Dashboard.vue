<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, RouterLink, useRoute } from 'vue-router'
import { Heart, LogOut, User, FileText, Shield, Settings, Menu, X } from 'lucide-vue-next'
import { usePatientStore } from '../stores/patientStore'
import PatientProfile from '../components/patient/PatientProfile.vue'
import EmergencyToggle from '../components/patient/EmergencyToggle.vue'
import MedicalRecordsList from '../components/patient/MedicalRecordsList.vue'

const router = useRouter()
const route = useRoute()
const patientStore = usePatientStore()

const user = ref<any>(null)
const patientData = ref<any>(null)
const isLoading = ref(true)
const menuOpen = ref(false)
const activeTab = ref('profile')

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'records', label: 'Records', icon: FileText },
  { id: 'emergency', label: 'Emergency', icon: Shield },
]

const mockPatientData = {
  id: "patient-001",
  nftId: "PHM-NFT-2024-001-ABCD1234",
  firstName: "Juan",
  lastName: "Dela Cruz",
  email: "juan.delacruz@email.com",
  phone: "+63 917 123 4567",
  dateOfBirth: "1985-03-15",
  address: "123 Rizal Avenue, Barangay 123, Manila, Metro Manila 1000",
  bloodType: "O+",
  allergies: ["Penicillin", "Seafood"],
  currentMedications: ["Losartan 50mg daily", "Metformin 500mg twice daily"],
  emergencyContacts: [
    { name: "Maria Dela Cruz", relationship: "Wife", phone: "+63 918 234 5678" },
    { name: "Pedro Dela Cruz", relationship: "Son", phone: "+63 919 345 6789" }
  ],
  recentRecords: [
    { date: "2024-11-15", type: "Consultation", description: "Follow-up for Hypertension and Diabetes", provider: "Dr. Santos - Philippine General Hospital" },
    { date: "2024-10-20", type: "Laboratory", description: "HbA1c: 7.2%, FBS: 126 mg/dL", provider: "PGH Laboratory" },
    { date: "2024-09-05", type: "Prescription", description: "Metformin 500mg, Losartan 50mg refill", provider: "Dr. Santos" },
    { date: "2024-08-10", type: "Vaccination", description: "Influenza Vaccine 2024-2025", provider: "Manila Health Center" },
    { date: "2024-07-01", type: "Procedure", description: "ECG - Normal sinus rhythm", provider: "Makati Medical Center" }
  ],
  hospitalHistory: [
    { hospital: "Philippine General Hospital", date: "2024-06-10", reason: "Chest pain evaluation", treatment: "Cardiac workup - negative for acute coronary syndrome" },
    { hospital: "Makati Medical Center", date: "2023-12-15", reason: "Dengue fever", treatment: "IV fluids, monitoring, discharged after 5 days" }
  ]
}

onMounted(async () => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
    await fetchPatientData()
  }
  isLoading.value = false
  patientStore.restoreEmergencyState()
  
  if (route.query.tab && typeof route.query.tab === 'string') {
    activeTab.value = route.query.tab
  }
})

watch(activeTab, (newTab) => {
  router.replace({ query: { ...route.query, tab: newTab } })
})

async function fetchPatientData() {
  try {
    const response = await fetch(`/api/patient/${user.value.nftId}`)
    if (response.ok) {
      const data = await response.json()
      patientData.value = data
      patientStore.setPatient({
        id: data.id || user.value.id,
        nftId: data.nftId || user.value.nftId,
        fullName: data.fullName || user.value.fullName,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : new Date(),
        address: data.address || '',
        bloodType: data.bloodType || '',
        allergies: data.allergies || [],
        currentMedications: data.currentMedications || data.medications || [],
        emergencyContacts: data.emergencyContacts || [],
        recentRecords: data.recentRecords || data.medicalRecords || [],
        hospitalHistory: data.hospitalHistory || [],
      })
    } else {
      loadMockData()
    }
  } catch (e) {
    console.error('Failed to fetch patient data, using mock data')
    loadMockData()
  }
}

function loadMockData() {
  patientData.value = {
    nftId: user.value?.nftId || mockPatientData.nftId,
    fullName: user.value?.fullName || `${mockPatientData.firstName} ${mockPatientData.lastName}`,
    bloodType: mockPatientData.bloodType,
    allergies: mockPatientData.allergies,
    currentMedications: mockPatientData.currentMedications,
    emergencyContacts: mockPatientData.emergencyContacts,
    recentRecords: mockPatientData.recentRecords,
    hospitalHistory: mockPatientData.hospitalHistory,
    dateOfBirth: mockPatientData.dateOfBirth,
    phone: mockPatientData.phone,
    email: mockPatientData.email,
    address: mockPatientData.address,
  }
  patientStore.setPatient({
    id: mockPatientData.id,
    nftId: user.value?.nftId || mockPatientData.nftId,
    fullName: user.value?.fullName || `${mockPatientData.firstName} ${mockPatientData.lastName}`,
    firstName: mockPatientData.firstName,
    lastName: mockPatientData.lastName,
    email: mockPatientData.email,
    phone: mockPatientData.phone,
    dateOfBirth: new Date(mockPatientData.dateOfBirth),
    address: mockPatientData.address,
    bloodType: mockPatientData.bloodType,
    allergies: mockPatientData.allergies,
    currentMedications: mockPatientData.currentMedications,
    emergencyContacts: mockPatientData.emergencyContacts,
    recentRecords: mockPatientData.recentRecords,
    hospitalHistory: mockPatientData.hospitalHistory,
  })
}

function logout() {
  localStorage.removeItem('user')
  patientStore.clearPatient()
  router.push('/')
}

const patientProfileData = computed(() => {
  if (!patientData.value) return null
  return {
    nftId: patientData.value.nftId || user.value?.nftId || 'N/A',
    fullName: patientData.value.fullName || user.value?.fullName || 'Patient',
    bloodType: patientData.value.bloodType || 'Unknown',
    allergies: patientData.value.allergies || [],
    currentMedications: patientData.value.currentMedications || patientData.value.medications || [],
    emergencyContacts: patientData.value.emergencyContacts || [],
    dateOfBirth: patientData.value.dateOfBirth,
    phone: patientData.value.phone,
    email: patientData.value.email,
    address: patientData.value.address,
  }
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <header class="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
      <div class="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <RouterLink to="/" class="flex items-center gap-2">
          <Heart class="h-6 w-6 text-primary" />
          <span class="font-bold text-lg">MediChain-PH</span>
        </RouterLink>
        
        <nav class="hidden md:flex items-center gap-2">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            class="px-3 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors"
            :class="activeTab === tab.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'"
            :data-testid="`tab-${tab.id}`"
          >
            <component :is="tab.icon" class="h-4 w-4" />
            {{ tab.label }}
          </button>
          <div class="w-px h-6 bg-border mx-2"></div>
          <button 
            @click="logout" 
            class="px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-md flex items-center gap-2"
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
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id; menuOpen = false"
          class="w-full text-left px-3 py-2 text-sm font-medium rounded-md flex items-center gap-2"
          :class="activeTab === tab.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'"
        >
          <component :is="tab.icon" class="h-4 w-4" />
          {{ tab.label }}
        </button>
        <button 
          @click="logout" 
          class="w-full text-left px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-md flex items-center gap-2"
        >
          <LogOut class="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>

    <div 
      v-if="patientStore.isEmergencyMode" 
      class="bg-red-500 text-white py-2 px-4 text-center text-sm font-medium"
    >
      Emergency Mode Active - Your health data is accessible via QR code
    </div>

    <main class="container mx-auto px-4 py-8">
      <div v-if="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p class="mt-4 text-muted-foreground">Loading your health data...</p>
      </div>
      
      <div v-else>
        <div class="mb-6">
          <h1 class="text-2xl font-bold mb-1" data-testid="text-welcome">
            Welcome, {{ user?.fullName || 'Patient' }}
          </h1>
          <p class="text-muted-foreground">
            <template v-if="activeTab === 'profile'">View and manage your health profile</template>
            <template v-else-if="activeTab === 'records'">Your complete medical history</template>
            <template v-else-if="activeTab === 'emergency'">Configure emergency access settings</template>
          </p>
        </div>

        <div class="md:hidden flex gap-1 mb-6 overflow-x-auto pb-2">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            class="flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full flex items-center gap-2"
            :class="activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'bg-muted'"
          >
            <component :is="tab.icon" class="h-4 w-4" />
            {{ tab.label }}
          </button>
        </div>

        <div v-if="activeTab === 'profile' && patientProfileData">
          <PatientProfile :patient="patientProfileData" />
        </div>

        <div v-else-if="activeTab === 'records'">
          <MedicalRecordsList 
            :records="patientData?.recentRecords || patientData?.medicalRecords || []"
            :hospital-history="patientData?.hospitalHistory || []"
          />
        </div>

        <div v-else-if="activeTab === 'emergency'">
          <EmergencyToggle />
        </div>
      </div>
    </main>
  </div>
</template>
