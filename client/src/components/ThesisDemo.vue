<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronRight, Play, Pause, X, Book, Zap, Lock, GitBranch } from 'lucide-vue-next'

const isDemoMode = ref(false)
const currentScenario = ref<'overview' | 'emergency' | 'hospital' | 'nft' | 'blockchain' | null>(null)
const isAutoAdvance = ref(false)
const autoAdvanceInterval = ref<NodeJS.Timeout | null>(null)
const commentaryIndex = ref(0)
const highlightedFeature = ref<string | null>(null)
const stepCounter = ref(0)
const maxSteps = ref(5)

const scenarios = {
  emergency: {
    title: 'Emergency Scenario',
    description: 'First responder accessing critical patient data via QR code',
    steps: [
      'Patient generates emergency QR code from dashboard',
      'First responder scans QR code at accident scene',
      'System verifies emergency access protocol',
      'Critical patient info displayed: blood type, allergies, medications',
      'Access logged to blockchain for audit trail',
    ],
    commentary: [
      'This demonstrates how blockchain enables transparent emergency access without compromising patient privacy.',
      'The QR-based system allows instant access in life-threatening situations.',
      'All access is recorded, giving patients full audit visibility.',
    ],
    color: 'bg-red-50 dark:bg-red-950',
    icon: 'emergency',
  },
  hospital: {
    title: 'Hospital Integration',
    description: 'Hospital staff adding records with patient-granted permissions',
    steps: [
      'Hospital logs into portal with institutional credentials',
      'Searches for patient by name or NFT ID',
      'Patient has previously granted 30-day access',
      'Hospital adds new medical record to patient NFT',
      'Patient receives notification of record addition',
    ],
    commentary: [
      'Unlike traditional systems, patients maintain control over hospital access.',
      'Time-limited permissions expire automatically - no manual revocation needed.',
      'Each access and modification is recorded on the blockchain.',
    ],
    color: 'bg-blue-50 dark:bg-blue-950',
    icon: 'hospital',
  },
  nft: {
    title: 'NFT Minting Process',
    description: 'How medical records become NFT-based assets',
    steps: [
      'Patient registers and receives unique NFT ID (e.g., NFT-DEMO-001)',
      'Medical records are cryptographically hashed',
      'Block created with patient data and hash',
      'NFT becomes immutable proof of ownership',
      'Patient can transfer NFT between institutions',
    ],
    commentary: [
      'NFTs provide proof of ownership - not actual blockchain (simulation mode).',
      'The patient always owns the NFT, making portability intrinsic.',
      'Traditional systems lock data in silos; NFTs enable true data ownership.',
    ],
    color: 'bg-purple-50 dark:bg-purple-950',
    icon: 'nft',
  },
  blockchain: {
    title: 'Blockchain Verification',
    description: 'How records are verified through the blockchain',
    steps: [
      'Each medical record receives a unique block hash',
      'Hash combines patient data, timestamp, and previous hash',
      'Immutable chain prevents tampering or forgery',
      'Hospital workers can verify record authenticity instantly',
      'Complete audit trail available to patient',
    ],
    commentary: [
      'This is why blockchain works for healthcare - immutability equals trust.',
      'In production, this would use a real blockchain like Ethereum.',
      'Patients gain transparency that traditional EHRs cannot provide.',
    ],
    color: 'bg-green-50 dark:bg-green-950',
    icon: 'blockchain',
  },
}

const currentScenarioData = computed(() => {
  if (!currentScenario.value || currentScenario.value === 'overview') return null
  return scenarios[currentScenario.value as keyof typeof scenarios]
})

const currentCommentary = computed(() => {
  if (!currentScenarioData.value) return ''
  return currentScenarioData.value.commentary[commentaryIndex.value] || ''
})

function startScenario(scenario: keyof typeof scenarios) {
  currentScenario.value = scenario
  commentaryIndex.value = 0
  stepCounter.value = 0
  maxSteps.value = scenarios[scenario].steps.length
  highlightedFeature.value = null
}

function nextStep() {
  if (currentScenarioData.value && stepCounter.value < maxSteps.value - 1) {
    stepCounter.value++
  } else if (stepCounter.value < currentScenarioData.value?.commentary.length - 1) {
    commentaryIndex.value++
    stepCounter.value++
  } else {
    endScenario()
  }
}

