<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, RouterLink, useRoute } from 'vue-router'
import { Heart, LogOut, User, FileText, Shield, Settings, Menu, X, Wallet, BookOpen, Lightbulb, Eye, EyeOff } from 'lucide-vue-next'
import { usePatientStore } from '../stores/patientStore'
import { useThesisStore } from '../stores/thesisStore'
import PatientProfile from '../components/patient/PatientProfile.vue'
import EmergencyToggle from '../components/patient/EmergencyToggle.vue'
import MedicalRecordsList from '../components/patient/MedicalRecordsList.vue'
import BlockchainActivityFeed from '../components/BlockchainActivityFeed.vue'
import HospitalRequestsList from '../components/HospitalRequestsList.vue'
import ThesisNotes from '../components/ThesisNotes.vue'
import SystemArchitectureDiagram from '../components/SystemArchitectureDiagram.vue'
import DataFlowDiagram from '../components/DataFlowDiagram.vue'
import ComparisonDiagram from '../components/ComparisonDiagram.vue'
import ThesisOverlay from '../components/ThesisOverlay.vue'
import BlockchainVisualizer from '../components/BlockchainVisualizer.vue'
import ThesisDemoController from '../components/ThesisDemoController.vue'
import EmergencyScenarioLauncher from '../components/EmergencyScenarioLauncher.vue'
import HospitalAccessPanel from '../components/HospitalAccessPanel.vue'

const router = useRouter()
const route = useRoute()
const patientStore = usePatientStore()
const thesisStore = useThesisStore()

const user = ref<any>(null)
const patientData = ref<any>(null)
const isLoading = ref(true)
const menuOpen = ref(false)
const activeTab = ref('profile')
const nftWalletStatus = ref<any>(null)

import { blockchain } from '@/utils/blockchainMock'

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: Wallet },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'records', label: 'Records', icon: FileText },
  { id: 'wallet', label: 'NFT Wallet', icon: Wallet },
  { id: 'emergency', label: 'Emergency', icon: Shield },
  { id: 'thesis', label: 'Thesis', icon: BookOpen },
]

const nftWallet = ref<any[]>([])

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
    loadNFTWallet()
    loadNFTWalletStatus()
  }
  isLoading.value = false
  patientStore.restoreEmergencyState()
  
  if (route.query.tab && typeof route.query.tab === 'string') {
    activeTab.value = route.query.tab
  }
})

function loadNFTWalletStatus() {
  // Load from user object if available from login response
  if (user.value?.nftWalletStatus) {
    nftWalletStatus.value = user.value.nftWalletStatus
  }
}

