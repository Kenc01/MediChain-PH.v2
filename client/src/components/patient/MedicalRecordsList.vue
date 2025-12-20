<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  FileText, Calendar, Building2, ChevronDown, ChevronUp, 
  Stethoscope, Pill, TestTube, Syringe, Activity, Search,
  Filter, CheckCircle, Clock, Sparkles, Lock, AlertCircle, Zap
} from 'lucide-vue-next'
import type { MedicalRecord, HospitalVisit } from '../../../../shared/schema'
import { blockchain } from '@/utils/blockchainMock'

const props = defineProps<{
  records: MedicalRecord[]
  hospitalHistory?: HospitalVisit[]
}>()

const searchQuery = ref('')
const selectedType = ref<string>('all')
const expandedRecords = ref<Set<number>>(new Set())
const recordNFTs = ref<Map<string, any>>(new Map())
const mintingStatus = ref<Map<string, 'idle' | 'minting' | 'minted' | 'error'>>(new Map())
const patientId = ref('patient-001')

const recordTypes = [
  { value: 'all', label: 'All Records' },
  { value: 'Consultation', label: 'Consultations', icon: Stethoscope },
  { value: 'Laboratory', label: 'Lab Results', icon: TestTube },
  { value: 'Prescription', label: 'Prescriptions', icon: Pill },
  { value: 'Vaccination', label: 'Vaccinations', icon: Syringe },
  { value: 'Procedure', label: 'Procedures', icon: Activity },
]

const getDescription = (record: MedicalRecord) => {
  return record.description || (record as any).diagnosis || (record as any).notes || 'No description'
}

const getProvider = (record: MedicalRecord) => {
  return record.provider || (record as any).hospital || 'Unknown provider'
}