function endScenario() {
  currentScenario.value = null
  commentaryIndex.value = 0
  stepCounter.value = 0
  isAutoAdvance.value = false
  stopAutoAdvance()
}

function toggleAutoAdvance() {
  isAutoAdvance.value = !isAutoAdvance.value
  if (isAutoAdvance.value) {
    autoAdvanceInterval.value = setInterval(() => {
      nextStep()
    }, 4000)
  } else {
    stopAutoAdvance()
  }
}

function stopAutoAdvance() {
  if (autoAdvanceInterval.value) {
    clearInterval(autoAdvanceInterval.value)
    autoAdvanceInterval.value = null
  }
}

function toggleDemoMode() {
  isDemoMode.value = !isDemoMode.value
  if (!isDemoMode.value) {
    endScenario()
  }
}

function highlightFeature(feature: string) {
  highlightedFeature.value = highlightedFeature.value === feature ? null : feature
}

onUnmounted(() => {
  stopAutoAdvance()
})
</script>

<template>
  <div v-if="isDemoMode" class="fixed right-4 z-50 max-w-sm bottom-4 max-h-[calc(100vh-120px)]">
    <!-- Demo Mode Toggle Banner -->
    <div class="bg-slate-800 dark:bg-slate-900 border border-purple-500/50 text-white rounded-lg shadow-2xl p-4 mb-3 max-h-[calc(100vh-200px)] overflow-y-auto">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <Book class="h-5 w-5" />
          <span class="font-semibold">Thesis Demo Mode</span>
        </div>
        <button @click="toggleDemoMode" class="p-1 hover:bg-white/20 rounded">
          <X class="h-4 w-4" />
        </button>
      </div>
      <p class="text-sm text-white/90 mb-3">Guided demonstration of MediChain-PH thesis project</p>

      <!-- Scenario Buttons -->
      <div v-if="!currentScenario" class="space-y-2">
        <button
          @click="startScenario('emergency')"
          class="w-full px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-medium text-white flex items-center gap-2 transition-colors"
        >
          <Zap class="h-4 w-4" />
          Emergency Scenario
        </button>
        <button
          @click="startScenario('hospital')"
          class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium text-white flex items-center gap-2 transition-colors"
        >
          <Lock class="h-4 w-4" />
          Hospital Integration
        </button>
        <button
          @click="startScenario('nft')"
          class="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm font-medium text-white flex items-center gap-2 transition-colors"
        >
          <GitBranch class="h-4 w-4" />
          NFT Minting
        </button>
        <button
          @click="startScenario('blockchain')"
          class="w-full px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm font-medium text-white flex items-center gap-2 transition-colors"
        >
          <Zap class="h-4 w-4" />
          Blockchain Verification
        </button>
      </div>

      <!-- Scenario Content -->
      <div class="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-4 space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
        <div class="flex items-start justify-between">
          <div>
            <h3 class="font-bold text-lg">{{ currentScenarioData?.title }}</h3>
            <p class="text-sm opacity-75">{{ currentScenarioData?.description }}</p>
          </div>
          <button @click="endScenario" class="p-1 hover:bg-black/10 rounded">
            <X class="h-4 w-4" />
          </button>
        </div>

        <!-- Steps -->
        <div class="space-y-2">
          <div class="text-xs font-semibold text-slate-600 dark:text-slate-400">WORKFLOW STEP {{ stepCounter + 1 }}/{{ maxSteps }}</div>
          <div class="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded p-3 min-h-16 flex items-center">
            <p class="text-sm font-medium text-slate-900 dark:text-slate-100">{{ currentScenarioData?.steps[stepCounter] }}</p>
          </div>
        </div>

        <!-- Academic Commentary -->
        <div v-if="currentCommentary" class="bg-slate-50 dark:bg-slate-700 border-l-4 border-purple-500 rounded p-3">
          <p class="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">💡 ACADEMIC INSIGHT</p>
          <p class="text-sm text-slate-700 dark:text-slate-200">{{ currentCommentary }}</p>
        </div>

        <!-- Controls -->
        <div class="flex gap-2">
          <button
            @click="nextStep"
            class="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <ChevronRight class="h-4 w-4" />
            Next
          </button>
          <button
            @click="toggleAutoAdvance"
            :class="[
              isAutoAdvance ? 'bg-purple-700' : 'bg-purple-600 hover:bg-purple-700',
              'px-3 py-2 text-white rounded text-sm font-medium flex items-center gap-2 transition-colors',
            ]"
          >
            <component :is="isAutoAdvance ? Pause : Play" class="h-4 w-4" />
          </button>
        </div>

        <!-- Progress -->
        <div v-if="currentScenarioData" class="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
          <div
            :style="{ width: `${((stepCounter + 1) / (maxSteps + currentScenarioData.commentary.length)) * 100}%` }"
            class="h-full bg-purple-600 rounded-full transition-all duration-300"
          ></div>
        </div>
      </div>
    </div>

    <!-- Architecture Insights Cards -->
    <div v-if="isDemoMode && !currentScenario" class="space-y-2 max-h-96 overflow-y-auto">
      <div class="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-3 space-y-2">
        <h4 class="font-semibold text-sm text-slate-900 dark:text-slate-100">🏗️ System Architecture</h4>
        <div class="text-xs space-y-1 text-slate-700 dark:text-slate-300">
          <p><strong>Frontend:</strong> Vue.js 3 with TypeScript</p>
          <p><strong>Backend:</strong> Express.js with in-memory storage</p>
          <p><strong>Data:</strong> NFT-based patient records</p>
          <p><strong>Security:</strong> Permission-based access control</p>
        </div>
      </div>

      <div class="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-3 space-y-2">
        <h4 class="font-semibold text-sm text-slate-900 dark:text-slate-100">🔑 Key Innovations</h4>
        <button
          @click="highlightFeature('ownership')"
          :class="[
            highlightedFeature === 'ownership' ? 'bg-purple-100 dark:bg-purple-900' : 'hover:bg-slate-200 dark:hover:bg-slate-700',
            'w-full text-left text-xs px-2 py-1 rounded text-slate-900 dark:text-slate-100 transition-colors',
          ]"
        >
          ✓ Patient Data Ownership via NFT
        </button>
        <button
          @click="highlightFeature('emergency')"
          :class="[
            highlightedFeature === 'emergency' ? 'bg-purple-100 dark:bg-purple-900' : 'hover:bg-slate-200 dark:hover:bg-slate-700',
            'w-full text-left text-xs px-2 py-1 rounded text-slate-900 dark:text-slate-100 transition-colors',
          ]"
        >
          ✓ QR-Based Emergency Access
        </button>
        <button
          @click="highlightFeature('audit')"
          :class="[
            highlightedFeature === 'audit' ? 'bg-purple-100 dark:bg-purple-900' : 'hover:bg-slate-200 dark:hover:bg-slate-700',
            'w-full text-left text-xs px-2 py-1 rounded text-slate-900 dark:text-slate-100 transition-colors',
          ]"
        >
          ✓ Immutable Audit Trail
        </button>
        <button
          @click="highlightFeature('control')"
          :class="[
            highlightedFeature === 'control' ? 'bg-purple-100 dark:bg-purple-900' : 'hover:bg-slate-200 dark:hover:bg-slate-700',
            'w-full text-left text-xs px-2 py-1 rounded text-slate-900 dark:text-slate-100 transition-colors',
          ]"
        >
          ✓ Time-Limited Access Grants
        </button>
      </div>

      <div class="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-3 space-y-2">
        <h4 class="font-semibold text-sm text-slate-900 dark:text-slate-100">📊 Thesis Comparison</h4>
        <div class="text-xs space-y-1 text-slate-700 dark:text-slate-300">
          <div class="flex justify-between">
            <span class="font-medium">Traditional EHR:</span>
            <span>Centralized, hospital-controlled</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">MediChain-PH:</span>
            <span class="text-purple-600 dark:text-purple-400 font-semibold">Patient-controlled, portable</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Demo Mode Toggle Button (Bottom Left) -->
  <button
    v-if="!isDemoMode"
    @click="toggleDemoMode"
    class="fixed bottom-6 left-6 z-50 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium text-sm flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all hover:scale-110"
  >
    <Book class="h-5 w-5" />
    Demo
  </button>
</template>
