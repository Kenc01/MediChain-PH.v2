<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { Heart, FileText, LogOut, Calendar, Building2, ArrowLeft, Plus, Menu, X, Zap, ChevronDown, CheckCircle, Link2 } from 'lucide-vue-next'
import { blockchain } from '@/utils/blockchainMock'

const router = useRouter()
const user = ref<any>(null)
const patientData = ref<any>(null)
const isLoading = ref(true)
const menuOpen = ref(false)
const expandedNFTIndex = ref<number | null>(null)
const nftVerifications = ref<Map<string, any>>(new Map())
const nftWallet = ref<any[]>([])
const mintingRecord = ref<number | null>(null)
const showMintModal = ref(false)

onMounted(async () => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
    await fetchPatientData()
    loadNFTWallet()
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

function loadNFTWallet() {
  const wallet = blockchain.getNFTWallet(user.value.nftId)
  nftWallet.value = wallet
}

function mintAsNFT(index: number, record: any) {
  mintingRecord.value = index
  showMintModal.value = true
}

function confirmMint(hospital: string = 'Philippine General Hospital') {
  if (mintingRecord.value !== null) {
    const record = patientData.value.medicalRecords[mintingRecord.value]
    const nftMetadata = blockchain.mintNFT(user.value.nftId, record, hospital)
    nftWallet.value.push(nftMetadata)
    showMintModal.value = false
    mintingRecord.value = null
  }
}

function viewOnBlockchain(nftId: string) {
  const url = `https://etherscan.io/address/${nftId}`
  window.open(url, '_blank')
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
                  <div class="flex items-center gap-2 flex-wrap mb-1">
                    <h3 class="font-semibold">{{ record.diagnosis || record.type || 'Medical Record' }}</h3>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span v-if="nftWallet.some((nft: any) => nft.recordType === record.diagnosis)" class="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-medium">
                      <CheckCircle class="h-3 w-3" />
                      NFT Minted
                    </span>
                    <button
                      v-else
                      @click="mintAsNFT(index, record)"
                      class="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/10 text-purple-600 rounded-full text-xs font-medium hover:bg-purple-500/20 transition-colors"
                    >
                      <Zap class="h-3 w-3" />
                      Mint as NFT
                    </button>
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

            <!-- NFT Details -->
            <div v-if="expandedNFTIndex === index" class="mt-4 pt-4 border-t">
              <div v-for="nft in nftWallet.filter((nft: any) => nft.recordType === record.diagnosis)" :key="nft.nftId" class="bg-purple-50 dark:bg-purple-950 rounded-md p-4 space-y-3">
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <p class="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">NFT Metadata</p>
                    <div class="mt-2 space-y-2 text-sm">
                      <div class="flex items-center justify-between">
                        <span class="text-muted-foreground">Token ID:</span>
                        <code class="text-xs bg-background px-2 py-1 rounded font-mono font-bold text-purple-600">{{ nft.tokenId }}</code>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-muted-foreground">Hospital:</span>
                        <span class="font-medium">{{ nft.hospital }}</span>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-muted-foreground">Minted:</span>
                        <span class="font-medium">{{ formatDate(new Date(nft.mintedAt).toISOString()) }}</span>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-muted-foreground">Gas Used:</span>
                        <code class="text-xs bg-background px-2 py-1 rounded font-mono">{{ nft.gasUsed }}</code>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-muted-foreground">Est. Value:</span>
                        <span class="font-medium text-green-600">${{ nft.value }}</span>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-muted-foreground">Status:</span>
                        <span class="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-medium">
                          <CheckCircle class="h-3 w-3" />
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  @click="viewOnBlockchain(nft.blockHash)"
                  class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-colors"
                >
                  <Link2 class="h-4 w-4" />
                  View on Blockchain
                </button>
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

    <!-- NFT Minting Modal -->
    <div v-if="showMintModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-slate-900 rounded-lg max-w-md w-full p-6 space-y-4">
        <div class="flex items-start justify-between">
          <h3 class="font-bold text-lg">Mint Medical Record as NFT</h3>
          <button @click="showMintModal = false" class="p-1 hover:bg-muted rounded">
            <X class="h-5 w-5" />
          </button>
        </div>

        <div class="bg-blue-50 dark:bg-blue-950 rounded-md p-4 space-y-2">
          <p class="text-sm text-muted-foreground">
            <strong>Record:</strong> {{ patientData?.medicalRecords[mintingRecord]?.diagnosis }}
          </p>
          <p class="text-sm text-muted-foreground">
            <strong>Hospital:</strong> Philippine General Hospital
          </p>
          <p class="text-sm text-muted-foreground">
            <strong>Gas Fee:</strong> ~0.0034 ETH ($5-10)
          </p>
        </div>

        <p class="text-sm text-muted-foreground">
          This will create a blockchain-verified NFT of your medical record, giving you complete ownership and portability of your health data.
        </p>

        <div class="flex gap-2 pt-2">
          <button
            @click="showMintModal = false"
            class="flex-1 px-4 py-2 border rounded-md font-medium hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmMint()"
            class="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Zap class="h-4 w-4" />
            Mint NFT
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