function loadNFTWallet() {
  const wallet = blockchain.getNFTWallet(user.value.nftId)
  nftWallet.value = wallet
}

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
            <template v-if="activeTab === 'dashboard'">Thesis demonstration dashboard with all features</template>
            <template v-else-if="activeTab === 'profile'">View and manage your health profile</template>
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

        <div v-if="activeTab === 'dashboard'">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Left Column: Patient Info -->
            <div class="lg:col-span-1 space-y-6">
              <div class="bg-card border rounded-lg p-6">
                <h3 class="font-semibold text-lg mb-4">Patient Identity</h3>
                <div class="space-y-2 text-sm">
                  <p><span class="text-muted-foreground">Name:</span> {{ user?.fullName }}</p>
                  <p><span class="text-muted-foreground">Blood Type:</span> {{ user?.bloodType || 'Unknown' }}</p>
                  <p class="font-mono text-xs break-all"><span class="text-muted-foreground">Wallet:</span> {{ user?.walletAddress }}</p>
                  <p><span class="text-muted-foreground">NFT ID:</span> {{ user?.nftId }}</p>
                </div>
              </div>

              <EmergencyToggle />

              <BlockchainVisualizer :user-id="user?.id" />
            </div>

            <!-- Middle Column: Medical Records -->
            <div class="lg:col-span-1">
              <div class="bg-card border rounded-lg p-6">
                <h3 class="font-semibold text-lg mb-4">Medical Records (5)</h3>
                <div class="space-y-3 max-h-96 overflow-y-auto">
                  <div
                    v-for="(record, idx) in (patientData?.recentRecords || []).slice(0, 5)"
                    :key="idx"
                    class="p-3 border rounded bg-muted/30 text-sm"
                  >
                    <p class="font-medium">{{ record.type }}</p>
                    <p class="text-xs text-muted-foreground">{{ record.date }}</p>
                    <p class="text-xs mt-1">{{ record.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column: Thesis Features -->
            <div class="lg:col-span-1 space-y-6">
              <ThesisDemoController />
              <EmergencyScenarioLauncher />
              <HospitalAccessPanel />
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'profile' && patientProfileData">
          <PatientProfile :patient="patientProfileData" />
        </div>

        <div v-else-if="activeTab === 'records'">
          <MedicalRecordsList 
            :records="patientData?.recentRecords || patientData?.medicalRecords || []"
            :hospital-history="patientData?.hospitalHistory || []"
          />
        </div>

        <div v-else-if="activeTab === 'wallet'">
          <div class="space-y-6">
            <!-- Wallet Summary -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-card border rounded-lg p-6">
                <p class="text-sm text-muted-foreground mb-1">Total NFTs Owned</p>
                <p class="text-3xl font-bold">{{ nftWallet.length || 1 }}</p>
              </div>
              <div class="bg-card border rounded-lg p-6">
                <p class="text-sm text-muted-foreground mb-1">Wallet Address</p>
                <p class="text-sm font-mono text-primary">{{ user?.walletAddress?.slice(0, 12) }}...{{ user?.walletAddress?.slice(-8) }}</p>
              </div>
              <div class="bg-card border rounded-lg p-6">
                <p class="text-sm text-muted-foreground mb-1">Total Portfolio Value</p>
                <p class="text-3xl font-bold text-green-600">${{ nftWallet.reduce((sum, nft) => sum + nft.value, 0) || 100 }}</p>
              </div>
            </div>

            <!-- Blockchain Activity Feed -->
            <div class="bg-card border rounded-lg p-6">
              <BlockchainActivityFeed :activities="nftWalletStatus?.recentActivity || []" />
            </div>

            <!-- Hospital Connection Requests -->
            <div class="bg-card border rounded-lg p-6">
              <HospitalRequestsList :requests="nftWalletStatus?.hospitalRequests || []" />
            </div>

            <div v-if="nftWallet.length > 0">
              <h3 class="font-semibold text-lg mb-4">Your NFT Medical Records</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="nft in nftWallet" 
                  :key="nft.nftId"
                  class="bg-card border border-purple-200 dark:border-purple-800 rounded-lg p-4 hover:border-purple-500/50 transition-colors"
                >
                  <div class="flex items-start justify-between mb-3">
                    <div>
                      <p class="text-xs text-muted-foreground font-semibold uppercase">NFT ID</p>
                      <p class="font-mono text-sm font-bold text-purple-600">{{ nft.tokenId }}</p>
                    </div>
                    <span class="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-medium">
                      ✓ Verified
                    </span>
                  </div>
                  <div class="space-y-2 text-sm">
                    <p><span class="text-muted-foreground">Record Type:</span> {{ nft.recordType }}</p>
                    <p><span class="text-muted-foreground">Hospital:</span> {{ nft.hospital }}</p>
                    <p><span class="text-muted-foreground">Minted:</span> {{ new Date(nft.mintedAt).toLocaleDateString('en-PH') }}</p>
                    <p><span class="text-muted-foreground">Gas Fee:</span> {{ nft.gasUsed }}</p>
                    <p class="text-green-600 font-medium">Value: ~${{ nft.value }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-12 bg-card border rounded-lg">
              <Shield class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 class="font-semibold mb-2">No NFT Medical Records Yet</h3>
              <p class="text-muted-foreground text-sm">
                Go to your Medical Records and mint your health data as NFTs for complete ownership and portability.
              </p>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'emergency'">
          <EmergencyToggle />
        </div>

        <div v-else-if="activeTab === 'thesis'">
          <div class="space-y-6">
            <!-- Thesis Mode Toggle -->
            <div class="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div>
                <h3 class="font-semibold text-lg flex items-center gap-2">
                  <BookOpen class="h-5 w-5" />
                  Thesis Documentation & Architecture
                </h3>
                <p class="text-sm text-muted-foreground mt-1">Learn how MediChain-PH demonstrates blockchain-based patient data ownership</p>
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="thesisStore.toggleExplanations()"
                  :class="['px-3 py-2 rounded text-sm font-medium transition-colors', thesisStore.showExplanations ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100']"
                  :title="thesisStore.showExplanations ? 'Hide explanations' : 'Show explanations'"
                >
                  <Eye v-if="thesisStore.showExplanations" class="h-4 w-4" />
                  <EyeOff v-else class="h-4 w-4" />
                </button>
                <button
                  @click="thesisStore.toggleThesisMode()"
                  :class="['px-4 py-2 rounded font-medium transition-colors', thesisStore.isThesisMode ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100']"
                >
                  {{ thesisStore.isThesisMode ? 'Mode: ON' : 'Mode: OFF' }}
                </button>
              </div>
            </div>

            <!-- Thesis Notes -->
            <div class="bg-card border rounded-lg p-6">
              <ThesisNotes />
            </div>

            <!-- System Architecture -->
            <div class="bg-card border rounded-lg p-6">
              <SystemArchitectureDiagram />
            </div>

            <!-- Data Flow Diagram -->
            <div class="bg-card border rounded-lg p-6">
              <DataFlowDiagram />
            </div>

            <!-- Comparison Diagram -->
            <div class="bg-card border rounded-lg p-6">
              <ComparisonDiagram />
            </div>

            <!-- Thesis Summary -->
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 class="font-semibold text-lg mb-3">Thesis Summary</h3>
              <div class="space-y-3 text-sm">
                <p>
                  <span class="font-semibold">Title:</span> MediChain-PH: Healthcare Records Management through NFT-based Patient Data Ownership
                </p>
                <p>
                  <span class="font-semibold">Objective:</span> Demonstrate that blockchain technology can enable patients to maintain direct ownership and control of their medical records while supporting critical emergency use cases.
                </p>
                <p>
                  <span class="font-semibold">Key Innovation:</span> Patient Profile NFTs with granular access controls, time-limited emergency access, and immutable audit trails.
                </p>
                <p>
                  <span class="font-semibold">Target Audience:</span> Healthcare IT, Medical Informatics, and Blockchain Policy researchers interested in patient data sovereignty.
                </p>
                <p class="pt-2 font-semibold text-blue-600 dark:text-blue-400">
                  All features on this platform have been designed and documented to support this thesis with practical evidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
