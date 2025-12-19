<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { Heart, FileText, LogOut, Calendar, Building2, ArrowLeft, Plus, Menu, X, Zap, ChevronDown } from 'lucide-vue-next'
import { blockchain } from '@/utils/blockchainMock'

const router = useRouter()
const user = ref<any>(null)
const patientData = ref<any>(null)
const isLoading = ref(true)
const menuOpen = ref(false)
const expandedNFTIndex = ref<number | null>(null)
const nftVerifications = ref<Map<string, any>>(new Map())

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
      // Verify all NFTs in the patient records
      if (patientData.value?.medicalRecords) {
        patientData.value.medicalRecords.forEach((record: any, index: number) => {
          const nftId = `NFT-${index + 1}-${user.value.nftId}`
          const verification = blockchain.verifyNFT(nftId)
          const newMap = new Map(nftVerifications.value)
          newMap.set(index, verification)
          nftVerifications.value = newMap
        })
      }
    }
  } catch (e) {
    console.error('Failed to fetch patient data')
  }
}

function toggleNFTDetails(index: number) {
  expandedNFTIndex.value = expandedNFTIndex.value === index ? null : index
}

function getTransactionHistory(index: number) {
  const nftId = `NFT-${index + 1}-${user.value.nftId}`
  return blockchain.getTransactionHistory(nftId)
}

function formatTimestamp(ms: number) {
  return new Date(ms).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function shortenHash(hash: string) {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`
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
            class="bg-card border rounded-md p-6 transition-all hover:border-primary/50"
          >
            <div class="flex items-start justify-between gap-4 mb-4">
              <div class="flex items-center gap-3 flex-1">
                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText class="h-5 w-5 text-primary" />
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h3 class="font-semibold">{{ record.diagnosis || record.type || 'Medical Record' }}</h3>
                    <span class="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-600 rounded-full text-xs font-medium">
                      <Zap class="h-3 w-3" />
                      NFT-{{index + 1}}
                    </span>
                  </div>
                  <div class="flex items-center gap-4 text-sm text-muted-foreground mt-1">
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
              <button 
                @click="toggleNFTDetails(index)"
                class="p-2 hover:bg-muted rounded-md transition-colors"
              >
                <ChevronDown 
                  class="h-5 w-5 transition-transform"
                  :class="{ 'rotate-180': expandedNFTIndex === index }"
                />
              </button>
            </div>
            
            <div v-if="record.notes" class="text-sm text-muted-foreground mb-3">
              {{ record.notes }}
            </div>
            
            <div v-if="record.treatment" class="mt-3 p-3 bg-muted rounded-md mb-3">
              <p class="text-sm"><span class="font-medium">Treatment:</span> {{ record.treatment }}</p>
            </div>

            <!-- NFT Verification Details -->
            <div v-if="expandedNFTIndex === index" class="mt-4 pt-4 border-t">
              <div class="bg-blue-50 dark:bg-blue-950 rounded-md p-4 space-y-3">
                <div>
                  <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Blockchain Verification</p>
                  <div class="mt-2 space-y-2 text-sm">
                    <div class="flex items-start justify-between">
                      <span class="text-muted-foreground">Status:</span>
                      <span class="font-medium text-green-600">✓ Verified</span>
                    </div>
                    <div class="flex items-start justify-between">
                      <span class="text-muted-foreground">Block Hash:</span>
                      <code class="text-xs bg-background px-2 py-1 rounded font-mono">
                        {{ shortenHash(nftVerifications.get(index)?.blockHash || '0x0') }}
                      </code>
                    </div>
                    <div class="flex items-start justify-between">
                      <span class="text-muted-foreground">NFT ID:</span>
                      <code class="text-xs bg-background px-2 py-1 rounded font-mono">
                        NFT-{{ index + 1 }}-{{ user?.nftId || 'unknown' }}
                      </code>
                    </div>
                    <div class="flex items-start justify-between">
                      <span class="text-muted-foreground">Transactions:</span>
                      <span class="font-medium">{{ nftVerifications.get(index)?.transactionCount || 0 }}</span>
                    </div>
                  </div>
                </div>

                <!-- Transaction History -->
                <div class="border-t pt-3">
                  <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Transaction History</p>
                  <div class="space-y-2 max-h-48 overflow-y-auto">
                    <div 
                      v-for="(tx, txIndex) in getTransactionHistory(index)" 
                      :key="txIndex"
                      class="flex items-start gap-2 text-xs"
                    >
                      <span class="text-blue-500 font-bold mt-0.5">→</span>
                      <div class="flex-1">
                        <p class="font-medium capitalize">{{ tx.action }}</p>
                        <p class="text-muted-foreground text-xs">{{ tx.details }}</p>
                        <p class="text-muted-foreground text-xs mt-1">{{ formatTimestamp(tx.timestamp) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