const filteredRecords = computed(() => {
  let result = [...props.records]
  
  if (selectedType.value !== 'all') {
    result = result.filter(r => (r.type || 'Other') === selectedType.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(r => {
      const desc = getDescription(r).toLowerCase()
      const prov = getProvider(r).toLowerCase()
      const type = (r.type || '').toLowerCase()
      return desc.includes(query) || prov.includes(query) || type.includes(query)
    })
  }
  
  return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

function getRecordIcon(type: string) {
  const iconMap: Record<string, any> = {
    'Consultation': Stethoscope,
    'Laboratory': TestTube,
    'Prescription': Pill,
    'Vaccination': Syringe,
    'Procedure': Activity,
  }
  return iconMap[type] || FileText
}

function getRecordColor(type: string) {
  const colorMap: Record<string, string> = {
    'Consultation': 'bg-blue-500/10 text-blue-500',
    'Laboratory': 'bg-purple-500/10 text-purple-500',
    'Prescription': 'bg-green-500/10 text-green-500',
    'Vaccination': 'bg-teal-500/10 text-teal-500',
    'Procedure': 'bg-orange-500/10 text-orange-500',
  }
  return colorMap[type] || 'bg-primary/10 text-primary'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-PH', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

function toggleExpand(index: number) {
  if (expandedRecords.value.has(index)) {
    expandedRecords.value.delete(index)
  } else {
    expandedRecords.value.add(index)
  }
}

async function mintAsNFT(record: MedicalRecord, index: number) {
  const recordKey = `${index}-${record.date}`
  
  try {
    mintingStatus.value.set(recordKey, 'minting')
    
    // Mint NFT using blockchain simulator
    const nftData = blockchain.mintNFT(
      patientId.value,
      {
        type: record.type,
        description: getDescription(record),
        date: record.date,
        provider: getProvider(record)
      },
      getProvider(record)
    )
    
    // Store NFT data
    recordNFTs.value.set(recordKey, nftData)
    mintingStatus.value.set(recordKey, 'minted')
    
  } catch (error) {
    console.error('Error minting NFT:', error)
    mintingStatus.value.set(recordKey, 'error')
  }
}

function getNFTStatus(record: MedicalRecord, index: number) {
  const recordKey = `${index}-${record.date}`
  return mintingStatus.value.get(recordKey) || 'idle'
}

function getNFTData(record: MedicalRecord, index: number) {
  const recordKey = `${index}-${record.date}`
  return recordNFTs.value.get(recordKey)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Search records..."
          class="w-full pl-9 pr-4 py-2 border rounded-lg bg-background"
          data-testid="search-records"
        />
      </div>
      
      <div class="relative">
        <Filter class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <select 
          v-model="selectedType"
          class="pl-9 pr-8 py-2 border rounded-lg bg-background appearance-none cursor-pointer min-w-[160px]"
          data-testid="filter-type"
        >
          <option v-for="type in recordTypes" :key="type.value" :value="type.value">
            {{ type.label }}
          </option>
        </select>
      </div>
    </div>

    <div class="text-sm text-muted-foreground">
      Showing {{ filteredRecords.length }} of {{ records.length }} records
    </div>

    <div v-if="filteredRecords.length" class="space-y-3" data-testid="records-list">
      <div 
        v-for="(record, index) in filteredRecords" 
        :key="index"
        class="bg-card border rounded-lg overflow-hidden transition-shadow hover:shadow-md"
      >
        <div 
          class="p-4 cursor-pointer"
          @click="toggleExpand(index)"
        >
          <div class="flex items-start gap-4">
            <div 
              class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              :class="getRecordColor(record.type)"
            >
              <component :is="getRecordIcon(record.type)" class="h-5 w-5" />
            </div>
            
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                  <h4 class="font-medium truncate">{{ getDescription(record) }}</h4>
                  <div class="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span class="flex items-center gap-1">
                      <Calendar class="h-3 w-3" />
                      {{ formatDate(record.date) }}
                    </span>
                    <span class="flex items-center gap-1">
                      <Building2 class="h-3 w-3" />
                      {{ getProvider(record) }}
                    </span>
                  </div>
                </div>
                
                <div class="flex items-center gap-2 flex-wrap justify-end">
                  <span 
                    class="px-2 py-0.5 text-xs font-medium rounded-full"
                    :class="getRecordColor(record.type)"
                  >
                    {{ record.type }}
                  </span>
                  
                  <!-- NFT Status Badge -->
                  <div v-if="getNFTStatus(record, index) === 'minted'" class="flex items-center gap-1 px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-xs font-medium">
                    <CheckCircle class="h-3 w-3" />
                    <span>NFT: {{ getNFTData(record, index).nftId.substring(0, 8) }}...</span>
                  </div>
                  
                  <div v-else-if="getNFTStatus(record, index) === 'minting'" class="flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium">
                    <Zap class="h-3 w-3 animate-spin" />
                    <span>Minting...</span>
                  </div>
                  
                  <div v-else-if="getNFTStatus(record, index) === 'error'" class="flex items-center gap-1 px-2 py-0.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-xs font-medium">
                    <AlertCircle class="h-3 w-3" />
                    <span>Failed</span>
                  </div>
                  
                  <component 
                    :is="expandedRecords.has(index) ? ChevronUp : ChevronDown" 
                    class="h-4 w-4 text-muted-foreground"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div 
          v-if="expandedRecords.has(index)"
          class="px-4 pb-4 pt-0 border-t bg-muted/30"
        >
          <div class="pt-4 space-y-4">
            <!-- NFT Section -->
            <div v-if="getNFTStatus(record, index) === 'minted'" class="p-3 bg-green-500/10 border border-green-200 dark:border-green-800 rounded-lg">
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center gap-2">
                  <CheckCircle class="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span class="text-sm font-semibold text-green-600 dark:text-green-400">NFT Minted on Blockchain</span>
                </div>
                <Lock class="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div class="space-y-1 text-xs text-green-700 dark:text-green-300">
                <p><span class="font-medium">NFT ID:</span> {{ getNFTData(record, index).nftId }}</p>
                <p><span class="font-medium">Token ID:</span> {{ getNFTData(record, index).tokenId }}</p>
                <p><span class="font-medium">Block Hash:</span> {{ getNFTData(record, index).blockHash.substring(0, 16) }}...</p>
                <p><span class="font-medium">Gas Used:</span> {{ getNFTData(record, index).gasUsed }}</p>
              </div>
            </div>
            
            <div v-else-if="getNFTStatus(record, index) === 'idle'" class="flex gap-2 mb-2">
              <button
                @click="mintAsNFT(record, index)"
                class="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Sparkles class="h-4 w-4" />
                Mint as NFT
              </button>
              <p class="text-xs text-muted-foreground py-2">Create an immutable blockchain record of this medical data</p>
            </div>
            
            <!-- Record Details -->
            <div class="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-muted-foreground mb-1">Record Type</p>
                <p class="font-medium">{{ record.type }}</p>
              </div>
              <div>
                <p class="text-muted-foreground mb-1">Date</p>
                <p class="font-medium">{{ formatDate(record.date) }}</p>
              </div>
              <div class="sm:col-span-2">
                <p class="text-muted-foreground mb-1">Provider</p>
                <p class="font-medium">{{ getProvider(record) }}</p>
              </div>
              <div class="sm:col-span-2">
                <p class="text-muted-foreground mb-1">Description</p>
                <p>{{ getDescription(record) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12 bg-card border rounded-lg">
      <FileText class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 class="font-semibold mb-2">No Records Found</h3>
      <p class="text-muted-foreground text-sm">
        {{ searchQuery || selectedType !== 'all' ? 'Try adjusting your filters' : 'Your medical records will appear here' }}
      </p>
    </div>

    <div v-if="hospitalHistory?.length" class="mt-8">
      <h3 class="font-semibold mb-4 flex items-center gap-2">
        <Building2 class="h-5 w-5 text-primary" />
        Hospital Visit History
      </h3>
      <div class="space-y-3" data-testid="hospital-history">
        <div 
          v-for="(visit, index) in hospitalHistory" 
          :key="index"
          class="bg-card border rounded-lg p-4"
        >
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Building2 class="h-5 w-5 text-primary" />
            </div>
            <div class="flex-1">
              <h4 class="font-medium">{{ visit.hospital }}</h4>
              <p class="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Calendar class="h-3 w-3" />
                {{ formatDate(visit.date) }}
              </p>
              <div class="mt-2 p-3 bg-muted/50 rounded-md">
                <p class="text-sm"><span class="font-medium">Reason:</span> {{ visit.reason }}</p>
                <p class="text-sm mt-1"><span class="font-medium">Treatment:</span> {{ visit.treatment }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
